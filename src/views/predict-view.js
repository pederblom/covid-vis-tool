import React from "react";
import Predict from "../components/prediction";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { dataOptions } from "../utils";
import Chart from "../components/chart";

const predictionMethods = ["Linear", "Polynomial", "Exponential"];

class PredictView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      country: "NOR",
      predMethod: "Linear",
      prediction: [],
      selData: "Cases",
      selOption: "Total",
      predDays: 90
    };
  }

  predict = () => {
    var numOfDays = document.getElementById("predictDays").value;
    var selectedData = dataOptions[this.state.selData][this.state.selOption];
    var predData = this.props.covidData[this.state.country][selectedData];
    var prediction = Predict(predData, this.state.predMethod);
    console.log(prediction);
    var predictor = prediction.predict;
    var predPoints = [];
    for (let i = 0; i < prediction.points.length; i++) {
      predPoints.push(prediction.points[i][1]);
    }

    for (let i = 0; i < numOfDays; i++) {
      predPoints.push(predictor(predData.length + i)[1]);
    }

    var chartData = [];
    var dates = this.props.covidData[this.state.country].date;
    for (let i = 0; i < predPoints.length; i++) {
      var d = {};
      var date = new Date(dates[i]);
      if (dates[i]) d["date"] = date.toUTCString().substr(0, 16);
      else {
        date = new Date(dates[dates.length - 1]);
        date.setDate(date.getDate() + (i - dates.length + 1));
        d["date"] = date.toUTCString().substr(0, 16);
      }
      if (predData[i]) d[this.state.selData] = predData[i];
      d["Prediction"] = predPoints[i];

      chartData.push(d);
    }

    this.setState({ prediction: predPoints, chartData });
  };

  render() {
    var domain = [0, "auto"];
    if (this.state.chartData.length > 0) {
      var data = this.state.chartData.map(c =>
        parseInt(c[this.state.selData]) ? parseInt(c[this.state.selData]) : 0
      );
      var prediction = this.state.chartData.map(c => c.Prediction);
      var min = Math.min(...data);
      var max = Math.max(...data);
      var pMin = Math.min(...prediction);
      var pMax = Math.max(...prediction);
      if (max < pMax) max = pMax;
      if (min > pMin) min = pMin;

      max = max + 0.2 * max;
      domain = [min, max];
    }
    console.log(data, prediction);

    return (
      <div className="predictView">
        <table className="statistics" id="dataDisplay">
          <tr>
            <th colspan="6" style={{ fontSize: 22, textAlign: "center" }}>
              <i class="fas fa-hat-wizard"></i> Predict COVID Data
            </th>
          </tr>
          <tr>
            <th>Country</th>
            <th>Method</th>
            <th>Data</th>
            <th>Option</th>
            <th colspan="2">Days</th>
            {/* <th></th> */}
          </tr>
          <tr>
            <td>
              <Dropdown
                options={Object.keys(this.props.covidData)}
                value={this.state.country}
                onChange={val => this.setState({ country: val.value })}
              />
            </td>
            <td>
              <Dropdown
                options={predictionMethods}
                value={this.state.predMethod}
                onChange={val => this.setState({ predMethod: val.value })}
              />
            </td>
            <td>
              <Dropdown
                options={Object.keys(dataOptions)}
                value={this.state.selData}
                onChange={val =>
                  this.setState({
                    selData: val.value
                  })
                }
              />
            </td>
            <td>
              <Dropdown
                options={Object.keys(dataOptions[this.state.selData])}
                value={this.state.selOption}
                onChange={val =>
                  this.setState({
                    selOption: val.value
                  })
                }
              />
            </td>
            <td>
              <input
                type="number"
                min={1}
                max={100}
                id={"predictDays"}
                onChange={e => this.setState({ predDays: e.target.value })}
                value={this.state.predDays}
                style={{ height: 44, fontSize: 18, width: 100 }}
              ></input>
            </td>
            <td>
              <button
                className="viewButton"
                style={{
                  height: 44,
                  fontSize: 20,
                  border: "1px solid #c7c7c7"
                }}
                onClick={this.predict}
              >
                Predict
              </button>
            </td>
          </tr>
          {this.state.chartData.length > 0 ? (
            <tr>
              <td colspan="6">
                <Chart
                  data={this.state.chartData}
                  countries={[this.state.selData, "Prediction"]}
                  domain={domain}
                  dimensions={{
                    width: window.innerWidth,
                    height: window.innerHeight - 300
                  }}
                />
              </td>
            </tr>
          ) : null}
        </table>
      </div>
    );
  }
}

export default PredictView;
