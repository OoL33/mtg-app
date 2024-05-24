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
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	var users []models.User
	config.DB.Find(&users)
	json.NewEncoder(w).Encode(users)
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	_ = json.NewDecoder(r.Body).Decode(&user)
	config.DB.Create(&user)
	json.NewEncoder(w).Encode(user)
}
