#!/bin/bash

# Configuration
PROJ_DIR="/Users/crasch/av/web/second-mountain-ready"
URL="https://script.google.com/macros/s/AKfycby_4od9HbaC2TyZlnFVvh24XxYmNtM5ZCmY0vh10wR_D_Jb3yO4v2tNtKZKfnq3nJeQ8Q/exec"

# Load API_KEY from .env
if [ -f "$PROJ_DIR/.env" ]; then
    export $(grep -v '^#' "$PROJ_DIR/.env" | xargs)
fi

if [ -z "$API_KEY" ]; then
    echo "❌ Error: API_KEY not found in .env"
    exit 1
fi

LOG_FILE="$PROJ_DIR/second-mountain-log.md"

echo "***************************************************"
echo "⚠️  WARNING: SPREADSHEET PURGE UTILITY ⚠️"
echo "This will DELETE ALL LEAD ENTRIES from your Google Sheet."
echo "Headers will be preserved, but all data will be lost."
echo "***************************************************"
echo ""
read -p "To proceed, please type 'CONFIRM' exactly: " CONFIRMATION

if [ "$CONFIRMATION" == "CONFIRM" ]; then
    echo "Processing purge request..."
    RESPONSE=$(curl -s -L "${URL}?key=${API_KEY}&clear=true")
    
    if [[ "$RESPONSE" == *"Success"* ]]; then
        echo "✅ $RESPONSE"
        echo "## $(date '+%Y-%m-%d %H:%M:%S') - Spreadsheet Purged" >> "$LOG_FILE"
        echo "- Manual purge triggered via clear-spreadsheet.sh. All data rows deleted." >> "$LOG_FILE"
    else
        echo "❌ Error: $RESPONSE"
    fi
else
    echo "Purge cancelled. No changes were made."
fi
