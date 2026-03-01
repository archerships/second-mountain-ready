function doGet(e) {
  if (e.parameter.verify) {
    try {
      var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1ek3WXu2JMMX2iKnOZQYC4Bmieq_BEsbdhQXL1twshJo/edit');
      var sheet = ss.getSheetByName('Sheet1') || ss.getSheets()[0];
      var data = sheet.getDataRange().getValues();
      var emailToFind = e.parameter.verify;
      
      // Search from the bottom (newest first)
      for (var i = data.length - 1; i >= 0; i--) {
        if (data[i][4] === emailToFind) { // Column E is email (index 4)
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

function doPost(e) {
  try {
    // Using the full URL which is often more reliable for authorization
    var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1ek3WXu2JMMX2iKnOZQYC4Bmieq_BEsbdhQXL1twshJo/edit');
    var sheet = ss.getSheetByName('Sheet1') || ss.getSheets()[0];
    
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
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error", 
      "error": error.message
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
