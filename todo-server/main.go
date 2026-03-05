package main

import (
	"net"
	"todo-server/controllers"
	"todo-server/middleware"
	"todo-server/models"
	"todo-server/services"

	"github.com/gin-gonic/gin"
)

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
	services.InitDB()
	services.DB.AutoMigrate(&models.User{}, &models.Task{})

	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message":   "TODO API is running",
			"server_ip": getLocalIP(),
		})
	})

	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)

	authorized := r.Group("/tasks")
	authorized.Use(middleware.AuthRequired())
	{
		authorized.GET("", controllers.GetTasks)
		authorized.POST("", controllers.CreateTask)
		authorized.PUT("/:id", controllers.UpdateTask)
		authorized.DELETE("/:id", controllers.DeleteTask)
	}

	r.Run(":80")
}
