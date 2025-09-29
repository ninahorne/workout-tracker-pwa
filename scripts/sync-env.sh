#!/bin/bash

# Script to sync environment variables from .env.production to Vercel
# 
# Usage: ./scripts/sync-env.sh
# 
# Make sure you're logged in to Vercel CLI first:
# npx vercel login

ENV_FILE=".env.production"

echo "🔄 Vercel Environment Variable Sync Tool"
echo ""

# Check if .env.production exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ $ENV_FILE not found"
    exit 1
fi

# Check if Vercel CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Make sure Node.js is installed."
    exit 1
fi

# Check if user is logged in to Vercel
if ! npx vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Run: npx vercel login"
    exit 1
fi

echo "📝 Reading environment variables from $ENV_FILE..."
echo ""

# Read and process each line in .env.production
while IFS= read -r line || [ -n "$line" ]; do
    # Skip empty lines and comments
    if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
        continue
    fi
    
    # Extract key and value
    if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        
        # Remove quotes if present
        value=$(echo "$value" | sed 's/^["'\'']\|["'\'']$//g')
        
        echo "🔄 Syncing $key..."
        
        # Remove existing variable (ignore errors)
        npx vercel env rm "$key" production --yes 2>/dev/null || true
        npx vercel env rm "$key" preview --yes 2>/dev/null || true
        npx vercel env rm "$key" development --yes 2>/dev/null || true
        
        # Add variable to all environments
        echo "$value" | npx vercel env add "$key" production >/dev/null 2>&1
        echo "$value" | npx vercel env add "$key" preview >/dev/null 2>&1
        echo "$value" | npx vercel env add "$key" development >/dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✅ $key synced successfully"
        else
            echo "❌ Failed to sync $key"
        fi
    fi
done < "$ENV_FILE"

echo ""
echo "✨ Environment variables sync completed!"
echo "🚀 Your next deployment will use the updated variables."
