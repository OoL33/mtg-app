package handlers

import (
	"encoding/json"

	"github.com/OoL33/mtg-app/config"
	"github.com/lib/pq"

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
	r.HandleFunc("/cards/scryfall", FetchScryfallCard).Methods("GET")
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

func FetchScryfallCard(w http.ResponseWriter, r *http.Request) {
	cardName := r.URL.Query().Get("name")
	if cardName == "" {
		http.Error(w, "Missing card name", http.StatusBadRequest)
		return
	}

	url := "https://api.scryfall.com/cards/named?exact=" + cardName
	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Failed to fetch card from Scryfall", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		http.Error(w, "Scryfall API returned an error", http.StatusInternalServerError)
		return
	}

	var cardData map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&cardData); err != nil {
		http.Error(w, "Failed to decode Scryfall response", http.StatusInternalServerError)
		return
	}

	var colors pq.StringArray
	if colorsData, ok := cardData["colors"].([]interface{}); ok {
		for _, color := range colorsData {
			if colorStr, ok := color.(string); ok {
				colors = append(colors, colorStr)
			}
		}
	}

	var imageUrl string
	if imageUris, ok := cardData["image_uris"].(map[string]interface{}); ok {
		if normalUrl, ok := imageUris["normal"].(string); ok {
			imageUrl = normalUrl
		}
	}

	card := models.Card{
		Name:      cardData["name"].(string),
		Colors:    colors,
		ImageUrls: imageUrl,
	}

	if result := config.DB.Create(&card); result.Error != nil {
		http.Error(w, "Failed to save card to the database", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(card)
}
