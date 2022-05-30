import { useState } from "react";
import { CSVLink } from "react-csv";
import SampleTable from "./SampleTable";
import Papa from "papaparse";
import {
  payBackPeriod,
  lifetimeValue,
  riskRating,
  findAppName,
} from "../utils";

//labels & keys for output file
const headers = [
  { label: "Company ID", key: "company_id" },
  { label: "Company Name", key: "company_name" },
  { label: "App Name", key: "app_name" },
  { label: "Risk Score", key: "risk_score" },
  { label: "Risk Rating", key: "risk_rating" },
];
function FileUploader() {
  //State to store the values
  const [companyData, setCompanyData] = useState([]);
  const [csvReport, setCsvReport] = useState({
    label: null,
    headers: null,
    data: null,
  });
  //create a map of {company_id: {rowData}} for constant look up when appending metrics
  const companyChangeHandler = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        let companyObject = {};
        results.data.forEach((company) => {
          let companyId = company.company_id;
          companyObject[companyId] = company;
          //add a metrics key where metric for each day can be appended
          companyObject[companyId].metrics = [];
          setCompanyData();
        });
        setCompanyData(companyObject);
      },
    });
  };

  const metricsChangeHandler = (event) => {
    //go through each day in file 2
    //map to correct company
    //append the metrics for that day
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        results.data.forEach((day) => {
          companyData[day.company_id].metrics.push(day);
        });
      },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let companyMetrics = {};
    Object.keys(companyData).forEach((companyId) => {
      let company = companyData[companyId];
      let companyName = company.company_name;
      companyMetrics[companyName] = {};
      let risk_score =
        payBackPeriod(company.metrics) + lifetimeValue(company.metrics);
      let risk_rating = riskRating(risk_score);
      //values for CSV file
      companyMetrics[companyName].company_id = companyId;
      companyMetrics[companyName].company_name = companyName;
      companyMetrics[companyName].app_name = findAppName(company.metrics);
      companyMetrics[companyName].risk_score = risk_score;
      companyMetrics[companyName].risk_rating = risk_rating;
    });

    //sorting is based on # of companies "m"
    //infinite amount of companies makes this O(m*log(m))
    const dataForCsv = Object.values(companyMetrics).sort(
      (a, b) => b.risk_score - a.risk_score
    );
    setCsvReport({
      filename: "app-credit-risk-ratings.csv",
      headers: headers,
      data: dataForCsv,
    });
    setCompanyData([]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <form
        style={{
          color: "palevioletred",
          display: "flex",
          flexDirection: "column",
          width: "300px",
          margin: "50px auto",
        }}
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          name="file"
          onChange={companyChangeHandler}
          accept=".csv"
          style={{ display: "block", margin: "10px auto" }}
        />
        <input
          type="file"
          //make sure csv w/companies is added first so metrics can be appended
          disabled={!Object.values(companyData).length > 0}
          name="file"
          onChange={metricsChangeHandler}
          on
          accept=".csv"
          style={{ display: "block", margin: "10px auto" }}
        />
        <input type="submit" style={{ marginBottom: "10px" }} />
        <input type="reset"></input>
        {csvReport.data && csvReport.data.length > 0 && (
          <CSVLink style={{ marginTop: "10px" }} {...csvReport}>
            Export to CSV
          </CSVLink>
        )}
      </form>
      <h4 style={{ color: "red", fontStyle: "italic" }}>
        Important: Hit "Reset" in between submissions
      </h4>
      <SampleTable />
    </div>
  );
}

export default FileUploader;
