package main

import (
	"log"
	"net/http"

	"github.com/OoL33/mtg-app/components"
	"github.com/OoL33/mtg-app/config"
	"github.com/OoL33/mtg-app/internal/handlers"
	"github.com/OoL33/mtg-app/internal/models"
	"github.com/a-h/templ"
	"github.com/gorilla/mux"
)

func main() {
	config.InitDB()
	config.DB.AutoMigrate(&models.User{}, &models.Deck{}, &models.Card{})

	r := mux.NewRouter()

	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	handlers.InitializeRoutes(r)

	r.Handle("/", templ.Handler(components.Index())).Methods("GET")
	r.Handle("/login", templ.Handler(components.LoginForm())).Methods("GET")

	log.Println("Server started on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
