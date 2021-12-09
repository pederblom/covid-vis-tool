import React from "react";
import ChartView from "./chart-view";
import MapView from "./map-view";
import PredictView from "./predict-view";
import { getCovidData, getCovidPolicyData } from "../data/repo";

const selectedStyle = {
  backgroundColor: "whitesmoke",
  borderTop: "1px solid #9c9292",
  borderRight: "1px solid #9c9292",
  borderLeft: "1px solid #9c9292",
  borderBottom: "0px"
};

class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { covidData: null, policyData: null, selectedView: "Chart" };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    var covidData = await getCovidData();
    var policyData = await getCovidPolicyData();
    console.log(covidData);
    console.log(policyData);
    this.setState({ covidData: covidData.data, policyData: policyData.data });
  };

  render() {
    return (
      <div>
        <div className="mainHeader">
          <i class="fas fa-virus"></i> COVID DATA ANALYSIS{" "}
          <i class="fas fa-virus"></i>
        </div>
        <div className="ViewSelector">
          <button
            className="tab"
            style={this.state.selectedView == "Chart" ? selectedStyle : {}}
            onClick={() => this.setState({ selectedView: "Chart" })}
          >
            Chart
          </button>
          <button
            className="tab"
            style={this.state.selectedView == "Map" ? selectedStyle : {}}
            onClick={() => this.setState({ selectedView: "Map" })}
          >
            Map
          </button>
          <button
            className="tab"
            style={this.state.selectedView == "Predict" ? selectedStyle : {}}
            onClick={() => this.setState({ selectedView: "Predict" })}
          >
            Prediction
          </button>
        </div>
        {this.state.covidData && this.state.policyData ? (
          <div>
            {this.state.selectedView == "Chart" ? (
              <ChartView covidData={this.state.covidData} />
            ) : null}
            {this.state.selectedView == "Map" ? (
              <MapView
                covidData={this.state.covidData}
                policyData={this.state.policyData}
              />
            ) : null}
            {this.state.selectedView == "Predict" ? (
              <PredictView covidData={this.state.covidData} />
            ) : null}
          </div>
        ) : (
          <div className="loading">Loading data...</div>
        )}
        {/* {this.state.selectedView == "Chart" ? (
          <ChartView covidData={this.state.covidData} />
        ) : null}
        {this.state.selectedView == "Map" ? (
          <MapView
            covidData={this.state.covidData}
            policyData={this.state.policyData}
          />
        ) : null}
        {this.state.selectedView == "Predict" ? (
          <PredictView covidData={this.state.covidData} />
        ) : null} */}
      </div>
    );
  }
}

export default MainView;
