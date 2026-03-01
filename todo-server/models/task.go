package models

import "gorm.io/gorm"

type Task struct {
	gorm.Model
	Title  string `json:"title" binding:"required,min=3,max=100"`
	Status string `json:"status" binding:"required,oneof='To Do' 'In Progress' 'Done'"`
	UserID uint   `json:"user_id"`
}
