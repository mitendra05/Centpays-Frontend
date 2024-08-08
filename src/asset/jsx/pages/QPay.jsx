import React, { Component } from "react";

// components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loder";
import MessageBox from "../components/Message_box";

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
      selectedMerchant: "", // Added state for selected merchant
      messageType: "",
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

  fetchCredentials = async (merchant) => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token } = this.state;
    try {
      const response = await fetch(
        `${backendURL}/merchantkeys?merchant=${merchant}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data && Array.isArray(data.uniqueMIDs)) {
        this.setState({
          midList: data.uniqueMIDs,
          api_key: data.apiKey,
          secret_key: data.secretKey,
        });
      } else {
        this.setState({ midList: [] });
        console.error(
          "API response does not contain valid uniqueMIDs array:",
          data
        );
      }
    } catch (error) {
      this.setState({
        errorMessage: "Error in Fetching MIDs. Please try again later.",
        messageType: "",
      });
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  
    if (name === "selectedMerchant") {
      this.setState({ selectedMerchant: value, errorMessage: "" });
      this.fetchCredentials(value);
    }
  };
  

  handleMIDClick = () => {
    const { selectedMerchant } = this.state;
  
    if (!selectedMerchant) {
      this.setState({ errorMessage: "Please select a merchant before choosing MID." });
    }
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
      mid: mid === "No MID" ? "" : mid,
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

    console.log("", payload);
    const headers = {
      "Content-Type": "application/json",
    };

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
      selectedMerchant,
      midList,
      errorMessage,
      messageType,
    } = this.state;

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
                    Welcome to the CentPays Payment Test Page! Here, merchants
                    can simulate transactions and test the full functionality of
                    our payment gateway before integrating it into their system.
                  </p>
                </div>
                <div className="form-container">
                  <div className="selects-container">
                    <select
                      name="selectedMerchant"
                      className="inputFeild cardnumberinput"
                      value={selectedMerchant}
                      onChange={this.handleInputChange}
                    >
                      <option value="">Select Merchant</option>
                      {this.state.companyList.map((merchant, index) => (
                        <option key={index} value={merchant}>
                          {merchant}
                        </option>
                      ))}
                    </select>

                    <select
                      name="mid"
                      className="inputFeild cardnumberinput"
                      onChange={this.handleInputChange}
                      onClick={this.handleMIDClick}
                      value={this.state.mid || ""}
                    >
                      <option value="" disabled selected>
                        Select MID
                      </option>
                      {midList
                        .filter((mid) => mid !== "")
                        .map((mid, index) => (
                          <option key={index} value={mid}>
                            {mid}
                          </option>
                        ))}
                      <option  value="No MID">No MID</option>
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
