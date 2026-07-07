package controllers

import (
	"attendance_sistem/config"
	"attendance_sistem/dto"
	"attendance_sistem/models"
	"errors"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func GetAllEmployees(c echo.Context) error {
	var users []models.User
	err := config.DB.Select("id", "full_name", "email", "role", "is_active", "created_at").
		Where("role = ?", "employee").
		Order("created_at DESC").
		Find(&users).Error

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "Gagal mengambil data employees",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Berhasil mengambil data employees",
		"data":    users,
	})
}

func GetAllAttendances(c echo.Context) error {
	var attendances []models.Attendance
	err := config.DB.Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id", "full_name", "email")
	}).Order("attendance_date DESC, clock_in DESC").Find(&attendances).Error

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "Gagal mengambil data attendances",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Berhasil mengambil data attendances",
		"data":    attendances,
	})
}

func CreateEmployee(c echo.Context) error {
	req := new(dto.CreateEmployeeRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request body"})
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	var existingUser models.User
	err := config.DB.Where("email = ?", req.Email).First(&existingUser).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Database error"})
	}
	if existingUser.ID != 0 {
		return c.JSON(http.StatusConflict, map[string]string{"message": "Email already exists"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to hash password"})
	}

	user := models.User{
		FullName: req.FullName,
		Email:    req.Email,
		Password: string(hashedPassword),
		Role:     "employee",
		IsActive: true,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to create employee"})
	}

	response := map[string]interface{}{
		"id":         user.ID,
		"full_name":  user.FullName,
		"email":      user.Email,
		"role":       user.Role,
		"is_active":  user.IsActive,
		"created_at": user.CreatedAt,
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "Employee created successfully",
		"data":    response,
	})
}

func UpdateEmployeeStatus(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid employee ID"})
	}

	req := new(dto.UpdateEmployeeStatusRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request body"})
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	var user models.User
	if err := config.DB.Where("role = ?", "employee").First(&user, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.JSON(http.StatusNotFound, map[string]string{"message": "Employee not found"})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Database error"})
	}

	if user.Role != "employee" {
		return c.JSON(http.StatusForbidden, map[string]string{"message": "Cannot change status of non-employee accounts"})
	}

	user.IsActive = *req.IsActive
	if err := config.DB.Model(&user).Update("is_active", user.IsActive).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to update employee status"})
	}

	response := map[string]interface{}{
		"id":         user.ID,
		"full_name":  user.FullName,
		"email":      user.Email,
		"role":       user.Role,
		"is_active":  user.IsActive,
		"created_at": user.CreatedAt,
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Employee status updated successfully",
		"data":    response,
	})
}
