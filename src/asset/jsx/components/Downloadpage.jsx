import React, { Component } from "react";

class Downloadpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: "2023-06-01",
      toDate: "2023-06-20",
      tableData: [
        { cardType: "Visa", quantity: 60, success: 50, fail: 10 },
        { cardType: "MasterCard", quantity: 90, success: 70, fail: 20 },
      ],
      countryData: [
        { country: "USA", amount: 1000, currency: "USD" },
        { country: "Canada", amount: 750, currency: "EUR" },
        { country: "Germany", amount: 500, currency: "EUR" },
        { country: "Australia", amount: 400, currency: "USD" },
        { country: "Japan", amount: 300, currency: "EUR" },
        { country: "Brazil", amount: 250, currency: "USD" },
        { country: "India", amount: 200, currency: "INR" },
        { country: "China", amount: 150, currency: "USD" },
        { country: "Mexico", amount: 100, currency: "USD" },
        { country: "South Africa", amount: 50, currency: "EUR" },
      ],
    };
  }

  handleDownloadPDF = () => {
    fetch("src/asset/jsx/components/Downloadpage.jsx") 
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const fileURL = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = "file.pdf"; 
        link.click();
      })
      .catch((error) => {
        console.error("Error fetching PDF:", error);
      });
  };
  

  render() {
    const { fromDate, toDate, tableData, countryData } = this.state;
    const today = new Date().toISOString().split("T")[0];

    return (
      <div className="page-container">
        <h1 className="page-title">Overview</h1>
        <div className="header-container">
          <span className="todays-date">Today's Date: {today}</span>
          <span className="date-range">
            <span> From: {fromDate} </span>
            <span> To: {toDate} </span>
          </span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Card Type</th>
                <th>Quantity</th>
                <th>Success</th>
                <th>Fail</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.cardType}</td>
                  <td>{row.quantity}</td>
                  <td>{row.success}</td>
                  <td>{row.fail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="country-container">
          <div className="top-countries">
            <h3>High Invest countries</h3>
            {countryData
              .slice(0, 5)
              .map((country, index) => (
                <div key={index} className="country-item">
                  <p className="p2">
                    {country.country} ({country.currency})
                  </p>
                  <span>{country.amount}</span>
                </div>
              ))}
          </div>

          <div className="bottom-countries">
            <h3>Low Invest countries</h3>
            {countryData
              .slice(5, 10)
              .map((country, index) => (
                <div key={index} className="country-item">
                  <p className="p2">
                    {country.country} ({country.currency})
                  </p>
                  <span>{country.amount}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="total-amount">
          <span>Total Amount: {countryData.reduce((acc, cur) => acc + cur.amount, 0)}</span>
        </div>

        <button className="btn-primary download-button" onClick={this.handleDownloadPDF}>
          Download PDF
        </button>
      </div>
    );
  }
}

export default Downloadpage;
