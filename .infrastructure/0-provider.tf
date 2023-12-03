terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "eu-central-1"
}

variable "cluster_name" {
  default = "maawf-cluster"
}

variable "cluster_version" {
  default = "1.28"
}