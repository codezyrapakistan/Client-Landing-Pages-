// ✅ Handle GET requests (for testing / health check)
function doGet(e) {
  const output = ContentService.createTextOutput('OK');
  output.setMimeType(ContentService.MimeType.TEXT);
  // CORS headers are applied via HtmlService
  return addCorsHeaders(output);
}

// ✅ Handle POST requests (from your form)
function doPost(e) {
  let output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    // Log incoming data
    Logger.log('Incoming POST: ' + JSON.stringify(e));

    // ✅ Parse data (handles URL-encoded form data)
    let data = {};
    if (e.postData && e.postData.contents) {
      // Handle URL-encoded data
      const formData = e.postData.contents;
      const params = formData.split('&');
      params.forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          data[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    } else {
      data = e.parameter;
    }

    Logger.log('Parsed data: ' + JSON.stringify(data));

    // ✅ Validate reCAPTCHA (optional - you can enable this if needed)
    const recaptchaResponse = data['g-recaptcha-response'];
    if (recaptchaResponse) {
      Logger.log('reCAPTCHA response received: ' + recaptchaResponse);
      // You can add reCAPTCHA verification here if needed
    }

    // ✅ Open your sheet
    const ss = SpreadsheetApp.openById('1-Ros3APjYoEk_QqhI4BLBy8QlidZ1pmRxuCyBNTkTqo');
    const sheet = ss.getSheetByName('tvsauralis') || ss.insertSheet('tvsauralis');

    // ✅ Add headers if sheet is empty (matching your exact column structure)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Name', 'email id', 'Mobile', 'comments', 'timestamp', 'ProjectName', 'Location', 'zone']);
    }

    // ✅ Extract fields with better handling
    const name = data.name || 'No Name';
    const email = data.email || 'No Email';
    const phone = data.phone || 'No Phone';
    const comments = data.comments || 'No Comments';
    const projectName = data.projectName || 'TVS Emerald Auralis';
    const timestamp = new Date();
    
    // ✅ Static values as requested
    const location = 'Varthur Lake Road, Whitefield';
    const zone = 'Bangalore East';

    // ✅ Log extracted data for debugging
    Logger.log('Extracted data: Name=' + name + ', Email=' + email + ', Phone=' + phone + ', Comments=' + comments + ', ProjectName=' + projectName);

    // ✅ Append data to sheet in correct column order: Name, email id, Mobile, comments, timestamp, ProjectName, Location, zone
    sheet.appendRow([name, email, phone, comments, timestamp, projectName, location, zone]);

    Logger.log('✅ Row added successfully');

    // ✅ Response
    output.setContent(JSON.stringify({ 
      ok: true, 
      message: 'Data saved to Google Sheet successfully!',
      timestamp: timestamp.toISOString()
    }));
  } catch (err) {
    Logger.log('❌ ERROR: ' + err);
    output.setContent(JSON.stringify({ 
      ok: false, 
      error: err.toString(),
      message: 'Failed to save data to Google Sheet'
    }));
  }

  return addCorsHeaders(output);
}

// ✅ Utility to add CORS headers safely
function addCorsHeaders(output) {
  const response = HtmlService.createHtmlOutput(output.getContent());
  response.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  response.addMetaTag('Access-Control-Allow-Origin', '*');
  return response;
}
