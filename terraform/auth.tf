resource "azurerm_container_app" "auth" {
  name                         = "auth-service"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  secret {
    name  = "acr-password"
    value = azurerm_container_registry.acr.admin_password
  }

  registry {
    server               = azurerm_container_registry.acr.login_server
    username             = azurerm_container_registry.acr.admin_username
    password_secret_name = "acr-password"
  }


  secret {
    name  = "mongodb-uri"
    value = "${var.mongodb_base_uri}/auth"
  }

  template {
    container {
      name   = "auth"
      image  = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "PORT"
        value = "8001"
      }
      env {
        name        = "MONGODB_URI"
        secret_name = "mongodb-uri"
      }
      env {
        name = "REDIS_URL"
        # Points to the internal FQDN of the Redis container app we created above
        value = "redis://${azurerm_container_app.redis.latest_revision_fqdn}:6379"
      }
    }
  }

  ingress {
    external_enabled = false
    target_port      = 8001
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].container[0].image,
    ]
  }
}
