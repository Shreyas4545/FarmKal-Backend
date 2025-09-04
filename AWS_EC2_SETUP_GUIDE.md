# AWS EC2 Free Tier Setup Guide for FarmKal NestJS App

## 🎯 Overview

This guide will help you deploy your NestJS application on AWS EC2 Free Tier, eliminating cold start issues from Render.

## 📋 Prerequisites

- AWS Account (Free Tier eligible)
- **Valid credit/debit card** (required for AWS account verification)
- Your application code ready
- Environment variables from current deployment

---

## 💳 Step 0: AWS Account Setup (If Not Done)

### 0.1 Create AWS Account

1. Go to [AWS Sign Up](https://aws.amazon.com)
2. Click **Create an AWS Account**
3. Enter email and account name
4. Choose **Personal** account type

### 0.2 Add Payment Information

1. **Credit/Debit Card Required** - Don't worry, you won't be charged for Free Tier usage
2. Add your card details
3. Verify phone number
4. Choose **Basic Support Plan** (Free)

### 0.3 Set Up Billing Alerts (Recommended)

1. Go to **Billing Dashboard**
2. Enable **Receive Billing Alerts**
3. Create alert for **$1** to monitor any unexpected charges
4. Set up **Free Tier Usage Alerts**

---

## 🚀 Step 1: Launch EC2 Instance

### 1.1 Access AWS Console

1. Login to [AWS Console](https://console.aws.amazon.com)
2. Navigate to **EC2 Dashboard**
3. Click **Launch Instance**

### 1.2 Configure Instance

1. **Name**: `farmkal-production`
2. **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
3. **Instance Type**: `t2.micro` (Free tier eligible)
4. **Key Pair**:
   - Create new key pair: `farmkal-key`
   - Download `.pem` file and keep it safe
5. **Security Group**: Create new with these rules:
   - **SSH (22)**: Your IP only
   - **HTTP (80)**: 0.0.0.0/0 (Anywhere)
   - **HTTPS (443)**: 0.0.0.0/0 (Anywhere)
   - **Custom TCP (3000)**: 0.0.0.0/0 (For testing)

### 1.3 Launch Instance

- Review settings and click **Launch Instance**
- Wait for instance to be in **Running** state
- Note down **Public IPv4 address**

---

## 🔐 Step 2: Connect to EC2 Instance

### 2.1 SSH Connection

```bash
# Make key file secure
chmod 400 farmkal-key.pem

# Connect to instance (replace with your IP)
ssh -i farmkal-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### 2.2 Verify Connection

```bash
# Check system info
uname -a
whoami
```

---

## 📦 Step 3: Deploy Application

### 3.1 Upload Deployment Script

```bash
# On your local machine, copy the deployment script
scp -i farmkal-key.pem deploy-ec2.sh ubuntu@YOUR_EC2_PUBLIC_IP:~/
```

### 3.2 Upload Your Application Code

**Option A: Using SCP**

```bash
# Zip your project (exclude node_modules)
zip -r farmkal-app.zip . -x "node_modules/*" "dist/*" ".git/*"

# Upload to EC2
scp -i farmkal-key.pem farmkal-app.zip ubuntu@YOUR_EC2_PUBLIC_IP:~/
```

**Option B: Using Git (Recommended)**

```bash
# On EC2 instance, clone your repository
git clone https://github.com/yourusername/farmkal-backend.git /var/www/farmkal
```

### 3.3 Run Deployment Script

```bash
# On EC2 instance
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

---

## ⚙️ Step 4: Configure Environment Variables

### 4.1 Edit Environment File

```bash
# Navigate to app directory
cd /var/www/farmkal

# Edit environment variables
nano .env
```

### 4.2 Add Your Actual Values

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farmkal

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Ably
ABLY_API_KEY=your_ably_api_key

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# AI Services
OPENAI_API_KEY=sk-your_openai_key
GROQ_API_KEY=gsk_your_groq_key
HUGGINGFACE_API_KEY=hf_your_huggingface_key

# SMS
FAST_TWO_SMS_API_KEY=your_sms_api_key

# App Configuration
PORT=3000
NODE_ENV=production
```

---

## 🌐 Step 5: Configure Domain/IP

### 5.1 Update Nginx Configuration

```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/farmkal

# Replace 'your-domain.com' with your EC2 public IP or domain
server_name YOUR_EC2_PUBLIC_IP;
```

### 5.2 Restart Services

```bash
# Test nginx config
sudo nginx -t

# Restart services
sudo systemctl restart nginx
pm2 restart farmkal-api
```

---

## ✅ Step 6: Verify Deployment

### 6.1 Check Application Status

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs farmkal-api

# Check nginx status
sudo systemctl status nginx
```

### 6.2 Test API Endpoints

```bash
# Test health endpoint
curl http://YOUR_EC2_PUBLIC_IP/

# Test specific endpoint
curl http://YOUR_EC2_PUBLIC_IP/api/health
```

### 6.3 Browser Test

- Open browser: `http://YOUR_EC2_PUBLIC_IP`
- Should see your API response (no cold start!)

---

## 🔧 Step 7: Monitoring & Maintenance

### 7.1 Useful Commands

```bash
# View application logs
pm2 logs farmkal-api --lines 100

# Restart application
pm2 restart farmkal-api

# View system resources
htop
df -h
free -m

# Check nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 7.2 Auto-restart Setup

```bash
# Ensure PM2 starts on boot
pm2 startup
pm2 save
```

---

## 🚨 Troubleshooting

### Common Issues:

**1. Application won't start**

```bash
# Check logs
pm2 logs farmkal-api
# Usually missing environment variables
```

**2. 502 Bad Gateway**

```bash
# Check if app is running
pm2 status
# Check nginx config
sudo nginx -t
```

**3. Can't connect to database**

```bash
# Verify MongoDB URI in .env
# Check if IP is whitelisted in MongoDB Atlas
```

**4. Memory issues**

```bash
# Check memory usage
free -m
# Restart if needed
pm2 restart farmkal-api
```

---

## 💰 Cost Monitoring

### Free Tier Limits:

- **750 hours/month** of t2.micro (covers 24/7 usage)
- **30 GB EBS storage**
- **15 GB data transfer out**

### After Free Tier (12 months):

- **~$8.50/month** for t2.micro
- **~$3/month** for 30GB EBS storage

---

## 🔒 Security Best Practices

1. **Regular Updates**

```bash
sudo apt update && sudo apt upgrade -y
```

2. **Firewall Setup**

```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
```

3. **Key Management**

- Never share your `.pem` file
- Use IAM roles for AWS services
- Rotate secrets regularly

---

## 🎉 Success!

Your NestJS application is now running on AWS EC2 with:

- ✅ **No cold starts**
- ✅ **Always-on server**
- ✅ **Free for 12 months**
- ✅ **WebSocket support for Ably**
- ✅ **Auto-restart on crashes**

**Your API is accessible at**: `http://YOUR_EC2_PUBLIC_IP`
