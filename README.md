# Running the COVID Data Analysis tool

The computer needs to have node.js installed, if you do not, then it can be installed from: https://nodejs.org/en/download/

Open a terminal inside the folder location, and first run "npm install" in the terminal.

Then, when all packages have been downloaded, run "npm start" and the application will run on "http://localhost:3000/".

## Data sources:

The tool uses two public datasets, which are imported at application start.

The data are imported as csv files and processed into json format. The sources for these data are:

Our World in Data: https://github.com/owid/covid-19-data/blob/master/public/data/owid-covid-data.csv

Oxford: https://github.com/OxCGRT/covid-policy-tracker/blob/master/data/OxCGRT_latest.csv (which are a result of the research project: https://www.bsg.ox.ac.uk/research/research-projects/covid-19-government-response-tracker)
