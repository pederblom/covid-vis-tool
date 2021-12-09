import Multiselect from "multiselect-react-dropdown";
import React from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Chart from "../components/chart";
import { dataOptions } from "../utils";

class ChartView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      countryAndCodes: ["Norway (NOR)"],
      countries: [],
      countryNames: [],
      selectedData: "Cases",
      selectedOption: "Total",
      selectedDuration: "All-time",
      dates: []
    };
  }

  componentDidMount() {
    if (this.props.covidData != null) {
      this.setState(
        { dates: this.props.covidData.CHN.date.slice().reverse() },
        () => {
          this.updateData();
          this.setAllCountries(this.props.covidData);
        }
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.covidData !== this.props.covidData) {
      console.log(this.props.covidData);
      this.setState(
        { dates: this.props.covidData.CHN.date.slice().reverse() },
        () => {
          this.updateData();
          this.setAllCountries(this.props.covidData);
        }
      );
    }
  }

  setAllCountries = data => {
    var countries = Object.keys(data);
    var countryNames = [];
    for (let i = 0; i < countries.length; i++) {
      countryNames.push(
        `${this.props.covidData[countries[i]].location[0]} (${countries[i]})`
      );
    }
    this.setState({ countryNames });
  };

  addToChartData = country => {
    console.log(country);
    var chartData = this.state.data;
    var cc = country.split("(");
    var iso = cc[1].substring(0, cc[1].length - 1);
    var data = this.props.covidData[iso];
    var cName = data.location[0];
    var countries = this.state.countries;

    for (let i = 0; i < data.date.length; i++) {
      var date = chartData.find(d => d.date == data.date[i]);
      chartData.find(d => d.date == data.date[i]);
      if (date) {
        var selectedDataOption =
          dataOptions[this.state.selectedData][this.state.selectedOption];
        var val = parseFloat(data[selectedDataOption][i]);
        date[cName] = val;
      }
    }

    this.setState({ data: chartData, countries });
  };

  convertChartData = (data, countries) => {
    var chosenData = [];
    var countryNames = [];
    for (var i = 0; i < countries.length; i++) {
      var cc = countries[i].split("(");
      var iso = cc[1].substring(0, cc[1].length - 1);
      chosenData.push(data[iso]);
      countryNames.push(data[iso].location[0]);
    }

    var dates = this.state.dates;
    var chartData = [];
    for (var i = 0; i < dates.length; i++) {
      var d = {};
      // make this date
      var date = new Date(dates[i]);
      d["date"] = date.toUTCString().substr(0, 16);
      for (var j = 0; j < chosenData.length; j++) {
        var selectedDataOption =
          dataOptions[this.state.selectedData][this.state.selectedOption];
        var selData = chosenData[j][selectedDataOption];

        var val = parseFloat(selData[selData.length - 1 - i]);
        if (val) d[chosenData[j].location[0]] = val;
      }
      chartData.push(d);
    }
    chartData = chartData.reverse();

    switch (this.state.selectedDuration) {
      case "All-time":
        break;
      case "Past 2 weeks":
        chartData = chartData.slice(Math.max(dates.length - 14, 0));
        break;
      case "Past month":
        chartData = chartData.slice(Math.max(dates.length - 30, 0));
        break;
      case "Past 6 months":
        chartData = chartData.slice(Math.max(dates.length - 180, 0));
        break;
      case "Past year":
        chartData = chartData.slice(Math.max(dates.length - 365, 0));
        break;
    }

    this.setState({ data: chartData, countries: countryNames });
  };

  selectAddRemove = values => {
    this.setState({ countryAndCodes: values });
    this.convertChartData(this.props.covidData, values);
    // this.addToChartData(values.pop());
  };

  updateData = () => {
    this.convertChartData(this.props.covidData, this.state.countryAndCodes);
  };

  render() {
    return (
      <div className="ChartViewContainer">
        <table className="statistics" id="dataDisplay">
          <tr>
            <th colSpan="4" style={{ fontSize: 22, textAlign: "center" }}>
              <i class="fas fa-chart-line"></i> COVID Data Chart
            </th>
          </tr>
          <tr>
            <th>Countries</th>
            <th>Data</th>
            <th>Options</th>
            <th>Duration</th>
          </tr>
          <tr>
            <td>
              <Multiselect
                isObject={false}
                onRemove={this.selectAddRemove}
                onSearch={value => console.log(value)}
                onSelect={this.selectAddRemove}
                options={this.state.countryNames}
                selectedValues={this.state.countryAndCodes}
              />
            </td>
            <td>
              <Dropdown
                options={Object.keys(dataOptions)}
                value={this.state.selectedData}
                onChange={val => {
                  this.setState(
                    {
                      selectedData: val.value,
                      selectedOption: "Total"
                    },
                    () => this.updateData()
                  );
                }}
              />
            </td>
            <td>
              <Dropdown
                options={Object.keys(dataOptions[this.state.selectedData])}
                value={this.state.selectedOption}
                onChange={val =>
                  this.setState({ selectedOption: val.value }, () =>
                    this.updateData()
                  )
                }
              />
            </td>
            <td>
              <Dropdown
                options={[
                  "All-time",
                  "Past 2 weeks",
                  "Past month",
                  "Past 6 months",
                  "Past year"
                ]}
                value={this.state.selectedDuration}
                onChange={val => {
                  this.setState({ selectedDuration: val.value }, () =>
                    this.updateData()
                  );
                }}
              />
            </td>
          </tr>
          <tr>
            <td colSpan="4">
              <div className="ChartContainer">
                {this.state.data.length > 0 ? (
                  <Chart
                    data={this.state.data}
                    countries={this.state.countries}
                    dimensions={{
                      width: window.innerWidth - 20,
                      height: window.innerHeight - 300
                    }}
                  />
                ) : (
                  <p>Loading data</p>
                )}
              </div>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default ChartView;
