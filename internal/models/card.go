package models

import (
	"gorm.io/gorm"
)

type Card struct {
	gorm.Model
	ID        uint `gorm:"primaryKey"`
	UserID    uint
	Name      string `gorm:"size:255"`
	Color     string `gorm:"size:10"`
	ImageUrls string `gorm:"size:255"`
	Decks     []Deck `gorm:"many2many:deck_cards"`
}
