import React, { Component } from "react";
import * as XLSX from "xlsx";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MessageBox from "../components/Message_box";
import Modal from "../components/Modal";

import { Folder, Excel, Import, Export, Bin } from "../../media/icon/SVGicons";

class BankSettlement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      token: this.getCookie("token"),
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
      nodataFound: false,
	  hasSettled: false,
    };
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

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
    const { id, files } = event.target;

    if (id === "attachment" && files.length > 0) {
      this.setState({ fileName: files[0].name, attachment: files[0] });
      this.readExcel(files[0]);

      // Clear the file input to allow re-upload of the same file
      event.target.value = null;
    } else {
      this.setState({ [id]: event.target.value });
    }
  };

  handleRemoveFile = () => {
    this.setState({
      fileName: "No File Chosen",
      attachment: null,
      excelData: [],
    });

    // Manually reset the file input value
    document.getElementById("attachment").value = "";
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
      this.setState({
        searchedResult: data,
        countOfAmounts,
        totalAmount: totalAmount.toFixed(2),
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

  handleSettleData = async () => {
	if (this.state.hasSettled) {
		return; // Prevent further executions
	  }
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token, matchedData } = this.state;

    try {
      const settleData = matchedData.map((data) => data.reference_id).join(" ");
      console.log("Settle Data (transaction IDs):", settleData);

      const payload = {
        txnids: settleData,
      };

      const response = await fetch(`${backendURL}/settledbybank`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

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
		hasSettled: true,
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
      excelData: [],
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

      this.setState({ excelData: filteredData }, () => {
        console.log("Excel Data:", this.state.excelData);
      });

      const excelTotals = this.calculateExcelTotals(filteredData);
      this.setState({ excelTotals }, () => {
        console.log("Excel Totals:", this.state.excelTotals);
      });

      this.setState(
        { receivedAmount: excelTotals.totalAmount.toFixed(2) },
        () => {
          console.log("Received Amount:", this.state.receivedAmount);
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  calculateExcelTotals = (filteredData) => {
    let totalTransactions = 0;
    let totalAmount = 0;

    filteredData.slice(1).forEach((row) => {
      const amount = parseFloat(row[1]);
      if (!isNaN(amount)) {
        totalTransactions += 1;
        totalAmount += amount;
      }
    });

    return {
      totalTransactions,
      totalAmount,
    };
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

    if (excelData.length === 0 || searchedResult.length === 0) {
      return;
    }

    let totalSearchDataCount = searchedResult.length;
    let matchDataCount = 0;

    const matchedData = [];
    const unmatchedExcelData = [];
    const unmatchedSelectedData = [];

    const searchedMap = {};
    searchedResult.forEach((transaction) => {
      searchedMap[transaction.txnid] = {
        amount: parseFloat(transaction.amount),
        status: transaction.Status === "Success" ? "Success" : "Failed",
      };
    });

    excelData.slice(1).forEach((excelTransaction) => {
      const [reference_id, excelAmountStr, excelStatusRaw] = excelTransaction;
      const excelAmount = parseFloat(excelAmountStr);
      const excelStatus = excelStatusRaw === "Success" ? "Success" : "Failed";

      if (searchedMap[reference_id]) {
        const searchedTransaction = searchedMap[reference_id];
        const searchedAmount = searchedTransaction.amount;
        const searchedStatus = searchedTransaction.status;

        if (excelAmount === searchedAmount && excelStatus === searchedStatus) {
          matchedData.push({
            reference_id,
            amount: excelAmount,
            status: excelStatus,
          });
          matchDataCount++;
        } else {
          unmatchedExcelData.push({
            reference_id,
            amount: excelAmount,
            status: excelStatus,
          });
          unmatchedSelectedData.push({
            reference_id,
            amount: searchedAmount,
            status: searchedStatus,
          });
        }
        delete searchedMap[reference_id];
      } else {
        unmatchedExcelData.push({
          reference_id,
          amount: excelAmount,
          status: excelStatus,
        });
      }
    });

    Object.keys(searchedMap).forEach((reference_id) => {
      const searchedTransaction = searchedMap[reference_id];
      unmatchedSelectedData.push({
        reference_id,
        amount: searchedTransaction.amount,
        status: searchedTransaction.status,
      });
    });

    let matchPercentage = (matchDataCount / totalSearchDataCount) * 100;
    matchPercentage = matchPercentage.toFixed(2);

    let color;
    let message;
    if (matchPercentage >= 0 && matchPercentage <= 40) {
      color = "var(--red-color)";
      message = "Low match";
    } else if (matchPercentage >= 41 && matchPercentage <= 60) {
      color = "var(--orange-color)";
      message = "Moderate match";
    } else if (matchPercentage >= 61 && matchPercentage <= 80) {
      color = "var(--blue-color)";
      message = "Good match";
    } else if (matchPercentage >= 81 && matchPercentage <= 99) {
      color = "var(--primary-dark)";
      message = "High match ";
    } else if (matchPercentage === "100.00") {
      color = "var(--green-color)";
      message = "Perfect match";
    }

    this.setState({
      matchedData,
      unmatchedExcelData,
      unmatchedSelectedData,
      matchDataCount,
      totalSearchDataCount,
      matchPercentage,
      color,
      message,
      mismatchModal: true,
    });
  };

  closeModal = () => {
    this.setState({ mismatchModal: false });
  };

  handleCopyReferenceIds = () => {
    const { unmatchedExcelData, unmatchedSelectedData } = this.state;

    const excelReferenceIds = unmatchedExcelData
      .map((data) => data.reference_id)
      .join("\n");
    const selectedReferenceIds = unmatchedSelectedData
      .map((data) => data.reference_id)
      .join("\n");
    const allReferenceIds = `${excelReferenceIds}\n${selectedReferenceIds}`;

    navigator.clipboard
      .writeText(allReferenceIds)
      .then(() => {
        this.setState({
          errorMessage: "Copied!",
          messageType: "success",
        });
      })
      .catch((err) => {
        console.error("Error copying IDs:", err);
        this.setState({
          errorMessage: "Error copying IDs!",
          messageType: "fail",
        });
      });
  };

  handleExcelReferenceIds = () => {
    const { unmatchedExcelData, unmatchedSelectedData } = this.state;

    const exportData = [
      ...unmatchedExcelData.map((data, index) => ({
        "S.NO.": index + 1,
        "Reference Id": data.reference_id,
        Amount: data.amount,
        Status: data.status,
      })),
      ...unmatchedSelectedData.map((data, index) => ({
        "S.NO.": unmatchedExcelData.length + index + 1,
        "Reference Id": data.reference_id,
        Amount: data.amount,
        Status: data.status,
      })),
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Mismatch Data");

    XLSX.writeFile(workbook, "Mismatch_Data.xlsx");
  };

  formatDate(dateTimeString) {
    if (!dateTimeString) return "";
    const [datePart, timePart] = dateTimeString.split("T");
    return `${datePart} ${timePart}`;
  }

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
                    type="datetime-local"
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
                    type="datetime-local"
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
                    {this.state.fileName !== "No File Chosen" && (
                      <span
                        className="remove-file"
                        onClick={this.handleRemoveFile}
                      >
                        <Bin className="grey-icon"></Bin>
                      </span>
                    )}
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
                <div className="head">
                  <h4>Preview Data</h4>
                </div>
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
                    <p>Count:</p>
                    <p className="p2">{this.state.countOfAmounts}</p>
                  </div>
                  <div>
                    <p>Sum:</p>
                    <p className="p2">{this.state.totalAmount}</p>
                  </div>
                </div>
              </div>
            )}
            {excelData.length > 1 && (
              <div className="row-cards report-preview">
                <div className="head">
                  <h4>Excel Data</h4>
                </div>
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
                    <p>Count:</p>
                    <p className="p2">
                      {this.state.excelTotals.totalTransactions}
                    </p>
                  </div>
                  <div>
                    <p>Sum:</p>
                    <p className="p2">{this.state.receivedAmount}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {mismatchModal && (
             <Modal
             onClose={() => this.closeModal("close")}
             onDecline={() => this.closeModal("decline")}
             onAccept={() => this.handleSettleData()}
             showDeclinebtn={"Cancel"}
			 acceptbtnname={this.state.hasSettled ? "Settled" : "Settle Now"}
             showFotter={true}
             modalHeading={"Transaction 📝"}
             enableDragging={true}
             modalBody={
              <>
              <div className="header-container">
                <div className="left-div">
                  <span className="date-section">
                    <span>
                      From:{" "}
                      <p className="p2">
                        {this.formatDate(this.state.fromDate)}
                      </p>
                    </span>
                    <span>
                      To:{" "}
                      <p className="p2">
                        {this.formatDate(this.state.toDate)}
                      </p>
                    </span>
                  </span>
                  <span>Total Amount: {totalAmount} /- </span>
                  <span>Received Amount: {receivedAmount}/- </span>
                </div>
                <div className="right-div">
                  <h4 style={{ color: this.state.color }}>
                    {this.state.message} {this.state.matchPercentage}%
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
                      {this.state.unmatchedExcelData.length > 0 ||
                      this.state.unmatchedSelectedData.length > 0 ? (
                        <>
                          {this.state.unmatchedExcelData.map(
                            (data, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{data.reference_id}</td>
                                <td>{data.amount}</td>
                                <td>{data.status}</td>
                              </tr>
                            )
                          )}

                          {this.state.unmatchedSelectedData.map(
                            (data, index) => (
                              <tr
                                key={
                                  index + this.state.unmatchedExcelData.length
                                }
                              >
                                <td>
                                  {this.state.unmatchedExcelData.length +
                                    index +
                                    1}
                                </td>
                                <td>{data.reference_id}</td>
                                <td>{data.amount}</td>
                                <td>{data.status}</td>
                              </tr>
                            )
                          )}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={4}>
                            <div>
                              <div className="search-result-head">
                                <div>
                                  <h4>Whoops!</h4>
                                </div>
                                <p className="p2">No Transaction Found....</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
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
              <div className="help-div">
                <p className="p4">help?</p>
              </div>
            </>
             }
           />
          )}
        </div>
      </>
    );
  }
}

export default BankSettlement;
