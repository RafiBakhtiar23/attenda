package controllers

import (
	"attendance_sistem/config"
	"attendance_sistem/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetProfile(c echo.Context) error {
	userID := c.Get("user_id").(uint)

	var user models.User
	err := config.DB.Select("id", "full_name", "email", "role", "is_active").Where("id = ?", userID).First(&user).Error

	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"message": "User tidak ditemukan",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Berhasil mengambil data profile",
		"data": map[string]interface{}{
			"id":        user.ID,
			"full_name": user.FullName,
			"email":     user.Email,
			"role":      user.Role,
			"is_active": user.IsActive,
		},
	})
}
