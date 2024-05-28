package handlers

import (
	"encoding/json"

	"github.com/OoL33/mtg-app/config"

	"net/http"

	"github.com/OoL33/mtg-app/internal/models"

	"github.com/gorilla/mux"
)

func InitializeRoutes(r *mux.Router) {
	r.HandleFunc("/users", GetUsers).Methods("GET")
	r.HandleFunc("/users", CreateUser).Methods("POST")
	r.HandleFunc("/decks", GetDecks).Methods("GET")
	r.HandleFunc("/decks", CreateDeck).Methods("POST")
	r.HandleFunc("/cards", GetCards).Methods("GET")
	r.HandleFunc("/cards", CreateCard).Methods("POST")
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	var users []models.User
	config.DB.Preload("Decks").Preload("Decks.Cards").Find(&users)
	json.NewEncoder(w).Encode(users)
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	_ = json.NewDecoder(r.Body).Decode(&user)
	config.DB.Create(&user)
	json.NewEncoder(w).Encode(user)
}

func GetDecks(w http.ResponseWriter, r *http.Request) {
	var decks []models.Deck
	config.DB.Preload("Cards").Find(&decks)
	json.NewEncoder(w).Encode(decks)
}

func CreateDeck(w http.ResponseWriter, r *http.Request) {
	var deck models.Deck
	_ = json.NewDecoder(r.Body).Decode(&deck)
	config.DB.Create(&deck)
	json.NewEncoder(w).Encode(deck)
}

func GetCards(w http.ResponseWriter, r *http.Request) {
	var cards []models.Card
	config.DB.Find(&cards)
	json.NewEncoder(w).Encode(cards)
}

func CreateCard(w http.ResponseWriter, r *http.Request) {
	var card []models.Card
	_ = json.NewDecoder(r.Body).Decode(&card)
	config.DB.Create(&card)
	json.NewEncoder(w).Encode(card)
}
