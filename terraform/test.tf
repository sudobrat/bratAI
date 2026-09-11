terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}
provider "azurerm" {
  features {}
}
output "test" {
  value = azurerm_container_app.gateway.ingress[0].fqdn
}
