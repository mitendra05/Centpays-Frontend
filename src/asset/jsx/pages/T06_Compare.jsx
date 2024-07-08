import React, { Component } from "react";
import * as XLSX from "xlsx";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Modal from "../components/Modal";

import { Folder, Excel } from "../../media/icon/SVGicons";

class Compare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      token: this.getCookie('token'),
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
      idsInExcelNotInSearched: [],
      idsInSearchedNotInExcel: [],
      mismatchedDetails: [],
      isMismatchesModal: false,
      overallTab: true,
      bankmissingTab: false,
      centpaysmissingTab: false,
      detailsmismatchTab: false,
    };
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  componentDidMount() {
    const token = this.getCookie('token');
		if (!token) {
			window.location.href = '/';
			return;
		}
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
    const { token } = this.state;
    const searchedData = {
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      paymentgateway: this.state.paymentgateway,
    };
    try {
      const response = await fetch(`http://localhost:3000/comparereport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(searchedData),
      });
      if (response.ok) {
        const data = await response.json();
        this.setState({ searchedResult: data });
        const result = this.calculateSearchedTotals(data);
        this.setState({ searchedTotals: result });
        console.log(data);
      } else {
        this.setState({
          errorMessage: "Error searching. Please try again later.",
          messageType: "fail",
        });
      }
    } catch (error) {
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

  handleMismatchesModalToggle = () => {
    this.setState({ isMismatchesModal: !this.state.isMismatchesModal });
  };

  handleTabchanges = (tab) => {
    this.setState({
      overallTab: tab === "Overall",
      bankmissingTab: tab === "Missing in Bank",
      centpaysmissingTab: tab === "Missing in Centpays",
      detailsmismatchTab: tab === "Mismatched Details",
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
      const filteredData = json.map((row) =>
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
      console.log(filteredData);
      const result = this.calculateExcelTotals(filteredData);
      this.setState({ excelTotals: result });
    };
    reader.readAsArrayBuffer(file);
  };

  calculateExcelTotals = (data) => {
    const totalTransactions = data.length;
    const totalAmount = data
      .filter((item) => item[2] === "Success")
      .reduce((sum, item) => sum + item[1], 0);
    return { totalTransactions, totalAmount };
  };

  calculateSearchedTotals = (data) => {
    const totalTransactions = data.length;
    const totalAmount = data
      .filter((item) => item.Status === "Success")
      .reduce((sum, item) => sum + item.amount, 0);
    return { totalTransactions, totalAmount };
  };

  findMismatches = () => {
    const { excelData, searchedResult } = this.state;
    if (excelData.length > 0 && searchedResult.length > 0) {
      this.handleMismatchesModalToggle();
      const excelDict = {};
      excelData.slice(1).forEach((row) => {
        excelDict[row[0]] = { amount: row[1], status: row[2] };
      });

      // Convert searchedResult to a dictionary for easy lookup
      const searchedDict = {};
      searchedResult.forEach((item) => {
        searchedDict[item.txnid] = { amount: item.amount, status: item.Status };
      });

      // Initialize results
      const idsInExcelNotInSearched = [];
      const idsInSearchedNotInExcel = [];
      const mismatchedDetails = [];

      // Find ids present in excelData but not in searchedResult
      for (const ref_id in excelDict) {
        if (!searchedDict.hasOwnProperty(ref_id)) {
          idsInExcelNotInSearched.push(ref_id);
        }
      }

      // Find ids present in searchedResult but not in excelData
      for (const txnid in searchedDict) {
        if (!excelDict.hasOwnProperty(txnid)) {
          idsInSearchedNotInExcel.push(txnid);
        }
      }

      // Find ids that are present in both but with mismatched amount or status
      for (const ref_id in excelDict) {
        if (searchedDict.hasOwnProperty(ref_id)) {
          const excelEntry = excelDict[ref_id];
          const searchedEntry = searchedDict[ref_id];
          if (
            excelEntry.amount !== searchedEntry.amount ||
            excelEntry.status !== searchedEntry.status
          ) {
            mismatchedDetails.push({
              id: ref_id,
              excel_amount: excelEntry.amount,
              excel_status: excelEntry.status,
              searched_amount: searchedEntry.amount,
              searched_status: searchedEntry.status,
            });
          }
        }
      }

      // Set the results in the state
      this.setState({
        idsInExcelNotInSearched,
        idsInSearchedNotInExcel,
        mismatchedDetails,
      });
    } else {
      console.log("Data incomplete for mismatching");
    }
  };

  render() {
    const {
      excelData,
      searchedResult,
      idsInExcelNotInSearched,
      idsInSearchedNotInExcel,
      mismatchedDetails,
      isMismatchesModal,
    } = this.state;
    console.log(
      idsInExcelNotInSearched,
      idsInSearchedNotInExcel,
      mismatchedDetails
    );
    return (
      <>
        {isMismatchesModal && (
          <Modal
            onClose={() => this.handleMismatchesModalToggle()}
            onDecline={() => this.handleMismatchesModalToggle()}
            onAccept={() => this.handleMismatchesModalToggle()}
            showDeclinebtn={false}
            acceptbtnname={"Ok"}
            showFotter={true}
            modalHeading={"Find Mismatches ⁉️"}
            modalBody={
              <>
                <div className="show-mismatches">
                  <div className="mismatches-head">
                    <p
                      className={`${
                        this.state.overallTab ? "selected-tab" : ""
                      } `}
                      onClick={() => this.handleTabchanges("Overall")}
                    >
                      Overall
                    </p>
                    <p
                      className={`${
                        this.state.bankmissingTab ? "selected-tab" : ""
                      } `}
                      onClick={() => this.handleTabchanges("Missing in Bank")}
                    >
                      Missing in Bank
                    </p>
                    <p
                      className={`${
                        this.state.centpaysmissingTab ? "selected-tab" : ""
                      } `}
                      onClick={() =>
                        this.handleTabchanges("Missing in Centpays")
                      }
                    >
                      Missing in Centpays
                    </p>
                    <p
                      className={`${
                        this.state.detailsmismatchTab ? "selected-tab" : ""
                      } `}
                      onClick={() =>
                        this.handleTabchanges("Mismatched Details")
                      }
                    >
                      Mismatched Details
                    </p>
                  </div>
                  <div className="mismatches-body">
                    {this.state.overallTab && (
                      <div>
                        <div className="mismatches-body-section">
                          <p className="p2">Bank</p>
                          <ul>
                            <li className="mismatch-details-row">
                              <p>No. of Transactions</p>
                              <p>{this.state.excelTotals.totalTransactions}</p>
                            </li>
                            <li className="mismatch-details-row">
                              <p>Approved Volume</p>
                              <p>{this.state.excelTotals.totalAmount}</p>
                            </li>
                          </ul>
                        </div>
                        <div className="create-settelments-horizontal-line"></div>
                        <div className="mismatches-body-section">
                          <p className="p2">Centpays</p>
                          <ul>
                            <li className="mismatch-details-row">
                              <p>No. of Transactions</p>
                              <p>
                                {this.state.searchedTotals.totalTransactions}
                              </p>
                            </li>
                            <li className="mismatch-details-row">
                              <p>Approved Volume</p>
                              <p>{this.state.searchedTotals.totalAmount}</p>
                            </li>
                          </ul>
                        </div>
                        <div className="create-settelments-horizontal-line"></div>
                        <div className="mismatches-body-section">
                          <ul>
                            <li className="mismatch-details-row">
                              <p>Ids mismatched from Bank</p>
                              <p>{idsInExcelNotInSearched.length}</p>
                            </li>
                            <li className="mismatch-details-row">
                              <p>Ids mismatched from Centpays</p>
                              <p>{idsInSearchedNotInExcel.length}</p>
                            </li>
                            <li className="mismatch-details-row">
                              <p>Ids with mismatched Details</p>
                              <p>{mismatchedDetails.length}</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            }
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
          </div>
        </div>
      </>
    );
  }
}

export default Compare;
