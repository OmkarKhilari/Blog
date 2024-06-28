package main

import (
    "log"
    "net/http"

    "github.com/OmkarKhilari/Blog/blog-backend/controller"
    "github.com/OmkarKhilari/Blog/blog-backend/database"
    "github.com/OmkarKhilari/Blog/blog-backend/env"

    "github.com/gorilla/mux"
)

func main() {
    env.LoadEnv()
    database.InitDB()

    router := mux.NewRouter()

    router.HandleFunc("/posts", controller.GetPosts).Methods("GET")
    router.HandleFunc("/posts/{id}", controller.GetPost).Methods("GET")
    router.HandleFunc("/posts", controller.CreatePost).Methods("POST")
    router.HandleFunc("/posts/{id}", controller.UpdatePost).Methods("PUT")
    router.HandleFunc("/posts/{id}", controller.DeletePost).Methods("DELETE")

    log.Println("Server is running on port 8080")
    log.Fatal(http.ListenAndServe(":8080", router))
}
