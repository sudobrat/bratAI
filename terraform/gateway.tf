resource "azurerm_container_app" "gateway" {
  name                         = "gateway-service"
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


  template {
    container {
      name   = "gateway"
      image  = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "PORT"
        value = "8000"
      }
            # Terraform pulls the URL dynamically from the frontend we just created!
      env {
        name  = "FRONTEND_URL"
        value = "https://${azurerm_static_web_app.frontend.default_host_name}"
      }

      
      # --- The Switchboard: Pointing to all internal services! ---
      env {
        name  = "AUTH_SERVICE"
        value = "http://${azurerm_container_app.auth.latest_revision_fqdn}"
      }
      env {
        name  = "CHAT_SERVICE"
        value = "http://${azurerm_container_app.chat.latest_revision_fqdn}"
      }
      env {
        name  = "AGENT_SERVICE"
        value = "http://${azurerm_container_app.agent.latest_revision_fqdn}"
      }
      env {
        name  = "BILLING_SERVICE"
        value = "http://${azurerm_container_app.billing.latest_revision_fqdn}"
      }
      env {
        name  = "REDIS_URL"
        value = "redis://${azurerm_container_app.redis.latest_revision_fqdn}:6379"
      }
    }
  }

  ingress {
    external_enabled = true 
    target_port      = 8000
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

output "gateway_url" {
  value = "https://${azurerm_container_app.gateway.latest_revision_fqdn}"
}
