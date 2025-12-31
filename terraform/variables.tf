variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "table_name" {
  description = "DynamoDB table name"
  type        = string
  default     = "ItemsTable"
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "bg-terraform"
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
  default     = "10.0.0.0/16"
}
