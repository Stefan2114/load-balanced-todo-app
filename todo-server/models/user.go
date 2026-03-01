package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string `gorm:"unique;not null" json:"username" binding:"required,min=4"`
	Password string `gorm:"not null" json:"password" binding:"required,min=8"`
}
