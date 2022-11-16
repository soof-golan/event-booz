terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.43.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 4.43.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 5.8.0"
    }
  }
}
