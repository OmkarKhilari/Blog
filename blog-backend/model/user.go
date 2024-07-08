package model

type User struct {
	ID         int    `json:"id"`
	AuthorName string `json:"author_name"`
	AuthorID   string `json:"author_id"`
	PostIDs    []int  `json:"post_ids"`
}
