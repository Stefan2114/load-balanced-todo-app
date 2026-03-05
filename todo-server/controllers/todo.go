package controllers

import (
	"net/http"
	"todo-server/models"
	"todo-server/services"

	"github.com/gin-gonic/gin"
)

func GetTasks(c *gin.Context) {
	var tasks []models.Task
	services.DB.Find(&tasks)
	c.JSON(http.StatusOK, tasks)
}

func CreateTask(c *gin.Context) {
	var input models.Task
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	input.UserID = userID.(uint)

	if err := services.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save task"})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func DeleteTask(c *gin.Context) {
	id := c.Param("id")
	services.DB.Delete(&models.Task{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

func UpdateTask(c *gin.Context) {
	id := c.Param("id")
	var task models.Task

	if err := services.DB.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	var input struct {
		Title  string `json:"title" binding:"min=3"`
		Status string `json:"status" binding:"oneof='To Do' 'In Progress' 'Done'"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	services.DB.Model(&task).Updates(input)
	c.JSON(http.StatusOK, task)
}
