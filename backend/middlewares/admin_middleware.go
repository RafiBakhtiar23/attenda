package middlewares

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func AdminMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		role := c.Get("role").(string)

		if role != "admin" {
			return c.JSON(http.StatusForbidden, map[string]string{
				"message": "Access denied. Admin only",
			})
		}

		return next(c)
	}
}
