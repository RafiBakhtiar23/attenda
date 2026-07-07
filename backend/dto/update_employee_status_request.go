package dto

type UpdateEmployeeStatusRequest struct {
	IsActive *bool `json:"is_active" validate:"required"`
}
