resource "azurerm_container_app" "redis" {
  name                         = "redis-cache"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = "redis"
      image  = "redis:latest"
      cpu    = 0.25
      memory = "0.5Gi"
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = false # Internal only!
    target_port                = 6379
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}
