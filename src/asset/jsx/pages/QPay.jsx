import React, { Component } from "react";

// components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loder";

export class QPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      errorMessage: "",
      userName: this.getCookie("name"),
      token: this.getCookie("token"),
      userRole: this.getCookie("role"),
      billingName: "",
      billingEmail: "",
      billingPhoneNumber: "",
      amount: "",
      selectedCard: "Visa",
      cardHolderName: "",
      cardNumder: "",
      expiryDate: "",
      cvvno: "",
      status: "",
      isLoader: false,
      orderNo: "",
      api_key: "",
      secret_key: "",
      mid: "",
      currency: "",
      companyList: [],
      midList: [],
    };
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  componentDidMount() {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    this.fetchMerchants(`${backendURL}/companylist`, "companyList");
    this.fetchMerchants(`${backendURL}/listofmids`, "midList");
  }

  fetchMerchants = async (url, dataVariable) => {
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

  fetchData = async () => {
    this.setState({ isLoading: true, error: null });
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    try {
      const API_URL = `${backendURL}/transactionflow/get_transaction?orderNo=${this.state.orderNo}`;
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      this.setState({ data });
      console.log("Fetched data:", data);
      this.setState({ status: data.status });
    } catch (error) {
      this.setState({
        error: error.message || "An error occurred while fetching data.",
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  toggleCard = (card) => {
    this.setState({ selectedCard: card });
  };

  handlePay = async (e) => {
    e.preventDefault();

    const {
      billingEmail,
      billingPhoneNumber,
      amount,
      currency,
      cardHolderName,
      cardNumder,
      expiryDate,
      cvvno,
      api_key,
      secret_key,
      mid,
    } = this.state;

    // Generate random transaction ID and order number
    const generateRandomString = (length) => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    };

    const transaction_id = generateRandomString(6);
    const order_number = generateRandomString(6);

    const payload = {
      merchantID: "1044",
      apiKey: api_key,
      apiSecret: secret_key,
      mid: mid,
      name: cardHolderName,
      email: billingEmail,
      phone: billingPhoneNumber,
      amount: amount,
      currency: currency,
      transactionID: transaction_id,
      orderNo: order_number,
      backURL: "https://www.centpays.online/paymentresult",
      requestMode: "Card",
      cardnumber: cardNumder,
      cardExpire: expiryDate,
      cardCVV: cvvno,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    console.log("Payload:", payload);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/paymentlink`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        this.setState({
          orderNo: data.orderNo,
          isLoader: false,
        });
        console.error("No redirect URL found in response");
      }
    } catch (error) {
      console.error("Error:", error);
      this.setState({ isLoader: false });
    }
    this.setState({
      billingName: "",
      billingEmail: "",
      billingPhoneNumber: "",
      amount: "",
      cardHolderName: "",
      cardNumder: "",
      expiryDate: "",
      cvvno: "",
      isLoader: true,
    });
  };

  render() {
    const {
      billingEmail,
      billingPhoneNumber,
      amount,
      currency,
      cardHolderName,
      cardNumder,
      expiryDate,
      cvvno,
      isLoader,
    } = this.state;

    return (
      <>
        <Header />
        <Sidebar />
        <div
          className={`main-screen ${
            this.state.sidebaropen
              ? "collapsed-main-screen"
              : "expanded-main-screen "
          }  `}
        >
          <div className="row-cards qpay-container">
            {isLoader ? (
              <div className="loader-container">
                <Loader />
              </div>
            ) : (
              <div>
                <div className="intro-paragraph">
                  <h5>Payment Page</h5>
                  <p>
                    {" "}
                    Welcome to the CentPays Payment Test Page! Here, merchants
                    can simulate transactions and test the full functionality of
                    our payment gateway before integrating it into their system.
                  </p>
                </div>
                <div className="form-container">
                  <div className="selects-container">
                    <select
                      name="merchant"
                      className="inputFeild cardnumberinput"
                    >
                      <option value="">Select Merchant</option>
                      {this.state.companyList.map((merchant, index) => (
                        <option key={index} value={index}>
                          {merchant}
                        </option>
                      ))}
                    </select>

                    <select name="mid" className="inputFeild cardnumberinput">
                      <option value="">Select MID</option>
                      {this.state.midList.map((midlist, index) => (
                        <option key={index} value={index}>
                          {midlist}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="billing-details">
                    <h5>Billing Details</h5>
                    <div>
                      <input
                        type="email"
                        className="inputFeild search-input"
                        name="billingEmail"
                        placeholder="Email"
                        value={billingEmail}
                        onChange={this.handleInputChange}
                      />
                      <input
                        type="text"
                        className="inputFeild search-input"
                        name="billingPhoneNumber"
                        placeholder="Phone Number"
                        value={billingPhoneNumber}
                        onChange={this.handleInputChange}
                      />
                      <input
                        type="text"
                        className="inputFeild search-input"
                        name="amount"
                        placeholder="Amount"
                        value={amount}
                        onChange={this.handleInputChange}
                      />
                      <input
                        type="text"
                        className="inputFeild search-input"
                        name="currency"
                        placeholder="Currency"
                        value={currency}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="credit-card-info">
                    <h5>Credit Card Info</h5>
                    <input
                      type="text"
                      className="inputFeild cardnumberinput"
                      name="cardNumder"
                      placeholder="Card Number"
                      value={cardNumder}
                      onChange={this.handleInputChange}
                    />
                    <div className="expiry-cvv">
                      <input
                        type="text"
                        className="inputFeild search-input"
                        name="cardHolderName"
                        placeholder="Card Holder"
                        value={cardHolderName}
                        onChange={this.handleInputChange}
                      />
                      <input
                        type="text"
                        className="inputFeild search-input"
                        name="expiryDate"
                        placeholder="Expiry (YYMM)"
                        value={expiryDate}
                        onChange={this.handleInputChange}
                      />
                      <input
                        type="text"
                        className="inputFeild search-input"
                        name="cvvno"
                        placeholder="CVV"
                        value={cvvno}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  <button
                    className="btn-primary Qpaybtn"
                    onClick={this.handlePay}
                  >
                    Proceed with Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default QPay;
