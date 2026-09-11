resource "azurerm_container_app" "chat" {
  name                         = "chat-service"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  secret {
    name  = "mongodb-uri"
    value = "${var.mongodb_base_uri}/chat"
  }

  template {
    container {
      name   = "chat"
      image  = "${azurerm_container_registry.acr.login_server}/chat:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "PORT"
        value = "8002"
      }

      env {
        name        = "MONGODB_URI"
        secret_name = "mongodb-uri"
      }
    }
  }

  ingress {
    external_enabled = false
    target_port      = 8002
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}
