package middleware

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token != "Bearer mysecrettoken" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
            return
        }
        c.Next()
    }
}
