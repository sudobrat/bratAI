resource "azurerm_container_app" "billing" {
  name                         = "billing-service"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  secret {
    name  = "mongodb-uri"
    value = "${var.mongodb_base_uri}/billing"
  }
  secret {
    name  = "razorpay-secret"
    value = var.razorpay_key_secret
  }

  template {
    container {
      name   = "billing"
      image  = "${azurerm_container_registry.acr.login_server}/billing:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "PORT"
        value = "8004"
      }
      env {
        name        = "MONGODB_URI"
        secret_name = "mongodb-uri"
      }
      env {
        name  = "RAZORPAY_KEY_ID"
        value = var.razorpay_key_id
      }
      env {
        name        = "RAZORPAY_KEY_SECRET"
        secret_name = "razorpay-secret"
      }
      env {
        name  = "AUTH_SERVICE"
        value = "http://${azurerm_container_app.auth.latest_revision_fqdn}"
      }
    }
  }

  ingress {
    external_enabled = false
    target_port      = 8004
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}
