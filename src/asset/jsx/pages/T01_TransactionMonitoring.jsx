import React, { Component } from "react";

//Components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Table from "../components/Table";

//SVG Icons
import { Search, Oops, DownSign, UpSign, Eye } from "../../media/icon/SVGicons";

import searchImg from "../../media/image/search-transaction.png";
import ViewTransaction from "../components/ViewTransaction";

class TransactionMonitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      token: localStorage.getItem("token"),
      userRole: localStorage.getItem("role"),
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
      showTypedData: false,
    };
  }

  componentDidMount() {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    this.fetchData(`${backendURL}/companylist`, "companyList");
    this.fetchData(`${backendURL}/listofmids`, "midList");
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
      this.setState({ showTypedData: false });
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

  handleInputChange = (event) => {
    const { id, value } = event.target;
    this.setState({
      [id]: value,
      showTypedData: false,
    });
  };

  toggleTypedData = () => {
    this.setState((prevState) => ({
      showTypedData: !prevState.showTypedData,
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

  handleCardNumber = (cardNo) => {
    if (cardNo) {
      return cardNo.slice(0, 6) + "******" + cardNo.slice(6, 10);
    } else {
      return cardNo;
    }
  };

  handleClear = () => {
    this.setState({
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
    });
  };

  handleSearch = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token } = this.state;
    const searchedData = {
      searchIds: this.state.searchIds,
      status: this.state.status,
      merchant: this.state.merchant,
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      mid: this.state.mid,
      paymentgateway: this.state.paymentgateway,
      currency: this.state.currency,
      country: this.state.country,
      cardtype: this.state.cardtype,
      cardnumber: this.handleCardNumber(this.state.cardnumber),
    };
    console.log("searcheddata", searchedData);
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
        this.setState({ searchedResult: data });
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

  handleQuickSearch = (buttonName) => {
    //Today
    if (buttonName === "Today") {
      console.log(buttonName);
      console.log(this.state.activeQuickSearchbtn);
      const currentDate = new Date();
      const from = `${currentDate.getFullYear()}-${(
        "0" +
        (currentDate.getMonth() + 1)
      ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)} 00:00:00`;
      const to = `${currentDate.getFullYear()}-${(
        "0" +
        (currentDate.getMonth() + 1)
      ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)} 23:59:59`;
      console.log("from", from);
      console.log("to", to);
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });

      //Yesterday
    } else if (buttonName === "Yesterday") {
      console.log(buttonName);
      console.log(this.state.activeQuickSearchbtn);
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
      console.log("from", from);
      console.log("to", to);
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });
    }

    //This week
    else if (buttonName === "This Week") {
      console.log(buttonName);
      console.log(this.state.activeQuickSearchbtn);
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
      console.log("from", from);
      console.log("to", to);
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });
    }

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

      console.log("from", from);
      console.log("to", to);
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });

    } else if (buttonName === "This Month") {
      const currentDate = new Date();

      const from = `${currentDate.getFullYear()}-${(
        "0" +
        (currentDate.getMonth() + 1)
      ).slice(-2)}-01 00:00:00`;

      const to = `${currentDate.getFullYear()}-${(
        "0" +
        (currentDate.getMonth() + 1)
      ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)} 23:59:59`;
      console.log("from", from);
      console.log("to", to);
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });

    } else if (buttonName === "Last Month") {
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
      console.log("from", from);
      console.log("to", to);
      this.setState({
        fromDate: from,
        toDate: to,
        activeQuickSearchbtn: buttonName,
      });

    } else if (buttonName === "This Year") {
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
      console.log("from", from);
      console.log("to", to);
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
      showTypedData,
      searchIds,
    } = this.state;
    const searchIdsArray = searchIds.split(/[\s,]+/);
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
                    <div className="id-search-row">
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
                          {searchIdsArray.length > 1 && (
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
                            className="id-input"
                            type="text"
                            id="searchIds"
                            value={searchIds}
                            placeholder="Txn ID/ Merchant Txn ID"
                            onChange={this.handleInputChange}
                          />
                        </div>

                        {showTypedData && (
                          <div ref={(ref) => (this.modalRef = ref)}>
                            <div className="Transaction-monitoring-modal">
                              <p>
                                {searchIdsArray.map((line, index) => (
                                  <span key={index}>
                                    {line}
                                    <br />
                                  </span>
                                ))}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="search-select-div">
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
                        >
                          <option value="">Select Status</option>
                          <option value="SUccess">Success</option>
                          <option value="Failed">Failed</option>
                          <option value="Incompleted">Incompleted</option>
                        </select>
                      </div>
                      <div className="search-select-div">
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
                      <div className="date-input-div">
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
                      <div className="date-input-div">
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
                    </div>

                    <div className="quick-search-div">
                      <div>
                        <p className="p2 date-label">Quick Search:</p>
                        <div>
                          {activeQuickSearchbtn === "Today" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() => this.handleQuickSearch("Today")}
                            >
                              Today
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() => this.handleQuickSearch("Today")}
                            >
                              Today
                            </button>
                          )}

                          {activeQuickSearchbtn === "Yesterday" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Yesterday")
                              }
                            >
                              Yesterday
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Yesterday")
                              }
                            >
                              Yesterday
                            </button>
                          )}

                          {activeQuickSearchbtn === "This Week" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Week")
                              }
                            >
                              This Week
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Week")
                              }
                            >
                              This Week
                            </button>
                          )}
                          {activeQuickSearchbtn === "Last Week" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Week")
                              }
                            >
                              Last Week
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Week")
                              }
                            >
                              Last Week
                            </button>
                          )}
                          {activeQuickSearchbtn === "This Month" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Month")
                              }
                            >
                              This Month
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Month")
                              }
                            >
                              This Month
                            </button>
                          )}
                          {activeQuickSearchbtn === "Last Month" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Month")
                              }
                            >
                              Last Month
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Month")
                              }
                            >
                              Last Month
                            </button>
                          )}
                          {activeQuickSearchbtn === "This Year" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Year")
                              }
                            >
                              This Year
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Year")
                              }
                            >
                              This Year
                            </button>
                          )}
                        </div>
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
                      >
                        <option value="">Select Currency</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
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
                    <div className="id-search-row">
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
                          {searchIdsArray.length > 1 && (
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
                            className="id-input"
                            type="text"
                            id="searchIds"
                            value={searchIds}
                            placeholder="Txn ID/ Merchant Txn ID"
                            onChange={this.handleInputChange}
                          />
                        </div>
                        {showTypedData && (
                          <div ref={(ref) => (this.modalRef = ref)}>
                            <div className="Transaction-monitoring-modal">
                              <p>
                                {searchIdsArray.map((line, index) => (
                                  <span key={index}>
                                    {line}
                                    <br />
                                  </span>
                                ))}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="search-select-div">
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
                        >
                          <option value="">Select Status</option>
                          <option value="Success">Success</option>
                          <option value="Failed">Failed</option>
                          <option value="Incompleted">Incompleted</option>
                        </select>
                      </div>
                      <div className="search-select-div">
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
                      <div className="date-input-div">
                        <label
                          className={`date-label ${
                            this.state.fromDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="fromDate"
                        >
                          From:
                        </label>
                        <input
                          className="date-input"
                          type="datetime-local"
                          id="fromDate"
                          value={this.state.fromDate}
                          onChange={this.handleInputChange}
                        ></input>
                      </div>
                      <div className="date-input-div">
                        <label
                          className={`date-label ${
                            this.state.toDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="toDate"
                        >
                          To:
                        </label>
                        <input
                          className="date-input"
                          type="datetime-local"
                          id="toDate"
                          value={this.state.toDate}
                          onChange={this.handleInputChange}
                        ></input>
                      </div>
                    </div>
                    <div className="quick-search-div">
                      <div>
                        <p className="p2 date-label">Quick Search:</p>
                        <div>
                          {activeQuickSearchbtn === "Today" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() => this.handleQuickSearch("Today")}
                            >
                              Today
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() => this.handleQuickSearch("Today")}
                            >
                              Today
                            </button>
                          )}

                          {activeQuickSearchbtn === "Yesterday" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Yesterday")
                              }
                            >
                              Yesterday
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Yesterday")
                              }
                            >
                              Yesterday
                            </button>
                          )}

                          {activeQuickSearchbtn === "This Week" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Week")
                              }
                            >
                              This Week
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Week")
                              }
                            >
                              This Week
                            </button>
                          )}
                          {activeQuickSearchbtn === "Last Week" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Week")
                              }
                            >
                              Last Week
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Week")
                              }
                            >
                              Last Week
                            </button>
                          )}
                          {activeQuickSearchbtn === "This Month" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Month")
                              }
                            >
                              This Month
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Month")
                              }
                            >
                              This Month
                            </button>
                          )}
                          {activeQuickSearchbtn === "Last Month" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Month")
                              }
                            >
                              Last Month
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Month")
                              }
                            >
                              Last Month
                            </button>
                          )}
                          {activeQuickSearchbtn === "This Year" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Year")
                              }
                            >
                              This Year
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Year")
                              }
                            >
                              This Year
                            </button>
                          )}
                        </div>
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
                    <div className="id-search-row">
                      <div className="id-input-div">
                        <label
                          className={`id-label ${
                            this.state.searchIds ? "filled-id-label" : ""
                          } `}
                          htmlFor="searchIds"
                        >
                          Id:
                        </label>
                        <input
                          className="id-input"
                          type="text"
                          id="searchIds"
                          value={this.state.searchIds}
                          placeholder="Txn ID/ Mercahnt Txn ID"
                          onChange={this.handleInputChange}
                        ></input>
                      </div>
                      <div className="search-select-div">
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
                        >
                          <option value="">Select Status</option>
                          <option value="SUccess">Success</option>
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
                      <div className="date-input-div">
                        <label
                          className={`date-label ${
                            this.state.fromDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="fromDate"
                        >
                          From:
                        </label>
                        <input
                          className="date-input"
                          type="datetime-local"
                          id="fromDate"
                          value={this.state.fromDate}
                          onChange={this.handleInputChange}
                        ></input>
                      </div>
                      <div className="date-input-div">
                        <label
                          className={`date-label ${
                            this.state.toDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="toDate"
                        >
                          To:
                        </label>
                        <input
                          className="date-input"
                          type="datetime-local"
                          id="toDate"
                          value={this.state.toDate}
                          onChange={this.handleInputChange}
                        ></input>
                      </div>
                    </div>
                    <div className="quick-search-div">
                      <div>
                        <p className="p2 date-label">Quick Search:</p>
                        <div>
                          {activeQuickSearchbtn === "Today" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() => this.handleQuickSearch("Today")}
                            >
                              Today
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() => this.handleQuickSearch("Today")}
                            >
                              Today
                            </button>
                          )}

                          {activeQuickSearchbtn === "Yesterday" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Yesterday")
                              }
                            >
                              Yesterday
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Yesterday")
                              }
                            >
                              Yesterday
                            </button>
                          )}

                          {activeQuickSearchbtn === "This Week" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Week")
                              }
                            >
                              This Week
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Week")
                              }
                            >
                              This Week
                            </button>
                          )}
                          {activeQuickSearchbtn === "Last Week" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Week")
                              }
                            >
                              Last Week
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Week")
                              }
                            >
                              Last Week
                            </button>
                          )}
                          {activeQuickSearchbtn === "This Month" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Month")
                              }
                            >
                              This Month
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Month")
                              }
                            >
                              This Month
                            </button>
                          )}
                          {activeQuickSearchbtn === "Last Month" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Month")
                              }
                            >
                              Last Month
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Month")
                              }
                            >
                              Last Month
                            </button>
                          )}
                          {activeQuickSearchbtn === "This Year" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Year")
                              }
                            >
                              This Year
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Year")
                              }
                            >
                              This Year
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="more-options-div">
                      <label className={`id-label ${this.state.mid ? "filled-id-label" : ""} `} htmlFor="mid">
												MID:
											</label>
	
											<select
												className="id-input"
												id="mid"
												value={this.state.mid}
												onChange={this.handleInputChange}
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
                      >
                        <option value="">Select Currency</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
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
                    <div className="id-search-row">
                      <div className="id-input-div">
                        <label
                          className={`id-label ${
                            this.state.searchIds ? "filled-id-label" : ""
                          } `}
                          htmlFor="searchIds"
                        >
                          Id:
                        </label>
                        <input
                          className="id-input"
                          type="text"
                          id="searchIds"
                          value={this.state.searchIds}
                          placeholder="Txn ID/ Mercahnt Txn ID"
                          onChange={this.handleInputChange}
                        ></input>
                        <Eye className="icon2" onClick={this.toggleTypedData} />
                      </div>
                      <div className="search-select-div">
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
                      <div className="date-input-div">
                        <label
                          className={`date-label ${
                            this.state.fromDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="fromDate"
                        >
                          From:
                        </label>
                        <input
                          className="date-input"
                          type="datetime-local"
                          id="fromDate"
                          value={this.state.fromDate}
                          onChange={this.handleInputChange}
                        ></input>
                      </div>
                      <div className="date-input-div">
                        <label
                          className={`date-label ${
                            this.state.toDate ? "filled-id-label" : ""
                          } `}
                          htmlFor="toDate"
                        >
                          To:
                        </label>
                        <input
                          className="date-input"
                          type="datetime-local"
                          id="toDate"
                          value={this.state.toDate}
                          onChange={this.handleInputChange}
                        ></input>
                      </div>
                    </div>
                    <div className="quick-search-div">
                      <div>
                        <p className="p2 date-label">Quick Search:</p>
                        <div>
                          {activeQuickSearchbtn === "Today" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() => this.handleQuickSearch("Today")}
                            >
                              Today
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() => this.handleQuickSearch("Today")}
                            >
                              Today
                            </button>
                          )}

                          {activeQuickSearchbtn === "Yesterday" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Yesterday")
                              }
                            >
                              Yesterday
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Yesterday")
                              }
                            >
                              Yesterday
                            </button>
                          )}

                          {activeQuickSearchbtn === "This Week" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Week")
                              }
                            >
                              This Week
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Week")
                              }
                            >
                              This Week
                            </button>
                          )}
                          {activeQuickSearchbtn === "Last Week" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Week")
                              }
                            >
                              Last Week
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Week")
                              }
                            >
                              Last Week
                            </button>
                          )}
                          {activeQuickSearchbtn === "This Month" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Month")
                              }
                            >
                              This Month
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Month")
                              }
                            >
                              This Month
                            </button>
                          )}
                          {activeQuickSearchbtn === "Last Month" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Month")
                              }
                            >
                              Last Month
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("Last Month")
                              }
                            >
                              Last Month
                            </button>
                          )}
                          {activeQuickSearchbtn === "This Year" ? (
                            <button
                              className="active-quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Year")
                              }
                            >
                              This Year
                            </button>
                          ) : (
                            <button
                              className="quick-search-btn"
                              onClick={() =>
                                this.handleQuickSearch("This Year")
                              }
                            >
                              This Year
                            </button>
                          )}
                        </div>
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
