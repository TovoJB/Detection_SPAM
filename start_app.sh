#!/bin/bash

# Function to handle script exit (Ctrl+C)
cleanup() {
    echo "🛑 Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

echo "🚀 Starting Spam/Ham Classifier Project..."

# Start Backend
echo "📦 Starting Backend..."
source venv/bin/activate
uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 2

# Start Frontend
echo "💻 Starting Frontend..."
pnpm run dev

# Wait for both processes
wait
