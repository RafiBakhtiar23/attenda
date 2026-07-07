package controllers

import (
	"attendance_sistem/config"
	"net/http"

	"github.com/labstack/echo/v4"
)

func HealthCheck(c echo.Context) error {
	sqlDB, err := config.DB.DB()
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, map[string]string{
			"status":   "error",
			"database": "disconnected",
		})
	}

	if err := sqlDB.Ping(); err != nil {
		return c.JSON(http.StatusServiceUnavailable, map[string]string{
			"status":   "error",
			"database": "disconnected",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"status":   "ok",
		"database": "connected",
	})
}
