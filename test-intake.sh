#!/bin/bash

# Configuration
PROJ_DIR="/Users/crasch/av/web/second-mountain-ready"
URL=$(grep -oE 'https://script.google.com/macros/s/[A-Za-z0-9_-]+/exec' "$PROJ_DIR/src/App.tsx" | head -n 1)
LOG_FILE="$PROJ_DIR/intake-verification.log"

if [ -z "$URL" ]; then
    echo "Error: Could not find Google Apps Script URL in App.tsx"
    exit 1
fi

echo "=========================================="
echo "Starting Intake Form Verification (Dynamic Faker): $(date)"
echo "Target Endpoint: $URL"
echo "==========================================" | tee "$LOG_FILE"

# a) Generate realistic test data using Node + Faker + our shared helper
# We use ts-node or just node if the helper was JS, but since it's TS we'll use a trick
# to run the function via node by requiring the compiled version or just re-defining the logic for bash.
# For bash speed, I'll put the dynamic logic in a small JS block here.

FAKE_DATA=$(cd "$PROJ_DIR" && node -e '
const { faker } = require("./node_modules/@faker-js/faker");
const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const email = faker.internet.email({firstName, lastName}).toLowerCase();
const phone = faker.string.numeric("##########");
const months = faker.number.int({min: 0, max: 24});

const openings = ["Since my doctor started me on Mounjaro,", "I want to stay as independent as possible, so", "After my recent knee replacement,", "My goal for my second mountain is that"];
const actions = ["I really need to prioritize", "I am looking for a trainer to help with", "my main focus needs to be"];
const targets = ["functional core strength", "bone density and balance", "lean muscle preservation"];
const contexts = ["to keep up with my grandkids this summer.", "so I can hike Camels Back without pain.", "while I navigate these medical changes."];
const goals = `${faker.helpers.arrayElement(openings)} ${faker.helpers.arrayElement(actions)} ${faker.helpers.arrayElement(targets)} ${faker.helpers.arrayElement(contexts)}`;

console.log(JSON.stringify({firstName, lastName, email, phone, months, goals}));
')

FIRST_NAME=$(echo $FAKE_DATA | jq -r .firstName)
LAST_NAME=$(echo $FAKE_DATA | jq -r .lastName)
EMAIL=$(echo $FAKE_DATA | jq -r .email)
RAW_PHONE=$(echo $FAKE_DATA | jq -r .phone)
PHONE="${RAW_PHONE:0:3}\u2011${RAW_PHONE:3:3}\u2011${RAW_PHONE:6:4}"
MONTHS=$(echo $FAKE_DATA | jq -r .months)
GOALS=$(echo $FAKE_DATA | jq -r .goals)

echo "Generated Test User: $FIRST_NAME $LAST_NAME ($EMAIL)" | tee -a "$LOG_FILE"
echo "Dynamic Goal: $GOALS" | tee -a "$LOG_FILE"

# b) Submit the user
echo "Submitting data to backend..." | tee -a "$LOG_FILE"
SQL_TIME=$(date '+%Y-%m-%d %H:%M:%S')

RESPONSE=$(curl -s -L -X POST \
    -H "Content-Type: application/json" \
    -d "{\"firstName\":\"$FIRST_NAME\",\"lastName\":\"$LAST_NAME\",\"phone\":\"$PHONE\",\"email\":\"$EMAIL\",\"glp1Duration\":\"$MONTHS\",\"fitnessGoals\":\"$GOALS\",\"submissionTime\":\"$SQL_TIME\"}" \
    "$URL")

if echo "$RESPONSE" | grep -q "\"result\":\"success\""; then
    echo "✓ Success: Backend confirmed receipt of Dynamic data." | tee -a "$LOG_FILE"
else
    echo "✗ Failure: Unexpected response from backend." | tee -a "$LOG_FILE"
    exit 1
fi

echo "=========================================="
echo "Intake Verification Finished: $(date)"
echo "==========================================" | tee -a "$LOG_FILE"
