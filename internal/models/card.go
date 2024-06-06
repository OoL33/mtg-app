package models

import (
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Card struct {
	gorm.Model
	Name      string         `gorm:"size:255"`
	Colors    pq.StringArray `gorm:"type:text[]" json:"colors"`
	ImageUrls string         `gorm:"size:255"`
	Decks     []Deck         `gorm:"many2many:deck_cards"`
	Users     []User         `gorm:"many2many:user_cards"`
}
