package main

import (
	"log"
	"net/http"

	"github.com/OoL33/mtg-app/config"

	"github.com/OoL33/mtg-app/internal/handlers"

	"github.com/OoL33/mtg-app/internal/models"

	"github.com/gorilla/mux"
)

func main() {
	config.InitDB()
	config.DB.AutoMigrate(&models.User{}, &models.Deck{}, &models.Card{})

	r := mux.NewRouter()

	handlers.InitializeRoutes(r)
	log.Fatal(http.ListenAndServe(":8080", r))
}
