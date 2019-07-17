package main

import (
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func envLoad() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {

	envLoad()
	r := mux.NewRouter()
	allowedOrigins := handlers.AllowedOrigins([]string{"http://localhost:3000"})
	allowedHeaders := handlers.AllowedHeaders([]string{"Content-Type"})
	allowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "DELETE", "PUT", "OPTIONS"})

	// エンドポイントの設定
	r.HandleFunc("/api/todolist", todoListHandler)
	r.HandleFunc("/api/todo", todoHandler)
	r.HandleFunc("/api/todo/{id}", todoHandler)
	r.HandleFunc("/", pingHandler)

	// 起動
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(allowedOrigins, allowedHeaders, allowedMethods)(r)))
}
