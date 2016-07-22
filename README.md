# project-funding
Quick site thrown together to make our project crowdsourcing efforts more visible.

## Developing
To make changes to the site, you will need to:

1. Clone this repository
2. Install node and npm
3. Run `npm install`
4. Build the client-side code by running `grunt`. To develop in "watch" mode, in which changes are recompiled as you make them, run `grunt watch`.
5. Fetch the spreadsheet data. This requires several steps:
 1. Create a "google-generated-creds.json" file. As the name implies, this file is created by the Google API wizard. See [here](https://www.npmjs.com/package/google-spreadsheet#spreadsheetworksheetgetcellsoptions-callback) for better instructions.
 2. Run `npm run-script fetch`. This will pull data from the spreadsheet and create a "projectData.json" file.
6. Run a webserver. Easiest way to do is is with `python -m SimpleHTTPServer 8000` from the root of the repository.
