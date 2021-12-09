// File responsible for fetching the data
// import { csv } from "d3-fetch";
const fs = require("fs");
const papa = require("papaparse");

export async function getCovidData() {
  // source: https://covid.ourworldindata.org/data/owid-covid-data
  var csv = await fetch(
    "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv"
  );

  var csvAsText = await csv.text();

  var json = papa.parse(csvAsText);

  var processedData = processCovidData(json.data, false);

  return processedData;
}

export async function getCovidPolicyData() {
  // source https://www.bsg.ox.ac.uk/research/research-projects/covid-19-government-response-tracker
  var csv = await fetch(
    "https://raw.githubusercontent.com/OxCGRT/covid-policy-tracker/master/data/OxCGRT_latest.csv"
  );
  var csvAsText = await csv.text();
  var json = papa.parse(csvAsText);
  var processedData = processCovidData(json.data, true);
  return processedData;
}

export function processCovidData(data, interpol) {
  var attributes = data.shift();
  var processedData = {};
  var countries = [];
  var index = !interpol ? 0 : 1;

  for (var j = 0; j < data.length; j++) {
    var c = data[j][index];
    if (!(c in processedData)) {
      var elem = {};
      for (var k = 0; k < attributes.length; k++) {
        elem[attributes[k]] = [];
      }
      processedData[c] = elem;
      countries.push(data[j][2]);
    }

    for (var i = 0; i < data[j].length; i++) {
      var country = processedData[c];
      var arr = country[attributes[i]];
      arr.push(data[j][i]);
    }
  }

  return { data: processedData, attributes };
  // return { data: processedData, attributes, rawData: data };
}
