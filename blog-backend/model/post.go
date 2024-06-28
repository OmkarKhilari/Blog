package model

type Post struct {
    ID       int    `json:"id"`
    Title    string `json:"title"`
    Content  string `json:"content"`
    Author   string `json:"author"`
    Date     string `json:"date"`
    Views    int    `json:"views"`
    Comments int    `json:"comments"`
    Image    string `json:"image"`
}