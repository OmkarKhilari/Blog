package controller

import (
    "fmt"
    "io"
    "mime/multipart"
    "os"
)

func SaveFile(file multipart.File, header *multipart.FileHeader) (string, error) {
    // Create the uploads directory if it doesn't exist
    if _, err := os.Stat("./uploads"); os.IsNotExist(err) {
        os.Mkdir("./uploads", 0755)
    }

    // Create a new file in the uploads directory
    dst, err := os.Create(fmt.Sprintf("./uploads/%s", header.Filename))
    if err != nil {
        return "", err
    }
    defer dst.Close()

    // Copy the uploaded file data to the new file
    if _, err := io.Copy(dst, file); err != nil {
        return "", err
    }

    return header.Filename, nil
}
