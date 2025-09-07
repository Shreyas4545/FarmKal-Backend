#!/bin/bash

# Debug and Fix NestJS Deployment on EC2
# Run this script to diagnose and fix deployment issues

set -e

echo "🔍 Diagnosing NestJS Deployment Issues..."

cd /var/www/farmkal

# Step 1: Check if package.json exists and has build script
echo "📋 Checking package.json..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found! Please ensure your NestJS code is properly uploaded."
    exit 1
fi

echo "📋 Build script in package.json:"
grep -A 5 -B 5 '"build"' package.json || echo "⚠️ No build script found in package.json"

# Step 2: Check Node.js and npm versions
echo "🔍 Checking Node.js environment..."
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# Step 3: Clear any existing installations and reinstall
echo "🧹 Cleaning previous installations..."
rm -rf node_modules package-lock.json dist/

# Step 4: Install dependencies with verbose logging
echo "📦 Installing dependencies with verbose logging..."
npm install --verbose --legacy-peer-deps

# Step 5: Check if TypeScript is installed
echo "🔍 Checking TypeScript installation..."
if ! npm list typescript; then
    echo "📦 Installing TypeScript..."
    npm install --save-dev typescript
fi

# Step 6: Check if @nestjs/cli is available
echo "🔍 Checking NestJS CLI..."
if ! npm list @nestjs/cli; then
    echo "📦 Installing NestJS CLI..."
    npm install --save-dev @nestjs/cli
fi

# Step 7: Check tsconfig.json
echo "📋 Checking TypeScript configuration..."
if [ ! -f "tsconfig.json" ]; then
    echo "⚠️ tsconfig.json not found. Creating basic tsconfig.json..."
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
  }
}
EOF
fi

# Step 8: Try building with different methods
echo "🔨 Attempting to build the application..."

# Method 1: Direct npm run build
echo "Method 1: npm run build"
if npm run build; then
    echo "✅ Build successful with npm run build"
else
    echo "❌ npm run build failed"
    
    # Method 2: Using npx nest build
    echo "Method 2: npx nest build"
    if npx nest build; then
        echo "✅ Build successful with npx nest build"
    else
        echo "❌ npx nest build failed"
        
        # Method 3: Direct TypeScript compilation
        echo "Method 3: Direct TypeScript compilation"
        if npx tsc; then
            echo "✅ Build successful with direct tsc"
        else
            echo "❌ Direct TypeScript compilation failed"
            echo "🔍 Showing TypeScript errors..."
            npx tsc --noEmit || true
        fi
    fi
fi

# Step 9: Verify dist directory and main.js
echo "🔍 Checking build output..."
if [ -d "dist" ]; then
    echo "✅ dist/ directory created"
    echo "📁 Contents of dist/:"
    ls -la dist/
    
    if [ -f "dist/main.js" ]; then
        echo "✅ dist/main.js found"
        echo "📄 First few lines of dist/main.js:"
        head -10 dist/main.js
    else
        echo "❌ dist/main.js not found"
        echo "🔍 Looking for main entry point..."
        find dist/ -name "*.js" | head -10
    fi
else
    echo "❌ dist/ directory not created"
fi

# Step 10: Check for src/main.ts
echo "🔍 Checking source structure..."
if [ -f "src/main.ts" ]; then
    echo "✅ src/main.ts found"
    echo "📄 Content of src/main.ts:"
    head -20 src/main.ts
else
    echo "❌ src/main.ts not found"
    echo "🔍 Looking for entry points in src/:"
    find src/ -name "*.ts" | head -10 || echo "No TypeScript files found in src/"
fi

echo "🔍 Diagnosis completed!"