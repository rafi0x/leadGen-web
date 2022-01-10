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
  "private_key_id": "c7485e22f04630c92b7b0a0e3adc5d5134bdf105",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCUs1kS1KER09vt\nctkS4QWWGZlTgXTU0NyV56M1lKtLfkYQ/XDRe8bPI2EezNzz76EWpMNX7j4Z0T/m\nNZMVGjEDgCjFdAid8WnjC9U5aHQCUOYBIP9EA6SmQG4Y+kHec6XJXLMi0/euz3HV\nHrmL1cAUyMtq5oluLg8kuq/vVkujHhMyfFeynRhxBnhWFt2sHUqYX9I0BTpwc0Ny\nLfFxsmgt+dUSUOmXUyvgVt00hOsOeH01z1scQRhDb3w+s+gxmRC8I0McO8tBEyXG\nv3DCJUazWsXBDp8QhrakKZni7CatjMWss6si5pBfs/P+JP3eJagLECv8uDU/znpv\nuin57v8DAgMBAAECggEAD0SO68ELPLJdDXdSVH7oPO4p8QoEvekoDPg4qMK4B8tS\nVGJBWDD2S8RdL3VnZmB/ULzgFcIvfCUhA3kSvgLvb2WUShnM3LKx5Y8MeJWB+87k\nns8NhqU9HZjV9RiU9Ms5BYDQH85Vywwfqvs5n+L1kuy+/h3nlHmEMog8kj1xDLFc\ntEWM3ZvSSoJUZOFS24JQZI31o0WUMedWCLCLMaZb0pnnULJaRq5BCDcfxODz3pft\nXRFlu8vxHcMhDdimoFsJj+xoMaD0m73UZxEJlNO8ldRHd4rqVuLBRy9/ANDEPaGJ\nTATmdntAeodaXTmHd/2j4KTbyUUt7xcTJrOahN+REQKBgQDOVUbB+qqnV17tmxiG\n0OshZe7HWAXHhThPVScO4lQ7InNGWSlMd2TrtPmyTjG5o2N8FthSgmH2DEBPmFWi\nGbx6ON8PcFqcJ3y9qjmhEV/m7FTKFi4F6r3BgreT4Du4yn5LnYYVdE+G/XkmUG1y\n0FsdRnoUBqBxLRfV2kyuY2E3ywKBgQC4fp8dTWWbDOyO1Mxb7Cg8L6ajtmbfoY5s\n07GOXFRXsbamD0L3+SSz9VXJns/zKDU6whujxrz5I5UGpQKH8pdP+uq3m42NukUZ\nvn+fm5F3Tilt2F0fJarR+uCI8nP5iEqW6ezaYB2QEZ7JszML7ZoAqAZsCMYdd4fN\nG//oJfo+qQKBgQDNKXQC+4lmfXTRk+8uVlwGSIHFy1tryaZ1E7mTji6s4hN3Nr7e\n3rUFvlyuFBxTdwg74cdVO3nGmuXzfwhe93I2oYgCpPgj3wuk17cX1dvjFMk2bBl1\nHrVxzdVV/5fCpe4wp8AkYxOUqUMmesBpco22rVZDxVcRUgIqTTcEC6MmQwKBgBlY\nM62H01xwcxLQAt7h20khVqgIx6sS+4jRsAOZhXCili/LyuxbyoH6QvW2nmSN8noG\n7lsaUx16mN9Xzbg1SDoRgysD8Hc2zoVR2SBo85vLHf/cCDbeKtA7wZqui+YMpgqD\nSilZqNYAxap5tpp94nkSnAc9UVH8+Kfhn88ZYH45AoGADUhm+5ud5pfSAHd7xsc5\nlKVYLhuWzoQsYpqhAKMgHNLv77HJtXQg3qc4QupJVAAC+oDiPxOrRg9sskIoZje6\n/8T2CRpASqaX6mxnWwfrOnw3PC338peYnxaoMgCr/22mi4cWrC1veBstl8jqJx12\nudZbonHTF3swrU+s6cMXyec=\n-----END PRIVATE KEY-----\n",
  "client_email": "ashabgm@ashabgm.iam.gserviceaccount.com",
  "client_id": "106011369738888384896",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ashabgm%40ashabgm.iam.gserviceaccount.com"
}

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const googleSheets = google.sheets({ version: "v4", auth: async () => await auth.getClient() });


app.get('/api/v1/get-contentz', async (req, res) => {

    const spreadsheetId = '1Z9edhuGLBS_wnVmpRSIfoHGcE20Sn1RETsBVxsJgxow'

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

        const spreadsheetId = '14taYrHgXp9u9jVJDP0IE5x_NFp-BnVVmq7p8k55f1js'

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