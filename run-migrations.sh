#!/bin/bash

# Set environment variables
export VITE_SUPABASE_URL="https://rmcgmcmqpjhqxrwuzbmy.supabase.co"
export VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY2dtY21xcGpocXhyd3V6Ym15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2OTY1MjgsImV4cCI6MjA4MzI3MjUyOH0.GcHML7-cwhrtCcsqf7IylJWz8A62yURIEhQbMSHcV68"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY2dtY21xcGpocXhyd3V6Ym15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY5NjUyOCwiZXhwIjoyMDgzMjcyNTI4fQ.sRzCL7bT3YvlagzcXFgHH6xF3X-0invtbO_WtdL1lNU"

echo "Starting Supabase migrations..."
echo "==============================="

# Run all migrations
pnpm install
echo ""
echo "Installing dependencies completed."
echo ""

echo "Running warehouse migration..."
npm run migrate:warehouses

echo ""
echo "Running COW migration..."
npm run migrate:cows

echo ""
echo "Running suppliers migration..."
npm run migrate:suppliers

echo ""
echo "==============================="
echo "✓ All migrations completed successfully!"
