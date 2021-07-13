
const googleTrends = require("google-trends-api");
const moment = require("moment")
const { writeGoogleSheet } = require('./googleSheets/writeGoogleSheet.js')
const { readSheet } = require('./googleSheets/readGoogleSheet.js');

//Match for column0 / ids. If the ID already is saved in Sheets it returns true
const matchInArray = (string, expressions) => {
    let len = expressions.length
    let i = 0;
    for (; i < len; i++) {
        if (string.match(expressions[i])) {
        return true;
        }
    }
    return false;
};

//Get real time trends  
const getRttIdsForPush = async (geo, spreadsheetId) => { 

    //Get already saved Ids to not add rows twice 
    const column0 = await readSheet(geo, spreadsheetId)
    
    //New Trends from Google Trends API
    var currentTimestamp = moment().unix();
    const req = { geo: geo };
    let res = await googleTrends.realTimeTrends(req); //Request Google Trends

    console.log(res)

    res = JSON.parse(res);
    const trendingStoriesArr = res.storySummaries.trendingStories;
    
    let timestamp = currentTimestamp
    let trendingStoriesForSheets = []

    for (let i = 0; i < trendingStoriesArr.length; i++) {
        let matchAlreadySaved = matchInArray(trendingStoriesArr[i].id, column0)

        //Feel free to add more from the API to your Google Sheet
        if(matchAlreadySaved == false) {
            let trendingStoriesRowForSheets = []
            trendingStoriesRowForSheets.push(trendingStoriesArr[i].id)
            trendingStoriesRowForSheets.push(timestamp)
            trendingStoriesRowForSheets.push(trendingStoriesArr[i].entityNames.sort().join(" | "))
            trendingStoriesRowForSheets.push(trendingStoriesArr[i].articles[0].articleTitle)
            trendingStoriesRowForSheets.push(trendingStoriesArr[i].articles[0].url)
            trendingStoriesRowForSheets.push(trendingStoriesArr[i].articles[0].source)
            trendingStoriesRowForSheets.push(trendingStoriesArr[i].image.imgUrl.replace("//", "https://"))
            trendingStoriesForSheets.push(trendingStoriesRowForSheets)
        }
    }

    return trendingStoriesForSheets
}

exports.startit = async (req, res) => {
    //Edit here to add other countries. Add the Sheet to your spreadsheet 
    // try {
    //     const trendingStoriesForSheetsCH =  await getRttIdsForPush("CH",process.env.SHEET_ID_CH); 
    //     await writeGoogleSheet(trendingStoriesForSheetsCH,"CH",process.env.SHEET_ID_CH)
    // } catch (error) {
    //     console.log(error) 
    // }

    // try {
    //     const trendingStoriesForSheetsDE =  await getRttIdsForPush("DE",process.env.SHEET_ID_DE); 
    //     await writeGoogleSheet(trendingStoriesForSheetsDE,"DE",process.env.SHEET_ID_DE)    
    // } catch (error) {
    //     console.log(error)
    // }

    // try {
    //     const trendingStoriesForSheetsFR =  await getRttIdsForPush("FR",process.env.SHEET_ID_FR); 
    //     await writeGoogleSheet(trendingStoriesForSheetsFR,"FR",process.env.SHEET_ID_FR)
    // } catch (error) {
    //     console.log(error)       
    // }

    // try {
    //     const trendingStoriesForSheetsPL =  await getRttIdsForPush("PL",process.env.SHEET_ID_PL); 
    //     await writeGoogleSheet(trendingStoriesForSheetsPL,"PL",process.env.SHEET_ID_PL)
    // } catch (error) {
    //     console.log(error)       
    // }

    // try {
    //     const trendingStoriesForSheetsGB =  await getRttIdsForPush("GB",process.env.SHEET_ID_GB); 
    //     await writeGoogleSheet(trendingStoriesForSheetsGB,"GB",process.env.SHEET_ID_GB)
    // } catch (error) {
    //     console.log(error)        
    // }

    try {
        const trendingStoriesForSheetsUS =  await getRttIdsForPush("US",process.env.SHEET_ID_US); 
        await writeGoogleSheet(trendingStoriesForSheetsUS,"US",process.env.SHEET_ID_US) 
    } catch (error) {
        console.log(error)        
    }

    res.send("done");
}
