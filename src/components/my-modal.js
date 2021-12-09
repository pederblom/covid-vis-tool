import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import Chart from "./chart";
import Multiselect from "multiselect-react-dropdown";
import {
  firstNotNull,
  policies,
  policyExplanation,
  filterData,
  dataOptions
} from "../utils";
import { interpolateRgbBasis } from "d3-interpolate";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

// const dataOptions = {
//   Vaccinations: "total_vaccinations",
//   Cases: "total_cases",
//   Deaths: "total_deaths",
//   Tests: "total_tests",
//   Boosters: "total_boosters"
// };

const allData = [
  "Cases",
  "Deaths",
  "Vaccinations",
  "Boosters",
  "Tests"
  // Add more as wanted friend
];

const dropData1 = {
  Stringency: filterData.stringency,
  "Face coverings": filterData.masks,
  "School closing": filterData.schools,
  "Workplace closing": filterData.work,
  "Gathering restrictions": filterData.gather,
  "Internal movement restrictions": filterData.internal,
  "International movement restrictions": filterData.international,
  "Close public transport": filterData.trans,
  "Stay at home requirements": filterData.home,
  "Testing policy": filterData.testing,
  "Contact tracing": filterData.contact
};

const dropData2 = {
  "Total cases": { arr: dataOptions.Cases.Total, dataSet: "covidData" },
  "New cases": { arr: dataOptions.Cases.New, dataSet: "covidData" },
  "Total vaccinations": {
    arr: dataOptions.Vaccinations.Total,
    dataSet: "covidData"
  },
  "New Vaccinations": {
    arr: dataOptions.Vaccinations.New,
    dataSet: "covidData"
  },
  "Total deaths": { arr: dataOptions.Deaths.Total, dataSet: "covidData" },
  "New deaths": { arr: dataOptions.Deaths.New, dataSet: "covidData" },
  "Total tests": { arr: dataOptions.Tests.Total, dataSet: "covidData" },
  "New tests": { arr: dataOptions.Tests.New, dataSet: "covidData" },
  "Total boosters": { arr: dataOptions.Boosters.Total, dataSet: "covidData" },
  "New boosters": { arr: dataOptions.Boosters.New, dataSet: "covidData" }
};

const colorScaler = interpolateRgbBasis(["green", "yellow", "red"]);

const MyModal = props => {
  const [toolText, setTool] = useState("");
  // const [chosenData, setChosenData] = useState(allData);
  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [selData1, setSelData1] = useState("Stringency");
  const [selData2, setSelData2] = useState("Total cases");

  useEffect(() => {
    if (props.covidData) {
      convertChartData(1);
      convertChartData(2);
    }
  }, [props.covidData]);

  useEffect(() => {
    if (props.covidData) convertChartData(1);
  }, [selData1]);

  useEffect(() => {
    if (props.covidData) convertChartData(2);
  }, [selData2]);

  const round = (num, dec) => {
    const facTen = Math.pow(10, dec);
    return Math.round(num * facTen) / facTen;
  };

  const rounded = num => {
    if (num > 1000000000) {
      return Math.round(num / 100000000) / 10 + " Bn";
    } else if (num > 1000000) {
      return Math.round(num / 100000) / 10 + " M";
    } else {
      return Math.round(num / 100) / 10 + " K";
    }
  };

  const convertChartData = chartNum => {
    var dates = props.covidData.date;
    var chartData = [];
    var chosenData = selData1;
    if (chartNum == 2) chosenData = selData2;
    for (var i = 0; i < dates.length; i++) {
      var d = {};
      var date = new Date(dates[i]);
      if (dates[i]) d["date"] = date.toUTCString().substr(0, 16);

      var sel = dropData1[selData1];
      if (chartNum == 2) sel = dropData2[selData2];
      var selData = props[sel.dataSet][sel.arr];

      var val = parseFloat(selData[i]);
      if (val) d[chosenData] = val;

      chartData.push(d);
    }
    console.log(chartData);
    if (chartNum == 1) setChartData1(chartData);
    else setChartData2(chartData);
  };

  // const selectAddRemove = values => {
  //   setChosenData(values);
  // };

  var covidData = props.covidData;
  var policyData = props.policyData;

  var country = covidData.location[0];
  var cases = firstNotNull(covidData.total_cases);
  var deaths = firstNotNull(covidData.total_deaths);
  var vaccPpl = firstNotNull(covidData.people_fully_vaccinated);
  var testPerCase = firstNotNull(covidData.tests_per_case);
  var weekHosp = firstNotNull(covidData.weekly_hosp_admissions);

  var population = firstNotNull(covidData.population);
  var pop_density = firstNotNull(covidData.population_density);
  var lifeExpec = firstNotNull(covidData.life_expectancy);
  var gdp = firstNotNull(covidData.gdp_per_capita);
  var hdi = firstNotNull(covidData.human_development_index);
  var medAge = firstNotNull(covidData.median_age);
  var repRate = firstNotNull(covidData.reproduction_rate);

  var maleSmoke = firstNotNull(covidData.male_smokers);
  var femaleSmoke = firstNotNull(covidData.female_smokers);
  var beetus = firstNotNull(covidData.diabetes_prevalence);
  var excMort = firstNotNull(covidData.excess_mortality_cumulative_per_million);
  var cardioDeath = firstNotNull(covidData.cardiovasc_death_rate);

  var stringency = parseInt(firstNotNull(covidData.stringency_index));
  if (policyData) {
    var schoolClose = parseInt(firstNotNull(policyData["C1_School closing"]));
    var workClose = parseInt(firstNotNull(policyData["C2_Workplace closing"]));
    var gatheringRes = parseInt(
      firstNotNull(policyData["C4_Restrictions on gatherings"])
    );
    var faceCover = parseInt(firstNotNull(policyData["H6_Facial Coverings"]));
    var pubTrans = parseInt(
      firstNotNull(policyData["C5_Close public transport"])
    );
    var stayHome = parseInt(
      firstNotNull(policyData["C6_Stay at home requirements"])
    );
    var travelInternal = parseInt(
      firstNotNull(policyData["C7_Restrictions on internal movement"])
    );
    var travelInternational = parseInt(
      firstNotNull(policyData["C8_International travel controls"])
    );
    var testingPolicy = parseInt(firstNotNull(policyData["H2_Testing policy"]));
    var contactTracing = parseInt(
      firstNotNull(policyData["H3_Contact tracing"])
    );
  } else {
    var schoolClose = "No data";
    var workClose = "No data";
    var gatheringRes = "No data";
    var faceCover = "No data";
    var pubTrans = "No data";
    var stayHome = "No data";
  }

  return (
    <div className="modalContainer">
      <div className="statContainer">
        <table className="statistics">
          <tr>
            <th colSpan="6" style={{ fontSize: 22, textAlign: "center" }}>
              <i class="far fa-flag"></i> {country}
            </th>
          </tr>
          <tr>
            <th colspan="2" style={{ width: "35%" }}>
              <i class="fas fa-virus"></i> COVID Statistics
            </th>
            <th colspan="2">
              <i class="fas fa-user-friends"></i> General Statistics
            </th>
            <th colspan="2">
              <i class="fas fa-file-medical"></i> Health Statistics
            </th>
          </tr>
          <tr>
            <td>Total number of cases: </td>
            <td>{parseInt(cases)}</td>
            <td>Population:</td>
            <td>{rounded(parseInt(population))}</td>
            <td>Life expectancy: </td>
            <td>{round(lifeExpec, 1)}</td>
          </tr>
          <tr>
            <td>Total number of deaths: </td>
            <td>{parseInt(deaths)}</td>
            <td>Population density: </td>
            <td>{round(pop_density, 1)}</td>
            <td>Male smokers: </td>
            <td>{parseInt(maleSmoke) ? parseInt(maleSmoke) : maleSmoke}</td>
          </tr>
          <tr>
            <td>Fully vaccinated people: </td>
            <td>{parseInt(vaccPpl)}</td>
            <td>Median age: </td>
            <td>{round(medAge, 1)}</td>
            <td>Female smokers: </td>
            <td>
              {parseInt(femaleSmoke) ? parseInt(femaleSmoke) : femaleSmoke}
            </td>
          </tr>
          <tr>
            <td>Population percentage fully vaccinated: </td>
            <td>
              {round((parseFloat(vaccPpl) / parseFloat(population)) * 100, 1)}%
            </td>
            <td>Reproduction rate:</td>
            <td>{round(repRate, 2)}</td>
            <td>Diabetes prevalence: </td>
            <td>{parseInt(beetus)}</td>
          </tr>
          <tr>
            <td>Weekly hospital admissions: </td>
            <td>{weekHosp}</td>
            <td>GDP per capita: </td>
            <td>{round(gdp, 0)}$</td>
            <td>Excess mortality (per million):</td>
            <td>{round(excMort, 1) ? round(excMort, 1) : excMort}</td>
          </tr>
          <tr>
            <td>Tests per case: </td>
            <td>{testPerCase} </td>
            <td>Human development index (0-1): </td>
            <td>{round(hdi, 3)}</td>
            <td>Cardiovascular death rate: </td>
            <td>
              {round(cardioDeath, 1) ? round(cardioDeath, 1) : cardioDeath}
            </td>
          </tr>
        </table>
      </div>
      <div className="policyChart">
        <table className="policyTable" style={{ width: "100%" }}>
          <tr>
            <th colSpan="2">
              <i class="fas fa-gavel"></i> COVID Policy
            </th>
            <th colSpan="2">
              <i class="fas fa-chart-line"></i> COVID Data Visualization
            </th>
          </tr>
          <tr>
            <td>Stringency index:</td>
            <td className="icon">
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() => setTool(policies.stringency)}
                style={{
                  color: colorScaler(stringency / 100)
                }}
              >
                {stringency}
              </a>
            </td>
            <th>Policy</th>
            <td>
              <Dropdown
                style={{ height: 35 }}
                options={Object.keys(dropData1)}
                value={selData1}
                onChange={val => setSelData1(val.value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(policyExplanation(policies.faceCovering))
                }
              >
                Face covering:
              </a>
            </td>
            <td className="icon">
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(`${faceCover} - ${policies.faceCovering[faceCover]}`)
                }
                style={{
                  color: colorScaler(
                    faceCover / (Object.keys(policies.faceCovering).length - 2)
                  )
                }}
              >
                <i className="fas fa-head-side-mask"></i>
              </a>
            </td>
            <td rowSpan="5" colSpan="2">
              {/* <Multiselect
                isObject={false}
                onRemove={() => selectAddRemove(2)}
                onSearch={value => console.log(value)}
                onSelect={() => selectAddRemove(2)}
                options={allData}
                selectedValues={chosenData}
              /> */}

              <Chart
                data={chartData1}
                countries={[selData1]}
                dimensions={{ width: 1500, height: 175 }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(policyExplanation(policies.schoolClose))
                }
              >
                Schools closing:
              </a>
            </td>
            <td className="icon">
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(
                    `${schoolClose} - ${policies.schoolClose[schoolClose]}`
                  )
                }
                style={{
                  color: colorScaler(
                    schoolClose / (Object.keys(policies.schoolClose).length - 2)
                  )
                }}
              >
                <i class="fas fa-school"></i>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(policyExplanation(policies.workClose))
                }
              >
                Workplace closing:
              </a>
            </td>
            <td className="icon">
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(`${workClose} - ${policies.workClose[workClose]}`)
                }
                style={{
                  color: colorScaler(
                    workClose / (Object.keys(policies.workClose).length - 2)
                  )
                }}
              >
                <i class="fas fa-briefcase"></i>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(policyExplanation(policies.restrictGather))
                }
              >
                Restrictions on gatherings:
              </a>
            </td>
            <td className="icon">
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(
                    `${gatheringRes} - ${policies.restrictGather[gatheringRes]}`
                  )
                }
                style={{
                  color: colorScaler(
                    gatheringRes /
                      (Object.keys(policies.restrictGather).length - 2)
                  )
                }}
              >
                <i class="fas fa-users"></i>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(policyExplanation(policies.pubTransClose))
                }
              >
                Public transport closing:
              </a>
            </td>
            <td className="icon">
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(`${pubTrans} - ${policies.pubTransClose[pubTrans]}`)
                }
                style={{
                  color: colorScaler(
                    pubTrans / (Object.keys(policies.pubTransClose).length - 2)
                  )
                }}
              >
                <i class="fas fa-bus"></i>
                {/* {pubTrans} */}
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(policyExplanation(policies.stayHome))
                }
              >
                Stay at home requirements:
              </a>
            </td>
            <td className="icon">
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(`${stayHome} - ${policies.stayHome[stayHome]}`)
                }
                style={{
                  color: colorScaler(
                    stayHome / (Object.keys(policies.stayHome).length - 2)
                  )
                }}
              >
                <i class="fas fa-house-user"></i>
              </a>
            </td>
            <td>
              <th>COVID</th>
            </td>
            <td>
              <Dropdown
                options={Object.keys(dropData2)}
                value={selData2}
                onChange={val => setSelData2(val.value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(policyExplanation(policies.travelInternal))
                }
              >
                Internal travel restrictions:
              </a>
            </td>
            <td className="icon">
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(
                    `${travelInternal} - ${policies.travelInternal[travelInternal]}`
                  )
                }
                style={{
                  color: colorScaler(
                    travelInternal /
                      (Object.keys(policies.travelInternal).length - 2)
                  )
                }}
              >
                <i class="fas fa-route"></i>
              </a>
            </td>
            <td rowSpan="5" colSpan="2">
              <Chart
                data={chartData2}
                countries={[selData2]}
                dimensions={{ width: 1500, height: 175 }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(policyExplanation(policies.travelInternational))
                }
              >
                International travel restrictions:
              </a>
            </td>
            <td className="icon">
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(
                    `${travelInternational} - ${policies.travelInternational[travelInternational]}`
                  )
                }
                style={{
                  color: colorScaler(
                    travelInternational /
                      (Object.keys(policies.travelInternational).length - 2)
                  )
                }}
              >
                <i class="fas fa-plane"></i>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(policyExplanation(policies.testingPolicy))
                }
              >
                Testing policy:
              </a>
            </td>
            <td className="icon">
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(
                    `${testingPolicy} - ${policies.testingPolicy[testingPolicy]}`
                  )
                }
                style={{
                  color: colorScaler(
                    testingPolicy /
                      (Object.keys(policies.testingPolicy).length - 2)
                  )
                }}
              >
                <i class="fas fa-vial"></i>
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(policyExplanation(policies.contactTracing))
                }
              >
                Contact tracing:
              </a>
            </td>
            <td className="icon">
              <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(
                    `${contactTracing} - ${policies.contactTracing[contactTracing]}`
                  )
                }
                style={{
                  color: colorScaler(
                    contactTracing /
                      (Object.keys(policies.contactTracing).length - 2)
                  )
                }}
              >
                <i class="fas fa-user-secret"></i>
              </a>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                Chill
                <div
                  style={{
                    width: "12%",
                    height: 10,
                    backgroundColor: colorScaler(0)
                  }}
                />
                <div
                  style={{
                    width: "12%",
                    height: 10,
                    backgroundColor: colorScaler(0.25)
                  }}
                />
                <div
                  style={{
                    width: "12%",
                    height: 10,
                    backgroundColor: colorScaler(0.5)
                  }}
                />
                <div
                  style={{
                    width: "12%",
                    height: 10,
                    backgroundColor: colorScaler(0.75)
                  }}
                />
                <div
                  style={{
                    width: "12%",
                    height: 10,
                    backgroundColor: colorScaler(1)
                  }}
                />
                Strict
              </div>
            </td>
          </tr>
        </table>
        <ReactTooltip html={true} place="right" id="tool">
          {toolText}
        </ReactTooltip>
      </div>
    </div>
  );
};

export default MyModal;
