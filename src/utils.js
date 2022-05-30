//calculations for risk factor & some helper functions

//marketing spend name is not always present in every row
const findMarketingSpend = (metrics) => {
  let marketingSpend = metrics.find((metric) => metric.marketing_spend > 0);
  return marketingSpend.marketing_spend;
};
//app name is not always present in every row
export const findAppName = (metrics) => {
  let appName = metrics.find((metric) => !!metric.app_name);
  return appName.app_name;
};

export const payBackPeriod = (metrics) => {
  let marketingSpend = findMarketingSpend(metrics);
  let daysToPayBack = 0;
  let revenue = 0;

  metrics.forEach((day) => {
    while (revenue <= marketingSpend) {
      let revenueToday = parseFloat(day.revenue);
      revenue += revenueToday;
      daysToPayBack++;
    }
  });

  let risk = paybackRisk(daysToPayBack);
  return risk * 0.7;
};

export const lifetimeValue = (metrics) => {
  let marketingSpend = findMarketingSpend(metrics);
  let risk;
  let monthsProfit = 0;

  metrics.forEach((metric) => {
    let revenueToday = parseFloat(metric.revenue);
    monthsProfit += revenueToday;
  });
  //avoid divide by 0 error
  if (marketingSpend > 0) risk = lifetimeRisk(monthsProfit / marketingSpend);
  return risk * 0.3;
};

const paybackRisk = (daysToPayBack) => {
  switch (true) {
    case daysToPayBack < 7:
      return 100;
    case daysToPayBack >= 7 && daysToPayBack <= 13:
      return 80;
    case daysToPayBack >= 14 && daysToPayBack <= 20:
      return 60;
    case daysToPayBack >= 21 && daysToPayBack <= 27:
      return 30;
    case daysToPayBack >= 28:
      return 10;
    default:
      break;
  }
};

const lifetimeRisk = (riskRatio) => {
  switch (true) {
    case riskRatio <= 1.4:
      return 10;
    case riskRatio >= 1.5 && riskRatio < 2.0:
      return 30;
    case riskRatio >= 2.0 && riskRatio < 2.5:
      return 60;
    case riskRatio >= 2.5 && riskRatio < 3.0:
      return 80;
    case riskRatio >= 3.0:
      return 100;
    default:
      break;
  }
};

export const riskRating = (riskFactor) => {
  switch (true) {
    case riskFactor <= 14:
      return "Unacceptable";
    case riskFactor > 14 && riskFactor <= 25:
      return "Unsatisfactory";
    case riskFactor > 25 && riskFactor <= 44:
      return "Cautionary";
    case riskFactor > 45 && riskFactor <= 64:
      return "Moderate";
    case riskFactor > 64 && riskFactor <= 84:
      return "Low";
    case riskFactor > 84 && riskFactor <= 100:
      return "Undoubted";
    default:
      return "Could not be determined";
  }
};
