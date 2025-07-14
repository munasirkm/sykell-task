package crawler

import (
	"net/http"
	"strings"
	"time"
	"encoding/json"
	
	

	"github.com/PuerkitoBio/goquery"
	"sykell-backend/models"
)

func CrawlURL(url *models.URL) {
	url.Status = "running"
	models.DB.Save(url)

	resp, err := http.Get(url.OriginalURL)
	if err != nil {
		url.Status = "error"
		models.DB.Save(url)
		return
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		url.Status = "error"
		models.DB.Save(url)
		return
	}

	url.Title = doc.Find("title").Text()

	htmlVersion := "Unknown"
	for _, n := range doc.Nodes {
		if n.Type == 10 && n.Data == "html" {
			htmlVersion = "HTML5"
		}
	}
	url.HTMLVersion = htmlVersion

	
	internalLinks := 0
	externalLinks := 0
	brokenLinks := 0
	brokenLinkList := []map[string]interface{}{}

	parsedURL := resp.Request.URL

	doc.Find("a").Each(func(i int, s *goquery.Selection) {
		href, exists := s.Attr("href")
		if !exists || href == "" || strings.HasPrefix(href, "#") {
			return
		}
		if strings.HasPrefix(href, "/") || strings.Contains(href, parsedURL.Host) {
			internalLinks++
		} else {
			externalLinks++
		}
		absURL, err := parsedURL.Parse(href)
		if err != nil || absURL.Scheme == "" || absURL.Host == "" {
			// Skip invalid or unresolved URLs
			return
		}
	
		finalURL := absURL.String()
		client := http.Client{Timeout: 5 * time.Second}
		res, err := client.Get(finalURL)
if err != nil {
	brokenLinks++
	brokenLinkList = append(brokenLinkList, map[string]interface{}{
		"url":    finalURL,
		"status": "error",
	})
} else {
	defer res.Body.Close()
	if res.StatusCode >= 400 {
		brokenLinks++
		brokenLinkList = append(brokenLinkList, map[string]interface{}{
			"url":    href,
			"status": res.StatusCode,
		})
	}
}

	})

	hasLoginForm := false
	doc.Find("form").Each(func(i int, s *goquery.Selection) {
		if s.Find("input[type='password']").Length() > 0 {
			hasLoginForm = true
		}
	})

	url.InternalLinks = internalLinks
	url.ExternalLinks = externalLinks
	brokenJSON, _ := json.Marshal(brokenLinkList)
	url.BrokenLinks = brokenLinks
	url.BrokenLinkList = brokenJSON
	url.HasLoginForm = hasLoginForm

	// Count heading tags
	url.H1Count = doc.Find("h1").Length()
	url.H2Count = doc.Find("h2").Length()
	url.H3Count = doc.Find("h3").Length()
	url.H4Count = doc.Find("h4").Length()
	url.H5Count = doc.Find("h5").Length()
	url.H6Count = doc.Find("h6").Length()

	url.Status = "done"
	models.DB.Save(url)
}