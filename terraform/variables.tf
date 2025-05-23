variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "aws_account_id" {
  description = "AWS account ID"
  type        = string
  default     = "457031429343"
}

variable "github_org" {
  description = "GitHub organization name"
  type        = string
  default     = "TestBoxLab"
}

variable "repo_name" {
  description = "GitHub repository name"
  type        = string
  default     = "browser-sdk"
}

variable "s3_bucket_name" {
  description = "S3 bucket name where files will be uploaded"
  type        = string
  default     = "tbx-assets"
} 
