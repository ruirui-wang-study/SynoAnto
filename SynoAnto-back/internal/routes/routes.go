package routes

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"synoanto-back/internal/models"
	"synoanto-back/internal/utils"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const (
	CollegiateKey = "0be4cedf-7b9b-4309-b986-a9c41fefa130"
	ThesaurusKey  = "aeae1af3-c3dd-4dfd-a927-06855ca8576b"
	CollegiateAPI = "https://www.dictionaryapi.com/api/v3/references/collegiate/json"
	ThesaurusAPI  = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json"
)

// CombinedResponse mirrors the structure the frontend expects or similar
type CombinedResponse struct {
	Collegiate interface{} `json:"collegiate"`
	Thesaurus  interface{} `json:"thesaurus"`
}

// ApiResult handles the response from external APIs
type ApiResult struct {
	Data interface{}
	Err  error
}

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	// CORS Configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "pong"})
		})

		api.GET("/word/:word", func(c *gin.Context) {
			wordStr := c.Param("word")

			// 1. Log Search
			go db.Create(&models.SearchLog{
				Word:       wordStr,
				UserID:     0,
				SearchTime: utils.Now(),
			})

			var entry models.DictionaryEntry

			// 2. Check Cache (DB)
			// We assume DefinitionData holds the JSON string of CombinedResponse
			if result := db.Where("word = ?", wordStr).First(&entry); result.Error == nil {
				// Cache Hit
				var cachedData CombinedResponse
				if err := json.Unmarshal([]byte(entry.DefinitionData), &cachedData); err == nil {
					c.JSON(http.StatusOK, cachedData)
					return
				}
				// If unmarshal fails, treat as cache miss (shouldn't happen)
			}

			// 3. Cache Miss - Fetch from External APIs
			// Use channels for parallel fetching

			collChan := make(chan ApiResult)
			thesChan := make(chan ApiResult)

			go fetchAPI(fmt.Sprintf("%s/%s?key=%s", CollegiateAPI, wordStr, CollegiateKey), collChan)
			go fetchAPI(fmt.Sprintf("%s/%s?key=%s", ThesaurusAPI, wordStr, ThesaurusKey), thesChan)

			collRes := <-collChan
			thesRes := <-thesChan

			if collRes.Err != nil || thesRes.Err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch from external dictionary"})
				return
			}

			resp := CombinedResponse{
				Collegiate: collRes.Data,
				Thesaurus:  thesRes.Data,
			}

			// 4. Save to DB (Async)
			jsonData, _ := json.Marshal(resp)
			newEntry := models.DictionaryEntry{
				Word:           wordStr,
				DefinitionData: string(jsonData),
			}
			go db.Create(&newEntry)

			c.JSON(http.StatusOK, resp)
		})

		api.GET("/stats/trending", func(c *gin.Context) {
			type Result struct {
				Word  string `json:"word"`
				Count int    `json:"count"`
			}
			var results []Result

			db.Model(&models.SearchLog{}).
				Select("word, count(*) as count").
				Group("word").
				Order("count desc").
				Limit(5).
				Scan(&results)

			c.JSON(http.StatusOK, gin.H{"trending": results})
		})
	}
}

func fetchAPI(url string, ch chan<- ApiResult) {
	resp, err := http.Get(url)
	if err != nil {
		ch <- ApiResult{Data: nil, Err: err}
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		ch <- ApiResult{Data: nil, Err: err}
		return
	}

	var data interface{}
	if err := json.Unmarshal(body, &data); err != nil {
		ch <- ApiResult{Data: nil, Err: err}
		return
	}

	ch <- ApiResult{Data: data, Err: nil}
}
