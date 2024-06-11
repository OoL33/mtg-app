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

	// Serve static files
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	// Serve index page
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../components.index.templ")
	}).Methods("GET")

	// Initialize routes
	handlers.InitializeRoutes(r)

	// Templ routes
	r.Handle("/", templ.Handler(components.Index)).Methods("GET")
	r.Handle("/login", templ.Handler(components.LoginForm)).Methods("GET")

	log.Println("Server started on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
