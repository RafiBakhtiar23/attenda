package controllers

import (
	"attendance_sistem/config"
	"attendance_sistem/models"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func ClockIn(c echo.Context) error {
	userID := c.Get("user_id").(uint)

	today := time.Now().Format("2006-01-02")
	todayDate, _ := time.Parse("2006-01-02", today)

	var existingAttendance models.Attendance
	err := config.DB.Where("user_id = ? AND attendance_date = ?", userID, todayDate).First(&existingAttendance).Error

	if err == nil {
		return c.JSON(http.StatusConflict, map[string]string{
			"message": "Anda sudah clock in hari ini",
		})
	}

	now := time.Now()
	cutoffTime := time.Date(now.Year(), now.Month(), now.Day(), 8, 0, 0, 0, now.Location())

	status := "on_time"
	if now.After(cutoffTime) {
		status = "late"
	}

	attendance := models.Attendance{
		UserId:         userID,
		AttendanceDate: todayDate,
		ClockIn:        now,
		Status:         status,
	}

	if err := config.DB.Create(&attendance).Error; err != nil {
		fmt.Println("========= GORM Error: ", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "Gagal menyimpan data attendance",
		})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "Clock in berhasil",
		"data":    attendance,
	})
}

func ClockOut(c echo.Context) error {
	userID := c.Get("user_id").(uint)

	location, _ := time.LoadLocation("Asia/Jakarta")
	now := time.Now().In(location)
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, location)
	endOfDay := startOfDay.Add(24 * time.Hour)

	var attendance models.Attendance
	err := config.DB.Where("user_id = ? AND attendance_date >= ? AND attendance_date < ? AND clock_out IS NULL", userID, startOfDay, endOfDay).First(&attendance).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.JSON(http.StatusNotFound, map[string]string{
				"message": "Anda belum clock in hari ini atau sudah clock out.",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "Gagal mengambil data attendance",
		})
	}

	if attendance.ClockOut != nil {
		return c.JSON(http.StatusConflict, map[string]string{
			"message": "Anda sudah clock out hari ini",
		})
	}

	nowInJakarta := time.Now().In(location)
	attendance.ClockOut = &nowInJakarta

	if err := config.DB.Save(&attendance).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "Gagal menyimpan data clock out",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Clock out berhasil",
		"data":    attendance,
	})
}

func GetAttendanceHistory(c echo.Context) error {
	userID := c.Get("user_id").(uint)

	var attendances []models.Attendance
	err := config.DB.Where("user_id = ?", userID).Order("attendance_date DESC").Find(&attendances).Error

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"message": "Gagal mengambil data attendance",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Berhasil mengambil data attendance",
		"data":    attendances,
	})
}
