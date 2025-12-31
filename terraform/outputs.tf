output "dynamodb_table_name" {
  value = aws_dynamodb_table.items.name
}

output "dynamodb_table_arn" {
  value = aws_dynamodb_table.items.arn
}

output "vpc_id" {
  value = aws_vpc.this.id
}

output "public_subnets" {
  value = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]
}

output "alb_arn" {
  value = aws_lb.app_alb.arn
}

output "alb_dns" {
  value = aws_lb.app_alb.dns_name
}

output "blue_tg_arn" {
  value = aws_lb_target_group.blue.arn
}

output "green_tg_arn" {
  value = aws_lb_target_group.green.arn
}

output "listener_arn" {
  value = aws_lb_listener.http.arn
}


output "blue_instance_id" {
  value = aws_instance.blue.id
}

output "green_instance_id" {
  value = aws_instance.green.id
}

output "blue_instance_public_ip" {
  value = aws_instance.blue.public_ip
}

output "green_instance_public_ip" {
  value = aws_instance.green.public_ip
}
