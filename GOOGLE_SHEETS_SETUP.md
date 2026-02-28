# Google Sheets Integration Setup

To connect the "Second Mountain Ready" intake form to a Google Sheet, follow these steps:

### 1. Create a Google Sheet
Create a new Google Sheet and add the following headers in the first row:
*   `Timestamp`
*   `First Name`
*   `Last Name`
*   `Phone`
*   `Email`
*   `GLP-1 Duration`
*   `Fitness Goals`

### 2. Open Apps Script
In your Google Sheet, go to **Extensions** > **Apps Script**.

### 3. Paste the following Code
Delete any existing code and paste this snippet:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(), 
    data.firstName, 
    data.lastName, 
    data.phone, 
    data.email, 
    data.glp1Duration, 
    data.fitnessGoals
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 4. Deploy as Web App
1.  Click **Deploy** > **New Deployment**.
2.  Select **Web App**.
3.  Set **Execute as:** "Me".
4.  Set **Who has access:** "Anyone" (to allow the website to send data).
5.  Click **Deploy** and authorize the script.
6.  **Copy the Web App URL**.

### 5. Update the Website Code
In `src/App.tsx`, find the `handleFormSubmit` function and replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your copied Web App URL.

```javascript
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/.../exec';
```
