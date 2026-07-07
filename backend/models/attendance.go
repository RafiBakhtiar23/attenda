package models

import (
	"time"

	"gorm.io/gorm"
)

type Attendance struct {
	gorm.Model

	UserId         uint       `json:"user_id" gorm:"not null;uniqueIndex:idx_user_date"`
	User           User       `json:"user" gorm:"foreignKey:UserId"`
	AttendanceDate time.Time  `json:"attendance_date" gorm:"type:date;not null;uniqueIndex:idx_user_date"`
	ClockIn        time.Time  `json:"clock_in"`
	ClockOut       *time.Time `json:"clock_out"`
	Status         string     `json:"status" gorm:"type:varchar(20)"`
}
