package utils

import (
	"fmt"
	"time"
)

type UniqueIdService struct{}

func (s *UniqueIdService) GenerateUniqueId(userName string) string {
	date := time.Now().UTC().Format("20060102T150405Z")
	return fmt.Sprintf("oandbtech@%s-%s@oandbtech", date, userName)
}
