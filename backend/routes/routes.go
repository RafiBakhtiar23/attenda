package routes

import (
	"attendance_sistem/controllers"
	"attendance_sistem/middlewares"

	"github.com/labstack/echo/v4"
)

func SetupRoutes(e *echo.Echo) {
	e.GET("/health", controllers.HealthCheck)

	e.POST("/register", controllers.Register)
	e.POST("/login", controllers.Login)

	e.POST("/clock-in", controllers.ClockIn, middlewares.AuthMiddleware)
	e.POST("/clock-out", controllers.ClockOut, middlewares.AuthMiddleware)
	e.GET("/attendance/history", controllers.GetAttendanceHistory, middlewares.AuthMiddleware)

	e.GET("/profile", controllers.GetProfile, middlewares.AuthMiddleware)

	// Admin routes
	adminGroup := e.Group("/admin", middlewares.AuthMiddleware, middlewares.AdminMiddleware)
	{
		adminGroup.GET("/employees", controllers.GetAllEmployees)
		adminGroup.POST("/employees", controllers.CreateEmployee)
		adminGroup.PATCH("/employees/:id/status", controllers.UpdateEmployeeStatus)
		adminGroup.GET("/attendances", controllers.GetAllAttendances)
	}
}
