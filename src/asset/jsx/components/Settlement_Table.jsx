import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

// component
import Modal from "./Modal";
import MessageBox from "./Message_box";
import ScrollTopAndBottomButton from "./ScrollUpAndDown";
import searchImg from "../../media/image/search-transaction.png";
import Loader from "./Loder";
//SVG icons
import {
  Excel,
  RateIcon,
  RightSign,
  LeftSign,
  More,
  CheckMark,
  MailStatus,
  PlusSymbol,
  Oops,
  LeftDoubleArrow,
  RightDoubleArrow,
} from "../../media/icon/SVGicons";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.getCookie("token"),
      userRole: this.getCookie("role"),
      isRatesModal: false,
      ratesdata: [],
      isEditStatusModal: false,
      isGenerateExcelModal: false,
      idforEdit: "",
      statusforEdit: "",
      searchText: "",
      highlightedOptions: [],
      noResultsFound: false,
      errorMessage: "",
      messageType: "",
      fromDate: "",
      toDate: "",
      rows: 10,
      currentPage: 1,
      totalDataCount: this.props.apiData.length,
    };
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  handleRowsChange = (event) => {
    this.setState({
      rows: parseInt(event.target.value),
      currentPage: 1,
    });
  };

  handlePageChange = (direction) => {
    this.setState((prevState) => {
      const { currentPage } = prevState;
      const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
      return { currentPage: newPage };
    });
  };

  handleRatesModalToggle = (action) => {
    this.setState({
      isRatesModal: action === "open" ? true : false,
      ratesdata: [],
    });
  };

  handleRatesModal = async (company_name) => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    this.handleRatesModalToggle("open");

    const { token } = this.state;
    try {
      const response = await fetch(
        `${backendURL}/ratetables?company_name=${company_name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (!result || Object.keys(result).length === 0) {
        this.setState({
          errorMessage: "Rates not found for the company",
          messageType: "fail",
        });
      } else {
        this.setState({ ratesdata: result });
      }
    } catch (error) {
      this.setState({ errorMessage: "Error fetching rates data:", error });
    }
  };

  handleEditStatusModalToggle = (action) => {
    this.setState((prevState) => ({
      isEditStatusModal: action === "open" ? true : false,
    }));
  };

  handleEditStatus = (item) => {
    this.setState({ isEditStatusModal: true });
    this.setState({ idforEdit: item._id });
    this.setState({ statusforEdit: item.status });
  };

  EditStatus = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token } = this.state;
    console.log(this.state.idforEdit, this.state.statusforEdit);
    try {
      const response = await fetch(`${backendURL}/updatesettlements`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: this.state.idforEdit,
          status: this.state.statusforEdit,
        }),
      });

      const result = await response.json();
      this.setState({
        errorMessage: "Status update successfully",
        messageType: "success",
      });
      this.setState({ isEditStatusModal: false });
      this.props.showSettlementRecord(this.props.company_name);
    } catch (error) {
      this.setState({ errorMessage: "Error updating status data:", error });
    }
  };
  getStatusImage(status) {
    switch (status) {
      case "Success":
        return (
          <div className="creditcard-div status-success">
            <CheckMark className="creditcard-img green-icon" />
          </div>
        );
      case "Pending":
        return (
          <div className="creditcard-div status-pending">
            <MailStatus className="creditcard-img primary-color-icon" />
          </div>
        );
      default:
        return "";
    }
  }

  getStatusText(status) {
    switch (status) {
      case "Active":
        return (
          <div className="status-div success-status">
            <p>Active</p>
          </div>
        );
      case "Inactive":
        return (
          <div className="status-div failed-status">
            <p>Inactive</p>
          </div>
        );
      case "Pending":
        return (
          <div className="status-div pending-status">
            <p>Pending</p>
          </div>
        );
      default:
        return "";
    }
  }

  handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    const { apiData, headerLabels } = this.props;
    const filteredOptions = apiData.filter((row) =>
      headerLabels.some((label) =>
        String(row[label.label]).toLowerCase().includes(searchText)
      )
    );
    this.setState({
      searchText,
      highlightedOptions: filteredOptions,
      noResultsFound: filteredOptions.length === 0,
      currentPage: 1,
    });
  };

  handleExcelModalToggle = () => {
    this.setState({ isGenerateExcelModal: !this.state.isGenerateExcelModal });
  };

  handleGenerateExcel = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { fromDate, toDate } = this.state;
    const { company_name } = this.props;
    const { token } = this.state;
    try {
      const response = await fetch(`${backendURL}/dailySettlement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromDate,
          toDate,
          company_name,
        }),
      });
      const excelData = await response.json();
      this.setState({ errorMessage: excelData.error });
      this.jsonToExcel(excelData, company_name);
      this.setState({ fromDate: "", toDate: "", isGenerateExcelModal: false });
    } catch (error) {
      this.setState({
        errorMessage: "Error updating status data:",
        messageType: "fail",
      });
    }
  };

  jsonToExcel = (data, fileName) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  render() {
    const { headerLabels, showRates, showReport, company_name, loading } =
      this.props;
    const {
      isRatesModal,
      ratesdata,
      isEditStatusModal,
      isGenerateExcelModal,
      errorMessage,
      searchText,
      highlightedOptions,
      noResultsFound,
      rows,
      currentPage,
      messageType,
      userRole,
    } = this.state;
    const dataToRender =
      highlightedOptions.length > 0 ? highlightedOptions : this.props.apiData;
    const startIdx = (currentPage - 1) * rows;
    const endIdx = startIdx + rows;
    const paginatedData = dataToRender.slice(startIdx, endIdx);
    const totalPages = Math.ceil(dataToRender.length / rows);

    if (userRole === "admin" || userRole === "employee") {
      return (
        <>
          {errorMessage && (
            <MessageBox
              message={errorMessage}
              messageType={messageType}
              onClose={() => this.setState({ errorMessage: "" })}
            />
          )}
          {isRatesModal && (
            <Modal
              onClose={() => this.handleRatesModalToggle("close")}
              onDecline={() => this.handleRatesModalToggle("decline")}
              onAccept={() => this.handleRatesModalToggle("accept")}
              showDeclinebtn={false}
              acceptbtnname={"OK"}
              showFotter={true}
              stopScroll={true}
              modalHeading={"Rates 🪙"}
              modalBody={
                <div>
                  <div className="rates-row">
                    <p>MDR</p>
                    <p className="p2">
                      {ratesdata.MDR !== undefined
                        ? ratesdata.MDR + " %"
                        : "No Rates"}
                    </p>
                  </div>
                  <div className="rates-row">
                    <p>Approval Rate</p>
                    <p className="p2">
                      {" "}
                      {ratesdata.txn_app !== undefined
                        ? ratesdata.txn_app + " " + ratesdata.currency
                        : "No Rates"}
                    </p>
                  </div>
                  <div className="rates-row">
                    <p>Decline Rate</p>
                    <p className="p2">
                      {" "}
                      {ratesdata.txn_dec !== undefined
                        ? ratesdata.txn_dec + " " + ratesdata.currency
                        : "No Rates"}
                    </p>
                  </div>
                  <div className="rates-row">
                    <p>Rolling Reserve</p>
                    <p className="p2">
                      {" "}
                      {ratesdata.RR !== undefined
                        ? ratesdata.RR + " %"
                        : "No Rates"}
                    </p>
                  </div>
                  <div className="rates-row">
                    <p>Refund Fees</p>
                    <p className="p2">
                      {" "}
                      {ratesdata.refund_fee !== undefined
                        ? ratesdata.refund_fee + " " + ratesdata.currency
                        : "No Rates"}
                    </p>
                  </div>
                  <div className="rates-row">
                    <p>Chargeback Fees</p>
                    <p className="p2">
                      {ratesdata.chargeback_fee !== undefined
                        ? ratesdata.chargeback_fee + " " + ratesdata.currency
                        : "No Rates"}
                    </p>
                  </div>
                </div>
              }
            />
          )}
          {/* Edit Status Moda; */}
          {isEditStatusModal && (
            <Modal
              onClose={() => this.handleEditStatusModalToggle("close")}
              onDecline={() => this.handleEditStatusModalToggle("decline")}
              onAccept={() => this.EditStatus()}
              showDeclinebtn={false}
              acceptbtnname={"Update"}
              showFotter={true}
              stopScroll={true}
              modalHeading={"Edit Status 📝"}
              modalBody={
                <div className="edit-status">
                  <label for="status">Status</label>
                  {showReport && (
                    <select
                      className="inputFeild select-input"
                      value={this.state.statusforEdit}
                      onChange={(e) =>
                        this.setState({ statusforEdit: e.target.value })
                      }
                    >
                      <option value="Success">Success</option>
                      <option value="Pending">Pending</option>
                    </select>
                  )}
                </div>
              }
            />
          )}
          {isGenerateExcelModal && (
            <Modal
              onClose={() => this.handleExcelModalToggle()}
              onDecline={() => this.handleExcelModalToggle()}
              onAccept={() => this.handleGenerateExcel()}
              showDeclinebtn={false}
              acceptbtnname={"Generate"}
              showFotter={true}
              modalHeading={"Generate Excel 📝"}
              modalBody={
                <div>
                  <div className="edit-status">
                    <label for="fromDate">From</label>

                    <input
                      type="date"
                      className="inputFeild "
                      value={this.state.fromDate}
                      onChange={(e) =>
                        this.setState({ fromDate: e.target.value })
                      }
                    ></input>
                  </div>

                  <div className="edit-status">
                    <label for="toDate">To</label>
                    <input
                      type="date"
                      className="inputFeild"
                      value={this.state.toDate}
                      onChange={(e) =>
                        this.setState({ toDate: e.target.value })
                      }
                    ></input>
                  </div>
                </div>
              }
            />
          )}
          <div className="Table-container">
            <div className="table-Header">
              {showRates && (
                <Link to={`/createsettlement`}>
                  <button className="btn-primary">
                    <PlusSymbol className="white-icon" /> Create Invoice
                  </button>
                </Link>
              )}
              {showReport && (
                <div className="table-header-buttons">
                  <Link to={`/createsettlement?company_name=${company_name}`}>
                    <button className="btn-primary">
                      <PlusSymbol className="white-icon" /> Create Invoice
                    </button>
                  </Link>
                  <button
                    className="btn-primary"
                    onClick={() => this.handleExcelModalToggle()}
                  >
                    <Excel className="white-icon" />
                    Generate Excel
                  </button>
                </div>
              )}
              <input
                className="inputFeild search-input"
                type="text"
                placeholder="Search"
                onChange={this.handleSearch}
                value={searchText}
              />
            </div>

            <div className="table-Body">
              {!noResultsFound && <ScrollTopAndBottomButton />}
              {loading ? (
                <Loader />
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th className="p1">S.No.</th>
                      {headerLabels.map((item, index) => (
                        <th className="p1" key={index}>
                          {item.heading}
                        </th>
                      ))}
                      {showRates && <th className="p1">Rates</th>}
                      <th></th>
                    </tr>
                  </thead>
                  {!noResultsFound && (
                    <tbody>
                      {paginatedData.map((row, index) => (
                        <tr className="p2" key={index}>
                          <td>{startIdx + index + 1}</td>
                          {headerLabels.map((collabel, labelIndex) => (
                            <td key={labelIndex}>
                              {collabel.id === 2
                                ? showRates
                                  ? this.getStatusText(row[collabel.label])
                                  : this.getStatusImage(row[collabel.label])
                                : row[collabel.label]}
                            </td>
                          ))}
                          {showRates && (
                            <>
                              <td>
                                <RateIcon
                                  className="icon2"
                                  onClick={() =>
                                    this.handleRatesModal(
                                      row.company_name,
                                      false
                                    )
                                  }
                                ></RateIcon>
                              </td>
                              <td>
                                <Link
                                  to={`/previewsettlement/${row.company_name}`}
                                >
                                  <RightSign
                                    className="icon2"
                                    title="View More"
                                  ></RightSign>
                                </Link>
                              </td>
                            </>
                          )}
                          {showReport && (
                            <td>
                              <Link to={`/previewreport/${row._id}`}>
                                <RightSign
                                  className="icon2"
                                  title="View More"
                                ></RightSign>
                              </Link>

                              <More
                                className="icon2"
                                onClick={() => this.handleEditStatus(row)}
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  )}

                  {noResultsFound && (
                    <tbody>
                      <tr>
                        <td colSpan={headerLabels.length + (showRates ? 2 : 1)}>
                          <div>
                            <div className="search-result-head">
                              <div>
                                <h4>Whoops!</h4>{" "}
                                <Oops className="primary-color-icon" />
                              </div>
                              <p className="p2">
                                We couldn't find the transaction you are looking
                                for
                              </p>
                            </div>
                            <div className="search-result-img">
                              <img src={searchImg} alt="search"></img>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              )}
            </div>

            {!noResultsFound && (
              <div className="table-Footer">
                <div className="table-footer-rows-div">
                  <label htmlFor="noRows">Rows per page</label>
                  <select
                    id="noRows"
                    value={this.state.rows}
                    onChange={this.handleRowsChange}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="table-footer-buttons-div">
                  <p>
                    {`${startIdx + 1}-${Math.min(
                      endIdx,
                      dataToRender.length
                    )} of ${dataToRender.length}`}
                  </p>
                  <button
                    onClick={() => this.setState({ currentPage: 1 })}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? "disabled-button" : ""}
                  >
                    <LeftDoubleArrow />
                  </button>
                  <button
                    onClick={() => this.handlePageChange("prev")}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? "disabled-button" : ""}
                  >
                    <LeftSign />
                  </button>
                  <button
                    onClick={() => this.handlePageChange("next")}
                    disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages ? "disabled-button" : ""
                    }
                  >
                    <RightSign />
                  </button>
                  <button
                    onClick={() => this.setState({ currentPage: totalPages })}
                    className={
                      currentPage === totalPages ? "disabled-button" : ""
                    }
                  >
                    <RightDoubleArrow />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      );
    } else if (userRole === "merchant") {
      return (
        <>
          {errorMessage && (
            <MessageBox
              message={errorMessage}
              messageType={messageType}
              onClose={() => this.setState({ errorMessage: "" })}
            />
          )}
          {isRatesModal && (
            <Modal
              onClose={() => this.handleRatesModalToggle("close")}
              onDecline={() => this.handleRatesModalToggle("decline")}
              onAccept={() => this.handleRatesModalToggle("accept")}
              showDeclinebtn={false}
              acceptbtnname={"OK"}
              showFotter={true}
              modalHeading={"Rates 🪙"}
              modalBody={
                <div>
                  <div className="rates-row">
                    <p>MDR</p>
                    <p className="p2">
                      {ratesdata.MDR !== undefined
                        ? ratesdata.MDR + " %"
                        : "No Rates"}
                    </p>
                  </div>
                  <div className="rates-row">
                    <p>Approval Rate</p>
                    <p className="p2">
                      {" "}
                      {ratesdata.txn_app !== undefined
                        ? ratesdata.txn_app + " " + ratesdata.currency
                        : "No Rates"}
                    </p>
                  </div>
                  <div className="rates-row">
                    <p>Decline Rate</p>
                    <p className="p2">
                      {" "}
                      {ratesdata.txn_dec !== undefined
                        ? ratesdata.txn_dec + " " + ratesdata.currency
                        : "No Rates"}
                    </p>
                  </div>
                  <div className="rates-row">
                    <p>Rolling Reserve</p>
                    <p className="p2">
                      {" "}
                      {ratesdata.RR !== undefined
                        ? ratesdata.RR + " %"
                        : "No Rates"}
                    </p>
                  </div>
                  <div className="rates-row">
                    <p>Refund Fees</p>
                    <p className="p2">
                      {" "}
                      {ratesdata.refund_fee !== undefined
                        ? ratesdata.refund_fee + " " + ratesdata.currency
                        : "No Rates"}
                    </p>
                  </div>
                  <div className="rates-row">
                    <p>Chargeback Fees</p>
                    <p className="p2">
                      {ratesdata.chargeback_fee !== undefined
                        ? ratesdata.chargeback_fee + " " + ratesdata.currency
                        : "No Rates"}
                    </p>
                  </div>
                </div>
              }
            />
          )}
          {/* Edit Status Moda; */}
          {isEditStatusModal && (
            <Modal
              onClose={() => this.handleEditStatusModalToggle("close")}
              onDecline={() => this.handleEditStatusModalToggle("decline")}
              onAccept={() => this.EditStatus()}
              showDeclinebtn={false}
              acceptbtnname={"Update"}
              showFotter={true}
              modalHeading={"Edit Status 📝"}
              modalBody={
                <div className="edit-status">
                  <label for="status">Status</label>
                  {showReport && (
                    <select
                      className="inputFeild select-input"
                      value={this.state.statusforEdit}
                      onChange={(e) =>
                        this.setState({ statusforEdit: e.target.value })
                      }
                    >
                      <option value="Success">Success</option>
                      <option value="Pending">Pending</option>
                    </select>
                  )}
                </div>
              }
            />
          )}
          {isGenerateExcelModal && (
            <Modal
              onClose={() => this.handleExcelModalToggle()}
              onDecline={() => this.handleExcelModalToggle()}
              onAccept={() => this.handleGenerateExcel()}
              showDeclinebtn={false}
              acceptbtnname={"Generate"}
              showFotter={true}
              modalHeading={"Generate Excel 📝"}
              modalBody={
                <div>
                  <div className="edit-status">
                    <label for="fromDate">From</label>

                    <input
                      type="date"
                      className="inputFeild "
                      value={this.state.fromDate}
                      onChange={(e) =>
                        this.setState({ fromDate: e.target.value })
                      }
                    ></input>
                  </div>

                  <div className="edit-status">
                    <label for="toDate">To</label>
                    <input
                      type="date"
                      className="inputFeild"
                      value={this.state.toDate}
                      onChange={(e) =>
                        this.setState({ toDate: e.target.value })
                      }
                    ></input>
                  </div>
                </div>
              }
            />
          )}
          <div className="Table-container">
            <div className="table-Header">
              {showRates && (
                <Link to={`/createsettlement`}>
                  <button className="btn-primary">
                    <PlusSymbol className="white-icon" /> Create Invoice
                  </button>
                </Link>
              )}
              {/* {showReport && (
              <div className="table-header-buttons">
                <Link to={`/createsettlement?company_name=${company_name}`}>
                  <button className="btn-primary">
                    <PlusSymbol className="white-icon" /> Create Invoice
                  </button>
                </Link>
                <button
                  className="btn-primary"
                  onClick={() => this.handleExcelModalToggle()}
                >
                  <Excel className="white-icon" />
                  Generate Excel
                </button>
              </div>
            )} */}
              <input
                className="inputFeild search-input"
                type="text"
                placeholder="Search"
                onChange={this.handleSearch}
                value={searchText}
              />
            </div>

            <div className="table-Body">
              {!noResultsFound && <ScrollTopAndBottomButton />}

              <table>
                {/* <thead>
                  <tr>
                    <th className="p1">S.No.</th>
                    {headerLabels.map((item, index) => (
                      <th className="p1" key={index}>
                        {item.heading}
                      </th>
                    ))}
                    {showRates && <th className="p1">Rates</th>}
                    <th></th>
                  </tr>
                </thead> */}
                <thead>
                  <tr>
                    <th className="p1">S.No.</th>
                    {headerLabels
                      .filter((item) => item.id !== 2) // Filter out column with id === 2
                      .map((item, index) => (
                        <th className="p1" key={index}>
                          {item.heading}
                        </th>
                      ))}
                    {showRates && <th className="p1">Rates</th>}
                    <th></th>
                  </tr>
                </thead>
                {!noResultsFound && (
                  <tbody>
                    {paginatedData.map((row, index) => (
                      <tr className="p2" key={index}>
                        <td>{startIdx + index + 1}</td>
                        {/* {headerLabels.map((collabel, labelIndex) => (
                        <td key={labelIndex}>
                          {collabel.id === 2
                            ? showRates
                              ? this.getStatusText(row[collabel.label])
                              : this.getStatusImage(row[collabel.label])
                            : row[collabel.label]}
                        </td>
                      ))} */}
                        {headerLabels
                          .filter((collabel) => collabel.id !== 2)
                          .map((collabel, labelIndex) => (
                            <td key={labelIndex}>
                              {collabel.id === 2 ? null : row[collabel.label]}
                            </td>
                          ))}
                        {showRates && (
                          <>
                            <td>
                              <RateIcon
                                className="icon2"
                                onClick={() =>
                                  this.handleRatesModal(row.company_name, false)
                                }
                              ></RateIcon>
                            </td>
                            <td>
                              <Link
                                to={`/previewsettlement/${row.company_name}`}
                              >
                                <RightSign
                                  className="icon2"
                                  title="View More"
                                ></RightSign>
                              </Link>
                            </td>
                          </>
                        )}
                        {showReport && (
                          <td>
                            <Link to={`/previewreport/${row._id}`}>
                              <RightSign
                                className="icon2"
                                title="View More"
                              ></RightSign>
                            </Link>

                            {/* <More
                            className="icon2"
                            onClick={() => this.handleEditStatus(row)}
                          /> */}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                )}

                {noResultsFound && (
                  <tbody>
                    <tr>
                      <td colSpan={headerLabels.length + (showRates ? 2 : 1)}>
                        <div>
                          <div className="search-result-head">
                            <div>
                              <h4>Whoops!</h4>{" "}
                              <Oops className="primary-color-icon" />
                            </div>
                            <p className="p2">
                              We couldn't find the transaction you are looking
                              for
                            </p>
                          </div>
                          <div className="search-result-img">
                            <img src={searchImg} alt="search"></img>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>

            {!noResultsFound && (
              <div className="table-Footer">
                <div className="table-footer-rows-div">
                  <label htmlFor="noRows">Rows per page</label>
                  <select
                    id="noRows"
                    value={this.state.rows}
                    onChange={this.handleRowsChange}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="table-footer-buttons-div">
                  <p>
                    {`${startIdx + 1}-${Math.min(
                      endIdx,
                      dataToRender.length
                    )} of ${dataToRender.length}`}
                  </p>
                  <button
                    onClick={() => this.setState({ currentPage: 1 })}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? "disabled-button" : ""}
                  >
                    <LeftDoubleArrow />
                  </button>
                  <button
                    onClick={() => this.handlePageChange("prev")}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? "disabled-button" : ""}
                  >
                    <LeftSign />
                  </button>
                  <button
                    onClick={() => this.handlePageChange("next")}
                    disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages ? "disabled-button" : ""
                    }
                  >
                    <RightSign />
                  </button>
                  <button
                    onClick={() => this.setState({ currentPage: totalPages })}
                    className={
                      currentPage === totalPages ? "disabled-button" : ""
                    }
                  >
                    <RightDoubleArrow />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      );
    }
  }
}

export default Table;
