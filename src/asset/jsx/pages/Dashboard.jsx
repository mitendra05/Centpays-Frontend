import React, { Component } from "react";

// component
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Card7chart from "../components/Card7_piechart";
import Bargraphs from "../components/BarGraphs";
import Card10chart from "../components/Card10_linechart";
import MessageBox from "../components/Message_box";
import CustomTooltip from "../components/Custom-tooltip";
import ScrollUpAndDown from "../components/ScrollUpAndDown";
import Table from "../components/Table";
import Modal from "../components/Modal";

//SVG Icons
import {
  Infoicon,
  UpSign,
  DownSign,
  DollarCircle,
  CreaditCard,
  Wallet,
  PieChart,
  BarChart,
  Calendar,
  Traffic,
} from "../../media/icon/SVGicons";

// images
import visa from "../../media/icon/logoVisa.png";
import mastercard from "../../media/icon/LogoMastercard.png";
import boyimg from "../../media/image/boyimg.png";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);
    this.state = {
      sidebaropen: true,
      userName: this.getCookie("name"),
      merchantName: this.getCookie("company_name"),
      token: this.getCookie("token"),
      userRole: this.getCookie("role"),
      userBehavior: this.getCookie("behavior"),
      userStatus: this.getCookie("status"),
      card1_data: {},
      card2_data: {},
      card9_Data: {},
      eleventhCard: {},
      Card4_bargraph: [],
      Card5_bargraph: [],
      Card8_bargraph: [],
      card10_linechart: [],
      card10_data: [],
      card6_data: [{ card: "Visa" }, { card: "Mastercard" }],
      card7_data: [],
      card9_data: [{ head: "Transactions" }, { head: "Sale Success" }],
      errorMessage: "",
      messageType: "",
      merchant: "",
      isCalendarOpen: false,
      showCalendar: false,
      startDate: startDate,
      endDate: endDate,
      selectedDate: today,
      selectedRowToView: null,
      showModal: false,
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
      tableData: [],
      currency: this.props.selectedCurrency,
    };
    this.calendarRef = React.createRef();
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  componentDidMount = async () => {
    const { userRole, userStatus } = this.state;
    if (userRole==='firstUser' && userStatus==='Pending') {
      this.setState({ showModal: true });
    }

    console.log("User Role:", userRole);
    console.log("User Status:", userStatus);

    if (userStatus === "Active") {
    }
    this.dataInterval = setInterval(() => {
      this.fetchData();
      this.fetchDatacard10();
    }, 900000);
    this.fetchTableData();
    this.interval = setInterval(this.fetchTableData, 20000);
    document.addEventListener("mousedown", this.handleClickOutside);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.calendarRef.current &&
      !this.calendarRef.current.contains(event.target)
    ) {
      this.setState({ showCalendar: false });
    }
  };

  fetchCurrencyList = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token, merchantName } = this.state;
    try {
      const response = await fetch(
        `${backendURL}/currenciesforcompany?company_name=${merchantName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("currency data", data);
      return data[0];
    } catch (error) {
      console.error("Fetch error:", error);
      this.setState({
        errorMessage: "Error fetching data. Please try again later.",
      });
    }
  };

  fetchTableData = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { userRole, merchantName, currency, merchant } = this.state;
    let url = `${backendURL}/latest100`;
    if (userRole === "merchant") {
      url += `?merchant=${merchantName}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const filteredData = data.filter((item) => {
        const matchesMerchant =
          userRole === "merchant"
            ? item.merchant === merchantName
            : !merchant || item.merchant === merchant;
        const matchesCurrency = !currency || item.currency === currency;
        return matchesMerchant && matchesCurrency;
      });
      this.setState({ tableData: filteredData });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleCurrencyChange = (selectedCurrency) => {
    this.setState({ currency: selectedCurrency }, () => {
      this.fetchData();
      this.fetchDatacard10();
      this.fetchDataBasedOnlocalStorage();
    });
  };

  handleMerchantChange = (selectedMerchant) => {
    this.setState({ merchant: selectedMerchant }, () => {
      this.fetchDataBasedOnlocalStorage();
      this.fetchData();
      this.fetchDatacard10();
    });
  };

  fetchDataBasedOnlocalStorage = () => {
    const { currency, startDate, endDate, userRole, merchantName } = this.state;
    const merchant =
      userRole === "merchant" ? merchantName : this.state.merchant;

    const fromDate = startDate.toISOString().split("T")[0];
    const toDate = endDate.toISOString().split("T")[0];
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    this.fetchDataFromURL(
      `${backendURL}/dashboard/todaystats?currency=${currency}&merchant=${merchant}`,
      "card1_data"
    );
    this.fetchDataFromURL(
      `${backendURL}/dashboard/weeklystats?currency=${currency}&merchant=${merchant}&fromDate=${fromDate}&toDate=${toDate}`,
      "card2_data"
    );
    this.fetchDataFromURL(
      `${backendURL}/dashboard/cardcomparison?currency=${currency}&merchant=${merchant}`,
      "card6_data"
    );
    this.fetchDataFromURL(
      `${backendURL}/dashboard/weeklyTop4Countries?currency=${currency}&merchant=${merchant}`,
      "card7_data"
    );
    this.fetchDataFromURL(
      `${backendURL}/dashboard/monthlyTransactionMetrics?currency=${currency}&merchant=${merchant}`,
      "card9_Data"
    );
  };

  formatValue = (val) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return val;
  };

  fetchDataFromURL = async (url, stateKey) => {
    const { token } = this.state;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching data from ${url}. Status: ${response.status}`
        );
      }

      const data = await response.json();

      if (stateKey === "card7_data") {
        const card7_data = data.topCountries.map((item) => ({
          region: item._id,
          no: item.transactionCount,
          amount: item.totalAmount,
        }));
        this.setState({ card7_data });
      } else if (stateKey === "card6_data") {
        const { visaDifference, mastercardDifference } = data;
        const card6_data = [
          { card: "Visa", amount: visaDifference },
          { card: "Mastercard", amount: mastercardDifference },
        ];
        this.setState({ card6_data });
      } else {
        this.setState({ [stateKey]: data });
      }
    } catch (error) {
      this.setState({
        errorMessage: "Error fetching rates data:dlifgeiufghi",
        error,
      });
    }
  };

  fetchData = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { currency, startDate, token, endDate, userRole, merchantName } =
      this.state;

    // const role = localStorage.getItem("role");
    // const company_name = localStorage.getItem("company_name");
    const merchant =
      userRole === "merchant" ? merchantName : this.state.merchant;
    const fromDate = startDate.toISOString().split("T")[0];
    const toDate = endDate.toISOString().split("T")[0];
    try {
      const response = await fetch(
        `${backendURL}/dashboard/weeklystats?currency=${currency}&merchant=${merchant}&fromDate=${fromDate}&toDate=${toDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        this.setState({
          errorMessage: "Network response was not OK",
          messageType: "fail",
        });
        return;
      }

      const jsonData = await response.json();

      const formattedData = jsonData.results.map((result) => ({
        day: result.date,
        success: result.successCount,
        fail: result.failedCount,
        incomplete: result.incompleteCount,
      }));

      const formattedData2 = jsonData.results.map((result) => ({
        day: result.date,
        successCount: result.successCount,
      }));

      const formattedData3 = jsonData.transactionCounts.map((item) => ({
        day: item.date,
        count: item.totalCount,
      }));

      formattedData.reverse();
      formattedData2.reverse();
      formattedData3.reverse();

      this.setState({
        Card4_bargraph: formattedData,
        Card8_bargraph: formattedData2,
        Card5_bargraph: formattedData3,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchDatacard10 = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { currency, token, userRole, merchantName } = this.state;

    // // Retrieve role and company_name from local storage
    // const role = localStorage.getItem("role");
    // const company_name = localStorage.getItem("company_name");
    const merchant =
      userRole === "merchant" ? merchantName : this.state.merchant;
    try {
      const response = await fetch(
        `${backendURL}/dashboard/successlast6Months?currency=${currency}&merchant=${merchant}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        this.setState({
          errorMessage: "Network response was not OK",
          messageType: "fail",
        });
        return;
      }

      const jsonData = await response.json();

      const salesByMonthData = Object.entries(jsonData.salesByMonth).map(
        ([monthYear, sales]) => ({
          monthYear,
          sales: sales,
        })
      );

      const totalSales = jsonData.totalSales;
      this.setState({
        card10_linechart: salesByMonthData,
        card10_data: totalSales,
      });
    } catch (error) {
      this.setState({
        errorMessage: "Error fetching data",
        messageType: "fail",
      });
    }
  };

  getCurrencySymbol = (currency) => {
    const { headerLabels } = this.state;
    const currencyLabel = headerLabels.find(
      (label) => label.label === "currency"
    );
    if (currencyLabel) {
      return currencyLabel.heading;
    } else {
      return "";
    }
  };

  handleToggleOptions = () => {
    this.setState((prevState) => ({
      showCalendar: !prevState.showCalendar,
    }));
  };

  handleDateShift = (direction) => {
    this.setState(
      (prevState) => {
        const newStartDate = new Date(prevState.startDate);
        const newEndDate = new Date(prevState.endDate);
        newStartDate.setDate(newStartDate.getDate() + direction * 7);
        newEndDate.setDate(newEndDate.getDate() + direction * 7);

        return { startDate: newStartDate, endDate: newEndDate };
      },
      () => {
        this.fetchDataBasedOnlocalStorage();
        this.fetchData();
      }
    );
  };

  handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    if (!isNaN(selectedDate.getTime())) {
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 6);
      this.setState(
        {
          selectedDate: selectedDate,
          startDate: selectedDate,
          endDate: endDate,
        },
        () => {
          this.fetchData();
          this.fetchDataBasedOnlocalStorage();
        }
      );
    }
  };

  handleDateClick = (date) => {
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6);
    this.setState({ selectedDate: date, startDate: date, endDate: endDate });
  };

  formatDateRange = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const startDay = startDate.getDate();
    const startMonth = String(startDate.getMonth() + 1).padStart(2, "0");
    const endDay = endDate.getDate();
    const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");
    return `${startDay}/${startMonth} to ${endDay}/${endMonth}`;
  };

  handleLogout = () => {
    this.deleteCookie("name");
    this.deleteCookie("email");
    this.deleteCookie("role");
    this.deleteCookie("company_name");
    this.deleteCookie("token");

    window.location.href = "/";
  };

  deleteCookie = (name) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };


  render() {
    const {
      card1_data,
      card2_data,
      card6_data,
      card7_data,
      card9_data,
      card9_Data,
      card10_data,
      merchantName,
      errorMessage,
      messageType,
      currency,
      headerLabels,
      tableData,
      userRole,
      userStatus,
      showModal 
    } = this.state;

    const shouldBlurHeaderAndSidebar = userRole === 'firstUser';
    const shouldBlur = userRole === 'firstUser' || userRole === 'merchant';
    const pendingMessage = "You are Successfully logged in";

    const { showCalendar, startDate, endDate } = this.state;

    const card7_sumOfAmount = card7_data.reduce(
      (acc, curr) => acc + parseFloat(curr.amount),
      0
    );

    const percentageChange = parseFloat(card2_data.percentageChange);
    const validCurrencyCodes = ["USD", "EUR", "GBP", "INR"];
    const validateCurrency = (currency) => {
      return validCurrencyCodes.includes(currency) ? currency : "USD";
    };

    if (userRole !== "Pending") {
      return (
        <>
          {errorMessage && (
            <MessageBox
              message={pendingMessage}
              messageType="success"
              onClose={() => this.setState({ errorMessage: "" })}
            />
          )}
           {showModal &&(
           <Modal
           onClose={() => this.handleLogout("close")}
           onDecline={() => this.handleLogout("decline")}
           onAccept={() => this.handleLogout()}
           showDeclinebtn={false}
           acceptbtnname={"Logout"}
           showFotter={true}
           stopScroll={true}
           modalHeading={"📝"}
           showBackground={true}
           modalBody={
             <div className="edit-status">
              <p className="p2">After your profile is approved by the owner, you will be able to logged in.</p>
             </div>
           }
         />
        )}
          <div className={shouldBlurHeaderAndSidebar ? 'blur-effect' : ''}>
            <Header
              onCurrencyChange={this.handleCurrencyChange}
              onMerchantChange={this.handleMerchantChange}
            />
          </div>
          <div className={shouldBlurHeaderAndSidebar ? 'blur-effect' : ''}>
            <Sidebar />
          </div>
          <div
            className={`main-screen ${this.state.sidebaropen
                ? "collapsed-main-screen"
                : "expanded-main-screen"
              }  `}
            style={shouldBlur ? { filter: 'blur(10px)' } : {}}
          >
            <div className="main-screen-rows first-row">
              <div className="row-cards first-row-card1">
                <div className="first-row-card1-head">
                  <h4>
                    Congratulations{" "}
                    <span style={{ fontWeight: "600" }}>{merchantName}</span>!🎉
                  </h4>
                  <p className="p2">
                    You have done {card1_data.successPercentage}% sales today 😎
                  </p>
                </div>
                <img
                  className="first-row-card1-image"
                  src={boyimg}
                  alt="Boy icon"
                />
              </div>
              <div className="row-cards first-row-card2">
                <div className="card-head-with-view-more">
                  <div className="card2-div card2-icon1">
                    <DollarCircle className="creditcard-img green-icon" />
                  </div>
                  <CustomTooltip details="This card displays the total amount of successful transactions that have occurred today.">
                    <Infoicon className="icon2" />
                  </CustomTooltip>
                </div>

                <div className="first-row-card2-details">
                  <p>Sales</p>
                  <h3 className="first-row-card2-details-amount">
                    {parseFloat(card1_data.successAmount).toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: validateCurrency(currency),
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }
                    )}
                  </h3>
                  <p>Today's Sale</p>
                </div>
              </div>

              <div className="row-cards first-row-card2">
                <div className="card-head-with-view-more">
                  <div className="card2-div card2-icon2">
                    <CreaditCard className="creditcard-img grey-icon" />
                  </div>
                  <CustomTooltip
                    details={
                      <p>
                        This card tracks the total number of transactions for
                        today
                      </p>
                    }
                  >
                    <Infoicon className="icon2" />
                  </CustomTooltip>
                </div>
                <div className="first-row-card2-details">
                  <p>Total</p>
                  <h3 className="first-row-card2-details-amount">
                    {this.formatValue(card1_data.totalTransactions)}
                  </h3>
                  <p>Today's Transactions</p>
                </div>
              </div>
            </div>
            <div className="main-screen-rows second-row">
              <div className="row-cards second-row-card1">
                <div className="second-row-card1-left">
                  <h4>Weekly Overview</h4>

                  <Bargraphs data={this.state.Card4_bargraph} type="bargraph4" />
                </div>
                <div className="vertical-line-card1"></div>
                <div className="second-row-card1-right">
                  <div className="second-row-card1-view-date">
                    <div
                      className="card2-div card3-icon"
                      onClick={this.handleToggleOptions}
                    >
                      <Calendar className="creditcard-img grey-icon" />
                    </div>
                    <CustomTooltip
                      maxWidth={250}
                      leftMargin={-5}
                      details={
                        <ul>
                          <li>
                            Left part of the card provides a breakdown of number
                            of transactions (successful, failed, incomplete) for
                            this week.
                          </li>
                          <li>
                            The right side shows amount of successful
                            transactions, amount of failed transactions and the
                            total mount of transactions for the complete week.
                          </li>
                        </ul>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>

                    {showCalendar && (
                      <div className="options-container" ref={this.calendarRef}>
                        <div className="option dates">
                          <span>{this.formatDateRange(startDate, endDate)}</span>
                          <div className="arrows">
                            <UpSign
                              className="arrowup"
                              onClick={() => this.handleDateShift(+1)}
                            />
                            <DownSign
                              className="arrowdown"
                              onClick={() => this.handleDateShift(-1)}
                            />
                          </div>
                        </div>
                        <div className="option">
                          <input
                            type="date"
                            className="input-calender"
                            onChange={this.handleDateChange}
                            value={
                              this.state.selectedDate.toISOString().split("T")[0]
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="second-row-card1-details">
                    <div className="creditcard-div card4-icon">
                      <DollarCircle className="creditcard-img green-icon" />
                    </div>
                    <div className="second-row-card1-div">
                      <p>
                        {parseFloat(card2_data.successThisWeek).toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: validateCurrency(currency),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }
                        )}
                      </p>
                      <p>Success</p>
                    </div>
                  </div>
                  <div className="second-row-card1-details">
                    <div className="creditcard-div card4-icon">
                      <PieChart className="creditcard-img primary-color-icon"></PieChart>
                    </div>
                    <div className="second-row-card1-div">
                      <p>
                        {parseFloat(card2_data.failedThisWeek).toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: validateCurrency(currency),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }
                        )}
                      </p>
                      <p>Fail</p>
                    </div>
                  </div>
                  <div className="second-row-card1-details">
                    <div className="creditcard-div card4-icon">
                      <CreaditCard className="creditcard-img grey-icon" />
                    </div>
                    <div className="second-row-card1-div">
                      <p>
                        {parseFloat(card2_data.totalThisWeek).toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: validateCurrency(currency),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }
                        )}
                      </p>
                      <p>Total</p>
                    </div>
                  </div>
                  <button className="btn-primary second-card1-btn">
                    View Report
                  </button>
                </div>
              </div>
              <div className="row-cards second-row-card2">
                <div className="card-head-with-view-more">
                  <div className="card2-div-traffic-status">
                    <div className="card2-div card4-icon">
                      <Traffic className="creditcard-img grey-icon" />
                    </div>
                    <h4>Traffic Status</h4>
                  </div>
                  <div className="card4-viewmore">
                    <CustomTooltip
                      details={
                        <p>
                          This card summarizes the total number of transactions
                          this week."
                        </p>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>
                </div>
                <Bargraphs type="bargraph5" data={this.state.Card5_bargraph} />

                <div className="second-row-card2-totaltraffic">
                  {" "}
                  <h3>
                    {this.formatValue(card2_data.totalNumTxn)}
                    {"  "}
                    <span className="p2">Total Traffic This Week</span>
                  </h3>
                </div>
              </div>
            </div>

            <div className="main-screen-rows third-row">
              <div className="row-cards third-row-card1">
                <div className="card-head-with-view-more">
                  <h4>Transactions</h4>
                  <CustomTooltip
                    details={
                      <p>
                        This card compares the difference between amounts of
                        transactions segregated by cards (VISA and Mastercard) of
                        this week and the previous week
                      </p>
                    }
                  >
                    <Infoicon className="icon2" />
                  </CustomTooltip>
                </div>
                <div className="creditcard-content">
                  <div className="creditcard">
                    <div className="creditcard-div visa">
                      <img className="creditcard-img" src={visa} alt=""></img>
                    </div>
                    <div>
                      <h5>{card6_data[0].card}</h5>

                      <p className="p2">
                        {parseFloat(card6_data[0]["amount"]).toLocaleString(
                          "en-IN",
                          {
                            style: "currency",
                            currency: validateCurrency(currency),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }
                        )}
                      </p>
                    </div>
                    {parseFloat(card6_data[0].amount) > 0 ? (
                      <div className="amount-container">
                        <UpSign className="arrow green-icon" />
                      </div>
                    ) : (
                      <div className="amount-container">
                        <DownSign className="arrow red-icon" />
                      </div>
                    )}
                  </div>

                  <div className="creditcard">
                    <div className="creditcard-div visa">
                      <img
                        className="creditcard-img"
                        src={mastercard}
                        alt="mastercard"
                      ></img>
                    </div>
                    <div>
                      <h5>{card6_data[1].card}</h5>
                      <p className="p2">
                        {parseFloat(card6_data[1]["amount"]).toLocaleString(
                          "en-IN",
                          {
                            style: "currency",
                            currency: validateCurrency(currency),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }
                        )}
                      </p>
                    </div>
                    {parseFloat(card6_data[1].amount) > 0 ? (
                      <div className="amount-container">
                        <UpSign className="arrow green-icon" />
                      </div>
                    ) : (
                      <div className="amount-container">
                        <DownSign className="arrow red-icon" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row-cards third-row-card2">
                <div className="card-head-with-view-more">
                  <h4>Weekly Country-wise Overview</h4>
                  <CustomTooltip
                    maxWidth={300}
                    leftMargin={-15}
                    details={
                      <ul>
                        <li>
                          Left part of the card provides a breakdown of number of
                          transactions (successful, failed, incomplete) for this
                          week.
                        </li>
                        <li>
                          The right side shows amount of successful transactions,
                          amount of failed transactions and the total mount of
                          transactions for the complete week.
                        </li>
                      </ul>
                    }
                  >
                    <Infoicon className="icon2" />
                  </CustomTooltip>
                </div>

                <Card7chart card7_data={card7_data} />
                <div className="card7-content">
                  <div className="card7-head">
                    <div>
                      <div className="creditcard-div card7-icon">
                        <Wallet className="creditcard-img blue-icon"></Wallet>
                      </div>
                    </div>
                    <div>
                      <p className="p2">Number of Sales</p>
                      <h5>
                        {parseFloat(card7_sumOfAmount).toLocaleString("en-US", {
                          style: "currency",
                          currency: validateCurrency(currency),
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </h5>
                    </div>
                  </div>
                  <div className="ruler"></div>
                  <div className="card7-content-grid">
                    {card7_data.map((item) => (
                      <div className="card7-grid-item p2">
                        <div className="grid-item-head">
                          <div></div>
                          <span className="region-container">
                            <p
                              className={`region-names ${item.region.length > 9 ? "animate-region" : ""
                                }`}
                            >
                              {item.region}
                            </p>
                          </span>
                        </div>
                        <p className="region-amounts">
                          {parseFloat(item["amount"]).toLocaleString("en-US", {
                            style: "currency",
                            currency: validateCurrency(currency),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    ))}{" "}
                  </div>
                </div>
              </div>{" "}
              <div className="row-cards third-row-card3">
                <div className="card-head-with-view-more">
                  <h4>Weekly Successful Transactions</h4>
                  <CustomTooltip
                    details={
                      <p>
                        This card shows number of successful transactions for this
                        week.
                      </p>
                    }
                  >
                    <Infoicon className="icon2" />
                  </CustomTooltip>
                </div>
                <Bargraphs data={this.state.Card8_bargraph} type="bargraph7" />
                <div className="third-row-card3-data">
                  <h3>{percentageChange.toFixed(1)}%</h3>
                  <p className="p2">
                    Your sales performance is {percentageChange.toFixed(1)}%{" "}
                    compared to last week.
                  </p>
                </div>
              </div>
            </div>
            <div className="main-screen-rows fourth-row">
              <div className="row-cards fourth-row-card1">
                <div className="card-head-with-view-more">
                  <h4>Performance This Month</h4>
                  <CustomTooltip
                    maxWidth={350}
                    leftMargin={-15}
                    details={
                      <p>
                        This card shows key metrics for transactions in the last
                        month total number of transactions, total volume of
                        transactions, number of successful transactions, volume of
                        successful transactions
                      </p>
                    }
                  >
                    <Infoicon className="icon2" />
                  </CustomTooltip>
                </div>
                <p className="card9-subhead">
                  Your performance this month is{" "}
                  {String(card9_Data.growthPercentage).slice(0, 5)}% in comparison
                  to previous month
                  <span className="p2"></span>
                </p>
                <div className="card9-content">
                  <div className="card7-head">
                    <div>
                      <div className="creditcard-div card9-icon1">
                        <PieChart className="creditcard-img white-icon"></PieChart>
                      </div>
                    </div>
                    <div className="card9-text">
                      <p className="p2"># {card9_data[0].head}</p>
                      <h5>{this.formatValue(card9_Data.numTransactions)}</h5>
                    </div>
                  </div>

                  <div className="card7-head">
                    <div>
                      <div className="creditcard-div card9-icon2">
                        <CreaditCard className="creditcard-img white-icon" />
                      </div>
                    </div>
                    <div className="card9-text">
                      <p className="p2">$ {card9_data[0].head}</p>
                      <h5>
                        {parseFloat(
                          card9_Data.totalAmountTransactions
                        ).toLocaleString("en-US", {
                          style: "currency",
                          currency: validateCurrency(currency),
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </h5>
                    </div>
                  </div>

                  <div className="card7-head">
                    <div>
                      <div className="creditcard-div card9-icon3">
                        <BarChart className="creditcard-img white-icon" />
                      </div>
                    </div>
                    <div className="card9-text">
                      <p className="p2"># {card9_data[1].head}</p>
                      <h5>
                        {this.formatValue(card9_Data.numSuccessfulTransactions)}
                      </h5>
                    </div>
                  </div>

                  <div className="card7-head">
                    <div>
                      <div className="creditcard-div card9-icon4">
                        <DollarCircle className="creditcard-img white-icon" />
                      </div>
                    </div>
                    <div className="card9-text">
                      <p className="p2">$ {card9_data[1].head}</p>
                      <h5>
                        {parseFloat(
                          card9_Data.totalAmountSuccessfulTransactions
                        ).toLocaleString("en-US", {
                          style: "currency",
                          currency: validateCurrency(currency),
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row-cards fourth-row-card2">
                <div className="card-head-with-view-more">
                  {" "}
                  <h4>
                    Total Sales{` `}
                    <span className="p2">
                      {parseFloat(card10_data).toLocaleString("en-US", {
                        style: "currency",
                        currency: validateCurrency(currency),
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </h4>
                  <CustomTooltip
                    details={
                      <p>
                        This card visualizes the volume of successful transactions
                        of last 6 months.
                      </p>
                    }
                  >
                    <Infoicon className="icon2" />
                  </CustomTooltip>
                </div>

                <Card10chart salesByMonthData={this.state.card10_linechart} />
              </div>
            </div>
            <div className="main-screen-rows ">
              <div className="row-cards search-table">
                <Table
                  headerLabels={headerLabels}
                  dataToRender={tableData || []}
                  onViewClick={this.handleViewClick}
                />
              </div>
              <ScrollUpAndDown showScrollToTopButton={true} />
            </div>
          </div>
        </>

      );
    } else {
      if (userRole === "admin" || userRole === "FirstUser") {
        return (
          <>
            {errorMessage && (
              <MessageBox
                message={errorMessage}
                messageType={messageType}
                onClose={() => this.setState({ errorMessage: "" })}
              />
            )}

            <Header
              onCurrencyChange={this.handleCurrencyChange}
              onMerchantChange={this.handleMerchantChange}
            />
            <Sidebar />
            <div
              className={`main-screen ${this.state.sidebaropen
                  ? "collapsed-main-screen"
                  : "expanded-main-screen"
                }  `}
            >
              <div className="main-screen-rows first-row">
                <div className="row-cards first-row-card1">
                  <div className="first-row-card1-head">
                    <h4>
                      Congratulations{" "}
                      <span style={{ fontWeight: "600" }}>{merchantName}</span>
                      !🎉
                    </h4>
                    <p className="p2">
                      You have done {card1_data.successPercentage}% sales today
                      😎
                    </p>
                  </div>
                  <img
                    className="first-row-card1-image"
                    src={boyimg}
                    alt="Boy icon"
                  />
                </div>
                <div className="row-cards first-row-card2">
                  <div className="card-head-with-view-more">
                    <div className="card2-div card2-icon1">
                      <DollarCircle className="creditcard-img green-icon" />
                    </div>
                    <CustomTooltip details="This card displays the total amount of successful transactions that have occurred today.">
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>

                  <div className="first-row-card2-details">
                    <p>Sales</p>
                    <h3 className="first-row-card2-details-amount">
                      {parseFloat(card1_data.successAmount).toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: validateCurrency(currency),
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }
                      )}
                    </h3>
                    <p>Today's Sale</p>
                  </div>
                </div>

                <div className="row-cards first-row-card2">
                  <div className="card-head-with-view-more">
                    <div className="card2-div card2-icon2">
                      <CreaditCard className="creditcard-img grey-icon" />
                    </div>
                    <CustomTooltip
                      details={
                        <p>
                          This card tracks the total number of transactions for
                          today
                        </p>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>
                  <div className="first-row-card2-details">
                    <p>Total</p>
                    <h3 className="first-row-card2-details-amount">
                      {this.formatValue(card1_data.totalTransactions)}
                    </h3>
                    <p>Today's Transactions</p>
                  </div>
                </div>
              </div>
              <div className="main-screen-rows second-row">
                <div className="row-cards second-row-card1">
                  <div className="second-row-card1-left">
                    <h4>Weekly Overview</h4>

                    <Bargraphs
                      data={this.state.Card4_bargraph}
                      type="bargraph4"
                    />
                  </div>
                  <div className="vertical-line-card1"></div>
                  <div className="second-row-card1-right">
                    <div className="second-row-card1-view-date">
                      <div
                        className="card2-div card3-icon"
                        onClick={this.handleToggleOptions}
                      >
                        <Calendar className="creditcard-img grey-icon" />
                      </div>
                      <CustomTooltip
                        maxWidth={250}
                        leftMargin={-5}
                        details={
                          <ul>
                            <li>
                              Left part of the card provides a breakdown of
                              number of transactions (successful, failed,
                              incomplete) for this week.
                            </li>
                            <li>
                              The right side shows amount of successful
                              transactions, amount of failed transactions and
                              the total mount of transactions for the complete
                              week.
                            </li>
                          </ul>
                        }
                      >
                        <Infoicon className="icon2" />
                      </CustomTooltip>

                      {showCalendar && (
                        <div
                          className="options-container"
                          ref={this.calendarRef}
                        >
                          <div className="option dates">
                            <span>
                              {this.formatDateRange(startDate, endDate)}
                            </span>
                            <div className="arrows">
                              <UpSign
                                className="arrowup"
                                onClick={() => this.handleDateShift(+1)}
                              />
                              <DownSign
                                className="arrowdown"
                                onClick={() => this.handleDateShift(-1)}
                              />
                            </div>
                          </div>
                          <div className="option">
                            <input
                              type="date"
                              className="input-calender"
                              onChange={this.handleDateChange}
                              value={
                                this.state.selectedDate
                                  .toISOString()
                                  .split("T")[0]
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="second-row-card1-details">
                      <div className="creditcard-div card4-icon">
                        <DollarCircle className="creditcard-img green-icon" />
                      </div>
                      <div className="second-row-card1-div">
                        <p>
                          {parseFloat(
                            card2_data.successThisWeek
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: validateCurrency(currency),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </p>
                        <p>Success</p>
                      </div>
                    </div>
                    <div className="second-row-card1-details">
                      <div className="creditcard-div card4-icon">
                        <PieChart className="creditcard-img primary-color-icon"></PieChart>
                      </div>
                      <div className="second-row-card1-div">
                        <p>
                          {parseFloat(card2_data.failedThisWeek).toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: validateCurrency(currency),
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}
                        </p>
                        <p>Fail</p>
                      </div>
                    </div>
                    <div className="second-row-card1-details">
                      <div className="creditcard-div card4-icon">
                        <CreaditCard className="creditcard-img grey-icon" />
                      </div>
                      <div className="second-row-card1-div">
                        <p>
                          {parseFloat(card2_data.totalThisWeek).toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: validateCurrency(currency),
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}
                        </p>
                        <p>Total</p>
                      </div>
                    </div>
                    <button className="btn-primary second-card1-btn">
                      View Report
                    </button>
                  </div>
                </div>
                <div className="row-cards second-row-card2">
                  <div className="card-head-with-view-more">
                    <div className="card2-div-traffic-status">
                      <div className="card2-div card4-icon">
                        <Traffic className="creditcard-img grey-icon" />
                      </div>
                      <h4>Traffic Status</h4>
                    </div>
                    <div className="card4-viewmore">
                      <CustomTooltip
                        details={
                          <p>
                            This card summarizes the total number of
                            transactions this week."
                          </p>
                        }
                      >
                        <Infoicon className="icon2" />
                      </CustomTooltip>
                    </div>
                  </div>
                  <Bargraphs
                    type="bargraph5"
                    data={this.state.Card5_bargraph}
                  />

                  <div className="second-row-card2-totaltraffic">
                    {" "}
                    <h3>
                      {this.formatValue(card2_data.totalNumTxn)}
                      {"  "}
                      <span className="p2">Total Traffic This Week</span>
                    </h3>
                  </div>
                </div>
              </div>

              <div className="main-screen-rows third-row">
                <div className="row-cards third-row-card1">
                  <div className="card-head-with-view-more">
                    <h4>Transactions</h4>
                    <CustomTooltip
                      details={
                        <p>
                          This card compares the difference between amounts of
                          transactions segregated by cards (VISA and Mastercard)
                          of this week and the previous week
                        </p>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>
                  <div className="creditcard-content">
                    <div className="creditcard">
                      <div className="creditcard-div visa">
                        <img className="creditcard-img" src={visa} alt=""></img>
                      </div>
                      <div>
                        <h5>{card6_data[0].card}</h5>

                        <p className="p2">
                          {parseFloat(card6_data[0]["amount"]).toLocaleString(
                            "en-IN",
                            {
                              style: "currency",
                              currency: validateCurrency(currency),
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}
                        </p>
                      </div>
                      {parseFloat(card6_data[0].amount) > 0 ? (
                        <div className="amount-container">
                          <UpSign className="arrow green-icon" />
                        </div>
                      ) : (
                        <div className="amount-container">
                          <DownSign className="arrow red-icon" />
                        </div>
                      )}
                    </div>

                    <div className="creditcard">
                      <div className="creditcard-div visa">
                        <img
                          className="creditcard-img"
                          src={mastercard}
                          alt="mastercard"
                        ></img>
                      </div>
                      <div>
                        <h5>{card6_data[1].card}</h5>
                        <p className="p2">
                          {parseFloat(card6_data[1]["amount"]).toLocaleString(
                            "en-IN",
                            {
                              style: "currency",
                              currency: validateCurrency(currency),
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}
                        </p>
                      </div>
                      {parseFloat(card6_data[1].amount) > 0 ? (
                        <div className="amount-container">
                          <UpSign className="arrow green-icon" />
                        </div>
                      ) : (
                        <div className="amount-container">
                          <DownSign className="arrow red-icon" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row-cards third-row-card2">
                  <div className="card-head-with-view-more">
                    <h4>Weekly Country-wise Overview</h4>
                    <CustomTooltip
                      maxWidth={300}
                      leftMargin={-15}
                      details={
                        <ul>
                          <li>
                            Left part of the card provides a breakdown of number
                            of transactions (successful, failed, incomplete) for
                            this week.
                          </li>
                          <li>
                            The right side shows amount of successful
                            transactions, amount of failed transactions and the
                            total mount of transactions for the complete week.
                          </li>
                        </ul>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>

                  <Card7chart card7_data={card7_data} />
                  <div className="card7-content">
                    <div className="card7-head">
                      <div>
                        <div className="creditcard-div card7-icon">
                          <Wallet className="creditcard-img blue-icon"></Wallet>
                        </div>
                      </div>
                      <div>
                        <p className="p2">Number of Sales</p>
                        <h5>
                          {parseFloat(card7_sumOfAmount).toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: validateCurrency(currency),
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}
                        </h5>
                      </div>
                    </div>
                    <div className="ruler"></div>
                    <div className="card7-content-grid">
                      {card7_data.map((item) => (
                        <div className="card7-grid-item p2">
                          <div className="grid-item-head">
                            <div></div>
                            <span className="region-container">
                              <p
                                className={`region-names ${item.region.length > 9 ? "animate-region" : ""
                                  }`}
                              >
                                {item.region}
                              </p>
                            </span>
                          </div>
                          <p className="region-amounts">
                            {parseFloat(item["amount"]).toLocaleString(
                              "en-US",
                              {
                                style: "currency",
                                currency: validateCurrency(currency),
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }
                            )}
                          </p>
                        </div>
                      ))}{" "}
                    </div>
                  </div>
                </div>{" "}
                <div className="row-cards third-row-card3">
                  <div className="card-head-with-view-more">
                    <h4>Weekly Successful Transactions</h4>
                    <CustomTooltip
                      details={
                        <p>
                          This card shows number of successful transactions for
                          this week.
                        </p>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>
                  <Bargraphs
                    data={this.state.Card8_bargraph}
                    type="bargraph7"
                  />
                  <div className="third-row-card3-data">
                    <h3>{percentageChange.toFixed(1)}%</h3>
                    <p className="p2">
                      Your sales performance is {percentageChange.toFixed(1)}%{" "}
                      compared to last week.
                    </p>
                  </div>
                </div>
              </div>
              <div className="main-screen-rows fourth-row">
                <div className="row-cards fourth-row-card1">
                  <div className="card-head-with-view-more">
                    <h4>Performance This Month</h4>
                    <CustomTooltip
                      maxWidth={350}
                      leftMargin={-15}
                      details={
                        <p>
                          This card shows key metrics for transactions in the
                          last month total number of transactions, total volume
                          of transactions, number of successful transactions,
                          volume of successful transactions
                        </p>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>
                  <p className="card9-subhead">
                    Your performance this month is{" "}
                    {String(card9_Data.growthPercentage).slice(0, 5)}% in
                    comparison to previous month
                    <span className="p2"></span>
                  </p>
                  <div className="card9-content">
                    <div className="card7-head">
                      <div>
                        <div className="creditcard-div card9-icon1">
                          <PieChart className="creditcard-img white-icon"></PieChart>
                        </div>
                      </div>
                      <div className="card9-text">
                        <p className="p2"># {card9_data[0].head}</p>
                        <h5>{this.formatValue(card9_Data.numTransactions)}</h5>
                      </div>
                    </div>

                    <div className="card7-head">
                      <div>
                        <div className="creditcard-div card9-icon2">
                          <CreaditCard className="creditcard-img white-icon" />
                        </div>
                      </div>
                      <div className="card9-text">
                        <p className="p2">$ {card9_data[0].head}</p>
                        <h5>
                          {parseFloat(
                            card9_Data.totalAmountTransactions
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: validateCurrency(currency),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </h5>
                      </div>
                    </div>

                    <div className="card7-head">
                      <div>
                        <div className="creditcard-div card9-icon3">
                          <BarChart className="creditcard-img white-icon" />
                        </div>
                      </div>
                      <div className="card9-text">
                        <p className="p2"># {card9_data[1].head}</p>
                        <h5>
                          {this.formatValue(
                            card9_Data.numSuccessfulTransactions
                          )}
                        </h5>
                      </div>
                    </div>

                    <div className="card7-head">
                      <div>
                        <div className="creditcard-div card9-icon4">
                          <DollarCircle className="creditcard-img white-icon" />
                        </div>
                      </div>
                      <div className="card9-text">
                        <p className="p2">$ {card9_data[1].head}</p>
                        <h5>
                          {parseFloat(
                            card9_Data.totalAmountSuccessfulTransactions
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: validateCurrency(currency),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row-cards fourth-row-card2">
                  <div className="card-head-with-view-more">
                    {" "}
                    <h4>
                      Total Sales{` `}
                      <span className="p2">
                        {parseFloat(card10_data).toLocaleString("en-US", {
                          style: "currency",
                          currency: validateCurrency(currency),
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </h4>
                    <CustomTooltip
                      details={
                        <p>
                          This card visualizes the volume of successful
                          transactions of last 6 months.
                        </p>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>

                  <Card10chart salesByMonthData={this.state.card10_linechart} />
                </div>
              </div>
              <div className="main-screen-rows ">
                <div className="row-cards search-table">
                  <Table
                    headerLabels={headerLabels}
                    dataToRender={tableData || []}
                    onViewClick={this.handleViewClick}
                  />
                </div>
                <ScrollUpAndDown showScrollToTopButton={true} />
              </div>
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

            <Header
              onCurrencyChange={this.handleCurrencyChange}
              onMerchantChange={this.handleMerchantChange}
            />
            <Sidebar />
            <div
              className={`main-screen ${this.state.sidebaropen
                  ? "collapsed-main-screen"
                  : "expanded-main-screen"
                }  `}
            >
              <div className="main-screen-rows first-row">
                <div className="row-cards first-row-card1">
                  <div className="first-row-card1-head">
                    <h4>
                      Congratulations{" "}
                      <span style={{ fontWeight: "600" }}>{merchantName}</span>
                      !🎉
                    </h4>
                    <p className="p2">
                      You have done {card1_data.successPercentage}% sales today
                      😎
                    </p>
                  </div>
                  <img
                    className="first-row-card1-image"
                    src={boyimg}
                    alt="Boy icon"
                  />
                </div>
                <div className="row-cards first-row-card2">
                  <div className="card-head-with-view-more">
                    <div className="card2-div card2-icon1">
                      <DollarCircle className="creditcard-img green-icon" />
                    </div>
                    <CustomTooltip details="This card displays the total amount of successful transactions that have occurred today.">
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>

                  <div className="first-row-card2-details">
                    <p>Sales</p>
                    <h3 className="first-row-card2-details-amount">
                      {parseFloat(card1_data.successAmount).toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: validateCurrency(currency),
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }
                      )}
                    </h3>
                    <p>Today's Sale</p>
                  </div>
                </div>

                <div className="row-cards first-row-card2">
                  <div className="card-head-with-view-more">
                    <div className="card2-div card2-icon2">
                      <CreaditCard className="creditcard-img grey-icon" />
                    </div>
                    <CustomTooltip
                      details={
                        <p>
                          This card tracks the total number of transactions for
                          today
                        </p>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>
                  <div className="first-row-card2-details">
                    <p>Total</p>
                    <h3 className="first-row-card2-details-amount">
                      {this.formatValue(card1_data.totalTransactions)}
                    </h3>
                    <p>Today's Transactions</p>
                  </div>
                </div>
              </div>
              <div className="main-screen-rows second-row">
                <div className="row-cards second-row-card1">
                  <div class="second-row-card1-left">
                    <h4>Weekly Overview</h4>

                    <Bargraphs
                      data={this.state.Card4_bargraph}
                      type="bargraph4"
                    />
                  </div>
                  <div className="vertical-line-card1"></div>
                  <div className="second-row-card1-right">
                    <div className="second-row-card1-view-date">
                      <div
                        className="card2-div card3-icon"
                        onClick={this.handleToggleOptions}
                      >
                        <Calendar className="creditcard-img grey-icon" />
                      </div>
                      <CustomTooltip
                        maxWidth={250}
                        leftMargin={-5}
                        details={
                          <ul>
                            <li>
                              Left part of the card provides a breakdown of
                              number of transactions (successful, failed,
                              incomplete) for this week.
                            </li>
                            <li>
                              The right side shows amount of successful
                              transactions, amount of failed transactions and
                              the total mount of transactions for the complete
                              week.
                            </li>
                          </ul>
                        }
                      >
                        <Infoicon className="icon2" />
                      </CustomTooltip>

                      {showCalendar && (
                        <div className="options-container">
                          <div className="option dates">
                            <span>
                              {this.formatDateRange(startDate, endDate)}
                            </span>
                            <div className="arrows">
                              <UpSign
                                className="arrowup"
                                onClick={() => this.handleDateShift(+1)}
                              />
                              <DownSign
                                className="arrowdown"
                                onClick={() => this.handleDateShift(-1)}
                              />
                            </div>
                          </div>
                          <div className="option">
                            <input
                              type="date"
                              onChange={this.handleDateChange}
                              value={
                                this.state.selectedDate
                                  .toISOString()
                                  .split("T")[0]
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="second-row-card1-details">
                      <div className="creditcard-div card4-icon">
                        <DollarCircle className="creditcard-img green-icon" />
                      </div>
                      <div className="second-row-card1-div">
                        <p>
                          {parseFloat(
                            card2_data.successThisWeek
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: validateCurrency(currency),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </p>
                        <p>Success</p>
                      </div>
                    </div>
                    <div className="second-row-card1-details">
                      <div className="creditcard-div card4-icon">
                        <PieChart className="creditcard-img primary-color-icon"></PieChart>
                      </div>
                      <div className="second-row-card1-div">
                        <p>
                          {parseFloat(card2_data.failedThisWeek).toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: validateCurrency(currency),
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}
                        </p>
                        <p>Fail</p>
                      </div>
                    </div>
                    <div className="second-row-card1-details">
                      <div className="creditcard-div card4-icon">
                        <CreaditCard className="creditcard-img grey-icon" />
                      </div>
                      <div className="second-row-card1-div">
                        <p>
                          {parseFloat(card2_data.totalThisWeek).toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: validateCurrency(currency),
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}
                        </p>
                        <p>Total</p>
                      </div>
                    </div>
                    <button className="btn-primary second-card1-btn">
                      View Report
                    </button>
                  </div>
                </div>
                <div className="row-cards second-row-card2">
                  <div className="card-head-with-view-more">
                    <div className="card2-div-traffic-status">
                      <div className="card2-div card4-icon">
                        <Traffic className="creditcard-img grey-icon" />
                      </div>
                      <h4>Traffic Status</h4>
                    </div>
                    <div className="card4-viewmore">
                      <CustomTooltip
                        details={
                          <p>
                            This card summarizes the total number of
                            transactions this week."
                          </p>
                        }
                      >
                        <Infoicon className="icon2" />
                      </CustomTooltip>
                    </div>
                  </div>
                  <Bargraphs
                    data={this.state.Card5_bargraph}
                    type="bargraph5"
                  />

                  <div className="second-row-card2-totaltraffic">
                    {" "}
                    <h3>
                      {this.formatValue(card2_data.totalNumTxn)}
                      {"  "}
                      <span className="p2">Total Traffic This Week</span>
                    </h3>
                  </div>
                </div>
              </div>

              <div className="main-screen-rows third-row">
                <div className="row-cards third-row-card1">
                  <div className="card-head-with-view-more">
                    <h4>Transactions</h4>
                    <CustomTooltip
                      details={
                        <p>
                          This card compares the difference between amounts of
                          transactions segregated by cards (VISA and Mastercard)
                          of this week and the previous week
                        </p>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>
                  <div className="creditcard-content">
                    <div className="creditcard">
                      <div className="creditcard-div visa">
                        <img className="creditcard-img" src={visa} alt=""></img>
                      </div>
                      <div>
                        <h5>{card6_data[0].card}</h5>

                        <p className="p2">
                          {parseFloat(card6_data[0]["amount"]).toLocaleString(
                            "en-IN",
                            {
                              style: "currency",
                              currency: validateCurrency(currency),
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}
                        </p>
                      </div>
                      {parseFloat(card6_data[0].amount) > 0 ? (
                        <div className="amount-container">
                          <UpSign className="arrow green-icon" />
                        </div>
                      ) : (
                        <div className="amount-container">
                          <DownSign className="arrow red-icon" />
                        </div>
                      )}
                    </div>

                    <div className="creditcard">
                      <div className="creditcard-div visa">
                        <img
                          className="creditcard-img"
                          src={mastercard}
                          alt="mastercard"
                        ></img>
                      </div>
                      <div>
                        <h5>{card6_data[1].card}</h5>
                        <p className="p2">
                          {parseFloat(card6_data[1]["amount"]).toLocaleString(
                            "en-IN",
                            {
                              style: "currency",
                              currency: validateCurrency(currency),
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}
                        </p>
                      </div>
                      {parseFloat(card6_data[1].amount) > 0 ? (
                        <div className="amount-container">
                          <UpSign className="arrow green-icon" />
                        </div>
                      ) : (
                        <div className="amount-container">
                          <DownSign className="arrow red-icon" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row-cards third-row-card2">
                  <div className="card-head-with-view-more">
                    <h4>Weekly Country-wise Overview</h4>
                    <CustomTooltip
                      maxWidth={300}
                      leftMargin={-15}
                      details={
                        <ul>
                          <li>
                            Left part of the card provides a breakdown of number
                            of transactions (successful, failed, incomplete) for
                            this week.
                          </li>
                          <li>
                            The right side shows amount of successful
                            transactions, amount of failed transactions and the
                            total mount of transactions for the complete week.
                          </li>
                        </ul>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>

                  <Card7chart card7_data={card7_data} />
                  <div className="card7-content">
                    <div className="card7-head">
                      <div>
                        <div className="creditcard-div card7-icon">
                          <Wallet className="creditcard-img blue-icon"></Wallet>
                        </div>
                      </div>
                      <div>
                        <p className="p2">Number of Sales</p>
                        <h5>
                          {parseFloat(card7_sumOfAmount).toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: validateCurrency(currency),
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}
                        </h5>
                      </div>
                    </div>
                    <div className="ruler"></div>
                    <div className="card7-content-grid">
                      {card7_data.map((item) => (
                        <div className="card7-grid-item p2">
                          <div className="grid-item-head">
                            <div></div>
                            <span className="region-container">
                              <p
                                className={`region-names ${item.region.length > 9 ? "animate-region" : ""
                                  }`}
                              >
                                {item.region}
                              </p>
                            </span>
                          </div>
                          <p className="region-amounts">
                            {parseFloat(item["amount"]).toLocaleString(
                              "en-US",
                              {
                                style: "currency",
                                currency: validateCurrency(currency),
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }
                            )}
                          </p>
                        </div>
                      ))}{" "}
                    </div>
                  </div>
                </div>{" "}
                <div className="row-cards third-row-card3">
                  <div className="card-head-with-view-more">
                    <h4>Weekly Successful Transactions</h4>
                    <CustomTooltip
                      details={
                        <p>
                          This card shows number of successful transactions for
                          this week.
                        </p>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>
                  <Bargraphs
                    data={this.state.Card8_bargraph}
                    type="bargraph7"
                  />
                  <div className="third-row-card3-data">
                    <h3>{percentageChange.toFixed(1)}%</h3>
                    <p className="p2">
                      Your sales performance is {percentageChange.toFixed(1)}%{" "}
                      compared to last week.
                    </p>
                  </div>
                </div>
              </div>
              <div className="main-screen-rows fourth-row">
                <div className="row-cards fourth-row-card1">
                  <div className="card-head-with-view-more">
                    <h4>Performance This Month</h4>
                    <CustomTooltip
                      maxWidth={350}
                      leftMargin={-15}
                      details={
                        <p>
                          This card shows key metrics for transactions in the
                          last month total number of transactions, total volume
                          of transactions, number of successful transactions,
                          volume of successful transactions
                        </p>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>
                  <p className="card9-subhead">
                    Your performance this month is{" "}
                    {String(card9_Data.growthPercentage).slice(0, 5)}% in
                    comparison to previous month
                  </p>
                  <div className="card9-content">
                    <div className="card7-head">
                      <div>
                        <div className="creditcard-div card9-icon1">
                          <PieChart className="creditcard-img white-icon"></PieChart>
                        </div>
                      </div>
                      <div className="card9-text">
                        <p className="p2"># {card9_data[0].head}</p>
                        <h5>{this.formatValue(card9_Data.numTransactions)}</h5>
                      </div>
                    </div>

                    <div className="card7-head">
                      <div>
                        <div className="creditcard-div card9-icon2">
                          <CreaditCard className="creditcard-img white-icon" />
                        </div>
                      </div>
                      <div className="card9-text">
                        <p className="p2">$ {card9_data[0].head}</p>
                        <h5>
                          {parseFloat(
                            card9_Data.totalAmountTransactions
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: validateCurrency(currency),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </h5>
                      </div>
                    </div>

                    <div className="card7-head">
                      <div>
                        <div className="creditcard-div card9-icon3">
                          <BarChart className="creditcard-img white-icon" />
                        </div>
                      </div>
                      <div className="card9-text">
                        <p className="p2"># {card9_data[1].head}</p>
                        <h5>
                          {this.formatValue(
                            card9_Data.numSuccessfulTransactions
                          )}
                        </h5>
                      </div>
                    </div>

                    <div className="card7-head">
                      <div>
                        <div className="creditcard-div card9-icon4">
                          <DollarCircle className="creditcard-img white-icon" />
                        </div>
                      </div>
                      <div className="card9-text">
                        <p className="p2">$ {card9_data[1].head}</p>
                        <h5>
                          {parseFloat(
                            card9_Data.totalAmountSuccessfulTransactions
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: validateCurrency(currency),
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row-cards fourth-row-card2">
                  <div className="card-head-with-view-more">
                    {" "}
                    <h4>
                      Total Sales{` `}
                      <span className="p2">
                        {parseFloat(card10_data).toLocaleString("en-US", {
                          style: "currency",
                          currency: validateCurrency(currency),
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </h4>
                    <CustomTooltip
                      details={
                        <p>
                          This card visualizes the volume of successful
                          transactions of last 6 months.
                        </p>
                      }
                    >
                      <Infoicon className="icon2" />
                    </CustomTooltip>
                  </div>

                  <Card10chart salesByMonthData={this.state.card10_linechart} />
                </div>
              </div>
              <div className="main-screen-rows ">
                <div className="row-cards search-table">
                  <Table
                    headerLabels={headerLabels}
                    dataToRender={tableData || []}
                    onViewClick={this.handleViewClick}
                  />
                </div>
                <ScrollUpAndDown showScrollToTopButton={true} />
              </div>
            </div>
          </>
        );
      }

      // else if(behaviour === true) {
      // 	return (
      // 		<>
      // 		  {errorMessage && (
      // 			<MessageBox
      // 			  message={errorMessage}
      // 			  messageType={messageType}
      // 			  onClose={() => this.setState({ errorMessage: "" })}
      // 			/>
      // 		  )}
      // 		  <div style={{ filter: 'blur(10px)',position:'relative' }}>
      // 		  <Header
      // 			onCurrencyChange={this.handleCurrencyChange}
      // 			onMerchantChange={this.handleMerchantChange}
      // 		  />
      // 		  </div>
      // 		  <div style={{ filter: 'blur(10px)',position:'fixed' }}>
      // 		  <Sidebar/>
      // 		  </div>
      // 		  <div
      // 			className={`main-screen ${
      // 			  this.state.sidebaropen
      // 				? "collapsed-main-screen"
      // 				: "expanded-main-screen"
      // 			}  `}
      // 			style={{ filter: 'blur(10px)' }}
      // 		  >
      // 			<div className="main-screen-rows first-row">
      // 			  <div className="row-cards first-row-card1">
      // 				<div className="first-row-card1-head">
      // 				  <h4>
      // 					Congratulations{" "}
      // 					<span style={{ fontWeight: "600" }}>{merchantName}</span>!🎉
      // 				  </h4>
      // 				  <p className="p2">
      // 					You have done {card1_data.successPercentage}% sales today 😎
      // 				  </p>
      // 				</div>
      // 				<img
      // 				  className="first-row-card1-image"
      // 				  src={boyimg}
      // 				  alt="Boy icon"
      // 				/>
      // 			  </div>
      // 			  <div className="row-cards first-row-card2">
      // 				<div className="card-head-with-view-more">
      // 				  <div className="card2-div card2-icon1">
      // 					<DollarCircle className="creditcard-img green-icon" />
      // 				  </div>
      // 				  <CustomTooltip details="This card displays the total amount of successful transactions that have occurred today.">
      // 					<Infoicon className="icon2" />
      // 				  </CustomTooltip>
      // 				</div>

      // 				<div className="first-row-card2-details">
      // 				  <p>Sales</p>
      // 				  <h3 className="first-row-card2-details-amount">
      // 					{parseFloat(card1_data.successAmount).toLocaleString(
      // 					  "en-US",
      // 					  {
      // 						style: "currency",
      // 						currency: validateCurrency(currency),
      // 						minimumFractionDigits: 0,
      // 						maximumFractionDigits: 0,
      // 					  }
      // 					)}
      // 				  </h3>
      // 				  <p>Today's Sale</p>
      // 				</div>
      // 			  </div>

      // 			  <div className="row-cards first-row-card2">
      // 				<div className="card-head-with-view-more">
      // 				  <div className="card2-div card2-icon2">
      // 					<CreaditCard className="creditcard-img grey-icon" />
      // 				  </div>
      // 				  <CustomTooltip
      // 					details={
      // 					  <p>
      // 						This card tracks the total number of transactions for
      // 						today
      // 					  </p>
      // 					}
      // 				  >
      // 					<Infoicon className="icon2" />
      // 				  </CustomTooltip>
      // 				</div>
      // 				<div className="first-row-card2-details">
      // 				  <p>Total</p>
      // 				  <h3 className="first-row-card2-details-amount">
      // 					{this.formatValue(card1_data.totalTransactions)}
      // 				  </h3>
      // 				  <p>Today's Transactions</p>
      // 				</div>
      // 			  </div>
      // 			</div>
      // 			<div className="main-screen-rows second-row">
      // 			  <div className="row-cards second-row-card1">
      // 				<div className="second-row-card1-left">
      // 				  <h4>Weekly Overview</h4>

      // 				  <Bargraphs data={this.state.Card4_bargraph} type="bargraph4" />
      // 				</div>
      // 				<div className="vertical-line-card1"></div>
      // 				<div className="second-row-card1-right">
      // 				  <div className="second-row-card1-view-date">
      // 					<div
      // 					  className="card2-div card3-icon"
      // 					  onClick={this.handleToggleOptions}
      // 					>
      // 					  <Calendar className="creditcard-img grey-icon" />
      // 					</div>
      // 					<CustomTooltip
      // 					  maxWidth={250}
      // 					  leftMargin={-5}
      // 					  details={
      // 						<ul>
      // 						  <li>
      // 							Left part of the card provides a breakdown of number
      // 							of transactions (successful, failed, incomplete) for
      // 							this week.
      // 						  </li>
      // 						  <li>
      // 							The right side shows amount of successful
      // 							transactions, amount of failed transactions and the
      // 							total mount of transactions for the complete week.
      // 						  </li>
      // 						</ul>
      // 					  }
      // 					>
      // 					  <Infoicon className="icon2" />
      // 					</CustomTooltip>

      // 					{showCalendar && (
      // 					  <div className="options-container" ref={this.calendarRef}>
      // 						<div className="option dates">
      // 						  <span>{this.formatDateRange(startDate, endDate)}</span>
      // 						  <div className="arrows">
      // 							<UpSign
      // 							  className="arrowup"
      // 							  onClick={() => this.handleDateShift(+1)}
      // 							/>
      // 							<DownSign
      // 							  className="arrowdown"
      // 							  onClick={() => this.handleDateShift(-1)}
      // 							/>
      // 						  </div>
      // 						</div>
      // 						<div className="option">
      // 						  <input
      // 							type="date"
      // 							className="input-calender"
      // 							onChange={this.handleDateChange}
      // 							value={
      // 							  this.state.selectedDate.toISOString().split("T")[0]
      // 							}
      // 						  />
      // 						</div>
      // 					  </div>
      // 					)}
      // 				  </div>

      // 				  <div className="second-row-card1-details">
      // 					<div className="creditcard-div card4-icon">
      // 					  <DollarCircle className="creditcard-img green-icon" />
      // 					</div>
      // 					<div className="second-row-card1-div">
      // 					  <p>
      // 						{parseFloat(card2_data.successThisWeek).toLocaleString(
      // 						  "en-US",
      // 						  {
      // 							style: "currency",
      // 							currency: validateCurrency(currency),
      // 							minimumFractionDigits: 0,
      // 							maximumFractionDigits: 0,
      // 						  }
      // 						)}
      // 					  </p>
      // 					  <p>Success</p>
      // 					</div>
      // 				  </div>
      // 				  <div className="second-row-card1-details">
      // 					<div className="creditcard-div card4-icon">
      // 					  <PieChart className="creditcard-img primary-color-icon"></PieChart>
      // 					</div>
      // 					<div className="second-row-card1-div">
      // 					  <p>
      // 						{parseFloat(card2_data.failedThisWeek).toLocaleString(
      // 						  "en-US",
      // 						  {
      // 							style: "currency",
      // 							currency: validateCurrency(currency),
      // 							minimumFractionDigits: 0,
      // 							maximumFractionDigits: 0,
      // 						  }
      // 						)}
      // 					  </p>
      // 					  <p>Fail</p>
      // 					</div>
      // 				  </div>
      // 				  <div className="second-row-card1-details">
      // 					<div className="creditcard-div card4-icon">
      // 					  <CreaditCard className="creditcard-img grey-icon" />
      // 					</div>
      // 					<div className="second-row-card1-div">
      // 					  <p>
      // 						{parseFloat(card2_data.totalThisWeek).toLocaleString(
      // 						  "en-US",
      // 						  {
      // 							style: "currency",
      // 							currency: validateCurrency(currency),
      // 							minimumFractionDigits: 0,
      // 							maximumFractionDigits: 0,
      // 						  }
      // 						)}
      // 					  </p>
      // 					  <p>Total</p>
      // 					</div>
      // 				  </div>
      // 				  <button className="btn-primary second-card1-btn">
      // 					View Report
      // 				  </button>
      // 				</div>
      // 			  </div>
      // 			  <div className="row-cards second-row-card2">
      // 				<div className="card-head-with-view-more">
      // 				  <div className="card2-div-traffic-status">
      // 					<div className="card2-div card4-icon">
      // 					  <Traffic className="creditcard-img grey-icon" />
      // 					</div>
      // 					<h4>Traffic Status</h4>
      // 				  </div>
      // 				  <div className="card4-viewmore">
      // 					<CustomTooltip
      // 					  details={
      // 						<p>
      // 						  This card summarizes the total number of transactions
      // 						  this week."
      // 						</p>
      // 					  }
      // 					>
      // 					  <Infoicon className="icon2" />
      // 					</CustomTooltip>
      // 				  </div>
      // 				</div>
      // 				<Bargraphs type="bargraph5" data={this.state.Card5_bargraph} />

      // 				<div className="second-row-card2-totaltraffic">
      // 				  {" "}
      // 				  <h3>
      // 					{this.formatValue(card2_data.totalNumTxn)}
      // 					{"  "}
      // 					<span className="p2">Total Traffic This Week</span>
      // 				  </h3>
      // 				</div>
      // 			  </div>
      // 			</div>

      // 			<div className="main-screen-rows third-row">
      // 			  <div className="row-cards third-row-card1">
      // 				<div className="card-head-with-view-more">
      // 				  <h4>Transactions</h4>
      // 				  <CustomTooltip
      // 					details={
      // 					  <p>
      // 						This card compares the difference between amounts of
      // 						transactions segregated by cards (VISA and Mastercard) of
      // 						this week and the previous week
      // 					  </p>
      // 					}
      // 				  >
      // 					<Infoicon className="icon2" />
      // 				  </CustomTooltip>
      // 				</div>
      // 				<div className="creditcard-content">
      // 				  <div className="creditcard">
      // 					<div className="creditcard-div visa">
      // 					  <img className="creditcard-img" src={visa} alt=""></img>
      // 					</div>
      // 					<div>
      // 					  <h5>{card6_data[0].card}</h5>

      // 					  <p className="p2">
      // 						{parseFloat(card6_data[0]["amount"]).toLocaleString(
      // 						  "en-IN",
      // 						  {
      // 							style: "currency",
      // 							currency: validateCurrency(currency),
      // 							minimumFractionDigits: 0,
      // 							maximumFractionDigits: 0,
      // 						  }
      // 						)}
      // 					  </p>
      // 					</div>
      // 					{parseFloat(card6_data[0].amount) > 0 ? (
      // 					  <div className="amount-container">
      // 						<UpSign className="arrow green-icon" />
      // 					  </div>
      // 					) : (
      // 					  <div className="amount-container">
      // 						<DownSign className="arrow red-icon" />
      // 					  </div>
      // 					)}
      // 				  </div>

      // 				  <div className="creditcard">
      // 					<div className="creditcard-div visa">
      // 					  <img
      // 						className="creditcard-img"
      // 						src={mastercard}
      // 						alt="mastercard"
      // 					  ></img>
      // 					</div>
      // 					<div>
      // 					  <h5>{card6_data[1].card}</h5>
      // 					  <p className="p2">
      // 						{parseFloat(card6_data[1]["amount"]).toLocaleString(
      // 						  "en-IN",
      // 						  {
      // 							style: "currency",
      // 							currency: validateCurrency(currency),
      // 							minimumFractionDigits: 0,
      // 							maximumFractionDigits: 0,
      // 						  }
      // 						)}
      // 					  </p>
      // 					</div>
      // 					{parseFloat(card6_data[1].amount) > 0 ? (
      // 					  <div className="amount-container">
      // 						<UpSign className="arrow green-icon" />
      // 					  </div>
      // 					) : (
      // 					  <div className="amount-container">
      // 						<DownSign className="arrow red-icon" />
      // 					  </div>
      // 					)}
      // 				  </div>
      // 				</div>
      // 			  </div>
      // 			  <div className="row-cards third-row-card2">
      // 				<div className="card-head-with-view-more">
      // 				  <h4>Weekly Country-wise Overview</h4>
      // 				  <CustomTooltip
      // 					maxWidth={300}
      // 					leftMargin={-15}
      // 					details={
      // 					  <ul>
      // 						<li>
      // 						  Left part of the card provides a breakdown of number of
      // 						  transactions (successful, failed, incomplete) for this
      // 						  week.
      // 						</li>
      // 						<li>
      // 						  The right side shows amount of successful transactions,
      // 						  amount of failed transactions and the total mount of
      // 						  transactions for the complete week.
      // 						</li>
      // 					  </ul>
      // 					}
      // 				  >
      // 					<Infoicon className="icon2" />
      // 				  </CustomTooltip>
      // 				</div>

      // 				<Card7chart card7_data={card7_data} />
      // 				<div className="card7-content">
      // 				  <div className="card7-head">
      // 					<div>
      // 					  <div className="creditcard-div card7-icon">
      // 						<Wallet className="creditcard-img blue-icon"></Wallet>
      // 					  </div>
      // 					</div>
      // 					<div>
      // 					  <p className="p2">Number of Sales</p>
      // 					  <h5>
      // 						{parseFloat(card7_sumOfAmount).toLocaleString("en-US", {
      // 						  style: "currency",
      // 						  currency: validateCurrency(currency),
      // 						  minimumFractionDigits: 0,
      // 						  maximumFractionDigits: 0,
      // 						})}
      // 					  </h5>
      // 					</div>
      // 				  </div>
      // 				  <div className="ruler"></div>
      // 				  <div className="card7-content-grid">
      // 					{card7_data.map((item) => (
      // 					  <div className="card7-grid-item p2">
      // 						<div className="grid-item-head">
      // 						  <div></div>
      // 						  <span className="region-container">
      // 							<p
      // 							  className={`region-names ${
      // 								item.region.length > 9 ? "animate-region" : ""
      // 							  }`}
      // 							>
      // 							  {item.region}
      // 							</p>
      // 						  </span>
      // 						</div>
      // 						<p className="region-amounts">
      // 						  {parseFloat(item["amount"]).toLocaleString("en-US", {
      // 							style: "currency",
      // 							currency: validateCurrency(currency),
      // 							minimumFractionDigits: 0,
      // 							maximumFractionDigits: 0,
      // 						  })}
      // 						</p>
      // 					  </div>
      // 					))}{" "}
      // 				  </div>
      // 				</div>
      // 			  </div>{" "}
      // 			  <div className="row-cards third-row-card3">
      // 				<div className="card-head-with-view-more">
      // 				  <h4>Weekly Successful Transactions</h4>
      // 				  <CustomTooltip
      // 					details={
      // 					  <p>
      // 						This card shows number of successful transactions for this
      // 						week.
      // 					  </p>
      // 					}
      // 				  >
      // 					<Infoicon className="icon2" />
      // 				  </CustomTooltip>
      // 				</div>
      // 				<Bargraphs data={this.state.Card8_bargraph} type="bargraph7" />
      // 				<div className="third-row-card3-data">
      // 				  <h3>{percentageChange.toFixed(1)}%</h3>
      // 				  <p className="p2">
      // 					Your sales performance is {percentageChange.toFixed(1)}%{" "}
      // 					compared to last week.
      // 				  </p>
      // 				</div>
      // 			  </div>
      // 			</div>
      // 			<div className="main-screen-rows fourth-row">
      // 			  <div className="row-cards fourth-row-card1">
      // 				<div className="card-head-with-view-more">
      // 				  <h4>Performance This Month</h4>
      // 				  <CustomTooltip
      // 					maxWidth={350}
      // 					leftMargin={-15}
      // 					details={
      // 					  <p>
      // 						This card shows key metrics for transactions in the last
      // 						month total number of transactions, total volume of
      // 						transactions, number of successful transactions, volume of
      // 						successful transactions
      // 					  </p>
      // 					}
      // 				  >
      // 					<Infoicon className="icon2" />
      // 				  </CustomTooltip>
      // 				</div>
      // 				<p className="card9-subhead">
      // 				  Your performance this month is{" "}
      // 				  {String(card9_Data.growthPercentage).slice(0, 5)}% in comparison
      // 				  to previous month
      // 				  <span className="p2"></span>
      // 				</p>
      // 				<div className="card9-content">
      // 				  <div className="card7-head">
      // 					<div>
      // 					  <div className="creditcard-div card9-icon1">
      // 						<PieChart className="creditcard-img white-icon"></PieChart>
      // 					  </div>
      // 					</div>
      // 					<div className="card9-text">
      // 					  <p className="p2"># {card9_data[0].head}</p>
      // 					  <h5>{this.formatValue(card9_Data.numTransactions)}</h5>
      // 					</div>
      // 				  </div>

      // 				  <div className="card7-head">
      // 					<div>
      // 					  <div className="creditcard-div card9-icon2">
      // 						<CreaditCard className="creditcard-img white-icon" />
      // 					  </div>
      // 					</div>
      // 					<div className="card9-text">
      // 					  <p className="p2">$ {card9_data[0].head}</p>
      // 					  <h5>
      // 						{parseFloat(
      // 						  card9_Data.totalAmountTransactions
      // 						).toLocaleString("en-US", {
      // 						  style: "currency",
      // 						  currency: validateCurrency(currency),
      // 						  minimumFractionDigits: 0,
      // 						  maximumFractionDigits: 0,
      // 						})}
      // 					  </h5>
      // 					</div>
      // 				  </div>

      // 				  <div className="card7-head">
      // 					<div>
      // 					  <div className="creditcard-div card9-icon3">
      // 						<BarChart className="creditcard-img white-icon" />
      // 					  </div>
      // 					</div>
      // 					<div className="card9-text">
      // 					  <p className="p2"># {card9_data[1].head}</p>
      // 					  <h5>
      // 						{this.formatValue(card9_Data.numSuccessfulTransactions)}
      // 					  </h5>
      // 					</div>
      // 				  </div>

      // 				  <div className="card7-head">
      // 					<div>
      // 					  <div className="creditcard-div card9-icon4">
      // 						<DollarCircle className="creditcard-img white-icon" />
      // 					  </div>
      // 					</div>
      // 					<div className="card9-text">
      // 					  <p className="p2">$ {card9_data[1].head}</p>
      // 					  <h5>
      // 						{parseFloat(
      // 						  card9_Data.totalAmountSuccessfulTransactions
      // 						).toLocaleString("en-US", {
      // 						  style: "currency",
      // 						  currency: validateCurrency(currency),
      // 						  minimumFractionDigits: 0,
      // 						  maximumFractionDigits: 0,
      // 						})}
      // 					  </h5>
      // 					</div>
      // 				  </div>
      // 				</div>
      // 			  </div>

      // 			  <div className="row-cards fourth-row-card2">
      // 				<div className="card-head-with-view-more">
      // 				  {" "}
      // 				  <h4>
      // 					Total Sales{` `}
      // 					<span className="p2">
      // 					  {parseFloat(card10_data).toLocaleString("en-US", {
      // 						style: "currency",
      // 						currency: validateCurrency(currency),
      // 						minimumFractionDigits: 0,
      // 						maximumFractionDigits: 0,
      // 					  })}
      // 					</span>
      // 				  </h4>
      // 				  <CustomTooltip
      // 					details={
      // 					  <p>
      // 						This card visualizes the volume of successful transactions
      // 						of last 6 months.
      // 					  </p>
      // 					}
      // 				  >
      // 					<Infoicon className="icon2" />
      // 				  </CustomTooltip>
      // 				</div>

      // 				<Card10chart salesByMonthData={this.state.card10_linechart} />
      // 			  </div>
      // 			</div>
      // 			<div className="main-screen-rows ">
      // 			  <div className="row-cards search-table">
      // 				<Table
      // 				  headerLabels={headerLabels}
      // 				  dataToRender={tableData || []}
      // 				  onViewClick={this.handleViewClick}
      // 				/>
      // 			  </div>
      // 			  <ScrollUpAndDown showScrollToTopButton={true} />
      // 			</div>
      // 		  </div>
      // 		</>
      // 	  );
      // }
      else if (userRole === "employee") {
        return (
          <>
            {errorMessage && (
              <MessageBox
                message={errorMessage}
                messageType={messageType}
                onClose={() => this.setState({ errorMessage: "" })}
              />
            )}

            <Header
              onCurrencyChange={this.handleCurrencyChange}
              onMerchantChange={this.handleMerchantChange}
            />
            <Sidebar />
            <div
              className={`main-screen ${this.state.sidebaropen
                  ? "collapsed-main-screen"
                  : "expanded-main-screen"
                }  `}
            >
              <div className="employeeDashboard">
                <h2>Centpays Dashboard</h2>
              </div>
            </div>
          </>
        );
      }
    }
  }
}

export default Dashboard;
