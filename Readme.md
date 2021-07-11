This is useful to push Google Trends to Google Sheets. From there it can be used to push it for example to Slack unsing ifttt for example. 

## Example sheet
https://docs.google.com/spreadsheets/d/1GXd44Uvzu8rROpFIpFemk-ZpIP1o4qZMLgP2OM2s_F4/edit?usp=sharing

## Using Google Cloud functions + Google Cloud Scheduler to run it every 15 minutes 
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
- Add the service accounts email with edit permission to a new created Google Spreadsheet 
- Add the sheet id to .env.yaml and/or the local test file. You don't need to go with an .env.yaml in any case
- Add Sheets e.g. DE, US, CH 

### Test in terminal
Download service account users json and test: 
- export GOOGLE_APPLICATION_CREDENTIALS="/Users/wio/Documents/GoogleTrendsToSheets/yourServiceAccountsJson.json"
- node local_index.js

### Deploy a Cloud Function
Login Google Cloud + Deploy:
- sudo gcloud auth login
- sudo gcloud functions deploy yourFunctionName --yourServiceAccount@gscblick.iam.gserviceaccount.com --env-vars-file .env.yaml --entry-point startit --runtime nodejs12 --trigger-http --allow-unauthenticated

### After deployment
- You will find your functions here https://console.cloud.google.com/functions/list?project=yourproject
- Test it manually 
- After testing add the trigger URL to the cloud scheduler:
https://console.cloud.google.com/cloudscheduler?project=yourproject
Run e.g. every 15 minutes with */15 * * * *

