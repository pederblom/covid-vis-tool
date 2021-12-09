import { scaleLinear } from "d3-scale";
export const dataOptions = {
  Cases: {
    Total: "total_cases",
    "Total per 1M": "total_cases_per_million",
    New: "new_cases",
    "New per 1M": "new_cases_per_million"
  },
  Vaccinations: {
    Total: "total_vaccinations",
    "Total per 100": "total_vaccinations_per_hundred",
    New: "new_vaccinations_smoothed",
    "New per 1M": "new_vaccinations_smoothed_per_million"
  },
  Deaths: {
    Total: "total_deaths",
    "Total per 1M": "total_deaths_per_million",
    New: "new_deaths",
    "New per 1M": "new_deaths_per_million"
  },
  Tests: {
    Total: "total_tests",
    "Total per 1k": "total_tests_per_thousand",
    New: "new_tests",
    "New per 1k": "new_tests_per_thousand"
  },
  Boosters: {
    Total: "total_boosters",
    "Per 100": "total_boosters_per_hundred"
  }
};

export const firstNotNull = arr => {
  var i = 1;
  while (arr.length > i) {
    if (arr[arr.length - i]) return arr[arr.length - i];
    else i++;
  }
  return "No data";
};

export const policies = {
  stringency:
    "An index between 0 - 200 that measures the stringency of the countries COVID measures",
  schoolClose: {
    0: "No measures",
    1: "Recommend closing",
    2: "Require closing (only some levels or categories, e.g. just high school, or just public schools)",
    3: "Require closing all levels",
    "No data": "No data"
  },
  workClose: {
    0: "No measures",
    1: "Recommend closing",
    2: "Require closing (or work from home) for some sectors or categories of workers",
    3: "Require closing (or work from home) all but essential workplaces (e.g. grocery stores, doctors)",
    "No data": "No data"
  },
  cancelEvents: {
    0: "No measures",
    1: "Recommend cancelling",
    2: "Require cancelling",
    "No data": "No data"
  },
  restrictGather: {
    0: "No restrictions",
    1: "Restrictions on very large gatherings (the limit is above 1,000 people)",
    2: "Restrictions on gatherings between 100-1,000 people",
    3: "Restrictions on gatherings between 10-100 people",
    4: "Restrictions on gatherings of less than 10 people",
    "No data": "No data"
  },
  pubTransClose: {
    0: "No measures",
    1: "Recommend closing (or significantly reduce volume/route/means of transport available)",
    2: "Require closing (or prohibit most citizens from using it)",
    "No data": "No data"
  },
  stayHome: {
    0: "No measures",
    1: "recommend not leaving house",
    2: "require not leaving house with exceptions for daily exercise, grocery shopping, and ‘essential’ trips",
    3: "Require not leaving house with minimal exceptions (e.g. allowed to leave only once every few days, or only one person can leave at a time, etc.)",
    "No data": "No data"
  },
  travelInternal: {
    0: "No measures",
    1: "Recommend movement restriction",
    2: "Restrict movement",
    "No data": "No data"
  },
  travelInternational: {
    0: "No measures",
    1: "Screening",
    2: "Quarantine arrivals from high-risk regions",
    3: "Ban on high-risk regions",
    4: "Total border closure",
    "No data": "No data"
  },
  testingPolicy: {
    0: "No testing policy",
    1: "Only those who both (a) have symptoms AND (b) meet specific criteria (eg key workers, admitted to hospital, came into contact with a known case, returned from overseas)",
    2: "testing of anyone showing COVID-19 symptoms",
    3: "open public testing (e.g. “drive through” testing available to asymptomatic people)",
    "No data": "No data"
  },
  contactTracing: {
    0: "No contact tracing",
    1: "Limited contact tracing - not done for all cases",
    2: "Comprehensive contact tracing - done for all cases",
    "No data": "No data"
  },
  faceCovering: {
    0: "No policy",
    1: "Recommended",
    2: "Required in some specified shared/public spaces outside the home with other people present, or some situations when social distancing not possible",
    3: "Required in all shared/public spaces outside the home with other people present or all situations when social distancing not possible",
    4: "Required outside the home at all times, regardless of location or presence of other people",
    "No data": "No data"
  }
};

export const policyExplanation = filter => {
  var objs = Object.values(filter);
  var keys = Object.keys(filter);
  var explain = "";
  for (let i = 0; i < objs.length; i++) {
    if (keys[i] != "No data")
      explain = explain + keys[i] + "-" + objs[i] + " <br/> ";
  }
  return explain;
};

export const colorScaler = (ceiling, color) =>
  scaleLinear().domain([0, ceiling]).range(["#fef2dd", color]);

export const mapColors = type => {
  // find the maxes based on the highest value in dataset
  switch (type) {
    case "total_cases_per_million":
      return { scale: colorScaler(200000, "#e88117"), max: 200000 };
    case "total_cases":
      return { scale: colorScaler(200000, "#e88117"), max: 200000 };
    case "new_cases_per_million":
      return { scale: colorScaler(2000, "#e88117"), max: 2000 };
    case "new_cases":
      return { scale: colorScaler(2000, "#e88117"), max: 2000 };
    case "total_vaccinations_per_hundred":
      return { scale: colorScaler(200, "#597D35"), max: 200 };
    case "total_vaccinations":
      return { scale: colorScaler(200, "#597D35"), max: 200 };
    case "new_vaccinations_smoothed_per_million":
      return { scale: colorScaler(15000, "#597D35"), max: 15000 };
    case "new_vaccinations_smoothed":
      return { scale: colorScaler(15000, "#597D35"), max: 15000 };
    case "total_deaths_per_million":
      return { scale: colorScaler(3000, "#de1f1f"), max: 3000 };
    case "total_deaths":
      return { scale: colorScaler(3000, "#de1f1f"), max: 3000 };
    case "new_deaths_per_million":
      return { scale: colorScaler(30, "#de1f1f"), max: 30 };
    case "new_deaths":
      return { scale: colorScaler(30, "#de1f1f"), max: 30 };
    default:
      return { scale: colorScaler(200000, "#e88117"), max: 200000 };
  }
};
