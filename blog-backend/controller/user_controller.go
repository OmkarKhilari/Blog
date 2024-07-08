package controller

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/lib/pq"
	"github.com/OmkarKhilari/Blog/blog-backend/model"
)

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user model.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	db, err := sql.Open("postgres", "user=youruser password=yourpassword dbname=blogdb sslmode=disable")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer db.Close()

	query := `INSERT INTO users (author_id, author_name, post_ids) VALUES ($1, $2, $3)`
	_, err = db.Exec(query, user.AuthorID, user.AuthorName, pq.Array(user.PostIDs))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully!"})
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	authorID := r.URL.Query().Get("author_id")
	if authorID == "" {
		http.Error(w, "Author ID is required", http.StatusBadRequest)
		return
	}

	db, err := sql.Open("postgres", "user=youruser password=yourpassword dbname=blogdb sslmode=disable")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer db.Close()

	var user model.User
	query := `SELECT author_id, author_name, post_ids FROM users WHERE author_id = $1`
	row := db.QueryRow(query, authorID)
	err = row.Scan(&user.AuthorID, &user.AuthorName, pq.Array(&user.PostIDs))
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
