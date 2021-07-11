const { google } = require('googleapis');

const readSheet = async (sheetname,spreadsheetId) => {
    let res = []
    let column0 = []

    try {
        const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets']})
        const sheets = await google.sheets({ version: 'v4', auth });
     
        try {
            const resObj = await sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: sheetname 
            })
            //Array of News Sitemaps
            res = resObj.data.values
            resObj.data.values.forEach(cell => {
                column0.push(cell[0])              
            });
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error) 
    }

    return column0
}

module.exports = {
    readSheet
};