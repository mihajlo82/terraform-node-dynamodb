# Blue–Green Deployment on AWS with Terraform, GitHub Actions, and Node.js

## 📌 Project Overview

This project demonstrates a **production-style Blue–Green deployment** on AWS using:

* **Terraform** for infrastructure provisioning
* **GitHub Actions** for CI/CD
* **Application Load Balancer (ALB)** with Blue & Green target groups
* **EC2 (Amazon Linux 2)** running a Node.js + Express app managed by PM2
* **DynamoDB** for persistent storage

Most AWS resources (VPC, subnets, security groups, ALB, target groups, EC2 instances, IAM roles, DynamoDB) are **fully created and managed by Terraform**.

---

## 🧱 Architecture

```
Developer → GitHub Push
            ↓
      GitHub Actions CI/CD
            ↓
   ┌──────────────────────────────┐
   │  Application Load Balancer    │
   │                              │
   │  Listener (HTTP :80)          │
   └───────────┬──────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────────────┐  ┌──────────────┐
│ Blue TG      │  │ Green TG     │
│ EC2 (Node)   │  │ EC2 (Node)   │
│ PM2 + App    │  │ PM2 + App    │
└──────────────┘  └──────────────┘
        │                │
        └───────┬────────┘
                │
          DynamoDB Table
```

---

## 🏗️ Infrastructure (Terraform)

All infrastructure is defined in **Terraform** and created before CI/CD runs.

### Terraform provisions:

* VPC with public subnets
* Internet Gateway & routing
* Security Groups (ALB + EC2)
* Application Load Balancer
* ALB Listener (HTTP :80)
* Two Target Groups (Blue & Green)
* Two EC2 instances (Blue & Green)
* IAM Role + Instance Profile for EC2
* DynamoDB table (`Users`)

> ⚠️ **Important**: GitHub Actions does **not** create infrastructure. It only deploys application code and switches ALB traffic.

---

## 🔐 IAM & Security

### EC2 IAM Role Permissions

The EC2 instances assume an IAM role created by Terraform with permissions such as:

```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:PutItem",
    "dynamodb:Scan",
    "dynamodb:GetItem"
  ],
  "Resource": "arn:aws:dynamodb:*:*:table/Users"
}
```

This allows the Node.js app to access DynamoDB **without AWS keys on the server**.

---

## 🚀 CI/CD Pipeline (GitHub Actions)

### Trigger

* Push to `main` or `dev` branch

### High-level flow

1. Checkout code
2. Configure AWS credentials
3. Detect which target group is currently LIVE
4. Select the IDLE environment (Blue or Green)
5. Copy code to the idle EC2 using SCP
6. Restart the Node.js app via SSH + PM2
7. Switch ALB listener to the new target group

---

## 🔁 Blue–Green Logic

* ALB always points to **one active target group**
* Deployment happens on the **idle** target group
* Once healthy, traffic is switched
* Zero downtime deployments

---

## 📦 Application Runtime

* **Node.js** installed manually on EC2 (compatible with Amazon Linux 2 GLIBC)
* **Express.js** backend
* **PM2** process manager
* App listens on port **3000**

Health checks are configured on the ALB target groups to match the running app.

---

## 🗄️ DynamoDB Integration

* Table: `Users`
* Accessed via AWS SDK (v2)
* EC2 IAM role provides permissions

Example API:

```
GET /users
POST /users
PUT /users/:id
DELETE /users/:id
```

---

## 🧪 Troubleshooting (Real Issues Solved)

### 502 Bad Gateway

* App not running
* PM2 crashed
* Wrong health check path or port

### Target Group Unhealthy

* App not listening on expected port
* Security group blocking traffic

### DynamoDB Access Denied

* Missing IAM policy on EC2 role

### GLIBC Errors

* Using incompatible Node binaries
* Fixed by installing Node manually or via NVM

---

## 📂 Repository Structure

```
.
├── terraform/
│   ├── vpc.tf
│   ├── alb.tf
│   ├── ec2.tf
│   ├── iam.tf
│   ├── dynamodb.tf
│   └── outputs.tf
├── .github/workflows/
│   └── deploy.yml
├── app.js
├── package.json
├── script.js
└── README.md
```

---

## ✅ Prerequisites

* AWS Account
* Terraform installed
* GitHub repository
* EC2 key pair


---

## 🔮 Improvements

* Migrate AWS SDK v2 → v3
* Add HTTPS (ACM + ALB)
* Auto Scaling Groups instead of static EC2
* Replace SCP with artifact-based deploy
* Add rollback logic

---

## 👏 Final Notes

This project demonstrates:

* Real-world blue–green deployment
* Infrastructure as Code with Terraform
* Zero-downtime CI/CD
* Secure AWS service integration

Built through real debugging and production-style iteration.
