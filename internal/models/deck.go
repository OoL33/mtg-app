package models

import (
	"gorm.io/gorm"
)

type Deck struct {
	gorm.Model
	ID     uint
	UserID uint
	Name   string `gorm:"size:255"`
	Cards  []Card `gorm:"many2many:deck_cards"`
}
