variable "cf_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "cf_account_id" {
  description = "Cloudflare account ID"
  type        = string
  sensitive   = true
}

variable "cf_turnstile_secret" {
  description = "Secret used to sign the turnstile token"
  type        = string
  sensitive   = true
}

variable "cf_web_analytics_tag" {
  description = "The Cloudflare Web Analytics tag to use for the site"
  type        = string
  default     = ""
}

variable "cf_web_analytics_token" {
  description = "The token for the web analytics tag"
  type        = string
  default     = ""
}

variable "cf_pages_project_name" {
  description = "The name of the Cloudflare Pages project to deploy to"
  type        = string
  default     = "event-booz"
}

variable "cf_pages_form_closing_time" {
  description = "Form closing time in ISO 8601 format"
  type        = string
  default     = "2035-12-31T23:59:59Z"
}

variable "ct_turnstile_site_key" {
  description = "Site key used to verify the turnstile token"
  type        = string
}

variable "gh_pages_owner" {
  description = "The owner of the GitHub repository"
  type        = string
  default     = "soof-golan"
}

variable "gh_pages_repo_name" {
  description = "The name of the GitHub repository"
  type        = string
  default     = "event-booz"
}

variable "git_production_branch" {
  description = "The name of the production branch"
  type        = string
  default     = "main"
}

variable "gcp_project_name" {
  description = "The name of the GCP project"
  type        = string
  default     = "event-booz-gcp"
}

variable "gcp_region" {
  description = "The region to deploy the GCP resources to"
  type        = string
  default     = "europe-west1"
}
