package models

import "gorm.io/datatypes"
import "gorm.io/gorm"

type URL struct {
	gorm.Model
	OriginalURL   string         `json:"original_url"`
	Title         string         `json:"title"`
	HTMLVersion   string         `json:"html_version"`
	Status        string         `json:"status"`
	InternalLinks int            `json:"internal_links"`
	ExternalLinks int            `json:"external_links"`
	BrokenLinks   int            `json:"broken_links"`
	HasLoginForm  bool           `json:"has_login_form"`
	BrokenLinkList datatypes.JSON `json:"broken_link_list"` // new field
	
	H1Count int `json:"h1_count"`
	H2Count int `json:"h2_count"`
	H3Count int `json:"h3_count"`
	H4Count int `json:"h4_count"`
	H5Count int `json:"h5_count"`
	H6Count int `json:"h6_count"`
}

