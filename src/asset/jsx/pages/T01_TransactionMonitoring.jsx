import React, { Component } from "react";
import * as XLSX from "xlsx";

//Components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Table from "../components/Table";
import Loader from "../components/Loder";

//SVG Icons
import { Search, Oops, DownSign, UpSign, Eye } from "../../media/icon/SVGicons";

import searchImg from "../../media/image/search-transaction.png";
import ViewTransaction from "../components/ViewTransaction";

class TransactionMonitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      token: this.getCookie("token"),
      userRole: this.getCookie("role"),
      merchantName: this.getCookie("company_name"),
      showMoreOptions: false,
      selectedRowToView: null,
      errorMessage: "",
      messageType: "",
      headerLabels: [
        { id: 1, heading: "Txn ID", label: "txnid" },
        { id: 2, heading: "Merchant Txn ID", label: "merchantTxnId" },
        { id: 3, heading: "Merchant", label: "merchant" },
        { id: 4, heading: "Payment Gateway", label: "paymentgateway" },
        { id: 5, heading: "Status", label: "Status" },
        { id: 6, heading: "Message", label: "message" },
        { id: 7, heading: "Transaction Date", label: "transactiondate" },
        { id: 8, heading: "Order No", label: "orderNo" },
        { id: 9, heading: "MID", label: "mid" },
        { id: 10, heading: "Customer Name", label: "cname" },
        { id: 11, heading: "Email", label: "email" },
        { id: 12, heading: "Amount", label: "amount" },
        { id: 13, heading: "Currency", label: "currency" },
        { id: 14, heading: "Card Number", label: "cardnumber" },
        { id: 15, heading: "Card Type", label: "cardtype" },
        { id: 16, heading: "Country", label: "country" },
        { id: 17, heading: "Web URL", label: "web_url" },
      ],
      searchedResult: null,
      companyList: [],
      midList: [],
      countryList: [],
      paymentgatewayList: [],
      //api states
      searchIds: "",
      status: "",
      merchant: "",
      fromDate: "",
      toDate: "",
      mid: "",
      paymentgateway: "",
      currency: "",
      country: "",
      cardtype: "",
      cardnumber: "",
      activeQuickSearchbtn: "",
      showIds: false,
      loading: false,
    };
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  componentDidMount() {
    const token = this.getCookie("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    this.fetchData(`${backendURL}/companylist`, "companyList");
    this.fetchData(`${backendURL}/listofmids`, "midList");
    this.fetchMidList();
    this.fetchData(`${backendURL}/listofcountries`, "countryList");
    this.fetchData(`${backendURL}/acquirerlist`, "paymentgatewayList");
    window.addEventListener("click", this.handleClickOutside);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.modalRef &&
      !this.modalRef.contains(event.target) &&
      this.iconContainerRef &&
      !this.iconContainerRef.contains(event.target)
    ) {
      this.setState({ showIds: false });
    }
  };

  fetchData = async (url, dataVariable) => {
    const { token } = this.state;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      this.setState({ [dataVariable]: data });
    } catch (error) {
      this.setState({
        errorMessage: "Error in Fetching data. Please try again later.",
        messageType: "",
      });
    }
  };

  fetchMidList = async () => {
    const { token, merchant } = this.state;
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    let url = `${backendURL}/listofmids`;

    if (merchant) {
      url += `?merchant=${merchant}`;
    }
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      this.setState({ midList: data });
    } catch (error) {
      this.setState({
        errorMessage: "Error in Fetching data. Please try again later.",
        messageType: "",
      });
    }
  };

  handleCompanySelect = (event) => {
    const merchant = event.target.value;
    this.setState({ merchant }, () => {
      if (merchant) {
        this.fetchMidList();
      } else {
        this.setState({ midList: [] });
      }
    });
  };

  handleInputChange = (event) => {
    const { id, value } = event.target;
  
    this.setState({
      [id]: value,
    });
    if (id === "searchIds") {
      const searchIdsArray = value.split(/[\s,]+/);
      const threshold = 54; 
      this.setState({
        searchIdsArray: searchIdsArray,
        showIdsArray: value.length > threshold && searchIdsArray.length > 1,
        showIds:
          value.length > threshold &&
          searchIdsArray.length > 1 &&
          this.state.showIds,
      });
    }
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.handleSearch();
    }
  };

  toggleTypedData = () => {
    this.setState((prevState) => ({
      showIds: !prevState.showIds,
    }));
  };

  handleShowMore = () => {
    this.setState({
      showMoreOptions: !this.state.showMoreOptions,
    });
  };

  handleViewClick = (row) => {
    this.setState({ selectedRowToView: row });
  };

  // handleCardNumber = (cardNo) => {
  //   if (cardNo) {
  //     return cardNo.slice(0, 6) + "******" + cardNo.slice(6, 10);
  //   } else {
  //     return cardNo;
  //   }
  // };

  handleClear = () => {
    this.setState(
      {
        searchIds: "",
        status: "",
        merchant: "",
        fromDate: "",
        toDate: "",
        mid: "",
        paymentgateway: "",
        currency: "",
        country: "",
        cardtype: "",
        cardnumber: "",
        searchedResult: null,
        activeQuickSearchbtn: "",
        showIdsArray:false,
      },
      () => {
        this.fetchMidList();
      }
    );
  };

  handleSearch = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token, userRole, merchantName, cardnumber } = this.state;
  
    let formattedCardNumber = this.state.cardnumber;
  let searchQuery = {};

  if (formattedCardNumber.length === 16) {
    searchQuery.cardnumber = formattedCardNumber;
  } else if (formattedCardNumber.length === 10) {
    const first6 = formattedCardNumber.substring(0, 6);
    const last4 = formattedCardNumber.substring(6, 10);
    searchQuery.cardnumber = `${first6}******${last4}`;
  } else if (formattedCardNumber.length === 8) {
    const first4 = formattedCardNumber.substring(0, 4);
    const last4 = formattedCardNumber.substring(4, 8);
    searchQuery = {
      cardnumber: {
        $regex: `${first4}??******${last4}`
      }
    };
  }
 
    const searchedData = {
      searchIds: this.state.searchIds,
      status: this.state.status,
      merchant: userRole === "merchant" ? merchantName : this.state.merchant,
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      mid: this.state.mid,
      paymentgateway: this.state.paymentgateway,
      currency: this.state.currency,
      country: this.state.country,
      cardtype: this.state.cardtype,
      cardnumber: searchQuery.cardnumber,
    };
  
    this.setState({ loading: true });
    try {
      const response = await fetch(`${backendURL}/transactionreport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(searchedData),
      });
      if (response.ok) {
        const data = await response.json();
        this.setState({ searchedResult: data, loading: false }, () => {
          this.calculateShowTotalAmount();
        });
      } else {
        this.setState({
          errorMessage: "Error searching. Please try again later.",
          messageType: "fail",
          loading: false,
        });
      }
    } catch (error) {
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "fail",
        loading: false,
      });
    }
  };

  calculateShowTotalAmount = () => {
    const { currentPage, rowsPerPage, searchedResult } = this.state;
    const totalRows = searchedResult.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const showTotalAmount =
      totalRows > 0 && (currentPage === totalPages || totalPages === 1);

    if (this.state.showTotalAmount !== showTotalAmount) {
      this.setState({ showTotalAmount });
    }
  };

  exportData = () => {
    const { searchedResult } = this.state;
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(searchedResult);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Mismatch Data");

    XLSX.writeFile(workbook, "Mismatch_Data.xlsx");
  };

  handleQuickSearch = (buttonName) => {
    if (this.state.activeQuickSearchbtn === buttonName) {
      this.setState({
        activeQuickSearchbtn: null,
        fromDate: null,
        toDate: null,
      });
      return;
    }

    // Today
    if (buttonName === "Today") {
      const currentDate = new Date();
      const from = `${currentDate.getFullYear()}-${(
        "0" +
        (currentDate.getMonth() + 1)
      ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)} 00:00:00`;
      const to = `${currentDate.getFullYear()}-${(
        "0" +
        (currentDate.getMonth() + 1)
      ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)} 23:59:59`;
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });
    }

    // Yesterday
    else if (buttonName === "Yesterday") {
      const currentDate = new Date();
      const oneDayMilliseconds = 24 * 60 * 60 * 1000;
      const yesterdayDate = new Date(
        currentDate.getTime() - oneDayMilliseconds
      );
      const from = `${yesterdayDate.getFullYear()}-${(
        "0" +
        (yesterdayDate.getMonth() + 1)
      ).slice(-2)}-${("0" + yesterdayDate.getDate()).slice(-2)} 00:00:00`;
      const to = `${yesterdayDate.getFullYear()}-${(
        "0" +
        (yesterdayDate.getMonth() + 1)
      ).slice(-2)}-${("0" + yesterdayDate.getDate()).slice(-2)} 23:59:59`;
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });
    }

    // This Week
    else if (buttonName === "This Week") {
      const currentDate = new Date();
      let date = new Date();
      const oneDayMilliseconds = 24 * 60 * 60 * 1000;

      while (date.getDay() !== 1) {
        date = new Date(date.getTime() - oneDayMilliseconds);
      }

      const from = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
        -2
      )}-${("0" + date.getDate()).slice(-2)} 00:00:00`;
      const to = `${currentDate.getFullYear()}-${(
        "0" +
        (currentDate.getMonth() + 1)
      ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)} 23:59:59`;
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });
    }

    // Last Week
    else if (buttonName === "Last Week") {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const daysSinceLastMonday = ((dayOfWeek + 6) % 7) + 7;
      const mondayDate = new Date(today);
      mondayDate.setDate(today.getDate() - daysSinceLastMonday);

      const sundayDate = new Date(today);
      sundayDate.setDate(today.getDate() - dayOfWeek);

      const from = `${mondayDate.getFullYear()}-${(
        "0" +
        (mondayDate.getMonth() + 1)
      ).slice(-2)}-${("0" + mondayDate.getDate()).slice(-2)} 00:00:00`;
      const to = `${sundayDate.getFullYear()}-${(
        "0" +
        (sundayDate.getMonth() + 1)
      ).slice(-2)}-${("0" + sundayDate.getDate()).slice(-2)} 23:59:59`;
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });
    }

    // This Month
    else if (buttonName === "This Month") {
      const currentDate = new Date();
      const from = `${currentDate.getFullYear()}-${(
        "0" +
        (currentDate.getMonth() + 1)
      ).slice(-2)}-01 00:00:00`;
      const to = `${currentDate.getFullYear()}-${(
        "0" +
        (currentDate.getMonth() + 1)
      ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)} 23:59:59`;
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });
    }

    // Last Month
    else if (buttonName === "Last Month") {
      const currentDate = new Date();
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );
      const from = `${currentDate.getFullYear()}-${(
        "0" + currentDate.getMonth()
      ).slice(-2)}-01 00:00:00`;
      const to = `${endDate.getFullYear()}-${(
        "0" +
        (endDate.getMonth() + 1)
      ).slice(-2)}-${("0" + endDate.getDate()).slice(-2)} 23:59:59`;
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });
    }

    // This Year
    else if (buttonName === "This Year") {
      const currentDate = new Date();
      const yearStartDate = new Date(currentDate.getFullYear(), 0, 1);
      const from = `${yearStartDate.getFullYear()}-${(
        "0" +
        (yearStartDate.getMonth() + 1)
      ).slice(-2)}-${("0" + yearStartDate.getDate()).slice(-2)} 00:00:00`;
      const to = `${currentDate.getFullYear()}-${(
        "0" +
        (currentDate.getMonth() + 1)
      ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)} 23:59:59`;
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });
    }
  };

  render() {
    const {
      headerLabels,
      searchedResult,
      activeQuickSearchbtn,
      selectedRowToView,
      userRole,
      searchIds,
      merchant,
      loading,
    } = this.state;
    if (userRole === "admin" || userRole === "employee") {
      if (!selectedRowToView) {
        return (
          <>
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
                {this.state.showMoreOptions ? (
                  <div className="row-cards search-card">
                    <div className="id-search-row-div">
                      <div className="id-input-div">
                        <div>
                          <label
                            className={`id-label ${
                              searchIds ? "filled-id-label" : ""
                            }`}
                            htmlFor="searchIds"
                          >
                            Id:
                          </label>
                          {this.state.showIdsArray && (
                            <div
                              className="icon-container"
                              ref={(ref) => (this.iconContainerRef = ref)}
                            >
                              <Eye onClick={this.toggleTypedData} />
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            className="id-input id-input-mrchnt-div"
                            type="text"
                            id="searchIds"
                            value={searchIds}
                            placeholder="Txn ID/ Merchant Txn ID"
                            onChange={this.handleInputChange}
                            onKeyDown={this.handleKeyDown}
                          />
                        </div>
                        {this.state.showIds &&
                          this.state.searchIdsArray.length > 0 && (
                            <div ref={(ref) => (this.modalRef = ref)}>
                              <select
                                className="transaction-id-dropdown"
                                size={Math.min(
                                  this.state.searchIdsArray.length,
                                  10
                                )}
                              >
                                {this.state.searchIdsArray.map(
                                  (line, index) => (
                                    <option key={index} value={line}>
                                      {line}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          )}
                      </div>
                      <div className="search-select-div search-status-div">
                        <label
                          className={`id-label ${
                            this.state.status ? "filled-id-label" : ""
                          } `}
                          htmlFor="status"
                        >
                          Status:
                        </label>
                        <select
                          className="id-input"
                          id="status"
                          value={this.state.status}
                          onChange={this.handleInputChange}
                          onKeyDown={this.handleKeyDown}
                        >
                          <option value="">Select Status</option>
                          <option value="Success">Success</option>
                          <option value="Failed">Failed</option>
                          <option value="Incompleted">Incompleted</option>
                        </select>
                      </div>
                      <div className="search-select-div search-status-div">
                        <label
                          className={`id-label ${
                            this.state.merchant ? "filled-id-label" : ""
                          } `}
                          htmlFor="merchant"
                        >
                          Merchant:
                        </label>
                        <select
                          className="id-input"
                          id="merchant"
                          value={merchant}
                          onChange={this.handleCompanySelect}
                          onKeyDown={this.handleKeyDown}
                        >
                          <option value="">Select Merchant</option>
                          {this.state.companyList.map((company) => (
                            <option key={company} value={company}>
                              {company}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="txn-monitoring-btn-div">
                        <button
                          className="btn-primary"
                          onClick={() => this.handleSearch()}
                        >
                          Search
                        </button>
                        <button
                          className="btn-secondary btn-suspend"
                          onClick={() => this.handleClear()}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="from-to-input-div">
                      <div className="id-input-div">
                        <label
                          className={`date-label ${
                            this.state.fromDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="fromDate"
                        >
                          From:
                        </label>
                        <input
                          className="date-input id-input-mrchnt-div"
                          type="datetime-local"
                          id="fromDate"
                          value={this.state.fromDate || ""}
                          onChange={this.handleInputChange}
                          onKeyDown={this.handleKeyDown}
                        ></input>
                      </div>
                      <div className="id-input-div todate-input-div">
                        <label
                          className={`date-label ${
                            this.state.toDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="toDate"
                        >
                          To:
                        </label>
                        <input
                          className="date-input date-input-mrchnt-div"
                          type="datetime-local"
                          id="toDate"
                          value={this.state.toDate || ""}
                          onChange={this.handleInputChange}
                          onKeyDown={this.handleKeyDown}
                        ></input>
                      </div>
                    </div>

                    <div className="quick-search-div">
                      <div>
                        <p className="p2 date-label">Quick Search:</p>
                        <button
                          className={
                            activeQuickSearchbtn === "Today"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Today")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Today
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "Yesterday"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Yesterday")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Yesterday
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "This Week"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("This Week")}
                          onKeyDown={this.handleKeyDown}
                        >
                          This Week
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "Last Week"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Last Week")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Last Week
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "This Month"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("This Month")}
                          onKeyDown={this.handleKeyDown}
                        >
                          This Month
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "Last Month"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Last Month")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Last Month
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "This Year"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("This Year")}
                          onKeyDown={this.handleKeyDown}
                        >
                          This Year
                        </button>
                      </div>
                    </div>

                    <div className="more-options-div">
                      <label
                        className={`id-label ${
                          this.state.mid ? "filled-id-label" : ""
                        } `}
                        htmlFor="mid"
                      >
                        MID:
                      </label>

                      <select
                        className="id-input"
                        id="mid"
                        value={this.state.mid}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeyDown}
                      >
                        <option value="">Select MID</option>
                        {this.state.midList.map((mid) => (
                          <option key={mid} value={mid}>
                            {mid}
                          </option>
                        ))}
                      </select>

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
                        onKeyDown={this.handleKeyDown}
                      >
                        <option value="">Select Payment Gateway</option>
                        {this.state.paymentgatewayList.map((paymentgateway) => (
                          <option key={paymentgateway} value={paymentgateway}>
                            {paymentgateway}
                          </option>
                        ))}
                      </select>

                      <label
                        className={`id-label ${
                          this.state.currency ? "filled-id-label" : ""
                        } `}
                        htmlFor="currency"
                      >
                        Currency:
                      </label>
                      <select
                        className="id-input"
                        id="currency"
                        value={this.state.currency}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeyDown}
                      >
                        <option value="">Select Currency</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="AUD">AUD</option>
                        <option value="INR">INR</option>
                      </select>

                      <label
                        className={`id-label ${
                          this.state.country ? "filled-id-label" : ""
                        } `}
                        htmlFor="country"
                      >
                        Country:
                      </label>
                      <select
                        className="id-input"
                        id="country"
                        value={this.state.country}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeyDown}
                      >
                        <option value="">Select Country</option>
                        {this.state.countryList.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>

                      <label
                        className={`id-label ${
                          this.state.cardtype ? "filled-id-label" : ""
                        } `}
                        htmlFor="cardtype"
                      >
                        Card Type:
                      </label>
                      <select
                        className="id-input"
                        id="cardtype"
                        value={this.state.cardtype}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeyDown}
                      >
                        <option value="">Select Card Type</option>
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                      </select>

                      <label
                        className={`id-label ${
                          this.state.cardnumber ? "filled-id-label" : ""
                        } `}
                        htmlFor="cardnumber"
                      >
                        Card Number:
                      </label>
                      <input
                        className="id-input"
                        type="text"
                        id="cardnumber"
                        value={this.state.cardnumber}
                        placeholder="First 6 and Last 4 digits"
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeyDown}
                      ></input>
                    </div>
                    <div
                      className="show-less"
                      onClick={() => this.handleShowMore()}
                    >
                      <UpSign className="primary-color-icon" />
                      <p className="p1">Show less options</p>
                    </div>
                  </div>
                ) : (
                  <div className="row-cards search-card">
                    <div className="id-search-row-div">
                      <div className="id-input-div">
                        <div>
                          <label
                            className={`id-label ${
                              searchIds ? "filled-id-label" : ""
                            }`}
                            htmlFor="searchIds"
                          >
                            Id:
                          </label>
                          {this.state.showIdsArray && (
                            <div
                              className="icon-container"
                              ref={(ref) => (this.iconContainerRef = ref)}
                            >
                              <Eye onClick={this.toggleTypedData} />
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            className="id-input id-input-mrchnt-div"
                            type="text"
                            id="searchIds"
                            value={searchIds}
                            placeholder="Txn ID/ Merchant Txn ID"
                            onChange={this.handleInputChange}
                            onKeyDown={this.handleKeyDown}
                          />
                        </div>
                        {this.state.showIds &&
                          this.state.searchIdsArray.length > 0 && (
                            <div ref={(ref) => (this.modalRef = ref)}>
                              <select
                                className="transaction-id-dropdown"
                                size={Math.min(
                                  this.state.searchIdsArray.length,
                                  10
                                )}
                              >
                                {this.state.searchIdsArray.map(
                                  (line, index) => (
                                    <option key={index} value={line}>
                                      {line}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          )}
                      </div>
                      <div className="search-select-div search-status-div">
                        <label
                          className={`id-label ${
                            this.state.status ? "filled-id-label" : ""
                          } `}
                          htmlFor="status"
                        >
                          Status:
                        </label>
                        <select
                          className="id-input "
                          id="status"
                          value={this.state.status}
                          onChange={this.handleInputChange}
                          onKeyDown={this.handleKeyDown}
                        >
                          <option value="">Select Status</option>
                          <option value="Success">Success</option>
                          <option value="Failed">Failed</option>
                          <option value="Incompleted">Incompleted</option>
                        </select>
                      </div>
                      <div className="search-select-div search-status-div">
                        <label
                          className={`id-label ${
                            this.state.merchant ? "filled-id-label" : ""
                          } `}
                          htmlFor="merchant"
                        >
                          Merchant:
                        </label>
                        <select
                          className="id-input"
                          id="merchant"
                          value={merchant}
                          onChange={this.handleCompanySelect}
                          onKeyDown={this.handleKeyDown}
                        >
                          <option value="">Select Merchant</option>
                          {this.state.companyList.map((company) => (
                            <option key={company} value={company}>
                              {company}
                            </option>
                          ))}
                        </select>
                        
                      </div>
                      <div className="txn-monitoring-btn-div">
                        <button
                          className="btn-primary"
                          onClick={() => this.handleSearch()}
                        >
                          Search
                        </button>
                        <button
                          className="btn-secondary btn-suspend"
                          onClick={() => this.handleClear()}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="from-to-input-div">
                      <div className="id-input-div">
                        <label
                          className={`date-label ${
                            this.state.fromDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="fromDate"
                        >
                          From:
                        </label>
                        <input
                          className="date-input id-input-mrchnt-div"
                          type="datetime-local"
                          id="fromDate"
                          value={this.state.fromDate || ""}
                          onChange={this.handleInputChange}
                          onKeyDown={this.handleKeyDown}
                        ></input>
                      </div>
                      <div className="id-input-div todate-input-div">
                        <label
                          className={`date-label ${
                            this.state.toDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="toDate"
                        >
                          To:
                        </label>
                        <input
                          className="date-input date-input-mrchnt-div"
                          type="datetime-local"
                          id="toDate"
                          value={this.state.toDate || ""}
                          onChange={this.handleInputChange}
                          onKeyDown={this.handleKeyDown}
                        ></input>
                      </div>
                    </div>
                    <div className="quick-search-div">
                      <div>
                        <p className="p2 date-label">Quick Search:</p>
                        <button
                          className={
                            activeQuickSearchbtn === "Today"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Today")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Today
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "Yesterday"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Yesterday")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Yesterday
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "This Week"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("This Week")}
                          onKeyDown={this.handleKeyDown}
                        >
                          This Week
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "Last Week"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Last Week")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Last Week
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "This Month"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("This Month")}
                          onKeyDown={this.handleKeyDown}
                        >
                          This Month
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "Last Month"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Last Month")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Last Month
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "This Year"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("This Year")}
                          onKeyDown={this.handleKeyDown}
                        >
                          This Year
                        </button>
                      </div>

                      <div
                        className="show-more"
                        onClick={() => this.handleShowMore()}
                        onKeyDown={this.handleKeyDown}
                      >
                        <DownSign className="primary-color-icon" />
                        <p className="p1">Show more options</p>
                      </div>
                      {/* <button onClick={this.exportData}>Export</button> */}
                    </div>
                  </div>
                )}
              </div>
              <div className="main-screen-rows transaction-monitoring-second-row">
                {this.state.loading ? (
                  <div className="row-cards search-result">
                  <Loader/>
                  </div>
                ) : this.state.searchedResult === null ? (
                  <div className="row-cards search-result">
                    <div className="search-result-head">
                      <div>
                        <h4>Search</h4>{" "}
                        <Search className="primary-color-icon" />
                      </div>
                      <p className="p2">Input Details to search transactions</p>
                    </div>
                    <div className="search-result-img">
                      <img src={searchImg} alt="search"></img>
                    </div>
                  </div>
                ) : this.state.searchedResult.length === 0 ? (
                  <div className="row-cards search-result">
                    <div className="search-result-head">
                      <div>
                        <h4>Oops...</h4> <Oops className="primary-color-icon" />
                      </div>
                      <p className="p2">
                        We couldn't find the transaction you are looking for
                      </p>
                    </div>
                    <div className="search-result-img">
                      <img src={searchImg} alt="search"></img>
                    </div>
                  </div>
                ) : (
                  <div className="row-cards search-table">
                    <Table
                      headerLabels={headerLabels}
                      dataToRender={searchedResult}
                      onViewClick={this.handleViewClick}
                      shouldRenderRightSign={true}
                      shouldRenderScrollButtons={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        );
      } else {
        return (
          <ViewTransaction
            data={selectedRowToView}
            onViewClick={this.handleViewClick}
          />
        );
      }
    } else if (userRole === "merchant") {
      if (!selectedRowToView) {
        return (
          <>
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
                {this.state.showMoreOptions ? (
                  <div className="row-cards search-card">
                    <div className="id-search-row-div">
                      <div className="id-input-div">
                        <div>
                          <label
                            className={`id-label ${
                              searchIds ? "filled-id-label" : ""
                            }`}
                            htmlFor="searchIds"
                          >
                            Id:
                          </label>
                          {this.state.showIdsArray && (
                            <div
                              className="icon-container"
                              ref={(ref) => (this.iconContainerRef = ref)}
                            >
                              <Eye onClick={this.toggleTypedData} />
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            className="id-input "
                            type="text"
                            id="searchIds"
                            value={searchIds}
                            placeholder="Txn ID/ Merchant Txn ID"
                            onChange={this.handleInputChange}
                            onKeyDown={this.handleKeyDown}
                          />
                        </div>
                        {this.state.showIds &&
                          this.state.searchIdsArray.length > 0 && (
                            <div ref={(ref) => (this.modalRef = ref)}>
                              <select
                                className="transaction-id-dropdown"
                                size={Math.min(
                                  this.state.searchIdsArray.length,
                                  10
                                )}
                              >
                                {this.state.searchIdsArray.map(
                                  (line, index) => (
                                    <option key={index} value={line}>
                                      {line}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          )}
                      </div>
                      <div className="search-select-div search-status-div">
                        <label
                          className={`id-label ${
                            this.state.status ? "filled-id-label" : ""
                          } `}
                          htmlFor="status"
                        >
                          Status:
                        </label>
                        <select
                          className="id-input date-input-mrchnt-div"
                          id="status"
                          value={this.state.status}
                          onChange={this.handleInputChange}
                          onKeyDown={this.handleKeyDown}
                        >
                          <option value="">Select Status</option>
                          <option value="Success">Success</option>
                          <option value="Failed">Failed</option>
                          <option value="Incompleted">Incompleted</option>
                        </select>
                      </div>
                      {/* <div className="search-select-div">
												<label className={`id-label ${this.state.merchant ? "filled-id-label" : ""} `} htmlFor="merchant">
													Merchant:
												</label>
												<select
													className="id-input"
													id="merchant"
													value={this.state.merchant}
													onChange={this.handleInputChange}
												>
													<option value="">Select Merchant</option>
													{this.state.companyList.map((company) => (
														<option key={company} value={company}>
															{company}
														</option>
													))}
												</select>
											</div> */}
                    </div>

                    <div className="from-to-input-div">
                      <div className="id-input-div">
                        <label
                          className={`date-label ${
                            this.state.fromDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="fromDate"
                        >
                          From:
                        </label>
                        <input
                          className="date-input id-input-mrchnt-div"
                          type="datetime-local"
                          id="fromDate"
                          value={this.state.fromDate || ""}
                          onChange={this.handleInputChange}
                          onKeyDown={this.handleKeyDown}
                        ></input>
                      </div>
                      <div className="id-input-div todate-div">
                        <label
                          className={`date-label ${
                            this.state.toDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="toDate"
                        >
                          To:
                        </label>
                        <input
                          className="date-input date-input-mrchnt-div"
                          type="datetime-local"
                          id="toDate"
                          value={this.state.toDate || ""}
                          onChange={this.handleInputChange}
                          onKeyDown={this.handleKeyDown}
                        ></input>
                      </div>

                      <div className="txn-monitoring-btn-div txn-monitoring-mrcnt-btn-div">
                        <button
                          className="btn-primary"
                          onClick={() => this.handleSearch()}
                        >
                          Search
                        </button>
                        <button
                          className="btn-secondary btn-suspend"
                          onClick={() => this.handleClear()}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="quick-search-div">
                      <div>
                        <p className="p2 date-label">Quick Search:</p>
                        <button
                          className={
                            activeQuickSearchbtn === "Today"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Today")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Today
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "Yesterday"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Yesterday")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Yesterday
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "This Week"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("This Week")}
                          onKeyDown={this.handleKeyDown}
                        >
                          This Week
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "Last Week"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Last Week")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Last Week
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "This Month"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("This Month")}
                          onKeyDown={this.handleKeyDown}
                        >
                          This Month
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "Last Month"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Last Month")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Last Month
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "This Year"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("This Year")}
                          onKeyDown={this.handleKeyDown}
                        >
                          This Year
                        </button>
                      </div>
                    </div>

                    <div className="more-options-div">
                      <label
                        className={`id-label ${
                          this.state.mid ? "filled-id-label" : ""
                        } `}
                        htmlFor="mid"
                      >
                        MID:
                      </label>

                      <select
                        className="id-input card-type"
                        id="mid"
                        value={this.state.mid}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeyDown}
                      >
                        <option value="">Select MID</option>
                        {this.state.midList.map((mid) => (
                          <option key={mid} value={mid}>
                            {mid}
                          </option>
                        ))}
                      </select>

                      {/* <label className={`id-label ${this.state.paymentgateway ? "filled-id-label" : ""} `} htmlFor="paymentgateway">
												Payment Gateway:
											</label>
	
											<select
												className="id-input"
												id="paymentgateway"
												value={this.state.paymentgateway}
												onChange={this.handleInputChange}
											>
												<option value="">Select Payment Gateway</option>
												{this.state.paymentgatewayList.map((paymentgateway) => (
													<option key={paymentgateway} value={paymentgateway}>
														{paymentgateway}
													</option>
												))}
											</select> */}

                      <label
                        className={`id-label ${
                          this.state.currency ? "filled-id-label" : ""
                        } `}
                        htmlFor="currency"
                      >
                        Currency:
                      </label>
                      <select
                        className="id-input"
                        id="currency"
                        value={this.state.currency}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeyDown}
                      >
                        <option value="">Select Currency</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="AUD">AUD</option>
                        <option value="INR">INR</option>
                      </select>

                      <label
                        className={`id-label ${
                          this.state.country ? "filled-id-label" : ""
                        } `}
                        htmlFor="country"
                      >
                        Country:
                      </label>
                      <select
                        className="id-input"
                        id="country"
                        value={this.state.country}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeyDown}
                      >
                        <option value="">Select Country</option>
                        {this.state.countryList.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>

                      <label
                        className={`id-label ${
                          this.state.cardtype ? "filled-id-label" : ""
                        } `}
                        htmlFor="cardtype"
                      >
                        Card Type:
                      </label>
                      <select
                        className="id-input card-type "
                        id="cardtype"
                        value={this.state.cardtype}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeyDown}
                      >
                        <option value="">Select Card Type</option>
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                      </select>

                      <label
                        className={`id-label ${
                          this.state.cardnumber ? "filled-id-label" : ""
                        } `}
                        htmlFor="cardnumber"
                      >
                        Card Number:
                      </label>
                      <input
                        className="id-input"
                        type="text"
                        id="cardnumber"
                        value={this.state.cardnumber}
                        placeholder="First 6 and Last 4 digits"
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeyDown}
                      ></input>
                    </div>
                    <div
                      className="show-less"
                      onClick={() => this.handleShowMore()}
                    >
                      <UpSign className="primary-color-icon" />
                      <p className="p1">Show less options</p>
                    </div>
                  </div>
                ) : (
                  <div className="row-cards search-card">
                    <div className="id-search-row-div">
                      <div className="id-input-div">
                        <div>
                          <label
                            className={`id-label ${
                              searchIds ? "filled-id-label" : ""
                            }`}
                            htmlFor="searchIds"
                          >
                            Id:
                          </label>
                          {this.state.showIdsArray && (
                            <div
                              className="icon-container"
                              ref={(ref) => (this.iconContainerRef = ref)}
                            >
                              <Eye onClick={this.toggleTypedData} />
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            className="id-input "
                            type="text"
                            id="searchIds"
                            value={searchIds}
                            placeholder="Txn ID/ Merchant Txn ID"
                            onChange={this.handleInputChange}
                            onKeyDown={this.handleKeyDown}
                          />
                        </div>
                        {this.state.showIds &&
                          this.state.searchIdsArray.length > 0 && (
                            <div ref={(ref) => (this.modalRef = ref)}>
                              <select
                                className="transaction-id-dropdown"
                                size={Math.min(
                                  this.state.searchIdsArray.length,
                                  10
                                )}
                              >
                                {this.state.searchIdsArray.map(
                                  (line, index) => (
                                    <option key={index} value={line}>
                                      {line}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          )}
                      </div>
                      <div className="search-select-div search-status-div">
                        <label
                          className={`id-label ${
                            this.state.status ? "filled-id-label" : ""
                          } `}
                          htmlFor="status"
                        >
                          Status:
                        </label>
                        <select
                          className="id-input date-input-mrchnt-div"
                          id="status"
                          value={this.state.status}
                          onChange={this.handleInputChange}
                          onKeyDown={this.handleKeyDown}
                        >
                          <option value="">Select Status</option>
                          <option value="Success">Success</option>
                          <option value="Failed">Failed</option>
                          <option value="Incompleted">Incompleted</option>
                        </select>
                      </div>
                    </div>

                    <div className="from-to-input-div">
                      <div className="id-input-div">
                        <label
                          className={`date-label ${
                            this.state.fromDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="fromDate"
                        >
                          From:
                        </label>
                        <input
                          className="date-input id-input-mrchnt-div"
                          type="datetime-local"
                          id="fromDate"
                          value={this.state.fromDate || ""}
                          onChange={this.handleInputChange}
                          onKeyDown={this.handleKeyDown}
                        ></input>
                      </div>
                      <div className="id-input-div todate-div">
                        <label
                          className={`date-label ${
                            this.state.toDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="toDate"
                        >
                          To:
                        </label>
                        <input
                          className="date-input date-input-mrchnt-div"
                          type="datetime-local"
                          id="toDate"
                          value={this.state.toDate || ""}
                          onChange={this.handleInputChange}
                          onKeyDown={this.handleKeyDown}
                        ></input>
                      </div>

                      <div className="txn-monitoring-btn-div txn-monitoring-mrcnt-btn-div">
                        <button
                          className="btn-primary"
                          onClick={() => this.handleSearch()}
                        >
                          Search
                        </button>
                        <button
                          className="btn-secondary btn-suspend"
                          onClick={() => this.handleClear()}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="quick-search-div">
                      <div>
                        <p className="p2 date-label">Quick Search:</p>
                        <button
                          className={
                            activeQuickSearchbtn === "Today"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Today")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Today
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "Yesterday"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Yesterday")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Yesterday
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "This Week"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("This Week")}
                          onKeyDown={this.handleKeyDown}
                        >
                          This Week
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "Last Week"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Last Week")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Last Week
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "This Month"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("This Month")}
                          onKeyDown={this.handleKeyDown}
                        >
                          This Month
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "Last Month"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("Last Month")}
                          onKeyDown={this.handleKeyDown}
                        >
                          Last Month
                        </button>

                        <button
                          className={
                            activeQuickSearchbtn === "This Year"
                              ? "active-quick-search-btn"
                              : "quick-search-btn"
                          }
                          onClick={() => this.handleQuickSearch("This Year")}
                          onKeyDown={this.handleKeyDown}
                        >
                          This Year
                        </button>
                      </div>

                      <div
                        className="show-more"
                        onClick={() => this.handleShowMore()}
                      >
                        <DownSign className="primary-color-icon" />
                        <p className="p1">Show more options</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="main-screen-rows transaction-monitoring-second-row">
                {this.state.searchedResult === null ? (
                  <div className="row-cards search-result">
                    <div className="search-result-head">
                      <div>
                        <h4>Search</h4>{" "}
                        <Search className="primary-color-icon" />
                      </div>
                      <p className="p2">Input Details to search transactions</p>
                    </div>
                    <div className="search-result-img">
                      <img src={searchImg} alt="search"></img>
                    </div>
                  </div>
                ) : this.state.searchedResult.length === 0 ? (
                  <div className="row-cards search-result">
                    <div className="search-result-head">
                      <div>
                        <h4>Oops...</h4> <Oops className="primary-color-icon" />
                      </div>
                      <p className="p2">
                        We couldn't find the transaction you are looking for
                      </p>
                    </div>
                    <div className="search-result-img">
                      <img src={searchImg} alt="search"></img>
                    </div>
                  </div>
                ) : (
                  <div className="row-cards search-table">
                    <Table
                      headerLabels={headerLabels}
                      dataToRender={searchedResult}
                      onViewClick={this.handleViewClick}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        );
      } else {
        return (
          <ViewTransaction
            data={selectedRowToView}
            onViewClick={this.handleViewClick}
          />
        );
      }
    }
  }
}

export default TransactionMonitoring;
