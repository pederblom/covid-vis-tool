import React, { useState } from "react";
import * as chart from "recharts";

const Chart = props => {
  const [colors, setColors] = useState({});
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 300
  });

  var defaultColors = [
    "#ff0800",
    "#0031ff",
    "#4db411",
    "#FFCE00",
    "#ff8500",
    "#ff00f7"
  ];

  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const renderLines = countries => {
    var lines = [];
    var removedCountry = Object.keys(colors).filter(
      c => !countries.includes(c)
    );
    delete colors[removedCountry[0]];

    var defColores = [...defaultColors];

    for (var i = 0; i < countries.length; i++) {
      var color = getRandomColor();
      if (defColores.length > 0 && !colors[countries[i]])
        while (defColores.length > 0) {
          var c = defColores.shift();
          if (!Object.values(colors).includes(c)) {
            color = c;
            defColores = [];
          }
        }
      if (colors[countries[i]]) color = colors[countries[i]];
      else {
        colors[countries[i]] = color;
      }

      getRandomColor();
      lines.push(
        <chart.Line
          key={countries[i]}
          type="monotone"
          dataKey={countries[i]}
          stroke={color}
        />
      );
    }
    return lines;
  };

  const resizeChart = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight - 300
    });
  };

  return (
    <div>
      <chart.LineChart
        style={{
          backgroundColor: "white"
        }}
        width={props.dimensions.width}
        height={props.dimensions.height}
        data={props.data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <chart.CartesianGrid strokeDasharray="3 3" />
        {/* make this date format */}
        <chart.XAxis dataKey="date" />
        <chart.YAxis
          type="number"
          domain={props.domain ? props.domain : [0, "auto"]}
        />
        <chart.Tooltip />
        <chart.Legend />

        {renderLines(props.countries)}
      </chart.LineChart>
      {/* <button onClick={resizeChart} style={{ position: "absolute", right: 10 }}>
        ⟲
      </button> */}
    </div>
  );
};

export default Chart;
