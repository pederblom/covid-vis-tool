import React, { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { firstNotNull, mapColors, filterData } from "../utils";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const Map = props => {
  const filterCountries = () => {
    var countries = Object.keys(props.covidData);
    var filters = Object.keys(props.filters);
    var filtered = Object.keys(props.covidData);
    for (let i = 0; i < countries.length; i++) {
      for (let j = 0; j < filters.length; j++) {
        var c = countries[i];
        var filter = filterData[filters[j]];
        if (c != "" && props[filter.dataSet][c]) {
          var val = parseInt(
            firstNotNull(props[filter.dataSet][c][filter.arr])
          );

          if (!val) filtered = filtered.filter(val => val != c);
          var f = props.filters[filters[j]];
          switch (f.option) {
            case "equal":
              if (val != f.value) filtered = filtered.filter(val => val != c);
              break;
            case "greaterThan":
              if (val <= f.value) filtered = filtered.filter(val => val != c);
              break;
            case "greaterThanEqual":
              if (val < f.value) filtered = filtered.filter(val => val != c);
              break;
            case "lessThan":
              if (val >= f.value) filtered = filtered.filter(val => val != c);
              break;
            case "lessThanEqual":
              if (val > f.value) filtered = filtered.filter(val => val != c);
              break;
          }
        } else {
          filtered = filtered.filter(val => val != c);
        }
      }
    }
    return filtered;
  };

  const filtered = filterCountries();
  return (
    <ComposableMap
      data-tip=""
      style={{
        backgroundColor: "white",
        // height: "100%",
        width: "100%"
      }}
      projectionConfig={{
        rotate: [-15, 0, 0],
        scale: 150
      }}
      // must be dynamic
      height={300}
    >
      <ZoomableGroup zoom={1}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const data = props.covidData[geo.properties.ISO_A3];
              var dataType = "total_cases_per_million";
              var colorScale = mapColors("");
              if (data) {
                switch (props.type) {
                  case "Cases":
                    if (props.option == "Total") {
                      dataType = "total_cases_per_million";
                      colorScale = mapColors("total_cases_per_million").scale;
                    } else {
                      dataType = "new_cases_per_million";
                      colorScale = mapColors("new_cases_per_million").scale;
                    }
                    break;
                  case "Vaccinations":
                    if (props.option == "Total") {
                      dataType = "total_vaccinations_per_hundred";
                      colorScale = mapColors(
                        "total_vaccinations_per_hundred"
                      ).scale;
                    } else {
                      dataType = "new_vaccinations_smoothed_per_million";
                      colorScale = mapColors(
                        "new_vaccinations_smoothed_per_million"
                      ).scale;
                    }
                    break;
                  case "Deaths":
                    if (props.option == "Total") {
                      dataType = "total_deaths_per_million";
                      colorScale = mapColors("total_deaths_per_million").scale;
                    } else {
                      dataType = "new_deaths_per_million";
                      colorScale = mapColors("new_deaths_per_million").scale;
                    }
                    break;
                }
                var val = parseFloat(data[dataType].pop());
                if (props.option == "Total") {
                  while ((val == 0 || !val) && data[dataType].length > 0)
                    val = parseFloat(data[dataType].pop());
                  if (val > 100) val = parseInt(val);
                } else
                  while (!val && data[dataType].length > 0)
                    val = parseFloat(data[dataType].pop());
              }
              return (
                <Geography
                  key={geo.rsmKey}
                  name={geo.properties.ISO_A3}
                  geography={geo}
                  fill={
                    val && filtered.includes(geo.properties.ISO_A3)
                      ? colorScale(val)
                      : "#F5F4F6"
                  }
                  style={{
                    hover: {
                      fill: "#000000",
                      outline: "none"
                    }
                  }}
                  onMouseEnter={() => {
                    const { NAME } = geo.properties;
                    props.setTooltip(`${NAME} — ${val ? val : "No data"}`);
                  }}
                  onMouseLeave={() => {
                    props.setTooltip("");
                  }}
                  onClick={() => props.openModal(geo.properties.ISO_A3)}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default memo(Map);
