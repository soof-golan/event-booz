provider "github" {
  token = var.gh_token
}

data "github_repository" "repo" {
  name = var.gh_pages_repo_name
}

