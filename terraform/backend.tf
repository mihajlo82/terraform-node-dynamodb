terraform {
  backend "s3" {
    bucket         = "my-terraform-state-mihajlo"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

