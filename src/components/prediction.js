import regression from "regression";
// import { interpolateNumberArray } from "d3-interpolate";

const Predict = (data, method) => {
  var regData = [];
  for (let i = 0; i < data.length; i++) {
    var val = parseInt(data[i]);
    val = val >= 0 ? val : 0;
    regData.push([i, val]);
  }

  console.log(regData);
  //interpolate if null values

  let result;
  switch (method) {
    case "Linear":
      result = regression.linear(regData);
      break;
    case "Polynomial":
      result = regression.polynomial(regData);
      break;
    case "Exponential":
      result = regression.exponential(regData);
      break;
    case "Logarithmic":
      result = regression.logarithmic(regData);
      break;
    case "Power":
      result = regression.power(regData);
      break;
    default:
      result = regression.linear(regData);
  }
  return result;
};

export default Predict;
