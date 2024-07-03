import React, { Component } from "react";
import * as XLSX from "xlsx";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MessageBox from "../components/Message_box";

import { Folder, Excel, Import, Export } from "../../media/icon/SVGicons";

class Compare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      token: localStorage.getItem("token"),
      AQlist: [],
      searchedResult: [],
      paymentgateway: "",
      fromDate: "",
      toDate: "",
      attachment: null,
      fileName: "No File Chosen",
      excelData: [],
      excelTotals: {},
      searchedTotals: {},
      mismatches: {},
      mismatchModal: false,
      errorMessage: "",
			messageType: "",
    };
  }

  componentDidMount() {
    this.fetchAcquirerList();
  }

  fetchAcquirerList = async () => {
    const { token } = this.state;
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(`${backendURL}/acquirerlist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      this.setState({ AQlist: data });
    } catch (error) {
      this.setState({
        errorMessage: "Error in Fetching data. Please try again later.",
        messageType: "",
      });
    }
  };

  handleInputChange = (event) => {
    const { id, value, files } = event.target;

    if (id === "attachment" && files.length > 0) {
      this.setState({ fileName: files[0].name, attachment: files[0] });
      this.readExcel(files[0]);
    } else {
      this.setState({ [id]: value });
    }
  };
  
  handleSearch = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token, fromDate, toDate, paymentgateway } = this.state;
  
    const searchedData = {
      fromDate,
      toDate,
      paymentgateway,
    };
  
    try {
      const response = await fetch(`${backendURL}/comparereport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(searchedData),
      });
  
      if (!response.ok) {
        throw new Error("Error searching. Please try again later.");
      }
  
      const data = await response.json();
      console.log("Fetched data:", data); 
  
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received.");
      }
  
      const totalAmount = data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      console.log("Total amount:", totalAmount);
  
      this.setState({
        searchedResult: data,
        totalAmount: totalAmount.toFixed(2), // Format to 2 decimal places
        errorMessage: null,
        messageType: null,
      });
  
    } catch (error) {
      console.error("Error fetching or processing data:", error);
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "fail",
      });
    }
  };  

  handleClear = () => {
    this.setState({
      fromDate: "",
      toDate: "",
      paymentgateway: "",
      searchedResult: [],
    });
  };

  readExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const columns = ["reference_id", "amount", "status"];
      const headers = json[0];
      const indices = columns.map((col) => headers.indexOf(col));
      const filteredData = json.slice(1).map((row) =>
        indices.map((index, colIndex) => {
          let cell = row[index];
          if (colIndex === 2) {
            if (cell === "process_failed") cell = "Failed";
            else if (cell === "processed") cell = "Success";
          }
          return cell;
        })
      );

      this.setState({ excelData: filteredData });
      const excelTotals = this.calculateExcelTotals(filteredData);
      this.setState({ excelTotals });
      this.setState({ receivedAmount: excelTotals.totalAmount.toFixed(2) });
    };
    reader.readAsArrayBuffer(file);
  };

  calculateExcelTotals = (data) => {
    const totalTransactions = data.length;
    const totalAmount = data.reduce(
      (sum, item) => sum + parseFloat(item[1]),
      0
    );
    return { totalTransactions, totalAmount };
  };

  calculateSearchedTotals = (data) => {
    const totalTransactions = data.length;
    const totalAmount = data
      .filter((item) => item.Status === "Success")
      .reduce((sum, item) => sum + item.amount, 0);
    return { totalTransactions, totalAmount };
  };

  calculateDifferenceAndPercentage = (totalAmount, totalMismatchAmount) => {
    let difference;
    let percentage;
  
    if (totalAmount > totalMismatchAmount) {
      difference = totalAmount - totalMismatchAmount;
      percentage = (difference / totalAmount) * 100;
    } else {
      difference = totalMismatchAmount - totalAmount;
      percentage = (difference / totalAmount) * 100;
    }
  
    return {
      difference: difference.toFixed(2),
      percentage: percentage.toFixed(2),
    };
  };
  
  findMismatches = () => {
    const { excelData, searchedResult } = this.state;
    if (excelData.length > 0 && searchedResult.length > 0) {
      let mismatches = [];
      let totalMismatchAmount = 0; 
  
      const excelTransactionsMap = new Map();
      for (const row of excelData) {
        excelTransactionsMap.set(row.reference_id, {
          amount: parseFloat(row.amount),
          status: row.status,
        });
      }
      const dbTransactionsMap = new Map();
      for (const transaction of searchedResult) {
        dbTransactionsMap.set(transaction.txnid, {
          amount: parseFloat(transaction.amount),
          status: transaction.Status,
        });
      }
  
      for (const [reference_id, excelTransaction] of excelTransactionsMap) {
        const dbTransaction = dbTransactionsMap.get(reference_id);
        if (dbTransaction) {
          if (dbTransaction.status !== excelTransaction.status) {
            mismatches.push({
              reference_id,
              db_status: dbTransaction.status,
              excel_status: excelTransaction.status,
            });
          }
          if (dbTransaction.amount !== excelTransaction.amount) {
            mismatches.push({
              reference_id,
              db_amount: dbTransaction.amount,
              excel_amount: excelTransaction.amount,
            });
            totalMismatchAmount += Math.abs(dbTransaction.amount - excelTransaction.amount);
          }
        } else {
          mismatches.push({
            reference_id,
            amount: excelTransaction.amount,
            status: excelTransaction.status,
          });
          totalMismatchAmount += excelTransaction.amount;
        }
      }
  
      for (const [txnid, dbTransaction] of dbTransactionsMap) {
        if (!excelTransactionsMap.has(txnid)) {
          mismatches.push({
            txnid: txnid,
            amount: dbTransaction.amount,
            status: dbTransaction.status,
          });
          totalMismatchAmount += dbTransaction.amount;
        }
      }
  
      const totalAmount = this.state.totalAmount;
      const { difference, percentage } = this.calculateDifferenceAndPercentage(totalAmount, totalMismatchAmount);
  
      console.log("Mismatches", mismatches);
      console.log("Total Mismatch Amount", totalMismatchAmount); 
      console.log("Difference", difference);
      console.log("Percentage", percentage);
  
      this.setState({ mismatches, mismatchModal: true, difference, percentage });
    }
  };
  

  closeModal = () => {
    this.setState({ mismatchModal: false });
  };

  handleCopyReferenceIds = () => {
    const { mismatches } = this.state;
    const referenceIds = mismatches.map(mismatch => mismatch.reference_id || mismatch.txnid).join(', ');
    
    navigator.clipboard.writeText(referenceIds)
      .then(() => {
        this.setState({
          errorMessage: "Copied!",
          messageType: "success",
        });
  
      })
      .catch(err => {
        this.setState({
          errorMessage: "Error to copied ids!",
          messageType: "fail",
        });
      });
  };

  render() {
    const {
      excelData,
      searchedResult,
      mismatches,
      mismatchModal,
      totalAmount,
      receivedAmount,
      errorMessage,
			messageType,
    } = this.state;
    console.log(mismatches);
    return (
      <>
      {errorMessage && (
						<MessageBox
							message={errorMessage}
							messageType={messageType}
							onClose={() => this.setState({ errorMessage: "" })}
						/>
					)}

        <Header />
        <Sidebar />
        <div
          className={`main-screen ${
            this.state.sidebaropen
              ? "collapsed-main-screen"
              : "expanded-main-screen"
          }  `}
        >
          <div className="main-screen-rows transaction-monitoring-first-row">
            <div className="row-cards search-card">
              {" "}
              <div className="id-search-row">
                <div className="search-select-div">
                  <label
                    className={`id-label ${
                      this.state.paymentgateway ? "filled-id-label" : ""
                    } `}
                    htmlFor="paymentgateway"
                  >
                    Payment Gateway:
                  </label>

                  <select
                    className="id-input"
                    id="paymentgateway"
                    value={this.state.paymentgateway}
                    onChange={this.handleInputChange}
                  >
                    <option value="">Select Payment Gateway</option>
                    {this.state.AQlist.map((paymentgateway) => (
                      <option key={paymentgateway} value={paymentgateway}>
                        {paymentgateway}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="search-select-div">
                  <label
                    className={`date-label ${
                      this.state.fromDate ? "filled-id-label" : ""
                    }`}
                    htmlFor="fromDate"
                  >
                    From:
                  </label>
                  <input
                    className="date-input"
                    type="date"
                    id="fromDate"
                    value={this.state.fromDate || ""}
                    onChange={this.handleInputChange}
                  ></input>
                </div>
                <div className="search-select-div">
                  <label
                    className={`date-label ${
                      this.state.toDate ? "filled-id-label" : ""
                    }`}
                    htmlFor="toDate"
                  >
                    To:
                  </label>
                  <input
                    className="date-input"
                    type="date"
                    id="toDate"
                    value={this.state.toDate || ""}
                    onChange={this.handleInputChange}
                  ></input>
                </div>
                <div className="txn-monitoring-btn-div">
                  <button
                    className="btn-primary"
                    onClick={() => this.handleSearch()}
                  >
                    Compare
                  </button>
                  <button
                    className="btn-secondary btn-suspend"
                    onClick={() => this.handleClear()}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="upload-row">
                <div className="upload-excel">
                  <div className="attachment-div">
                    <Excel className="primary-color-icon" />
                    <label>Upload</label>
                  </div>
                  <div>
                    <input
                      type="file"
                      id="attachment"
                      className="file-input"
                      onChange={this.handleInputChange}
                    />
                    <label
                      htmlFor="attachment"
                      className="file-input-label btn-secondary"
                    >
                      <Folder className="icon2 yellow-icon" />
                    </label>
                    <span className="p2 file-name">{this.state.fileName}</span>
                  </div>
                </div>
                <div
                  className="p1"
                  style={{ cursor: "pointer" }}
                  onClick={this.findMismatches}
                >
                  Find Mismatches?
                </div>
              </div>
            </div>
          </div>

          <div className="main-screen-rows compare-report-second-row">
            {excelData.length > 1 && (
              <div className="row-cards report-preview">
                <div className="preview-table">
                  <table>
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        {excelData[0].map((cell, index) => (
                          <th key={index}>{cell}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {excelData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>{rowIndex + 1}</td>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="preview-totals">
                  <div>
                    <p>Count</p>
                    <p>{this.state.excelTotals.totalTransactions}</p>
                  </div>
                  <div>
                    <p>Sum</p>
                    <p>{this.state.excelTotals.totalAmount}</p>
                  </div>
                </div>
              </div>
            )}
            {searchedResult.length > 1 && (
              <div className="row-cards report-preview">
                <div className="preview-table">
                  <table>
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchedResult.map((transaction, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{transaction.txnid}</td>
                          <td>{transaction.amount}</td>
                          <td>{transaction.Status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="preview-totals">
                  <div>
                    <p>Count</p>
                    <p>{this.state.searchedTotals.totalTransactions}</p>
                  </div>
                  <div>
                    <p>Sum</p>
                    <p>{this.state.searchedTotals.totalAmount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {mismatchModal && (
            <div className="modal">
              <div className="row-cards trans-settle-view">
                <h4>Transaction</h4>
                <div className="compare-line "></div>

                <div className="header-container">
                  <div className="left-div">
                    <span>Date: </span>
                    <span>Total Amount: {totalAmount} /- </span>
                    <span>Received Amount: {receivedAmount}/- </span>
                  </div>
                  <div className="right-div">
                    <h4>Prefectly matched 100%</h4>
                  </div>
                </div>

                <div className="txn-search-table-Body">
                  <div className="compare-table">
                    <table>
                      <thead>
                        <tr>
                          <th>S.NO.</th>
                          <th>Reference Id</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mismatches.slice(1).map(
                          (
                            mismatch,
                            index 
                          ) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{mismatch.reference_id || mismatch.txnid}</td>
                              <td>
                                {mismatch.db_amount ||
                                  mismatch.excel_amount ||
                                  mismatch.amount}
                              </td>
                              <td>
                                {mismatch.db_status ||
                                  mismatch.excel_status ||
                                  mismatch.status}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="header-container">
                  <div className="imprt-exprt-div">
                    <p>Export: </p>
                    <div>
                      <Import className="primary-color-icon" />
                    </div>
                    /
                    <div>
                      <Export className="primary-color-icon" />
                    </div>
                  </div>
                  <p className="p3" onClick={this.handleCopyReferenceIds}>Copy</p>
                </div>
                <div className="compare-line "></div>
                <div className="header-container">
                  <p className="p4">help?</p>
                  <div className="settle-btns">
                    <button className="btn-secondary" onClick={this.closeModal}>
                      Cancel
                    </button>
                    <button className="btn-primary">Settle Now</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default Compare;
