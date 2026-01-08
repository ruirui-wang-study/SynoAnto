package main

import (
	"fmt"
	"log"
	"synoanto-back/internal/config"
	"synoanto-back/internal/database"
	"synoanto-back/internal/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load Config
	cfg, err := config.LoadConfig(".")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize Database
	db, err := database.Connect(&cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Migrate Schema
	database.Migrate(db)

	// Set Gin Mode
	if cfg.Server.Mode != "" {
		gin.SetMode(cfg.Server.Mode)
	}

	// Initialize Router
	r := gin.Default()

	// Setup Routes
	routes.SetupRoutes(r, db)

	// Start Server
	addr := fmt.Sprintf(":%d", cfg.Server.Port)
	log.Printf("Server executing on port %d", cfg.Server.Port)
	r.Run(addr)
}
