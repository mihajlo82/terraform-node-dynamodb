# Blue–Green Deployment Node.js  with DynamoDB App on AWS

This project demonstrates a **production-ready Blue–Green deployment** setup for a Node.js CRUD application running on **AWS EC2**, fronted by an **Application Load Balancer (ALB)**, and using **Amazon DynamoDB** as the database. Deployment is fully automated using **GitHub Actions**.

---

## 🚀 Architecture Overview

**High-level flow:**

1. Developer pushes code to GitHub (`main` or `dev` branch)
2. GitHub Actions CI/CD pipeline runs
3. Pipeline determines which environment is LIVE (Blue or Green)
4. Code is deployed to the IDLE EC2 instance
5. App is restarted using PM2
6. ALB listener switches traffic to the newly deployed target group
7. Health checks confirm the deployment

```
GitHub → GitHub Actions → EC2 (Blue / Green) → ALB → Users
                                   ↓
                               DynamoDB
```

---

## 🧱 Components Used

### AWS

* **EC2 (Amazon Linux 2)** – Application servers (Blue & Green)
* **Application Load Balancer (ALB)** – Traffic routing
* **Target Groups** – Blue and Green environments
* **IAM Role for EC2** – Secure DynamoDB access
* **DynamoDB** – NoSQL database (`Users` table)

### DevOps / Tooling

* **GitHub Actions** – CI/CD automation
* **PM2** – Node.js process manager
* **Node.js (v14 via NVM)** – Runtime environment
* **Express.js** – Backend framework

---

## 📂 Project Structure

```
.
├── app.js              # Express server
├── script.js           # Frontend JS (fetch users)
├── package.json
├── package-lock.json
├── views/
├── public/
├── .github/
│   └── workflows/
│       └── deploy.yml  # Blue–Green deployment pipeline
└── README.md
```

---

## ⚙️ Application Details

### Backend

* Node.js + Express
* Runs on **port 3000**
* Endpoints:

  * `GET /users` – Fetch users from DynamoDB
  * `POST /users` – Add user to DynamoDB

### Process Management

* Managed using **PM2**
* Supports reload without downtime

---

## 🔐 Security & IAM

### EC2 IAM Role

The EC2 instances use an **IAM Role** (no access keys stored in code).

**Required IAM permissions:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:<ACCOUNT_ID>:table/Users"
    }
  ]
}
```

---

## 🔁 Blue–Green Deployment Strategy

* **Blue** = current live version
* **Green** = new version
* Only one environment serves traffic at a time

### Deployment Logic

1. Detect which target group is live
2. Deploy to the idle EC2
3. Restart app with PM2
4. Switch ALB listener to new target group

This ensures:

* ✅ Zero downtime
* ✅ Fast rollback (switch target group back)

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Trigger

```yaml
on:
  push:
    branches:
      - main
      - dev
```

### Key Steps

1. Checkout code
2. Configure AWS credentials
3. Detect live target group
4. Copy code to EC2 (SCP)
5. Restart app via SSH
6. Switch ALB traffic

---

## 📦 Deployment Notes

### Why SCP instead of `git pull` on EC2?

* Ensures **exact same code** that was tested
* No need to store GitHub credentials on EC2
* More secure & deterministic

---

## 🩺 Health Checks

ALB health checks:

* Protocol: HTTP
* Path: `/`
* Port: `3000`

If health checks fail, traffic will not switch.

---

## 🐞 Common Issues & Fixes

### 502 Bad Gateway

* App not running
* Wrong port
* Failed health check

### DynamoDB Access Denied

* Missing IAM permissions on EC2 role

### Node / GLIBC Errors

* Use **NVM-built Node**, not system Node

---

## 🚀 How to Deploy

1. Push code to `main` or `dev`
2. GitHub Actions runs automatically
3. Monitor workflow logs
4. ALB switches traffic when healthy

---

## 🔮 Future Improvements

* Add `/health` endpoint
* Auto rollback on failed health checks
* Migrate AWS SDK v2 → v3
* Add CloudWatch alarms
* Use build artifacts instead of SCP

---

## 👏 Final Notes

This project follows **real-world DevOps best practices**:

* No downtime deployments
* Secure IAM usage
* Infrastructure-aware CI/CD

Feel free to fork, extend, and improve 🚀

---

**Author:** Mihajlo Dimitric 💪
