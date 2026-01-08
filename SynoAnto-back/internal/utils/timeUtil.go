package utils

import (
	"database/sql/driver"
	"fmt"
	"time"
)

// JSONTime wraps time.Time to enforce "2006-01-02 15:04:05" format in JSON and DB
type JSONTime struct {
	time.Time
}

const timeLayout = "2006-01-02 15:04:05"

// MarshalJSON conforms to json.Marshaler interface
func (t JSONTime) MarshalJSON() ([]byte, error) {
	if t.Time.IsZero() {
		return []byte("null"), nil
	}
	return []byte(fmt.Sprintf("\"%s\"", t.Time.Format(timeLayout))), nil
}

// UnmarshalJSON conforms to json.Unmarshaler interface
func (t *JSONTime) UnmarshalJSON(b []byte) error {
	s := string(b)
	if s == "null" {
		t.Time = time.Time{}
		return nil
	}
	// Remove quotes if present
	if len(s) > 1 && s[0] == '"' && s[len(s)-1] == '"' {
		s = s[1 : len(s)-1]
	}

	parsedTime, err := time.Parse(timeLayout, s)
	if err != nil {
		return err
	}
	t.Time = parsedTime
	return nil
}

// Value conforms to driver.Valuer interface for database storage
func (t JSONTime) Value() (driver.Value, error) {
	if t.Time.IsZero() {
		return nil, nil
	}
	return t.Time, nil
}

// Scan conforms to sql.Scanner interface for database retrieval
func (t *JSONTime) Scan(value interface{}) error {
	if value == nil {
		t.Time = time.Time{}
		return nil
	}
	if v, ok := value.(time.Time); ok {
		t.Time = v
		return nil
	}
	return fmt.Errorf("can not convert %v to timestamp", value)
}

// Now returns a new JSONTime with current time
func Now() JSONTime {
	return JSONTime{Time: time.Now()}
}
