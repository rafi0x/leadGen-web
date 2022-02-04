require('dotenv').config()
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors')

const app = express();

app.use([
    cors(),
    express.json(),
    express.urlencoded({extended: true}),
])

const re = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/;

const credentials = {
  "type": "service_account",
  "project_id": "ashabgm",
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY,
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.CLIENT_CERT_URL
}

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const googleSheets = google.sheets({ version: "v4", auth: async () => await auth.getClient() });


app.get('/api/v1/get-contentz', async (req, res) => {

    const spreadsheetId = process.env.SHEETID

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1!A:G",
    });

    let arrData = []

    getRows.data.values.map((item) => {
        let fdata = {}
        getRows.data.values[0].forEach((el, index) => {
            fdata[el] = item[index]
        })
        arrData.push(fdata)
    })
    arrData.shift()
    res.send(arrData);
})

app.post('/api/v1/client-data', async (req, res) => {
    try {
        const { name, contact, id } = req.body;

        if(!name) return res.json({nameErr: true})
        else if (!contact.match(re)) return res.json({contactErr: true})

        const spreadsheetId = process.env.SHEETID

        // Write row(s) to spreadsheet
        googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Sheet1!A:B",
            valueInputOption: "USER_ENTERED",
            resource: {
            values: [[name, contact, id]],
            },
        });
        return res.json({noErr: true});
    } catch (error) {
        return res.json({err: error});
    }

})

app.listen(process.env.PORT || '13370', () => console.log('server running 13370'));