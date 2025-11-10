const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const { defineSecret } = require('firebase-functions/params');

admin.initializeApp();
const db = admin.firestore();

// Define secrets
const googleCredentials = defineSecret("GOOGLE_CREDENTIALS");
const sheetId = defineSecret("SHEET_ID");

// this is the main trigger
exports.syncToGoogleSheets = onDocumentWritten(
  {
    document: 'inventory/{docId}',
    secrets: [googleCredentials, sheetId],
  },
  async (event) => {
    console.log("📦 Firestore change detected, syncing to Google Sheets...");
    
    try {
      const snapshot = await db.collection('inventory').get();
      const items = snapshot.docs.map((doc) => doc.data());
      
      // Use the secret credentials
      const credentials = JSON.parse(googleCredentials.value());
      
      const auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
      
      const sheets = google.sheets({ version: 'v4', auth });
      const spreadsheetId = sheetId.value();
      const range = 'Sheet1!A1';
      
      const values = [
        ['Brand', 'Model', 'Size', 'Quantity', 'Sold', 'Purchase Price', 'Profit'],
        ...items.map(i => [
          i.brand || '',
          i.model || '',
          i.size || '',
          i.quantity || 0,
          i.quantitySold || 0,
          i.purchasePrice || 0,
          (i.quantitySold || 0) * ((i.sellingPrice || 0) - (i.purchasePrice || 0))
        ])
      ];
      
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values }
      });
      
      console.log("✅ Sync successful!");
    } catch (error) {
      console.error("❌ Sync failed:", error);
    }
  }
);