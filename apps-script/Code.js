function doGet(e) {
  if (e.parameter.setup || e.parameter.force) {
    try {
      setupHeaders(true);
      return ContentService.createTextOutput("Success: Headers have been forced to the top of the sheet.")
        .setMimeType(ContentService.MimeType.TEXT);
    } catch (err) {
      return ContentService.createTextOutput("Error: " + err.message)
        .setMimeType(ContentService.MimeType.TEXT);
    }
  }
  
  if (e.parameter.verify) {
    try {
      var ss = SpreadsheetApp.openById('1ek3WXu2JMMX2iKnOZQYC4Bmieq_BEsbdhQXL1twshJo');
      var sheet = ss.getSheets()[0];
      var data = sheet.getDataRange().getValues();
      var emailToFind = e.parameter.verify;
      
      for (var i = data.length - 1; i >= 0; i--) {
        if (data[i][4] === emailToFind) { 
          return ContentService.createTextOutput(JSON.stringify({
            "result": "found",
            "data": {
              "firstName": data[i][1],
              "lastName": data[i][2],
              "email": data[i][4]
            }
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
  return ContentService.createTextOutput("Second Mountain Ready API is live! Use POST to submit data.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function setupHeaders(force) {
  var ss = SpreadsheetApp.openById('1ek3WXu2JMMX2iKnOZQYC4Bmieq_BEsbdhQXL1twshJo');
  var sheet = ss.getSheets()[0];
  var headers = [
    "Google Timestamp", 
    "First Name", 
    "Last Name", 
    "Phone", 
    "Email", 
    "GLP-1 Months", 
    "Fitness Goals", 
    "SQL92 Timestamp"
  ];
  
  var firstCellValue = sheet.getRange(1, 1).getValue();
  
  // If the first cell isn't our header, or we are forcing it
  if (firstCellValue !== headers[0] || force) {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    // Make headers bold
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
}

function doPost(e) {
  try {
    setupHeaders(false);

    var ss = SpreadsheetApp.openById('1ek3WXu2JMMX2iKnOZQYC4Bmieq_BEsbdhQXL1twshJo');
    var sheet = ss.getSheets()[0];
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(), 
      data.firstName, 
      data.lastName, 
      data.phone, 
      data.email, 
      data.glp1Duration, 
      data.fitnessGoals,
      data.submissionTime
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
