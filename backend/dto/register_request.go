package dto

type RegisterRequest struct {
	Fullname string `json:"full_name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
