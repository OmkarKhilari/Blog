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
	"strings"

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
	file, header, err := r.FormFile("image")
	if err != nil {
		log.Println("No file uploaded:", err)
		return "", nil
	}
	defer file.Close()

	dir := "./uploads"
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		os.Mkdir(dir, os.ModePerm)
	}

	fileName := strings.Replace(header.Filename, " ", "_", -1)
	filePath := filepath.Join(dir, fileName)

	dst, err := os.Create(filePath)
	if err != nil {
		log.Println("Error creating file:", err)
		return "", err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		log.Println("Error copying file:", err)
		return "", err
	}

	log.Println("File uploaded successfully:", filePath)
	return fileName, nil
}


func CreatePost(w http.ResponseWriter, r *http.Request) {
	log.Println("Creating new post...")
	db := database.GetDB()

	title := r.FormValue("title")
	content := r.FormValue("content")
	author := r.FormValue("author")
	authorID := r.FormValue("author_id")
	date := r.FormValue("date")

	imagePath, err := handleFileUpload(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var image sql.NullString
	if imagePath != "" {
		image = sql.NullString{String: imagePath, Valid: true}
	} else {
		image = sql.NullString{String: "", Valid: false}
	}

	var id int
	err = db.QueryRow("INSERT INTO posts (title, content, author, author_id, date, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", title, content, author, authorID, date, image).Scan(&id)
	if err != nil {
		log.Println("Error inserting post:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = db.Exec("UPDATE users SET post_ids = array_append(post_ids, $1) WHERE author_id = $2", id, authorID)
	if err != nil {
		log.Println("Error updating user's post_ids:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int{"id": id})
	log.Println("Post created successfully:", id)
}
