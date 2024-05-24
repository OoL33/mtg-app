package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name  string
	Email string `gorm:"unique"`
	Posts []Post `gorm:"foreignKey:UserID"`
}

type Post struct {
	gorm.Model
	Title  string
	UserID uint
}
