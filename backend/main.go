package main

import (
    "sykell-backend/models"
    "sykell-backend/router"
    
)

func main() {
    models.ConnectDatabase()
    r := router.SetupRouter()
    r.Run(":8080")
}
