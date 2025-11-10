const { google } = require("googleapis");
const creds = require("./google-service-account.json"); // your key file

async function testAuth() {
  try {
    // Authenticate with the service account
    const auth = new google.auth.JWT(
      creds.client_email,
      null,
      creds.private_key,
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    // ⚠️ Replace this with your actual Google Sheet ID
    const spreadsheetId = "YOUR_SHEET_ID_HERE";

    // Get basic info about the sheet
    const res = await sheets.spreadsheets.get({ spreadsheetId });

    console.log("✅ Authentication successful!");
    console.log("Spreadsheet title:", res.data.properties.title);
  } catch (error) {
    console.error("❌ Authentication failed:", error.message);
  }
}

testAuth();
