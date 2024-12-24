const { google } = require("googleapis");
const express = require("express");
require('dotenv').config();
var app = express();

const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n'); // Handle new lines in private key
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function authSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      private_key: PRIVATE_KEY,
      client_email: CLIENT_EMAIL,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });

  return {
    auth,
    authClient,
    sheets,
  };
}

app.get("/getSponsorID", async (req, res) => {
  const userIdHHF = req.query.id;
  const { sheets } = await authSheets();
  const getRows = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Affiliates",
  });

  if (!getRows.data) return res.status(404).send({ error: "No data found in spreadsheet" });

  for (let i = 1; i < getRows.data.values.length; i++) {
    if (getRows.data.values[i][5] == userIdHHF) return res.send(getRows.data.values[i][6]);
  }
  return res.status(404).send({ error: getRows.data });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
