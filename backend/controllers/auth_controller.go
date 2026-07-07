package controllers

import (
	"attendance_sistem/config"
	"attendance_sistem/dto"
	"attendance_sistem/models"
	"attendance_sistem/utils"
	"net/http"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

func Register(c echo.Context) error {
	var req dto.RegisterRequest

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Data Register tidak valid",
		})
	}

	if req.Fullname == "" || req.Email == "" || req.Password == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Semua field wajib di isi",
		})
	}

	var existingUser models.User
	if err := config.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		return c.JSON(http.StatusConflict, map[string]string{
			"message": "Email sudah digunakan",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "Gagal memproses password",
		})
	}

	user := models.User{
		FullName: req.Fullname,
		Email:    req.Email,
		Password: string(hashedPassword),
		Role:     "employee",
		IsActive: true,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "Gagal menyimpan data user",
		})
	}

	return c.JSON(http.StatusCreated, map[string]string{
		"message": "Sukses menyimpan data user",
	})
}

func Login(c echo.Context) error {
	var req dto.LoginRequest

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Data login tidak valid",
		})
	}

	if req.Email == "" || req.Password == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"message": "Field wajib di isi",
		})
	}

	var foundUser models.User
	if err := config.DB.Where("email = ?", req.Email).First(&foundUser).Error; err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Email atau password salah",
		})
	}

	if !foundUser.IsActive {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Akun tidak aktif",
		})
	}

	if err := bcrypt.CompareHashAndPassword(
		[]byte(foundUser.Password),
		[]byte(req.Password),
	); err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Email atau password salah",
		})
	}

	token, err := utils.GenerateToken(foundUser.ID, foundUser.Role)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "Gagal generate token",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Login berhasil",
		"token":   token,
	})
}
