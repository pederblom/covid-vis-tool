import React from "react";
import Map from "../components/map";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import ReactTooltip from "react-tooltip";
import Modal from "react-modal";
import MyModal from "../components/my-modal";
import { dataOptions, mapColors } from "../utils";

const title = {
  Cases: {
    Total: "Total cases (per million)",
    New: "New cases (per million)"
  },
  Deaths: {
    Total: "Total deaths (per million)",
    New: "New deaths (per million)"
  },
  Vaccinations: {
    Total: "Total vaccinations (per hundred)",
    New: "New vaccinations (per million)"
  },
  icon: {
    Cases: "fas fa-head-side-cough",
    Vaccinations: "fas fa-syringe",
    Deaths: "fas fa-skull-crossbones"
  }
};

const filters = [
  "stringency",
  "masks",
  "schools",
  "work",
  "gather",
  "internal",
  "international",
  "trans",
  "home",
  "testing",
  "contact"
];

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selType: "Cases",
      selOption: "Total",
      tooltip: "",
      modalOpen: false,
      modalCountry: "",
      filters: {}
    };
  }

  setTooltip = tip => {
    this.setState({ tooltip: tip });
  };

  openModal = iso => {
    this.setState({ modalOpen: true, modalCountry: iso });
  };

  filterOptionDrop = id => {
    return (
      <select id={id}>
        <option value="equal">=</option>
        <option value="greaterThan">{">"}</option>
        <option value="greaterThanEqual">{"≥"}</option>
        <option value="lessThan">{"<"}</option>
        <option value="lessThanEqual">{"≤"}</option>
      </select>
    );
  };

  inputNumber = (min, max, type) => {
    return (
      <input
        type="number"
        id={type + "dropdown"}
        min={min}
        max={max}
        style={{ width: "40px" }}
      ></input>
    );
  };

  applyFilter = () => {
    var f = {};
    for (let i = 0; i < filters.length; i++) {
      var value = parseInt(
        document.getElementById(filters[i] + "dropdown").value
      );
      var option = document.getElementById(filters[i]).value;
      if (value) f[filters[i]] = { option, value };
    }
    console.log(f);
    this.setState({ filters: f });
  };

  clearFilters = () => {
    this.setState({ filters: {} });
    for (let i = 0; i < filters.length; i++) {
      document.getElementById(filters[i] + "dropdown").value = "";
    }
  };

  render() {
    var c = mapColors(dataOptions[this.state.selType][this.state.selOption]);
    var colorScale = c.scale;
    var colorMax = c.max;
    return (
      <div className="mapViewContainer">
        <Modal
          isOpen={this.state.modalOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={() => this.setState({ modalOpen: false })}
          // style={customStyles}
          contentLabel="Example Modal"
        >
          {this.props.covidData[this.state.modalCountry] &&
          this.props.policyData[this.state.modalCountry] ? (
            <MyModal
              covidData={this.props.covidData[this.state.modalCountry]}
              policyData={this.props.policyData[this.state.modalCountry]}
            />
          ) : (
            <div>No data :////</div>
          )}
        </Modal>
        {/* <div className="filterContainer"> */}
        <table className="statistics" id="dataDisplay">
          <tr>
            <th colSpan="2" style={{ fontSize: 22, textAlign: "center" }}>
              <i class="fas fa-globe-africa"></i> COVID Data Map
            </th>
          </tr>
          <tr>
            <th colSpan="2">
              <div className="dataOptionsMap">
                <div className="dropdowner">
                  <Dropdown
                    options={["Cases", "Deaths", "Vaccinations"]}
                    value={this.state.selType}
                    onChange={val => {
                      this.setState({
                        selType: val.value
                      });
                    }}
                  />
                </div>
                <div className="dropdowner">
                  <Dropdown
                    options={["Total", "New"]}
                    value={this.state.selOption}
                    onChange={val => {
                      this.setState({
                        selOption: val.value
                      });
                    }}
                  />
                </div>
              </div>
            </th>
          </tr>
          <tr>
            <th style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <i class="fas fa-filter"></i> Filter countries
              </div>{" "}
              <div>
                <button onClick={this.clearFilters}>Clear</button>
                <button onClick={this.applyFilter}>Apply</button>
              </div>
            </th>
            <th>
              <i class={title.icon[this.state.selType]}></i>{" "}
              {title[this.state.selType][this.state.selOption]}
            </th>
          </tr>
          <tr>
            <td>
              <div className="filterColumn">
                <div>
                  {/* <a
                data-tip
                data-for="tool"
                onMouseEnter={() =>
                  setTool(policyExplanation(policies.contactTracing))
                }
              > */}
                  <i class="fas fa-sort-numeric-up-alt"></i> Stringency index{" "}
                  {/* </a> */}
                </div>
                <div style={{ display: "flex" }}>
                  {this.filterOptionDrop("stringency")}
                  {this.inputNumber(0, 100, "stringency")}
                </div>
              </div>
            </td>
            <td rowSpan="10">
              <Map
                covidData={this.props.covidData}
                policyData={this.props.policyData}
                type={this.state.selType}
                option={this.state.selOption}
                filters={this.state.filters}
                setTooltip={this.setTooltip}
                openModal={this.openModal}
              />
            </td>
          </tr>
          <tr>
            <td>
              <div className="filterColumn">
                <div>
                  <i class="fas fa-head-side-mask"></i> Face covering{" "}
                </div>
                <div style={{ display: "flex" }}>
                  {this.filterOptionDrop("masks")}
                  {this.inputNumber(0, 4, "masks")}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="filterColumn">
                <div>
                  <i class="fas fa-school"></i> Schools closing
                </div>
                <div style={{ display: "flex" }}>
                  {this.filterOptionDrop("schools")}
                  {this.inputNumber(0, 3, "schools")}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="filterColumn">
                <div>
                  <i class="fas fa-briefcase"></i> Workplace closing
                </div>
                <div style={{ display: "flex" }}>
                  {this.filterOptionDrop("work")}
                  {this.inputNumber(0, 3, "work")}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="filterColumn">
                <div>
                  <i class="fas fa-users"></i> Restrictions on gatherings
                </div>
                <div style={{ display: "flex" }}>
                  {this.filterOptionDrop("gather")}
                  {this.inputNumber(0, 4, "gather")}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="filterColumn">
                <div>
                  <i class="fas fa-bus"></i> Public transport closing
                </div>
                <div style={{ display: "flex" }}>
                  {this.filterOptionDrop("trans")}
                  {this.inputNumber(0, 2, "trans")}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="filterColumn">
                <div>
                  <i class="fas fa-house-user"></i> Stay at home requirements
                </div>
                <div style={{ display: "flex" }}>
                  {this.filterOptionDrop("home")}
                  {this.inputNumber(0, 3, "home")}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="filterColumn">
                <div>
                  <i class="fas fa-route"></i> Internal travel restrictions
                </div>
                <div style={{ display: "flex" }}>
                  {this.filterOptionDrop("internal")}
                  {this.inputNumber(0, 2, "internal")}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="filterColumn">
                <div>
                  <i class="fas fa-plane"></i> International travel restrictions
                </div>
                <div style={{ display: "flex" }}>
                  {this.filterOptionDrop("international")}
                  {this.inputNumber(0, 4, "international")}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="filterColumn">
                <div>
                  <i class="fas fa-vial"></i> Testing policy
                </div>
                <div style={{ display: "flex" }}>
                  {this.filterOptionDrop("testing")}
                  {this.inputNumber(0, 3, "testing")}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="filterColumn">
                <div>
                  <i class="fas fa-user-secret"></i> Contact tracing
                </div>
                <div style={{ display: "flex" }}>
                  {this.filterOptionDrop("contact")}
                  {this.inputNumber(0, 2, "contact")}
                </div>
              </div>
            </td>
            <td>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 12,
                  textAlign: "center",
                  border: "1px solid #9c9292"
                }}
              >
                <div
                  style={{
                    width: "15%",
                    height: 17,
                    backgroundColor: "#F5F4F6",
                    borderRight: "1px solid #9c9292"
                  }}
                >
                  No data
                </div>
                <div
                  style={{
                    width: "15%",
                    height: 17,
                    backgroundColor: colorScale(0 * colorMax),
                    borderRight: "1px solid #9c9292"
                  }}
                >
                  {0 * colorMax}
                </div>
                <div
                  style={{
                    width: "15%",
                    height: 17,
                    backgroundColor: colorScale(0.25 * colorMax),
                    borderRight: "1px solid #9c9292"
                  }}
                >
                  {0.25 * colorMax}
                </div>
                <div
                  style={{
                    width: "15%",
                    height: 17,
                    backgroundColor: colorScale(0.5 * colorMax),
                    borderRight: "1px solid #9c9292"
                  }}
                >
                  {0.5 * colorMax}
                </div>
                <div
                  style={{
                    width: "15%",
                    height: 17,
                    backgroundColor: colorScale(0.75 * colorMax),
                    borderRight: "1px solid #9c9292"
                  }}
                >
                  {0.75 * colorMax}
                </div>
                <div
                  style={{
                    width: "15%",
                    height: 17,
                    backgroundColor: colorScale(1 * colorMax),
                    borderRight: "1px solid #9c9292"
                  }}
                >
                  {1 * colorMax}
                </div>
                <div
                  style={{
                    width: "15%",
                    height: 17,
                    backgroundColor: colorScale(1.25 * colorMax),
                    borderRight: "1px solid #9c9292"
                  }}
                >
                  {1.25 * colorMax}+
                </div>
              </div>
            </td>
          </tr>
        </table>
        <ReactTooltip>{this.state.tooltip}</ReactTooltip>
      </div>
    );
  }
}

export default MapView;
