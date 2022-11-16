resource "google_storage_bucket" "backend_source_bucket" {
  name                        = "${google_project.project.project_id}-gcf-source"
  location                    = var.gcp_region
  project                     = var.gcp_project_name
  uniform_bucket_level_access = true
}

data "archive_file" "function_source" {
  type        = "zip"
  source_dir  = "${path.module}/backend"
  excludes    = [".git", ".gitignore", ".terraform", "terraform.tfstate", "terraform.tfstate.backup", "terraform.tfvars", "terraform.tfvars.json", "terraform.tfstate.d"]
  output_path = "${path.module}/build/function.zip"
}

resource "google_storage_bucket_object" "function_source_obj" {
  name   = "function.zip"
  bucket = google_storage_bucket.backend_source_bucket.name
  source = "${path.module}/build/function.zip"  # Add path to the zipped function source code
}


resource "google_cloudfunctions2_function" "function" {
  name        = "eb-register"
  location    = var.gcp_region
  description = "Form Registration"
  project     = var.gcp_project_name
  build_config {
    runtime     = "python310"
    entry_point = "register"
    source {
      storage_source {
        bucket = google_storage_bucket.backend_source_bucket.name
        object = google_storage_bucket_object.function_source_obj.name
      }
    }
  }

  service_config {
    service_account_email = google_service_account.account.email
    max_instance_count    = 1000
    available_memory      = "512M"
    timeout_seconds       = 4
    environment_variables = {
      CF_TURNSTILE_SECRET = var.cf_turnstile_secret
      FUNCTION_HASH       = filebase64sha256("${path.module}/build/function.zip")
    }
    ingress_settings               = "ALLOW_ALL"
    min_instance_count             = 0
    all_traffic_on_latest_revision = true
  }

}

data "google_iam_policy" "noauth" {
  binding {
    role    = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloudfunctions2_function.function.location
  project     = google_cloudfunctions2_function.function.project
  service     = google_cloudfunctions2_function.function.name
  policy_data = data.google_iam_policy.noauth.policy_data
}

output "register_function_uri" {
  value = google_cloudfunctions2_function.function.service_config[0].uri
}
