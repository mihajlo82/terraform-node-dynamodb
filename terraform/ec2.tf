resource "aws_instance" "blue" {
  ami                    = "ami-0dc2d3e4c0f9ebd18" # Example: Amazon Linux 2
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public_a.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  key_name               = "shared-bg-kpair" # Replace with your key

  tags = {
    Name = "${var.project_name}-blue"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_instance" "green" {
  ami                    = "ami-0dc2d3e4c0f9ebd18"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public_b.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  key_name               = "shared-bg-kpair"

  tags = {
    Name = "${var.project_name}-green"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_target_group_attachment" "blue" {
  target_group_arn = aws_lb_target_group.blue.arn
  target_id        = aws_instance.blue.id
  port             = 3000
}

resource "aws_lb_target_group_attachment" "green" {
  target_group_arn = aws_lb_target_group.green.arn
  target_id        = aws_instance.green.id
  port             = 3000
}
