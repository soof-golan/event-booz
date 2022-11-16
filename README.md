# Event Booz

An event registration system for the yells 'Boooo!' at other systems.

![architecture](docs/arch.jpeg)

# Requirements

* GCP Account
* Cloudflare Account
* A GitHub Account
* `gcloud` CLI
* `terraform` CLI
* Node.js >=16 for `/frontend`
* Python 3.10 for `/backend`

# Setup

## GitHub

1. Fork this repository
2. Create a new GitHub Personal Access Token [here][gh-token] (no scopes required, unless you want to make this repo private)

## GCP

Install the `gcloud` CLI and run `gcloud init` to authenticate with GCP.

## Cloudflare

### Create a new API Token

Create an [API token][cf-token] with the following permissions:

* `Cloudflare Pages:Read`
* `Cloudflare Pages:Edit`

### Create a new Turnstile Site

[Turnstile][cf-turnstile] is a Cloudflare's Capthca competitor. I chose them kinda randomly, but they seem to work well.

Add the following domains to the Turnstile site:

* `<project-name>.pages.dev`
* `localhost`

## Terraform

Create a `terraform.tfvars` file with the following contents:

```hcl
cf_api_token          = "YOUR_CLOUDFLARE_API_TOKEN"
cf_account_id         = "YOUR_CLOUDFLARE_ACCOUNT_ID"
cf_turnstile_secret   = "YOUR_TURNSTILE_SECRET"
ct_turnstile_site_key = "YOUR_TURNSTILE_SITE_KEY"
gh_token              = "ghp_YOUR_GH_TOKEN"
```

Then run `terraform init` to verify that everything is configured correctly.

# Deployment

We'll use Terraform to deploy the infrastructure:

```bash
terraform init && terraform apply
```

Your fork of Event Booz should now be deployed to `<project-name>.pages.dev` (maybe).

[cf-token]: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/

[cf-turnstile]: https://developers.cloudflare.com/turnstile/

[gh-token]: https://github.com/settings/tokens/new?description=Event%20Booz%20(no%20scope%20required)
