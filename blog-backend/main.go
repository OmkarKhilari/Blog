package main

import (
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"github.com/OmkarKhilari/Blog/blog-backend/controller"
	"github.com/OmkarKhilari/Blog/blog-backend/database"
	"github.com/OmkarKhilari/Blog/blog-backend/env"
)

func main() {
	env.LoadEnv()
	database.InitDB()

	router := mux.NewRouter()

	router.HandleFunc("/posts", controller.GetPosts).Methods("GET")
	router.HandleFunc("/posts/{id}", controller.GetPost).Methods("GET")
	router.HandleFunc("/posts", controller.CreatePost).Methods("POST")
	// router.HandleFunc("/posts/{id}", controller.UpdatePost).Methods("PUT")
	// router.HandleFunc("/posts/{id}", controller.DeletePost).Methods("DELETE")

	router.HandleFunc("/users", controller.CreateUser).Methods("POST")
	router.HandleFunc("/users", controller.GetUser).Methods("GET")

	headers := handlers.AllowedHeaders([]string{"Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})

	log.Println("Server is running on port 8000")
	log.Fatal(http.ListenAndServe(":8000", handlers.CORS(headers, methods, origins)(router)))
}
