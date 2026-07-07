package main

import (
	"attendance_sistem/config"
	"attendance_sistem/routes"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	config.ConnectDatabase()
	e := echo.New()

	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodOptions},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	routes.SetupRoutes(e)

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Attendances API Berjalan")
	})

	e.Logger.Fatal(e.Start(":8080"))
}
