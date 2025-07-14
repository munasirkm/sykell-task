package router

import (
	"github.com/gin-gonic/gin"
	"sykell-backend/handlers"
	"sykell-backend/middleware"
	"github.com/gin-contrib/cors"
	"time"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))


	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())

	api.POST("/urls", handlers.AddURL)
	api.GET("/urls", handlers.ListURLs)
	api.POST("/urls/:id/start", handlers.StartCrawl)
	api.GET("/urls/:id", handlers.GetURLDetails)
	api.DELETE("/urls", handlers.Delete)
	api.POST("/urls/reanalyze", handlers.BulkReanalyze)
	
	return r
}