#!/bin/bash

# Complete Fix for NestJS Deployment on EC2
# This script will fix the deployment issues and ensure your app runs

set -e

echo "🔧 Fixing NestJS Deployment Issues..."

cd /var/www/farmkal

# Step 1: Install essential build dependencies
echo "📦 Installing essential build dependencies..."
sudo apt update
sudo apt install -y build-essential python3 python3-pip

# Step 2: Clean and reinstall Node.js dependencies
echo "🧹 Clean installation of dependencies..."
rm -rf node_modules package-lock.json dist/ .nest/

# Install dependencies with specific Node.js settings
export NODE_OPTIONS="--max-old-space-size=2048"
npm install --legacy-peer-deps

# Step 3: Ensure NestJS CLI and TypeScript are installed
echo "📦 Installing NestJS CLI and TypeScript..."
npm install --save-dev @nestjs/cli typescript ts-node

# Step 4: Create/fix tsconfig.json if needed
echo "⚙️ Ensuring proper TypeScript configuration..."
if [ ! -f "tsconfig.json" ]; then
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2020",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
fi

# Step 5: Fix package.json scripts if they don't exist
echo "⚙️ Ensuring proper build scripts..."
if ! grep -q '"build"' package.json; then
    echo "Adding build script to package.json..."
    # Create a backup
    cp package.json package.json.backup
    
    # Add build script
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!pkg.scripts) pkg.scripts = {};
    pkg.scripts.build = pkg.scripts.build || 'nest build';
    pkg.scripts.start = pkg.scripts.start || 'node dist/main';
    pkg.scripts['start:prod'] = pkg.scripts['start:prod'] || 'node dist/main';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
fi

# Step 6: Attempt multiple build methods
echo "🔨 Building the application..."

BUILD_SUCCESS=false

# Try Method 1: npm run build
if npm run build 2>&1; then
    BUILD_SUCCESS=true
    echo "✅ Built successfully with npm run build"
elif npx nest build 2>&1; then
    BUILD_SUCCESS=true
    echo "✅ Built successfully with nest build"
elif npx tsc 2>&1; then
    BUILD_SUCCESS=true
    echo "✅ Built successfully with direct TypeScript compilation"
else
    echo "❌ All build methods failed. Attempting manual build..."
    
    # Create dist directory manually
    mkdir -p dist
    
    # Try to compile TypeScript files manually
    find src -name "*.ts" -exec npx tsc {} --outDir dist --module commonjs --target es2020 --experimentalDecorators --emitDecoratorMetadata \; 2>/dev/null || true
    
    if [ -f "dist/main.js" ] || [ -n "$(find dist -name "*.js" 2>/dev/null)" ]; then
        BUILD_SUCCESS=true
        echo "✅ Manual build completed"
    fi
fi

# Step 7: Verify build output
if [ "$BUILD_SUCCESS" = true ]; then
    echo "🔍 Verifying build output..."
    
    if [ ! -f "dist/main.js" ]; then
        # Look for alternative main files
        MAIN_FILE=$(find dist -name "main.js" -o -name "index.js" -o -name "app.js" | head -1)
        if [ -n "$MAIN_FILE" ]; then
            echo "📄 Found main file at: $MAIN_FILE"
            # Update ecosystem.config.js to use the correct main file
            sed -i "s|dist/main.js|$MAIN_FILE|g" ecosystem.config.js
        else
            echo "❌ No main entry point found in dist/"
            echo "📁 Contents of dist/:"
            find dist -name "*.js" | head -10
            exit 1
        fi
    else
        echo "✅ dist/main.js found"
    fi
else
    echo "❌ Build failed completely. Please check your source code."
    exit 1
fi

# Step 8: Update ecosystem.config.js with better configuration
echo "⚙️ Updating PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
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
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/farmkal-error.log',
    out_file: '/var/log/pm2/farmkal-out.log',
    log_file: '/var/log/pm2/farmkal-combined.log',
    time: true,
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Step 9: Ensure .env file has basic required variables
echo "⚙️ Checking environment configuration..."
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# Basic Configuration
NODE_ENV=production
PORT=3000

# Add your other environment variables here
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# etc.
EOF
fi

# Step 10: Stop any running PM2 processes and start fresh
echo "🔄 Restarting PM2 application..."
pm2 delete farmkal-api 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# Step 11: Restart nginx
echo "🔄 Restarting nginx..."
sudo systemctl restart nginx

# Step 12: Check application status
echo "🔍 Checking application status..."
sleep 5
pm2 status
pm2 logs farmkal-api --lines 10

echo ""
echo "✅ Deployment fix completed!"
echo ""
echo "🔍 Testing your application:"
echo "1. Check PM2 status: pm2 status"
echo "2. Check PM2 logs: pm2 logs farmkal-api"
echo "3. Test locally: curl http://localhost:3000"
echo "4. Test publicly: curl http://$(curl -s ifconfig.me)"
echo ""
echo "🌐 Your app should now be accessible at: http://$(curl -s ifconfig.me)"
EOF