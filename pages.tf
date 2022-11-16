resource "cloudflare_pages_project" "frontend" {
  depends_on        = [google_cloudfunctions2_function.function]
  account_id        = var.cf_account_id
  name              = var.cf_pages_project_name
  production_branch = data.github_repository.repo.default_branch

  # Manage build config
  build_config {
    build_command       = "yarn build"
    destination_dir     = "dist"
    root_dir            = "frontend"
    web_analytics_tag   = var.cf_web_analytics_tag
    web_analytics_token = var.cf_web_analytics_token
  }

  # Manage project source
  source {
    type = "github"
    config {
      owner                         = split("/", data.github_repository.repo.full_name)[0]
      repo_name                     = data.github_repository.repo.name
      production_branch             = data.github_repository.repo.default_branch
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "custom"
      preview_branch_includes       = ["dev", "preview"]
      preview_branch_excludes       = [data.github_repository.repo.default_branch]
    }
  }

  # Manage deployment configs
  deployment_configs {
    preview {
      environment_variables = {
        VITE_REGISTER_API_URL   = google_cloudfunctions2_function.function.service_config[0].uri
        VITE_TURNSTILE_SITE_KEY = var.ct_turnstile_site_key
        VITE_FORM_CLOSING_TIME  = var.cf_pages_form_closing_time
      }
    }
    production {
      environment_variables = {
        VITE_REGISTER_API_URL   = google_cloudfunctions2_function.function.service_config[0].uri
        VITE_TURNSTILE_SITE_KEY = var.ct_turnstile_site_key
        VITE_FORM_CLOSING_TIME  = var.cf_pages_form_closing_time
      }
    }
  }

}
