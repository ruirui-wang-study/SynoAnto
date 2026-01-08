package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a registered user
type User struct {
	gorm.Model
	Username string `gorm:"uniqueIndex;not null" json:"username"`
	Email    string `gorm:"uniqueIndex;not null" json:"email"`
	// Storing lightweight user prefs in JSONB if using Postgres
	Preferences string `gorm:"type:jsonb;default:'{}'" json:"preferences"` 
}

// DictionaryEntry stores the cached or imported dictionary data
// We use a flexible Key-Value approach for the definition using JSONB
type DictionaryEntry struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Word      string         `gorm:"uniqueIndex;not null" json:"word"`
	DefinitionData string    `gorm:"type:jsonb" json:"definition_data"` // Stores full JSON response from external APIs
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
}

// SearchLog tracks search frequency for stats
type SearchLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Word      string    `gorm:"index" json:"word"`
	UserID    uint      `json:"user_id"` // 0 if anonymous
	SearchTime time.Time `json:"search_time"`
}
