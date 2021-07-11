
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

    //Get already saved Ids
    const column0 = await readSheet(geo, spreadsheetId)
    
    //New Trends from Google Trends API
    var currentTimestamp = moment().unix();
    const req = { geo: geo };
    let res = await googleTrends.realTimeTrends(req); //Request Google Trends
    res = JSON.parse(res);
    const trendingStoriesArr = res.storySummaries.trendingStories;
    
    let timestamp = currentTimestamp
    let trendingStoriesForSheets = []

    for (let i = 0; i < trendingStoriesArr.length; i++) {
        let matchAlreadySaved = matchInArray(trendingStoriesArr[i].id, column0)

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
    let spreadsheetId = process.env.SHEET_ID

    //Local test
    if(spreadsheetId === undefined) {
      spreadsheetId = req
    }

    const trendingStoriesForSheetsDE =  await getRttIdsForPush("DE",spreadsheetId); 
    await writeGoogleSheet(trendingStoriesForSheetsDE,"DE",spreadsheetId)

    const trendingStoriesForSheetsUS =  await getRttIdsForPush("US",spreadsheetId); 
    await writeGoogleSheet(trendingStoriesForSheetsUS,"US",spreadsheetId)

    const trendingStoriesForSheetsCH =  await getRttIdsForPush("CH",spreadsheetId); 
    await writeGoogleSheet(trendingStoriesForSheetsCH,"CH",spreadsheetId)

    res.send("done");
}
