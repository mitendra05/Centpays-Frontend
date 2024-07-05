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

      const totalAmount = data.reduce(
        (sum, item) => sum + parseFloat(item.amount),
        0
      );
      const countOfAmounts = data.length;

      console.log(countOfAmounts);
      this.setState(
        {
          searchedResult: data,
          countOfAmounts,
          totalAmount: totalAmount.toFixed(2),
          errorMessage: null,
          messageType: null,
        },
        () => {
          // After setting state, call findMismatches
          this.findMismatches();
        }
      );
    } catch (error) {
      console.error("Error fetching or processing data:", error);
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "fail",
      });
    }
  };

  handleSettleData = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token, mismatches } = this.state;

    try {
      // Extract txnids from mismatches and join them into a single string
      const settleData = mismatches
        .map((mismatch) => mismatch.reference_id || mismatch.txnid)
        .join(" ");

      // Log the settle data for debugging
      console.log("Settle data to send:", settleData);

      const payload = {
        txnids: settleData,
      };

      // Log the payload to check its structure
      console.log("Payload to send:", JSON.stringify(payload));

      const response = await fetch(`${backendURL}/settledbybank`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from backend:", errorText);
        throw new Error("Error settling data. Please try again later.");
      }

      const responseData = await response.json();
      console.log("Settled data response:", responseData);

      this.setState({
        errorMessage: "Data sent successfully!",
        messageType: "success",
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
      const excelTotals = this.calculateExcelTotals(filteredData);
      this.setState({ excelTotals });
      this.setState({ receivedAmount: excelTotals.totalAmount.toFixed(2) });
    };
    reader.readAsArrayBuffer(file);
  };

  calculateExcelTotals = (data) => {
    const totalTransactions = data.length;

    const totalAmount = data.reduce((sum, item, index) => {
      // Skip header row (index 0)
      if (index === 0) return sum;
      return sum + parseFloat(item[1]);
    }, 0);

    const successfulAmount = data
      .filter((item, index) => index > 0 && item[2] === "Success")
      .reduce((sum, item) => sum + parseFloat(item[1]), 0);

    return { totalTransactions, totalAmount, successfulAmount };
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
    console.log("excel", excelData);

    if (excelData.length === 0 || searchedResult.length === 0) {
      return; // No data to compare
    }

    const matchData = [];
    const mismatchedData = [];

    // Convert searchedResult into a Map for easier lookup
    const searchedMap = new Map();
    searchedResult.forEach((transaction) => {
      searchedMap.set(transaction.txnid, {
        amount: parseFloat(transaction.amount),
        status: transaction.Status === "Success" ? "Success" : "Failed",
      });
    });

    excelData.forEach((excelTransaction) => {
      const reference_id =
        excelTransaction.reference_id || excelTransaction.txnid;
        const excelAmount = parseFloat(excelTransaction.amount);
        const excelStatus =
        excelTransaction.status === "Success" ? "Success" : "Failed";

      if (searchedMap.has(reference_id)) {
        const searchedTransaction = searchedMap.get(reference_id);
        const searchedAmount = searchedTransaction.amount;
        const searchedStatus = searchedTransaction.status;

        if (excelAmount === searchedAmount && excelStatus === searchedStatus) {
          matchData.push({
            ID: {
              reference_id: reference_id,
              txnId: reference_id, 
            },
            Amount: {
              "amount of excel": excelAmount,
              "amount of search data": searchedAmount,
            },
            Status: {
              "status of excel": excelStatus,
              "status of searched data": searchedStatus,
            },
          });
        } else {
          // Found a mismatch
          mismatchedData.push({
            ID: {
              reference_id: reference_id,
              txnId: reference_id, 
            },
            Amount: {
              "amount of excel": excelAmount,
              "amount of search data": searchedAmount,
            },
            Status: {
              "status of excel": excelStatus,
              "status of searched data": searchedStatus,
            },
          });
        }

        // Remove from searchedMap to mark as processed
        searchedMap.delete(reference_id);
      } else {
        // No matching txnId found in searched data
        mismatchedData.push({
          ID: {
            reference_id: reference_id,
            txnId: reference_id,
          },
          Amount: {
            "amount of excel": excelAmount,
            "amount of search data": 0, // Assuming 0 for amount not found
          },
          Status: {
            "status of excel": excelStatus,
            "status of searched data": "Not Found",
          },
        });
      }
    });

    // Any remaining items in searchedMap are not found in excelData
    searchedMap.forEach((searchedTransaction, txnid) => {
      mismatchedData.push({
        ID: {
          ReferenceID: txnid,
          txnId: txnid,
        },
        Amount: {
          "amount of excel": 0, // Assuming 0 for amount not found
          "amount of search data": searchedTransaction.amount,
        },
        Status: {
          "status of excel": "Not Found",
          "status of searched data": searchedTransaction.status,
        },
      });
    });
    console.log("sadsf",matchData);
    console.log("mismatch",mismatchedData);
    // Set state with matchData and mismatchedData
    this.setState({
      matchData,
      mismatchedData,
      matchModal: true, // Optionally show modal or handle these data accordingly
      mismatchModal: true,
    });
  };

  closeModal = () => {
    this.setState({ mismatchModal: false });
  };

  handleCopyReferenceIds = () => {
    const { mismatches } = this.state;
    const referenceIds = mismatches
      .map((mismatch) => mismatch.reference_id || mismatch.txnid)
      .join("");

    navigator.clipboard
      .writeText(referenceIds)
      .then(() => {
        this.setState({
          errorMessage: "Copied!",
          messageType: "success",
        });
      })
      .catch((err) => {
        this.setState({
          errorMessage: "Error to copied ids!",
          messageType: "fail",
        });
      });
  };

  handleExcelReferenceIds = () => {
    const { mismatches } = this.state;

    const exportData = mismatches.map((mismatch, index) => ({
      "S.NO.": index + 1,
      "Reference Id": mismatch.reference_id || mismatch.txnid,
      Amount: mismatch.db_amount || mismatch.excel_amount || mismatch.amount,
      Status: mismatch.db_status || mismatch.excel_status || mismatch.status,
    }));

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mismatch Data");
    XLSX.writeFile(workbook, "Mismatch_Data.xlsx");
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
                    <h4 style={{ color: this.state.color }}>
                      {this.state.message}{" "}
                      {/* {this.state.percentageDifference.toFixed(2)}% */}
                    </h4>
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
                        {this.state.mismatchedData.map((mismatch, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {mismatch.ID.ReferenceID || mismatch.ID.txnId}
                            </td>
                            <td>
                              {mismatch.Amount["amount of excel"] ||
                                mismatch.Amount["amount of search data"] ||
                                0}
                            </td>
                            <td>
                              {mismatch.Status["status of excel"] ||
                                mismatch.Status["status of searched data"] ||
                                "Not Found"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="header-container">
                  <div className="imprt-exprt-div">
                    <p>Export: </p>
                    <div onClick={this.handleExcelReferenceIds}>
                      <Import className="primary-color-icon" />
                    </div>
                    /
                    <div onClick={this.handleExcelReferenceIds}>
                      <Export className="primary-color-icon" />
                    </div>
                  </div>

                  <p className="p3" onClick={this.handleCopyReferenceIds}>
                    Copy
                  </p>
                </div>
                <div className="compare-line "></div>
                <div className="header-container">
                  <p className="p4">help?</p>
                  <div className="settle-btns">
                    <button className="btn-secondary" onClick={this.closeModal}>
                      Cancel
                    </button>
                    <button
                      className="btn-primary"
                      onClick={this.handleSettleData}
                    >
                      Settle Now
                    </button>
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
