#!/bin/bash

# Function to kill processes on exit
cleanup() {
    echo "Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

# Start Backend
echo "Starting Backend..."
cd SynoAnto-back
go mod tidy
go run cmd/main.go &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID"
cd ..

# Start Frontend
echo "Starting Frontend..."
cd synoanto-web
npm run dev &
FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID"
cd ..

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
