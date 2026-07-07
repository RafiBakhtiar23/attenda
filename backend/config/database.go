package config

import (
	"fmt"
	"os"

	"attendance_sistem/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {

	err := godotenv.Load()
	if err != nil {
		panic("Gagal membaca file .env")
	}
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user,
		password,
		host,
		port,
		dbName,
	)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	DB = db
	err = DB.AutoMigrate(
		&models.User{},
		&models.Attendance{},
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Sukses Connect to Database")
}
