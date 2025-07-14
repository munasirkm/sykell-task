package models

import (
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "log"
)

var DB *gorm.DB

func ConnectDatabase() {
    dsn := "root:admin@tcp(127.0.0.1:3306)/crawler_db?charset=utf8mb4&parseTime=True&loc=Local"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to DB:", err)
    }

    db.AutoMigrate(&URL{})
    DB = db
}
