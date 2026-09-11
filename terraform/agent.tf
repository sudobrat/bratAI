resource "azurerm_container_app" "agent" {
  name                         = "agent-service"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  secret {
    name  = "mongodb-uri"
    value = "${var.mongodb_base_uri}/agent"
  }
  secret {
    name  = "groq-key"
    value = var.groq_api_key
  }
  secret {
    name  = "google-key"
    value = var.google_api_key
  }
  secret {
    name  = "tavily-key"
    value = var.tavily_api_key
  }
  secret {
    name  = "openrouter-key"
    value = var.openrouter_api_key
  }
  secret {
    name  = "qdrant-key"
    value = var.qdrant_api_key
  }
  # Inject the Azure Storage Key directly from the storage resource!
  secret {
    name  = "azure-storage-key"
    value = azurerm_storage_account.storage.primary_connection_string
  }

  template {
    container {
      name   = "agent"
      image  = "${azurerm_container_registry.acr.login_server}/agent:latest"
      cpu    = 0.5
      memory = "1Gi"
      # --- Standard Variables ---
      env {
        name  = "PORT"
        value = "8003"
      }
      env {
        name  = "QDRANT_URL"
        value = var.qdrant_url
      }
      env {
        name  = "AUTH_SERVICE"
        value = "http://${azurerm_container_app.auth.latest_revision_fqdn}"
      }
      env {
        name  = "CHAT_SERVICE"
        value = "http://${azurerm_container_app.chat.latest_revision_fqdn}"
      }
      env {
        name  = "REDIS_URL"
        value = "redis://${azurerm_container_app.redis.latest_revision_fqdn}:6379"
      }
      env {
        name        = "MONGODB_URI"
        secret_name = "mongodb-uri"
      }
      env {
        name        = "GROQ_API_KEY"
        secret_name = "groq-key"
      }
      env {
        name        = "GOOGLE_API_KEY"
        secret_name = "google-key"
      }
      env {
        name        = "TAVILY_API_KEY"
        secret_name = "tavily-key"
      }
      env {
        name        = "OPENROUTER_API_KEY"
        secret_name = "openrouter-key"
      }
      env {
        name        = "QDRANT_API_KEY"
        secret_name = "qdrant-key"
      }
      env {
        name        = "AZURE_STORAGE_CONNECTION_STRING"
        secret_name = "azure-storage-key"
      }
    }
  }

  ingress {
    external_enabled = false
    target_port      = 8003
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}
