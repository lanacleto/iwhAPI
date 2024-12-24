var express = require("express");
const { google } = require("googleapis");
const fs = require("fs");

var app = express();

const SERVICE_ACCOUNT_FILE = "./iwhServiceAcc.json";
const SPREADSHEET_ID = "";

async function authSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: SERVICE_ACCOUNT_FILE,
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
    if(!getRows.data) return res.status(404).send({ error: "No data found in spreadsheet" });
    
    console.log(getRows.data)
    for (let i = 1; i < getRows.data.values.length; i++) {
        if(getRows.data.values[i][5] == userIdHHF) return res.send(getRows.data.values[i][6]);
    }
    return res.status(404).send({ error: getRows.data });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
