#!/bin/bash
set -e

# Ensure .env exists
if [ ! -f .env ]; then
  echo "⚠️  No .env file found."
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "   Created .env from .env.example. Please add your GEMINI_API_KEY and run again."
  else
    echo "   Create .env with: GEMINI_API_KEY=your_gemini_api_key_here"
  fi
  exit 1
fi

# Check GEMINI_API_KEY is set (docker compose reads .env automatically)
if ! grep -qE '^GEMINI_API_KEY=.+' .env; then
  echo "⚠️  GEMINI_API_KEY is not set in .env"
  echo "   Add: GEMINI_API_KEY=your_gemini_api_key_here"
  exit 1
fi

echo "🚀 Building and starting ELI5 Tutor..."
echo "   App will be at http://localhost:3000"
docker compose up --build
