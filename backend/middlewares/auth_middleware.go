package middlewares

import (
	"attendance_sistem/utils"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")

		if authHeader == "" {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"message": "Authorization header required",
			})
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"message": "Invalid authorization format",
			})
		}

		tokenString := parts[1]
		secret := os.Getenv("JWT_SECRET")

		token, err := jwt.ParseWithClaims(tokenString, &utils.JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
			if token.Method.Alg() != jwt.SigningMethodHS256.Alg() {
				return nil, echo.NewHTTPError(http.StatusUnauthorized, "Invalid signing method")
			}
			return []byte(secret), nil
		})

		if err != nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"message": "Invalid or expired token",
			})
		}

		if !token.Valid {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"message": "Token is not valid",
			})
		}

		claims, ok := token.Claims.(*utils.JWTClaims)
		if !ok {
			return c.JSON(http.StatusUnauthorized, map[string]string{
				"message": "Invalid token claims",
			})
		}

		c.Set("user_id", claims.UserID)
		c.Set("role", claims.Role)

		return next(c)
	}
}
