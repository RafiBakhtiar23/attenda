package models

import "gorm.io/gorm"

type User struct {
	gorm.Model

	FullName string `json:"full_name" gorm:"size:50;not null"`
	Email    string `json:"email" gorm:"size:30;unique;not null"`
	Password string `json:"password" gorm:"size:255;not null"`
	Role     string `json:"role" gorm:"size:20;default:employee"`
	IsActive bool   `json:"is_active" gorm:"default:true"`
}
