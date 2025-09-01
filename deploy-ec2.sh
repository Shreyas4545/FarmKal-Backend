#!/bin/bash

# AWS EC2 Deployment Script for NestJS FarmKal App
# Run this script on your EC2 instance after initial setup

set -e

echo "🚀 Starting FarmKal NestJS App Deployment on EC2..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install nginx
echo "📦 Installing nginx..."
sudo apt install -y nginx

# Install git if not present
echo "📦 Installing git..."
sudo apt install -y git

# Create app directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/farmkal
sudo chown -R $USER:$USER /var/www/farmkal

# Clone repository (replace with your repo URL)
echo "📥 Cloning repository..."
cd /var/www/farmkal
# git clone https://github.com/yourusername/farmkal-backend.git .
# For now, you'll need to upload your code manually or via git

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install --legacy-peer-deps

# Build the application
echo "🔨 Building NestJS application..."
npm run build

# Create .env file template
echo "📝 Creating environment file template..."
cat > .env << EOL
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Ably
ABLY_API_KEY=your_ably_api_key

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# AI Services
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

# SMS
FAST_TWO_SMS_API_KEY=your_sms_api_key

# App Configuration
PORT=3000
NODE_ENV=production
EOL

echo "⚠️  Please edit /var/www/farmkal/.env with your actual environment variables"

# Create PM2 ecosystem file
echo "📝 Creating PM2 ecosystem configuration..."
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'farmkal-api',
    script: 'dist/main.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/farmkal-error.log',
    out_file: '/var/log/pm2/farmkal-out.log',
    log_file: '/var/log/pm2/farmkal-combined.log',
    time: true
  }]
};
EOL

# Create PM2 log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Configure nginx
echo "🌐 Configuring nginx..."
sudo tee /etc/nginx/sites-available/farmkal << EOL
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain or EC2 public IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # WebSocket support for Socket.io
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOL

# Enable nginx site
sudo ln -sf /etc/nginx/sites-available/farmkal /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Start and enable services
echo "🔄 Starting services..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Start PM2 application
echo "🚀 Starting NestJS application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Deployment completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit /var/www/farmkal/.env with your environment variables"
echo "2. Update nginx server_name with your domain/IP in /etc/nginx/sites-available/farmkal"
echo "3. Restart services: sudo systemctl restart nginx && pm2 restart farmkal-api"
echo "4. Check application status: pm2 status"
echo "5. View logs: pm2 logs farmkal-api"
echo ""
echo "🌐 Your app should be accessible at: http://your-ec2-public-ip"
