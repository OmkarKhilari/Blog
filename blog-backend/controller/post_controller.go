package controller

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/OmkarKhilari/Blog/blog-backend/database"
	"github.com/OmkarKhilari/Blog/blog-backend/model"
	"github.com/gorilla/mux"
)

func GetPosts(w http.ResponseWriter, r *http.Request) {
	log.Println("Fetching all posts...")
	db := database.GetDB()

	rows, err := db.Query("SELECT id, title, content, author, date, image FROM posts")
	if err != nil {
		log.Println("Error querying posts:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []model.Post
	for rows.Next() {
		var post model.Post
		err := rows.Scan(&post.ID, &post.Title, &post.Content, &post.Author, &post.Date, &post.Image)
		if err != nil {
			log.Println("Error scanning post:", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		posts = append(posts, post)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
	log.Println("Posts fetched successfully")
}

func GetPost(w http.ResponseWriter, r *http.Request) {
	log.Println("Fetching post by ID...")
	db := database.GetDB()

	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		log.Println("Invalid ID:", err)
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var post model.Post
	err = db.QueryRow("SELECT id, title, content, author, date, image FROM posts WHERE id=$1", id).Scan(&post.ID, &post.Title, &post.Content, &post.Author, &post.Date, &post.Image)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Println("Post not found:", id)
			http.Error(w, "Post not found", http.StatusNotFound)
			return
		}
		log.Println("Error querying post:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
	log.Println("Post fetched successfully:", post)
}

func handleFileUpload(r *http.Request) (string, error) {
	log.Println("Handling file upload...")
	file, header, err := r.FormFile("image")
	if err != nil {
		log.Println("Error getting file from form:", err)
		return "", err
	}
	defer file.Close()

	filename := filepath.Join("uploads", header.Filename)

	dst, err := os.Create(filename)
	if err != nil {
		log.Println("Error creating file:", err)
		return "", err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		log.Println("Error copying file:", err)
		return "", err
	}

	log.Println("File uploaded successfully:", filename)
	return filename, nil
}

func CreatePost(w http.ResponseWriter, r *http.Request) {
	log.Println("Creating new post...")
	db := database.GetDB()

	var post model.Post
	post.Title = r.FormValue("title")
	post.Content = r.FormValue("content")
	post.Author = r.FormValue("author")

	file, _, err := r.FormFile("image")
	if err != nil {
		log.Println("Invalid file upload:", err)
		http.Error(w, "Invalid file upload", http.StatusBadRequest)
		return
	}
	defer file.Close()

	filename, err := handleFileUpload(r)
	if err != nil {
		log.Println("Failed to save file:", err)
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}
	post.Image = filename

	err = db.QueryRow(
		"INSERT INTO posts (title, content, author, image) VALUES ($1, $2, $3, $4) RETURNING id, date",
		post.Title, post.Content, post.Author, post.Image,
	).Scan(&post.ID, &post.Date)
	if err != nil {
		log.Println("Error inserting post into database:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
	log.Println("Post created successfully:", post)
}

func UpdatePost(w http.ResponseWriter, r *http.Request) {
	log.Println("Updating post...")
	db := database.GetDB()

	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil || id <= 0 {
		log.Println("Invalid ID:", err)
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var post model.Post
	err = json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		log.Println("Invalid request payload:", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	_, err = db.Exec(
		"UPDATE posts SET title=$1, content=$2, author=$3, image=$4 WHERE id=$5",
		post.Title, post.Content, post.Author, post.Image, id,
	)
	if err != nil {
		log.Println("Error updating post:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	log.Println("Post updated successfully:", post)
}

func DeletePost(w http.ResponseWriter, r *http.Request) {
	log.Println("Deleting post...")
	db := database.GetDB()

	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"]) // Define err here
	if err != nil {
		log.Println("Invalid ID:", err)
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = db.Exec("DELETE FROM posts WHERE id=$1", id) // Reuse the err variable
	if err != nil {
		log.Println("Error deleting post:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	log.Println("Post deleted successfully:", id)
}

