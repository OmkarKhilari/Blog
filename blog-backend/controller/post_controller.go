package controller

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
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

func handleFileUpload(r *http.Request) (string, error) {
	file, header, err := r.FormFile("image")
	if err != nil {
		return "", err
	}
	defer file.Close()

	// Generate a unique filename for the uploaded file
	filename := filepath.Join("uploads", header.Filename)

	// Create a destination file
	dst, err := os.Create(filename)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	// Copy the uploaded file to the destination file
	if _, err := io.Copy(dst, file); err != nil {
		return "", err
	}

	return filename, nil
}

func CreatePost(w http.ResponseWriter, r *http.Request) {
	db := database.GetDB()

	var post model.Post
	post.Title = r.FormValue("title")
	post.Content = r.FormValue("content")
	post.Author = r.FormValue("author")

	// Get the file from the form
	file, _, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Invalid file upload", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Save the file
	filename, err := handleFileUpload(r)
	if err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}
	post.Image = filename

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
	if err != nil || id <= 0 {
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
