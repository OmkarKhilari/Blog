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

    // CORS middleware configuration
    allowedOrigins := handlers.AllowedOrigins([]string{"http://localhost:3000"})
    allowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
    allowedHeaders := handlers.AllowedHeaders([]string{"Content-Type"})

    router.HandleFunc("/posts", controller.GetPosts).Methods("GET")
    router.HandleFunc("/posts/{id}", controller.GetPost).Methods("GET")
    router.HandleFunc("/posts", controller.CreatePost).Methods("POST")
    router.HandleFunc("/posts/{id}", controller.UpdatePost).Methods("PUT")
    router.HandleFunc("/posts/{id}", controller.DeletePost).Methods("DELETE")

    // Serve static files from the uploads directory
    router.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads/"))))

    // Wrap the router with CORS handlers
    log.Println("Server is running on port 8000")
    log.Fatal(http.ListenAndServe(":8000", handlers.CORS(allowedOrigins, allowedMethods, allowedHeaders)(router)))
}
