function doGet(e) {
  var props = PropertiesService.getScriptProperties();
  
  // INITIAL SETUP: Remove this after one-time use or protect with hardcoded check
  if (e.parameter.init_secrets === 'true') {
    props.setProperties({
      'ADMIN_PASSWORD': 'heather2026',
      'API_KEY': 'secret-test-key-2026'
    });
    return ContentService.createTextOutput("Secrets Initialized Successfully. REMOVE the init_secrets check now.")
      .setMimeType(ContentService.MimeType.TEXT);
  }

  var apiKey = props.getProperty('API_KEY');
  if (e.parameter.key !== apiKey) {
    return ContentService.createTextOutput("Unauthorized: Valid API Key required.")
      .setMimeType(ContentService.MimeType.TEXT);
  }

  if (e.parameter.setup || e.parameter.force) {
    try {
      setupHeaders(true);
      return ContentService.createTextOutput("Success: Headers initialized.")
        .setMimeType(ContentService.MimeType.TEXT);
    } catch (err) {
      return ContentService.createTextOutput("Error: " + err.message)
        .setMimeType(ContentService.MimeType.TEXT);
    }
  }

  if (e.parameter.clear === 'true') {
    return clearSheet();
  }
  
  if (e.parameter.verify) {
    return verifyEntry(e.parameter.verify);
  }

  return ContentService.createTextOutput("Second Mountain Ready Internal API is live.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var props = PropertiesService.getScriptProperties();

  if (data.action === 'login') {
    var adminPass = props.getProperty('ADMIN_PASSWORD');
    if (data.password === adminPass) {
      return ContentService.createTextOutput(JSON.stringify({"result": "authorized"}))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({"result": "unauthorized"}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  try {
    setupHeaders(false);
    var ss = SpreadsheetApp.openById('1ek3WXu2JMMX2iKnOZQYC4Bmieq_BEsbdhQXL1twshJo');
    var sheet = ss.getSheets()[0];
    var formattedPhone = formatPhone(data.phone);
    
    sheet.appendRow([
      new Date(), 
      data.firstName, 
      data.lastName, 
      formattedPhone, 
      data.email, 
      data.glp1Duration || data.months,
      data.fitnessGoals || data.goals,
      data.submissionTime
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function verifyEntry(emailToFind) {
  try {
    var ss = SpreadsheetApp.openById('1ek3WXu2JMMX2iKnOZQYC4Bmieq_BEsbdhQXL1twshJo');
    var sheet = ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i][4] === emailToFind) { 
        return ContentService.createTextOutput(JSON.stringify({
          "result": "found",
          "data": { firstName: data[i][1], lastName: data[i][2], email: data[i][4] }
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({"result": "not_found"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "message": err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function clearSheet() {
  try {
    var ss = SpreadsheetApp.openById('1ek3WXu2JMMX2iKnOZQYC4Bmieq_BEsbdhQXL1twshJo');
    var sheet = ss.getSheets()[0];
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
      return ContentService.createTextOutput("Success: Spreadsheet cleared.")
        .setMimeType(ContentService.MimeType.TEXT);
    }
    return ContentService.createTextOutput("Spreadsheet is already empty.");
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.message);
  }
}

function formatPhone(value) {
  if (!value) return "";
  var digits = value.toString().replace(/\D/g, '');
  if (digits.length < 10) return value;
  return digits.slice(0, 3) + '\u2011' + digits.slice(3, 6) + '\u2011' + digits.slice(6, 10);
}

function setupHeaders(force) {
  var ss = SpreadsheetApp.openById('1ek3WXu2JMMX2iKnOZQYC4Bmieq_BEsbdhQXL1twshJo');
  var sheet = ss.getSheets()[0];
  var headers = ["Google Timestamp", "First Name", "Last Name", "Phone", "Email", "GLP-1 Months", "Fitness Goals", "SQL92 Timestamp"];
  var firstCellValue = sheet.getRange(1, 1).getValue();
  if (firstCellValue !== headers[0] || force) {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
}
