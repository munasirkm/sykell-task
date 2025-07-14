package handlers

import (
	"net/http"
	"sykell-backend/models"
	"sykell-backend/crawler"
	"github.com/gin-gonic/gin"
)

func AddURL(c *gin.Context) {
	var input models.URL
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.Status = "queued"
	models.DB.Create(&input)
	c.JSON(http.StatusOK, input)
}

func ListURLs(c *gin.Context) {
	var urls []models.URL
	models.DB.Find(&urls)
	c.JSON(http.StatusOK, urls)
}

func StartCrawl(c *gin.Context) {
	id := c.Param("id")
	var url models.URL
	if err := models.DB.First(&url, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}
	go crawler.CrawlURL(&url)
	c.JSON(http.StatusOK, gin.H{"message": "Crawl started"})
}

func GetURLDetails(c *gin.Context) {
	id := c.Param("id")
	var url models.URL
	if err := models.DB.First(&url, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
		return
	}
	c.JSON(http.StatusOK, url)
}

func Delete(c *gin.Context) {
	var ids []uint
	if err := c.ShouldBindJSON(&ids); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	models.DB.Delete(&models.URL{}, ids)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

func BulkReanalyze(c *gin.Context) {
	var ids []uint
	if err := c.ShouldBindJSON(&ids); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	for _, id := range ids {
		var url models.URL
		if err := models.DB.First(&url, id).Error; err == nil {
			go crawler.CrawlURL(&url)
		}
	}
	c.JSON(http.StatusOK, gin.H{"message": "Reanalysis started"})
}