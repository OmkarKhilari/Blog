// controller/user.go
package controller

import (
    "database/sql"
    "encoding/json"
    "log"
    "net/http"

    "github.com/OmkarKhilari/Blog/blog-backend/database"
    "github.com/OmkarKhilari/Blog/blog-backend/model"
    "github.com/OmkarKhilari/Blog/blog-backend/utils"
    "github.com/lib/pq"
)

// CreateUser handles user creation
func CreateUser(w http.ResponseWriter, r *http.Request) {
    var user model.User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        log.Println("Error decoding user:", err)
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    log.Println("User decoded successfully:", user)

    // Generate a unique ID
    uniqueIdService := &utils.UniqueIdService{}
    user.AuthorID = uniqueIdService.GenerateUniqueId(user.AuthorName)
    log.Println("Generated Author ID:", user.AuthorID)

    db := database.GetDB()

    query := `INSERT INTO users (author_id, author_name, post_ids) VALUES ($1, $2, $3)`
    log.Println("Executing query:", query)
    _, err := db.Exec(query, user.AuthorID, user.AuthorName, pq.Array(user.PostIDs))
    if err != nil {
        log.Println("Error inserting user:", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    log.Println("User inserted successfully")

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully!"})
}

// GetUser handles fetching user by author_id
func GetUser(w http.ResponseWriter, r *http.Request) {
    authorID := r.URL.Query().Get("author_id")
    if authorID == "" {
        http.Error(w, "Author ID is required", http.StatusBadRequest)
        return
    }

    db := database.GetDB()

    var user model.User
    query := `SELECT author_id, author_name, post_ids FROM users WHERE author_id = $1`
    row := db.QueryRow(query, authorID)
    err := row.Scan(&user.AuthorID, &user.AuthorName, pq.Array(&user.PostIDs))
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
