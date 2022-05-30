// Example of expected csv data format
const fileOne = [
  { copmany_id: 100, company_name: "Klutch Games", country_code: "USA" },
];

const fileTwoData = [
  {
    date: 100,
    app_name: "Klutch Games",
    company_id: "USA",
    revenue: 2628,
    marketing_spend: 40000,
  },
];

function SampleTable() {
  return (
    <div style={{ fontSize: "16px" }}>
      <h3>File One CSV Example Format</h3>
      <table>
        <tr>
          <th>company_id (integer)</th>|<th>company_name (string)</th>|
          <th>country_code (string)</th>
        </tr>
        {fileOne.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.company_name}</td>|<td>{val.copmany_id}</td>|
              <td>{val.country_code}</td>
            </tr>
          );
        })}
      </table>
      <br></br>
      <h3>File Two CSV Example Format</h3>
      <table>
        <tr>
          <th>date (date)</th>|<th>app_name (string)</th>|
          <th>company_id (integer)</th>|<th>revenue (float)</th>|
          <th>marketing_spend (float)</th>
        </tr>
        {fileTwoData.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.date}</td>|<td>{val.app_name}</td>|
              <td>{val.company_id}</td>|<td>{val.revenue}</td>|
              <td>{val.marketing_spend}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default SampleTable;
