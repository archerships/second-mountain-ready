#!/bin/bash

# Configuration
# Extract URL from App.tsx
URL=$(grep -oE 'https://script.google.com/macros/s/[A-Za-z0-9_-]+/exec' /Users/crasch/av/web/second-mountain-ready/src/App.tsx | head -n 1)
LOG_FILE="/Users/crasch/av/web/second-mountain-ready/intake-verification.log"

if [ -z "$URL" ]; then
    echo "Error: Could not find Google Apps Script URL in App.tsx"
    exit 1
fi

echo "=========================================="
echo "Starting Intake Form Verification: $(date)"
echo "Target Endpoint: $URL"
echo "==========================================" | tee "$LOG_FILE"

# a) Generate a new test user
RAND_ID=$((1000 + RANDOM % 9000))
FIRST_NAME="TestUser$RAND_ID"
LAST_NAME="Verification"
PHONE="555-0000"
EMAIL="test-$RAND_ID@example.com"
GLP1="3 months"
GOALS="Automatic verification test run"

echo "Generated Test User: $FIRST_NAME $LAST_NAME ($EMAIL)" | tee -a "$LOG_FILE"

# b) Submit the user via the endpoint (simulating the web form)
echo "Submitting data to backend..." | tee -a "$LOG_FILE"

# Single-line curl to avoid shell interpretation issues
RESPONSE=$(curl -s -L -X POST -H "Content-Type: application/json" -d "{\"firstName\":\"$FIRST_NAME\",\"lastName\":\"$LAST_NAME\",\"phone\":\"$PHONE\",\"email\":\"$EMAIL\",\"glp1Duration\":\"$GLP1\",\"fitnessGoals\":\"$GOALS\"}" "$URL")

# c) Verify that the user was added (Check the response JSON)
if echo "$RESPONSE" | grep -q "\"result\":\"success\""; then
    echo "✓ Success: Backend confirmed receipt of data." | tee -a "$LOG_FILE"
    echo "Data stored in Google Sheets (verify manually in your Spreadsheet)." | tee -a "$LOG_FILE"
else
    echo "✗ Failure: Unexpected response from backend." | tee -a "$LOG_FILE"
    echo "Raw Response: $RESPONSE" | tee -a "$LOG_FILE"
    exit 1
fi

echo "=========================================="
echo "Intake Verification Finished: $(date)"
echo "==========================================" | tee -a "$LOG_FILE"
