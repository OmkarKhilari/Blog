package controller

import (
    "database/sql"
    "encoding/json"
    "net/http"
    "strconv"

    "github.com/gorilla/mux"
    "github.com/OmkarKhilari/Blog/blog-backend/database"
    "github.com/OmkarKhilari/Blog/blog-backend/model"
)

func GetPosts(w http.ResponseWriter, r *http.Request) {
    db := database.GetDB()

    rows, err := db.Query("SELECT * FROM posts")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var posts []model.Post
    for rows.Next() {
        var post model.Post
        err := rows.Scan(&post.ID, &post.Title, &post.Content, &post.Author, &post.Date, &post.Views, &post.Comments, &post.Image)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        posts = append(posts, post)
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(posts)
}

func GetPost(w http.ResponseWriter, r *http.Request) {
    db := database.GetDB()

    params := mux.Vars(r)
    id, err := strconv.Atoi(params["id"])
    if err != nil {
        http.Error(w, "Invalid ID", http.StatusBadRequest)
        return
    }

    var post model.Post
    err = db.QueryRow("SELECT * FROM posts WHERE id=$1", id).Scan(&post.ID, &post.Title, &post.Content, &post.Author, &post.Date, &post.Views, &post.Comments, &post.Image)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "Post not found", http.StatusNotFound)
            return
        }
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(post)
}

func CreatePost(w http.ResponseWriter, r *http.Request) {
    db := database.GetDB()

    var post model.Post
    err := json.NewDecoder(r.Body).Decode(&post)
    if err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    err = db.QueryRow(
        "INSERT INTO posts (title, content, author, image) VALUES ($1, $2, $3, $4) RETURNING id, date, views, comments",
        post.Title, post.Content, post.Author, post.Image,
    ).Scan(&post.ID, &post.Date, &post.Views, &post.Comments)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(post)
}

func UpdatePost(w http.ResponseWriter, r *http.Request) {
    db := database.GetDB()

    params := mux.Vars(r)
    id, err := strconv.Atoi(params["id"])
    if err != nil {
        http.Error(w, "Invalid ID", http.StatusBadRequest)
        return
    }

    var post model.Post
    err = json.NewDecoder(r.Body).Decode(&post)
    if err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    _, err = db.Exec(
        "UPDATE posts SET title=$1, content=$2, author=$3, image=$4 WHERE id=$5",
        post.Title, post.Content, post.Author, post.Image, id,
    )
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}

func DeletePost(w http.ResponseWriter, r *http.Request) {
    db := database.GetDB()

    params := mux.Vars(r)
    id, err := strconv.Atoi(params["id"])
    if err != nil {
        http.Error(w, "Invalid ID", http.StatusBadRequest)
        return
    }

    _, err = db.Exec("DELETE FROM posts WHERE id=$1", id)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}
