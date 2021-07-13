This is useful to push Google Trends to Google Sheets. From there it can be used to push it for example to Slack using @IFTTT. I'm using the "New row added to spreadsheet" method of IFTTT's Google Sheet solution to forward data. You could not just do Google Trends to Slack but push it to any service which is supported by IFTTT. 

## Example sheet
This shows the what data is stored in the Google Sheets "database". 
https://docs.google.com/spreadsheets/d/1GXd44Uvzu8rROpFIpFemk-ZpIP1o4qZMLgP2OM2s_F4/edit?usp=sharing

The following documentation will just describe how to run such a Google Sheet. If you need help aferwards how to setup e.g. a Google Trends to Slack solution let me know. 

## Using Google Cloud functions + Google Cloud Scheduler to run it every 5 minutes 
### Tools used
- https://cloud.google.com/scheduler
- https://cloud.google.com/functions

## Setup
### In Google Cloud Platform:
You need a project with:
- Google Sheets API
- Google Cloud Functions 
- Google Scheduler API

Create a service account json and download it 

### In Google Sheets 
- Creat a new Google Spreadsheet
- Add the service accounts email with edit permission
- Add the sheet id (from the URL) to .env.yaml and/or the local test file. You don't need to go with an .env.yaml in any case
- Name the first Sheet e.g. "US". 

### Test in terminal
For testing you probably want to comment out some of the languages in exports.startit. Download service account users json and test: 
- export GOOGLE_APPLICATION_CREDENTIALS="/Users/wio/Documents/GoogleTrendsToSheets/yourServiceAccountsJson.json"
- node local_index.js

### Deploy a Cloud Function
Login Google Cloud + Deploy:
- sudo gcloud auth login
- sudo gcloud functions deploy yourFunctionName --yourServiceAccount@gscblick.iam.gserviceaccount.com --env-vars-file .env.yaml --entry-point startit --runtime nodejs12 --trigger-http --allow-unauthenticated
- After deployment you will find your functions here https://console.cloud.google.com/functions/list?project=yourproject
- Test it manually. Just open the URL in a browser. It's without auth. So be careful with sharing the URL. It can create cost running the cloud functions too often. 
- After testing add the trigger URL to the cloud scheduler: https://console.cloud.google.com/cloudscheduler?project=yourproject Run e.g. every 5 minutes with */5 * * * *

