#!/bin/bash

# Configuration
SITE_URL="https://archerships.github.io/second-mountain-ready/"
LOG_FILE="/Users/crasch/av/web/second-mountain-ready/test-results.log"

echo "=========================================="
echo "Starting Website Verification: $(date)"
echo "Target: $SITE_URL"
echo "==========================================" | tee "$LOG_FILE"

# 1. Check if the site is reachable (HTTP 200)
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
if [ "$STATUS" -eq 200 ]; then
    echo "✓ Site is reachable (HTTP 200)" | tee -a "$LOG_FILE"
else
    echo "✗ Site is unreachable (HTTP $STATUS)" | tee -a "$LOG_FILE"
    exit 1
fi

# 2. Extract the main JS bundle from the HTML
JS_FILE=$(curl -s "$SITE_URL" | grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' | head -n 1)
if [ -n "$JS_FILE" ]; then
    echo "✓ Found JS Bundle: $JS_FILE" | tee -a "$LOG_FILE"
else
    echo "✗ Could not find JS bundle in HTML" | tee -a "$LOG_FILE"
    exit 1
fi

# 3. Check the JS Bundle for core text components
echo "Checking JS bundle for core components..." | tee -a "$LOG_FILE"
JS_URL="${SITE_URL}${JS_FILE}"
JS_CONTENT=$(curl -s "$JS_URL")

CHECK_COMPONENTS=("Second Mountain" "Heather Cooper" "GLP1" "Trainerize" "Fitness Goals")

for comp in "${CHECK_COMPONENTS[@]}"; do
    if echo "$JS_CONTENT" | grep -qi "$comp"; then
        echo "✓ Component Found: $comp" | tee -a "$LOG_FILE"
    else
        echo "✗ Component Missing: $comp" | tee -a "$LOG_FILE"
    fi
done

# 4. Check for profile image name in JS Bundle
echo "Verifying profile image configuration..." | tee -a "$LOG_FILE"
IMAGE_REF=$(echo "$JS_CONTENT" | grep -o "heather-cooper.jpg" | head -n 1)
if [ -n "$IMAGE_REF" ]; then
    echo "✓ Profile image name found in JS bundle: $IMAGE_REF" | tee -a "$LOG_FILE"
else
    echo "✗ Profile image name missing from JS bundle" | tee -a "$LOG_FILE"
fi

# 5. Check for public assets
echo "Checking for public assets..." | tee -a "$LOG_FILE"
ASSETS=("heather-cooper.jpg" "vite.svg")

for asset in "${ASSETS[@]}"; do
    ASSET_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SITE_URL}${asset}")
    if [ "$ASSET_STATUS" -eq 200 ]; then
        echo "✓ Asset Reachable: $asset" | tee -a "$LOG_FILE"
    else
        echo "✗ Asset Missing: $asset (HTTP $ASSET_STATUS)" | tee -a "$LOG_FILE"
    fi
done

echo "=========================================="
echo "Verification Finished: $(date)"
echo "Detailed log saved to $LOG_FILE"
echo "=========================================="
