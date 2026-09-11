resource "azurerm_static_web_app" "frontend" {
  name                = "bratai-frontend"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  
  # Standard is required if we want to add custom domains later!
  sku_tier = "Standard" 
  sku_size = "Standard"
}

# Print out the URL so you know where to visit your app!
output "frontend_url" {
  value = "https://${azurerm_static_web_app.frontend.default_host_name}"
}
