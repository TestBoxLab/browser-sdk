provider "aws" {
  alias   = "testbox-root"
  region  = "us-east-1"
  default_tags {
    tags = {
      terraform = "true"
    }
  }
}

terraform {
  backend "s3" {
    bucket  = "tbx-terraform"
    key     = "browser-sdk.tfstate"
    region  = "us-west-2"
  }
}

resource "aws_iam_role" "github_actions_role" {
  name = "github-actions-${var.repo_name}-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${var.aws_account_id}:oidc-provider/token.actions.githubusercontent.com"
        }
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          },
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/${var.repo_name}:ref:refs/heads/*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_policy" "s3_deploy_policy" {
  name        = "s3-deploy-${var.repo_name}-policy"
  description = "Policy to allow uploading to specific S3 bucket paths"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Effect = "Allow"
        Resource = [
          "arn:aws:s3:::${var.s3_bucket_name}",
          "arn:aws:s3:::${var.s3_bucket_name}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "s3_deploy_attachment" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.s3_deploy_policy.arn
} 
