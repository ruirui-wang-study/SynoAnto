package database

import (
	"fmt"
	"synoanto-back/internal/config"
	"synoanto-back/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect(cfg *config.DatabaseConfig) (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=%s TimeZone=%s",
		cfg.Host, cfg.User, cfg.Password, cfg.DBName, cfg.Port, cfg.SSLMode, cfg.TimeZone)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}

func Migrate(db *gorm.DB) {
	// Auto Migrate the schema (creates tables if they don't exist)
	db.AutoMigrate(
		&models.User{},
		&models.DictionaryEntry{},
		&models.SearchLog{},
	)
	fmt.Println("Database Migration Completed")
}
