#!/bin/bash

# Helper script to upload FarmKal app to EC2 instance
# Run this from your local project directory

# Configuration - UPDATE THESE VALUES
EC2_IP="YOUR_EC2_PUBLIC_IP"
KEY_FILE="farmkal-key.pem"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 FarmKal EC2 Upload Script${NC}"

# Check if key file exists
if [ ! -f "$KEY_FILE" ]; then
    echo -e "${RED}❌ Key file $KEY_FILE not found!${NC}"
    echo "Please place your EC2 key file in this directory"
    exit 1
fi

# Check if EC2_IP is set
if [ "$EC2_IP" = "YOUR_EC2_PUBLIC_IP" ]; then
    echo -e "${RED}❌ Please update EC2_IP in this script with your actual EC2 public IP${NC}"
    exit 1
fi

# Create temporary directory for upload
echo -e "${YELLOW}📦 Preparing files for upload...${NC}"
mkdir -p temp_upload
cp -r src temp_upload/
cp package*.json temp_upload/
cp tsconfig*.json temp_upload/
cp nest-cli.json temp_upload/
cp .prettierrc temp_upload/
cp .eslintrc.js temp_upload/

# Create archive
echo -e "${YELLOW}🗜️  Creating archive...${NC}"
cd temp_upload
tar -czf ../farmkal-app.tar.gz .
cd ..
rm -rf temp_upload

# Upload to EC2
echo -e "${YELLOW}⬆️  Uploading to EC2...${NC}"
scp -i "$KEY_FILE" farmkal-app.tar.gz ubuntu@$EC2_IP:~/

# Upload deployment script
echo -e "${YELLOW}📋 Uploading deployment script...${NC}"
scp -i "$KEY_FILE" deploy-ec2.sh ubuntu@$EC2_IP:~/

# SSH and extract
echo -e "${YELLOW}🔧 Extracting files on EC2...${NC}"
ssh -i "$KEY_FILE" ubuntu@$EC2_IP << 'EOF'
# Create app directory if it doesn't exist
sudo mkdir -p /var/www/farmkal
sudo chown -R $USER:$USER /var/www/farmkal

# Extract files
cd /var/www/farmkal
tar -xzf ~/farmkal-app.tar.gz
rm ~/farmkal-app.tar.gz

# Make deployment script executable
chmod +x ~/deploy-ec2.sh

echo "✅ Files uploaded successfully!"
echo "📋 Next steps:"
echo "1. Run: ./deploy-ec2.sh"
echo "2. Configure environment variables in /var/www/farmkal/.env"
echo "3. Update nginx configuration with your domain/IP"
EOF

# Cleanup
rm farmkal-app.tar.gz

echo -e "${GREEN}✅ Upload completed!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. SSH to your EC2: ssh -i $KEY_FILE ubuntu@$EC2_IP"
echo "2. Run deployment script: ./deploy-ec2.sh"
echo "3. Configure your environment variables"
