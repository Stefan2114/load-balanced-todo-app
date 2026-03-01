package main

import (
	"net"
	"todo-server/controllers"
	"todo-server/middleware"
	"todo-server/models"
	"todo-server/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Helper to get local IP for the project requirement
func getLocalIP() string {
	addrs, _ := net.InterfaceAddrs()
	for _, address := range addrs {
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}
	return "127.0.0.1"
}

func main() {
	// Initialize Database
	services.InitDB()

	// Auto-migrate models
	services.DB.AutoMigrate(&models.User{}, &models.Task{})

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Public Routes
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message":   "TODO API is running",
			"server_ip": getLocalIP(), // Requirement: display IP address
		})
	})

	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)

	// Protected Routes (Tasks)
	authorized := r.Group("/tasks")
	authorized.Use(middleware.AuthRequired())
	{
		authorized.GET("", controllers.GetTasks)
		authorized.POST("", controllers.CreateTask)
		authorized.PUT("/:id", controllers.UpdateTask)
		authorized.DELETE("/:id", controllers.DeleteTask)
	}

	// Run on port 80 (Internal container port)
	r.Run(":80")
}
