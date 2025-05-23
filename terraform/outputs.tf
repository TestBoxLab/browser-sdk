output "github_actions_role_arn" {
  description = "ARN of the IAM role for GitHub Actions"
  value       = aws_iam_role.github_actions_role.arn
}

output "s3_deploy_policy_arn" {
  description = "ARN of the S3 deployment policy"
  value       = aws_iam_policy.s3_deploy_policy.arn
} 
