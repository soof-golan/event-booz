provider "google-beta" {
  project = var.gcp_project_name
  region  = var.gcp_region
}

data "google_billing_account" "acct" {
  display_name = "My Billing Account"
  open         = true
}


resource "google_project" "project" {
  name            = "Event Booz GCP Project"
  project_id      = var.gcp_project_name
  billing_account = data.google_billing_account.acct.id
}

resource "google_project_service" "cloudfunctions" {
  project = var.gcp_project_name
  service = "cloudfunctions.googleapis.com"
}

resource "google_project_service" "run" {
  project = var.gcp_project_name
  service = "run.googleapis.com"
}

resource "google_project_service" "storagecomponent" {
  project = var.gcp_project_name
  service = "storage-component.googleapis.com"
}

resource "google_project_service" "cloudbuild" {
  project = var.gcp_project_name
  service = "cloudbuild.googleapis.com"
}

resource "google_project_service" "artifactregistry" {
  project = var.gcp_project_name
  service = "artifactregistry.googleapis.com"
}

resource "google_service_account" "account" {
  project = var.gcp_project_name
  account_id = "event-booz-service-account"
  display_name = "Event Booz Service Account"
}

resource "null_resource" "service_account_delay" {
    provisioner "local-exec" {
        command = "sleep 20"
    }
  triggers = {
    "before" = google_service_account.account.account_id
  }
}