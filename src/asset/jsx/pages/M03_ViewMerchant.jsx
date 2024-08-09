import React, { Component } from "react";
import CryptoJS from "crypto-js";

//Components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MerchantForm from "../components/Merchant_Form";
import MessageBox from "../components/Message_box";
import CustomTooltip from "../components/Custom-tooltip";
// import ApprovalRatioChart from "../components/ApprovalRatioChart";

// SVG Icons
import {
  ApprovalRatio,
  CreaditCard,
  DollarCircle,
  LeftSign,
  RightSign,
  User,
  Id,
  URL,
  Industry,
  Phone,
  Email,
  Skype,
  Address,
  BusinessInfo,
  DirectorInfo,
  PendingUserIcon,
  MerchantRates,
  MerchantSettlements,
  LeftArrow,
  Eye,
  Copy,
  EyeOff,
  Infoicon,
} from "../../media/icon/SVGicons";

//Images and Icons
import profile from "../../media/icon/user-profile.png";
import settlemntimg from "../../media/image/siteWorking.jpg";
// import calender from "../../media/icon/calender.png";

class ViewMerchant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      token: this.getCookie("token"),
      userRole: this.getCookie("role"),
      companyName: this.getCookie("company_name"),
      company_name: this.extractENameFromURL(),
      overviewData: [],
      ratesData: [],
      approvalData: {},
      volumeData: [],
      states: ["showApprovalRatio", "showTotalVolume", "showSettledVolume"],
      showApprovalRatio: true,
      showTotalVolume: false,
      showSettledVolume: false,
      overviewInfo: true,
      ratesInfo: false,
      settlementInfo: false,
      secretsInfo: false,
      isAddMerchantPanelOpen: false,
      companyInfo: true,
      businessInfo: false,
      directorInfo: false,
      isEditing: false,
      isSuspended: false,
      calendarVisible: false,
      isActive: null,
      statusText: "Active",
      idforEdit: [],
      idforRatedata: [],
      buttonLabel: "Suspend",
      email: "",
      password: "",
      showPassword: false,
      errorMessage: "",
      messageType: "",
      rootAccountKey: "",
      apiKey: "001134098237654321",
      secretKey: "110863876737654321",
      showApiKey: false,
      showSecretKey: false,
      copied: {
        rootAccountKey: false,
        apiKey: false,
        secretKey: false,
      },
      slideIndex: 0,
      slides: [
        { type: "approvalRatio", label: "Approval Ratio" },
        { type: "totalVolume", label: "Total Volume" },
        { type: "settledVolume", label: "Settled Volume" },
      ],
    };
  }

  extractENameFromURL = () => {
    return window.location.pathname.split("/viewmerchant/")[1];
  };

  fetchClientId = async (company_name) => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(
        `${backendURL}/viewclient?company_name=${company_name}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.state.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.client_id;
    } catch (error) {
      console.error("Error fetching client ID:", error.message);
      return null;
    }
  };

  fetchAndSetClientId = async () => {
    const company_name = this.extractENameFromURL();

    const client_id = await this.fetchClientId(company_name);

    if (client_id) {
      this.setState({ client_id });
    }
  };

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  async loginCredentials() {
    const companyName = this.extractENameFromURL();
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(
        `${backendURL}/logincredentials?company_name=${companyName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.state.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      this.setState({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error("Error fetching login credentials:", error);
      // this.setState({ errorMessage: 'Failed to fetch login credentials. Please check your token and try again.', messageType: 'fail' });
    }
  }

  handleSubmit = () => {
    const { email, password } = this.state;
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const newWindow = window.open("", "_blank");

    const scriptContent = `
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'LOGIN') {
          const { email, password } = event.data;
  
          try {
            const response = await fetch("${process.env.REACT_APP_BACKEND_URL}/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });
  
            if (response.ok) {
              const data = await response.json();
              if (data) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('role', data.user.role);
                sessionStorage.setItem('email', data.user.email);
                sessionStorage.setItem('name', data.user.name);
                sessionStorage.setItem('company_name', data.user.company_name);
  
                window.location.href = '${backendURL}/dashboard';
              } else {
                console.error("Token not generated");
              }
            } else {
              console.error("Wrong Username & Password");
            }
          } catch (error) {
            console.error("There was a problem with your fetch operation:", error);
          }
        }
      });
  
      window.opener.postMessage({ type: 'LOGIN', email: '${email}', password: '${password}' }, '*');
    `;

    // Write the script to the new window's document
    newWindow.document.write(`
      <html>
        <body>
          <script>${scriptContent}<\/script>
        </body>
      </html>
    `);

    this.setState({ email, password });
  };

  componentDidMount() {
    this.fetchAndSetClientId();
    this.loginCredentials();

    const {
      company_name: stateCompanyName,
      companyName,
      userRole,
    } = this.state;

    const company_name =
      userRole === "merchant" ? companyName : stateCompanyName;

    let date = new Date().toISOString().split("T")[0];
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    this.fetchData(
      `${backendURL}/viewclient?company_name=${company_name}`,
      "overviewData",
      (data) => {
        if (data) {
          this.setState({
            overviewData: data,
            idforEdit: data._id,
            isActive: data.status,
            statusText: data.status,
            buttonLabel: data.status === "Active" ? "Suspend" : "Activate",
          });
        }
      }
    );

    this.fetchData(
      `${backendURL}/approvalratio?merchant=${company_name}&fromDate=${date}&toDate=${date}`,
      "approvalData"
    );

    this.fetchData(
      `${backendURL}/volumesum?company_name=${company_name}`,
      "volumeData"
    );
    this.startSlideshow();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  startSlideshow = () => {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  };

  nextSlide = () => {
    const { slideIndex, slides } = this.state;
    const nextIndex = (slideIndex + 1) % slides.length;
    this.setState({ slideIndex: nextIndex });
  };

  fetchData = async (url, dataVariable, callback = null) => {
    const { token } = this.state;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      this.setState({ [dataVariable]: data }, () => {
        if (callback) callback(data);
      });
    } catch (error) {
      this.setState({
        errorMessage: `Error fetching data: ${error.message}`,
        messageType: "fail",
      });
    }
  };

  refreshMerchantData = () => {
    const { company_name } = this.state;
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    this.fetchData(
      `${backendURL}/viewclient?company_name=${company_name}`,
      "overviewData",
      (data) => {
        if (data) {
          this.setState({
            overviewData: data,
            idforEdit: data._id,
            isActive: data.status,
            statusText: data.status,
            buttonLabel: data.status === "Active" ? "Suspend" : "Activate",
          });
        }
      }
    );
  };

  updateMerchantStatus = async (statusText, idforEdit) => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token } = this.state;

    try {
      const response = await fetch(`${backendURL}/updateclient`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: idforEdit, status: statusText }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      this.setState({
        errorMessage: "Status updated successfully",
        messageType: "success",
      });
    } catch (error) {
      this.setState({
        errorMessage: "Status Not Update",
        messageType: "fail",
      });
    }
  };

  fetchRatesData = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token, role, companyName } = this.state;

    const company_name =
      role === "merchant" ? companyName : this.state.company_name;

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

      if (response.ok) {
        const data = await response.json();
        if (data && data._id) {
          this.setState({ ratesData: data, idforRatedata: data._id });
        } else {
          this.setState({
            errorMessage:
              "Data format is incorrect or _id not found. Please try again later.",
            messageType: "fail",
          });
        }
      } else {
        this.setState({
          errorMessage: "Error in Fetching data. Please try again later.",
          messageType: "fail",
        });
      }
    } catch (error) {
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "",
      });
    }
  };

  handleSave = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token, idforRatedata, ratesData } = this.state;

    const updateRate = {
      id: idforRatedata,
      ...ratesData,
    };

    try {
      const response = await fetch(`${backendURL}/updateratetable`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateRate),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      this.setState({
        ratesData: data.rates,
        isEditing: false,
        errorMessage: "Data Edited Successfully.",
        messageType: "success",
      });
    } catch (error) {
      this.setState({
        errorMessage: "Error updating data. Please try again.",
        messageType: "fail",
      });
    }
  };

  handleCancelClick = () => {
    this.setState({ isEditing: false });
  };

  formatValue = (val) => {
    return `${(val / 1000).toFixed(1)}k`;
  };

  handleStatusChange = () => {
    const { isActive, idforEdit } = this.state;
    const newStatusText = isActive ? "Inactive" : "Active";

    this.setState(
      {
        isActive: !isActive,
        statusText: newStatusText,
        buttonLabel: newStatusText === "Active" ? "Suspend" : "Activate",
      },
      () => this.updateMerchantStatus(newStatusText, idforEdit)
    );
  };

  handleBackButtonClick = () => {
    window.history.back();
  };

  handleEditClick = () => {
    this.setState({ isEditing: !this.state.isEditing });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      ratesData: {
        ...prevState.ratesData,
        [name]: value,
      },
    }));
  };

  handleAddMerchant = () => {
    this.setState({
      isAddMerchantPanelOpen: !this.state.isAddMerchantPanelOpen,
    });
  };

  handleInputChange = (event) => {
    const { id, value } = event.target;
    const { overviewData } = this.state;
    const updatedOverviewData = { ...overviewData, [id]: value };
    this.setState({ overviewData: updatedOverviewData });
  };

  handleBackArrowclick = (current) => {
    const { states } = this.state;
    const currentIndex = states.indexOf(current);
    const newIndex = (currentIndex - 1 + states.length) % states.length;
    const { slideIndex, slides } = this.state;

    // Calculate the previous slide index in a circular manner
    const prevIndex = (slideIndex - 1 + slides.length) % slides.length;
    this.setState({
      showApprovalRatio: newIndex === 0,
      showTotalVolume: newIndex === 1,
      showSettledVolume: newIndex === 2,
    });
    this.setState({ slideIndex: prevIndex });
  };

  handleNextArrowclick = (current) => {
    const { states } = this.state;
    const currentIndex = states.indexOf(current);
    const newIndex = (currentIndex + 1) % states.length;
    this.setState({
      showApprovalRatio: newIndex === 0,
      showTotalVolume: newIndex === 1,
      showSettledVolume: newIndex === 2,
    });
    this.nextSlide();
  };

  handleButtonClick = (buttonName) => {
    const newState = {
      overviewInfo: false,
      ratesInfo: false,
      settlementInfo: false,
      secretsInfo: false,
    };

    newState[buttonName] = true;

    this.setState(newState, () => {
      if (buttonName === "ratesInfo") {
        this.fetchRatesData();
      } else if (buttonName === "secretsInfo") {
        const overviewData = this.state;
        if (!overviewData.rootAccountCreated) {
          const { fullToken, truncatedToken } = this.generateSignedToken(
            overviewData.client_id,
            "merchant"
          );
          this.setState({ rootAccountKey: fullToken, truncatedToken });
        }
      }
    });
  };

  renderButton = (buttonName, isActive, IconComponent, label) => {
    return isActive ? (
      <button className="btn-primary btn3">
        <div className="Info-btn">
          <IconComponent className="white-icon" width="20" height="20" />
          <p>{label}</p>
        </div>
      </button>
    ) : (
      <div
        onClick={() => this.handleButtonClick(buttonName)}
        className="btn-secondary btn-inactive"
      >
        <IconComponent className="black-icon" width="20" height="20" />
        <p className="p2">{label}</p>
      </div>
    );
  };

  renderButtons = () => {
    const { overviewInfo, ratesInfo, settlementInfo, secretsInfo } = this.state;

    return (
      <div className="btn-container">
        {this.renderButton(
          "overviewInfo",
          overviewInfo,
          PendingUserIcon,
          "Overview"
        )}
        {this.renderButton("ratesInfo", ratesInfo, MerchantRates, "Rates")}
        {this.renderButton(
          "settlementInfo",
          settlementInfo,
          MerchantSettlements,
          "Settlements"
        )}
        {this.renderButton("secretsInfo", secretsInfo, Eye, "Secrets")}
      </div>
    );
  };

  generateSignedToken = (clientId, role) => {
    const payload = { clientId, role };
    const payloadString = JSON.stringify(payload);
    const encrypted = CryptoJS.AES.encrypt(
      payloadString,
      process.env.REACT_APP_KEY_SECRET
    ).toString();

    const fullToken = encrypted;

    const truncatedToken = btoa(encrypted)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return { fullToken, truncatedToken };
  };

  maskString = (key) => {
    if (key.length > 12) {
      const stars = "*".repeat(key.length - 12);
      return `${key.slice(0, 6)}${stars}${key.slice(-6)}`;
    }
    return key;
  };

  handleCopy = (key, keyType, elementId) => {
    navigator.clipboard.writeText(key);
    let message;
    switch (keyType) {
      case "api":
        message = "API Key Copied!";
        break;
      case "secret":
        message = "Secret Key Copied!";
        break;
      case "root":
        message = "Account Creation Key Copied!";
        break;
      default:
        message = "Key Copied!";
    }
    this.setState({ errorMessage: message, messageType: "success" });
    this.setState((prevState) => ({
      copied: {
        ...prevState.copied,
        [key]: true,
      },
    }));

    const element = document.getElementById(elementId);
    element.classList.add("zoom-animation");
    setTimeout(() => {
      element.classList.remove("zoom-animation");
    }, 300);
  };

  toggleVisibility = (key) => {
    this.setState((prevState) => ({ [key]: !prevState[key] }));
  };

  getCurrencySymbol = (currencyCode) => {
    switch (currencyCode) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      default:
        return currencyCode;
    }
  };

  async approveMerchant(idforEdit) {
    console.log("Entered");

    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token } = this.state;

    try {
      const response = await fetch(`${backendURL}/approveclient`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: idforEdit }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      this.setState({
        errorMessage: "Client approved successfully",
        messageType: "success",
      });
      this.refreshMerchantData()
    } catch (error) {
      console.error("Error approving merchant:", error);
      this.setState({
        errorMessage: "Client Not Approved",
        messageType: "fail",
      });
    }
  }

  render() {
    const {
      isSuspended,
      overviewData,
      isEditing,
      ratesData,
      statusText,
      buttonLabel,
      errorMessage,
      messageType,
      userRole,
      apiKey,
      secretKey,
      showApiKey,
      showSecretKey,
      copied,
      rootAccountKey,
      slideIndex,
      slides,
      approvalData,
      volumeData,
      email,
      password,
      isActive,
    } = this.state;
    const currentSlide = slides[slideIndex];

    if (userRole === "admin") {
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
            <div className="view-merchant-container">
              <div className="row-cards left-section">
                <LeftArrow
                  className="icon2"
                  onClick={this.handleBackButtonClick}
                />
                <div className="left-section-top">
                  <div className="profile-image">
                    <img src={profile} alt="user profile"></img>
                  </div>
                  <h5>
                    {this.state.company_name.split(/[^a-zA-Z\s]+/).join(" ")}
                  </h5>
                  <div
                    className={`status-div ${
                      statusText === "Pending"
                        ? "pending-status"
                        : statusText === "Active"
                        ? "success-status"
                        : "failed-status"
                    }`}
                  >
                    <p>{statusText}</p>
                  </div>

                  <div className="slideshow-container">
                    {currentSlide.type === "approvalRatio" && (
                      <div className="approve-volume-container">
                        <LeftSign
                          className="icon2"
                          onClick={this.handleBackArrowclick}
                        />
                        <div className="scroll-animation">
                          <div className="approval-div-section">
                            <div>
                              <div className="creditcard-div">
                                <ApprovalRatio className="creditcard-img primary-color-icon" />
                              </div>
                            </div>
                            <div>
                              <h5>
                                {approvalData &&
                                approvalData.approvalRatio !== undefined
                                  ? parseFloat(
                                      approvalData.approvalRatio.toFixed(2)
                                    )
                                  : "N/A"}
                                %
                              </h5>
                              <p className="p2">Approval Ratio</p>
                            </div>
                          </div>
                        </div>

                        <RightSign
                          className="icon2"
                          onClick={this.handleNextArrowclick}
                        />
                      </div>
                    )}

                    {currentSlide.type === "totalVolume" && (
                      <div className="approve-volume-container">
                        <LeftSign
                          className="icon2"
                          onClick={this.handleBackArrowclick}
                        />
                        <div className="scroll-animation">
                          <div className="approval-div-section">
                            <div>
                              <div className="creditcard-div">
                                <CreaditCard className="creditcard-img primary-color-icon" />
                              </div>
                            </div>
                            <div>
                              <h5>
                                ${this.formatValue(volumeData.totalVolume)}
                              </h5>
                              <p className="p2">Total Volume</p>
                            </div>
                          </div>
                        </div>

                        <RightSign
                          className="icon2"
                          onClick={this.handleNextArrowclick}
                        />
                      </div>
                    )}

                    {currentSlide.type === "settledVolume" && (
                      <div className="approve-volume-container">
                        <LeftSign
                          className="icon2"
                          onClick={this.handleBackArrowclick}
                        />
                        <div className="scroll-animation">
                          <div className="approval-div-section">
                            <div>
                              <div className="creditcard-div">
                                <DollarCircle className="creditcard-img primary-color-icon" />
                              </div>
                            </div>
                            <div>
                              <h5>
                                ${this.formatValue(volumeData.settledVolume)}
                              </h5>
                              <p className="p2">Settled Volume</p>
                            </div>
                          </div>
                        </div>

                        <RightSign
                          className="icon2"
                          onClick={this.handleNextArrowclick}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="left-section-middle">
                  <p>Details</p>
                  <div className="create-settelments-horizontal-line"></div>
                  <div className="left-section-middle-body">
                    <p>ABOUT</p>
                    <ul>
                      <li>
                        <div className="p2 icons-div">
                          <User
                            className="merchant-icon"
                            width="20"
                            height="20"
                          />
                          Username:&nbsp;
                          <p>{overviewData.username}</p>
                        </div>
                      </li>
                      <li>
                        <div className="p2 icons-div">
                          <Id className="merchant-icon"></Id>
                          Merchant ID:&nbsp;
                          <p>{overviewData.merchant_id}</p>
                        </div>
                      </li>
                      <li>
                        <div className="p2 icons-div">
                          <URL className="merchant-icon" />
                          Website URL:&nbsp;
                          <p>{overviewData.website_url}</p>
                        </div>
                      </li>
                      <li>
                        <div className="p2 icons-div">
                          <Industry className="merchant-icon" />
                          Industry:&nbsp;
                          <p>{overviewData.industry}</p>
                        </div>
                      </li>
                    </ul>

                    <p>CONTACTS</p>
                    <ul>
                      <li>
                        <div className="p2 icons-div">
                          <Phone className="merchant-icon" />
                          Phone No:&nbsp;
                          <p>{overviewData.phone_number}</p>
                        </div>
                      </li>
                      <li>
                        <div className="p2 icons-div">
                          <Email className="merchant-icon" />
                          Email:&nbsp;
                          <p>{overviewData.email}</p>
                        </div>
                      </li>
                      <li>
                        <div className="p2 icons-div">
                          <Skype className="merchant-icon" />
                          Skype:&nbsp;
                          <p>{overviewData.skype_id}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="left-section-bottom">
                {statusText !== "Pending" && (
                  <button
                    className="btn-primary"
                    onClick={() => this.handleAddMerchant()}
                    disabled={isSuspended}
                  >
                    Edit
                  </button>
                  )}
                  {statusText !== "Pending" && (
                    <button
                      className={`btn-secondary ${
                        statusText === "Active" ? "btn-suspend" : "btn-activate"
                      }`}
                      onClick={this.handleStatusChange}
                      disabled={statusText === "Pending"}
                    >
                      {buttonLabel}
                    </button>
                  )}

{statusText === "Pending" && (
          <button
            className="btn-primary"
            onClick={() => this.approveMerchant(overviewData._id)}
            // Uncomment below line to disable button based on a condition
            // disabled={isActive === "Active" || isActive === "Inactive"}
          >
            Approve
          </button>
        )}
                </div>
              </div>
              <div className="right-section">
                <div className="btn-container">{this.renderButtons()}</div>
                <div className="row-cards">
                  {this.state.overviewInfo && (
                    <div className="right-section-middle-body">
                      <h5>Business Details</h5>
                      <div className="overview-head">
                        <Address className="merchant-icon" />
                        <p>ADDRESS</p>
                      </div>
                      <div className="overview-details">
                        <ul>
                          <li>
                            <div className="p2 icons-div">
                              Country:&nbsp;
                              <p>{overviewData.country}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              City:&nbsp;
                              <p>{overviewData.city}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              Street Address1:&nbsp;
                              <p>{overviewData.street_address}</p>
                            </div>
                          </li>
                        </ul>

                        <ul>
                          <li>
                            <div className="p2 icons-div">
                              State:&nbsp;
                              <p>{overviewData.state}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              Postal Code:&nbsp;
                              <p>{overviewData.postal_code}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              Street Address2:&nbsp;
                              <p>{overviewData.street_address2}</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="create-settelments-horizontal-line"></div>
                      <div className="overview-head">
                        <BusinessInfo className="merchant-icon" />
                        <p>BUSINESS INFO</p>
                      </div>

                      <div className="overview-details">
                        <ul>
                          <li>
                            <div className="p2 icons-div">
                              Type:&nbsp;
                              <p>{overviewData.business_type}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              Sub Category:&nbsp;
                              <p>{overviewData.business_subcategory}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              Pay In:&nbsp;
                              <p>{overviewData.merchant_pay_in}</p>
                            </div>
                          </li>

                          <li>
                            <div className="p2 icons-div">
                              Settlement Charge:&nbsp;
                              <p>{overviewData.settlement_charge}</p>
                            </div>
                          </li>

                          <li>
                            <div className="p2 icons-div">
                              Expected Chargeback Percentage:&nbsp;
                              <p>
                                {overviewData.expected_chargeback_percentage}
                              </p>
                            </div>
                          </li>
                        </ul>
                        <ul>
                          <li>
                            <div className="p2 icons-div">
                              Category:&nbsp;
                              <p>{overviewData.business_category}</p>
                            </div>
                          </li>

                          <li>
                            <div className="p2 icons-div">
                              Registered On:&nbsp;
                              <p>{overviewData.buiness_registered_on}</p>
                            </div>
                          </li>

                          <li>
                            <div className="p2 icons-div">
                              Pay Out:&nbsp;
                              <p>{overviewData.merchant_pay_out}</p>
                            </div>
                          </li>

                          <li>
                            <div className="p2 icons-div">
                              Turnover:&nbsp;
                              <p>{overviewData.turnover}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              Industries ID:&nbsp;
                              <p>{overviewData.industries_id}</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="create-settelments-horizontal-line"></div>
                      <div className="overview-head">
                        <DirectorInfo className="merchant-icon" />
                        <p>DIRECTOR INFO</p>
                      </div>

                      <div className="overview-details">
                        <ul>
                          <li>
                            <div className="p2 icons-div">
                              First Name:&nbsp;
                              <p>{overviewData.director_first_name}</p>
                            </div>
                          </li>
                        </ul>
                        <ul>
                          <li>
                            <div className="p2 icons-div">
                              Last Name:&nbsp;
                              <p>{overviewData.director_last_name}</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  {/* Rates section */}
                  {this.state.ratesInfo && (
                    <div className="right-section-middle-body">
                      <h5>Current Prices</h5>
                      <div className="rates-table">
                        <table>
                          <thead>
                            <tr>
                              <th>Charging Items</th>
                              <th>Charging Rates or Amount</th>
                              <th>Remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <div className="ratesItem">MDR</div>{" "}
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="MDR"
                                    value={ratesData.MDR}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.MDR} %`
                                )}
                              </td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">
                                  Transaction Approved
                                </div>{" "}
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="txn_app"
                                    value={ratesData.txn_app}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${
                                    ratesData.txn_app
                                  } ${this.getCurrencySymbol(
                                    ratesData.currency
                                  )}`
                                )}
                              </td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">
                                  Transaction Declined
                                </div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="txn_dec"
                                    value={ratesData.txn_dec}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${
                                    ratesData.txn_dec
                                  } ${this.getCurrencySymbol(
                                    ratesData.currency
                                  )}`
                                )}
                              </td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">Refund Fees</div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="refund_fee"
                                    value={ratesData.refund_fee}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${
                                    ratesData.refund_fee
                                  } ${this.getCurrencySymbol(
                                    ratesData.currency
                                  )}`
                                )}
                              </td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">Chargeback Fees</div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="chargeback_fee"
                                    value={ratesData.chargeback_fee}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${
                                    ratesData.chargeback_fee
                                  } ${this.getCurrencySymbol(
                                    ratesData.currency
                                  )}`
                                )}
                              </td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">Rolling Reserve</div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="RR"
                                    value={ratesData.RR}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.RR} %`
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="RR_remark"
                                    value={ratesData.RR_remark}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.RR_remark}`
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">Setup Fees</div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="setup_fee"
                                    value={ratesData.setup_fee}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${
                                    ratesData.setup_fee
                                  } ${this.getCurrencySymbol(
                                    ratesData.currency
                                  )}`
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="setupFee_remark"
                                    value={ratesData.setupFee_remark}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.setupFee_remark}`
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">
                                  Settlement Cycle
                                </div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="settlement_cycle"
                                    value={ratesData.settlement_cycle}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  ratesData.settlement_cycle
                                )}
                              </td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">Settlement Fees</div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="settlement_fee"
                                    value={ratesData.settlement_fee}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.settlement_fee} %`
                                )}
                              </td>

                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="settlementFee_remark"
                                    value={ratesData.settlementFee_remark}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.settlementFee_remark}`
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">
                                  Annual Maintenance Fees
                                </div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="annual_maintenance_fee"
                                    value={ratesData.annual_maintenance_fee}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${
                                    ratesData.annual_maintenance_fee
                                  } ${this.getCurrencySymbol(
                                    ratesData.currency
                                  )}`
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name=" annualMaintenanceFee_remark"
                                    value={
                                      ratesData.annualMaintenanceFee_remark
                                    }
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.annualMaintenanceFee_remark}`
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="rates-table-button-container">
                        <button
                          className="btn-primary"
                          onClick={
                            isEditing ? this.handleSave : this.handleEditClick
                          }
                        >
                          {isEditing ? "Update" : "Edit"}
                        </button>
                        {isEditing && (
                          <button
                            className="btn-secondary"
                            onClick={this.handleCancelClick}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Settlement section */}
                  {this.state.settlementInfo && (
                    <div className="right-section-middle-body">
                      <div className="settlements-container">
                        <img
                          src={settlemntimg}
                          alt=""
                          className="settelmentimg"
                        />
                      </div>
                    </div>
                  )}

                  {this.state.secretsInfo && (
                    <div className="right-section-middle-body">
                      <div className="settlements-container">
                        <h4 className="head-head">API Key List & Access</h4>
                        <p className="head-head fonttt">
                          An API key is a simple encrypted string that
                          identifies an application without any principal. They
                          are useful for accessing public data anonymously, and
                          are used to associate API requests with your project
                          for quota and billing.
                        </p>
                        <div className="api-key-container">
                          <div className="api-key-container-head-div">
                            <div className="api-key-container-div">
                              <h6 className="heading-text">API Key</h6>
                              <div className="mini-container">
                                <p>Public Key</p>
                              </div>
                            </div>
                            <CustomTooltip
                              details={
                                <p className="white-color">
                                  Essential for API access. Protect it like a
                                  password.
                                </p>
                              }
                            >
                              <Infoicon className="icon2" />
                            </CustomTooltip>
                          </div>
                          <div className="api-key-content">
                            <p id="api-key">
                              {showApiKey
                                ? this.apiKey
                                : this.maskString(this.state.apiKey)}
                            </p>
                            <div
                              onClick={() =>
                                this.handleCopy(apiKey, "api", "api-key")
                              }
                            >
                              <Copy className="grey-icon zoom copy-icon-signupkey" />
                            </div>
                          </div>
                          <div className="subtext-api">
                            <p>Created on 28 Apr 2021, 18:20 GTM+4:10</p>
                          </div>
                        </div>

                        <div className="api-key-container">
                          <div className="api-key-container-head-div">
                            <div className="api-key-container-div">
                              <h6 className="heading-text">Secret Key</h6>
                              <div className="mini-container">
                                <p>Private Key</p>
                              </div>
                            </div>
                            <CustomTooltip
                              details={
                                <p className="white-color">
                                  {" "}
                                  Highest level of security for API
                                  authentication. Keep it confidential.
                                </p>
                              }
                            >
                              <Infoicon className="icon2" />
                            </CustomTooltip>
                          </div>
                          <div className="api-key-content">
                            <p id="secret-key">
                              {showSecretKey
                                ? secretKey
                                : this.maskString(secretKey)}
                            </p>
                            <div
                              onClick={() =>
                                this.handleCopy(
                                  secretKey,
                                  "secret",
                                  "secret-key"
                                )
                              }
                            >
                              <Copy className="grey-icon copy-icon-signupkey" />
                            </div>
                          </div>
                          <div className="subtext-api">
                            <p>Created on 28 Apr 2021, 18:20 GTM+4:10</p>
                          </div>
                        </div>

                        {overviewData.rootAccountCreated ? (
                          <div className="api-key-container">
                            <h6 className="heading-text">Login Credentials</h6>
                            <div className="login-key-container">
                              <div className="input-group">
                                <input
                                  type="text"
                                  id="Email"
                                  className="inputFeild"
                                  value={email}
                                />
                                <label className="inputLabel" htmlFor="email">
                                  Email
                                </label>
                              </div>
                              <div className="input-group">
                                <input
                                  type="password"
                                  id="Password"
                                  className="inputFeild"
                                  value={password}
                                />
                                <label className="inputLabel" htmlFor="email">
                                  Password
                                </label>
                              </div>
                              <button
                                className="btn-primary login-secret"
                                onClick={this.handleSubmit}
                              >
                                Login
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="api-key-container">
                            <div className="api-key-container-head-div">
                              <div className="api-key-container-div">
                                <h6 className="heading-text">
                                  Account Creation Key
                                </h6>
                              </div>
                              <CustomTooltip
                                details={
                                  <p className="white-color">
                                    {" "}
                                    Restricted key for account creation. Handle
                                    with extreme care.
                                  </p>
                                }
                              >
                                <Infoicon className="icon2" />
                              </CustomTooltip>
                            </div>
                            <div className="api-key-content">
                              <p>{this.maskString(rootAccountKey)}</p>
                              <div
                                className={`copy-icon-signupkey ${
                                  copied.rootAccountKey ? "disabled" : ""
                                }`}
                                onClick={() =>
                                  !copied.rootAccountKey &&
                                  this.handleCopy(
                                    rootAccountKey,
                                    "root",
                                    "root-key"
                                  )
                                }
                              >
                                <Copy className="grey-icon" />
                              </div>
                            </div>
                            <div className="subtext-api">
                              <p>Root account not created</p>
                            </div>
                          </div>
                        )}
                        {/* {!overviewData.rootAccountCreated && (
                          <>
                            <h5>Account Creation Key</h5>
                            <div className="secret-field">
                              <p className="p2">Root User Sign Up Key</p>
                              <div className="input-container">
                                <div
                                  className={`icon-container copy-icon ${copied.rootAccountKey ? "disabled" : ""
                                    }`}
                                  onClick={() =>
                                    !copied.rootAccountKey &&
                                    this.handleCopy(
                                      "userSignUpKey",
                                      rootAccountKey
                                    )
                                  }
                                >
                                  <Copy className="grey-icon" />
                                </div>
                                <input
                                  className="inputFeild secretkey-input"
                                  type="text"
                                  id="rootAccountKey"
                                  value={this.maskString(rootAccountKey)}
                                  readOnly
                                />
                              </div>
                              <p className="p2">Root account not created</p>
                            </div>
                          </>
                        )} */}
                      </div>
                    </div>
                  )}
                  {this.state.isAddMerchantPanelOpen && (
                    <MerchantForm
                      handleAddMerchant={this.handleAddMerchant}
                      merchantData={overviewData}
                      isAddMerchantPanelOpen={this.state.isAddMerchantPanelOpen}
                      submitButtonText="Update"
                      heading="Update Merchant"
                      refreshMerchantData={this.refreshMerchantData}
                      isDisable={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="icons-div">
						<img
						  src={calender}
						  alt="calender"
						  onClick={() => this.handleCalenderClick()}
						></img>
					  </div>
					  {this.state.calendarVisible && (
						<div className="dates-container">
						  <div className="dates-div">
							<label className="p2" htmlFor="fromDate">
							  From:{" "}
							</label>
							<p className="p2">{this.state.fromDate}</p>
							<input
							  type="datetime-local"
							  id="fromDate"
							  className="inputFeild date-input"
							  required
							  onChange={this.handleInputChange}
							  value={this.state.fromDate}
							/>
						  </div>
						  <div className="dates-div">
							<label className="p2" htmlFor="toDate">
							  To:{" "}
							</label>
							<p className="p2">{this.state.toDate}</p>
							<input
							  type="datetime-local"
							  id="toDate"
							  className="inputFeild date-input"
							  required
							  onChange={this.handleInputChange}
							  value={this.state.toDate}
							/>
						  </div>
						</div>
					  )} */}
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
          <Header />
          <Sidebar />
          <div
            className={`main-screen ${
              this.state.sidebaropen
                ? "collapsed-main-screen"
                : "expanded-main-screen"
            }  `}
          >
            <div className="view-merchant-container">
              <div className="row-cards left-section">
                <div className="left-section-top">
                  <div className="profile-image">
                    <img src={profile} alt="user profile"></img>
                  </div>
                  <h5>{this.state.company_name}</h5>
                  <div
                    className={`status-div ${
                      statusText === "Active"
                        ? "success-status"
                        : "failed-status"
                    }`}
                  >
                    <p>{statusText}</p>
                  </div>
                  <div className="slideshow-container">
                    {currentSlide.type === "approvalRatio" && (
                      <div className="approve-volume-container">
                        <LeftSign
                          className="icon2"
                          onClick={this.handleBackArrowclick}
                        />
                        <div className="scroll-animation">
                          <div className="approval-div-section">
                            <div>
                              <div className="creditcard-div">
                                <ApprovalRatio className="creditcard-img primary-color-icon" />
                              </div>
                            </div>
                            <div>
                              <h5>
                                {approvalData &&
                                approvalData.approvalRatio !== undefined
                                  ? parseFloat(
                                      approvalData.approvalRatio.toFixed(2)
                                    )
                                  : "N/A"}
                                %
                              </h5>
                              <p className="p2">Approval Ratio</p>
                            </div>
                          </div>
                        </div>

                        <RightSign
                          className="icon2"
                          onClick={this.handleNextArrowclick}
                        />
                      </div>
                    )}

                    {currentSlide.type === "totalVolume" && (
                      <div className="approve-volume-container">
                        <LeftSign
                          className="icon2"
                          onClick={this.handleBackArrowclick}
                        />
                        <div className="scroll-animation">
                          <div className="approval-div-section">
                            <div>
                              <div className="creditcard-div">
                                <CreaditCard className="creditcard-img primary-color-icon" />
                              </div>
                            </div>
                            <div>
                              <h5>
                                ${this.formatValue(volumeData.totalVolume)}
                              </h5>
                              <p className="p2">Total Volume</p>
                            </div>
                          </div>
                        </div>

                        <RightSign
                          className="icon2"
                          onClick={this.handleNextArrowclick}
                        />
                      </div>
                    )}

                    {currentSlide.type === "settledVolume" && (
                      <div className="approve-volume-container">
                        <LeftSign
                          className="icon2"
                          onClick={this.handleBackArrowclick}
                        />
                        <div className="scroll-animation">
                          <div className="approval-div-section">
                            <div>
                              <div className="creditcard-div">
                                <DollarCircle className="creditcard-img primary-color-icon" />
                              </div>
                            </div>
                            <div>
                              <h5>
                                ${this.formatValue(volumeData.settledVolume)}
                              </h5>
                              <p className="p2">Settled Volume</p>
                            </div>
                          </div>
                        </div>

                        <RightSign
                          className="icon2"
                          onClick={this.handleNextArrowclick}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="left-section-middle">
                  <p>Details</p>
                  <div className="create-settelments-horizontal-line"></div>
                  <div className="left-section-middle-body">
                    <p>ABOUT</p>
                    <ul>
                      <li>
                        <div className="p2 icons-div">
                          <User className="merchant-icon" />
                          Username:&nbsp;
                          <p>{overviewData.username}</p>
                        </div>
                      </li>
                      <li>
                        <div className="p2 icons-div">
                          <Id className="merchant-icon"></Id>
                          Merchant ID:&nbsp;
                          <p>{overviewData.merchant_id}</p>
                        </div>
                      </li>
                      <li>
                        <div className="p2 icons-div">
                          <URL className="merchant-icon" />
                          Website URL:&nbsp;
                          <p>{overviewData.website_url}</p>
                        </div>
                      </li>
                      <li>
                        <div className="p2 icons-div">
                          <Industry className="merchant-icon" />
                          Industry:&nbsp;
                          <p>{overviewData.industry}</p>
                        </div>
                      </li>
                    </ul>

                    <p className="p2">CONTACTS</p>
                    <ul>
                      <li>
                        <div className="p2 icons-div">
                          <Phone className="merchant-icon" />
                          Phone No:&nbsp;
                          <p>{overviewData.phone_number}</p>
                        </div>
                      </li>
                      <li>
                        <div className="p2 icons-div">
                          <Email className="merchant-icon" />
                          Email:&nbsp;
                          <p>{overviewData.email}</p>
                        </div>
                      </li>
                      <li>
                        <div className="p2 icons-div">
                          <Skype className="merchant-icon" />
                          Skype:&nbsp;
                          <p>{overviewData.skype_id}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="left-section-bottom root-update-btn">
                  <button
                    className="btn-primary"
                    onClick={() => this.handleAddMerchant()}
                    disabled={isSuspended}
                  >
                    Edit
                  </button>
                  {/* <button
                    className={`btn-secondary ${
                      statusText === "Active" ? "btn-suspend" : "btn-activate"
                    }`}
                    onClick={this.handleStatusChange}
                  >
                    {buttonLabel}
                  </button> */}
                </div>
              </div>
              <div className="right-section">
                <div className="btn-container">{this.renderButtons()}</div>
                <div className="row-cards">
                  {this.state.overviewInfo && (
                    <div className="right-section-middle-body">
                      <h5>Business Details</h5>
                      <div className="overview-head">
                        <Address className="merchant-icon" />
                        <p>ADDRESS</p>
                      </div>
                      <div className="overview-details">
                        <ul>
                          <li>
                            <div className="p2 icons-div">
                              Country:&nbsp;
                              <p>{overviewData.country}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              City:&nbsp;
                              <p>{overviewData.city}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              Street Address1:&nbsp;
                              <p>{overviewData.street_address}</p>
                            </div>
                          </li>
                        </ul>

                        <ul>
                          <li>
                            <div className="p2 icons-div">
                              State:&nbsp;
                              <p>{overviewData.state}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              Postal Code:&nbsp;
                              <p>{overviewData.postal_code}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              Street Address2:&nbsp;
                              <p>{overviewData.street_address2}</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="create-settelments-horizontal-line"></div>
                      <div className="overview-head">
                        <BusinessInfo className="merchant-icon" />
                        <p>BUSINESS INFO</p>
                      </div>

                      <div className="overview-details">
                        <ul>
                          <li>
                            <div className="p2 icons-div">
                              Type:&nbsp;
                              <p>{overviewData.business_type}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              Sub Category:&nbsp;
                              <p>{overviewData.business_subcategory}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              Pay In:&nbsp;
                              <p>{overviewData.merchant_pay_in}</p>
                            </div>
                          </li>

                          <li>
                            <div className="p2 icons-div">
                              Settlement Charge:&nbsp;
                              <p>{overviewData.settlement_charge}</p>
                            </div>
                          </li>

                          <li>
                            <div className="p2 icons-div">
                              Expected Chargeback Percentage:&nbsp;
                              <p>
                                {overviewData.expected_chargeback_percentage}
                              </p>
                            </div>
                          </li>
                        </ul>
                        <ul>
                          <li>
                            <div className="p2 icons-div">
                              Category:&nbsp;
                              <p>{overviewData.business_category}</p>
                            </div>
                          </li>

                          <li>
                            <div className="p2 icons-div">
                              Registered On:&nbsp;
                              <p>{overviewData.buiness_registered_on}</p>
                            </div>
                          </li>

                          <li>
                            <div className="p2 icons-div">
                              Pay Out:&nbsp;
                              <p>{overviewData.merchant_pay_out}</p>
                            </div>
                          </li>

                          <li>
                            <div className="p2 icons-div">
                              Turnover:&nbsp;
                              <p>{overviewData.turnover}</p>
                            </div>
                          </li>
                          <li>
                            <div className="p2 icons-div">
                              Industries ID:&nbsp;
                              <p>{overviewData.industries_id}</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="create-settelments-horizontal-line"></div>
                      <div className="overview-head">
                        <DirectorInfo className="merchant-icon" />
                        <p>DIRECTOR INFO</p>
                      </div>

                      <div className="overview-details">
                        <ul>
                          <li>
                            <div className="p2 icons-div">
                              First Name:&nbsp;
                              <p>{overviewData.director_first_name}</p>
                            </div>
                          </li>
                        </ul>
                        <ul>
                          <li>
                            <div className="p2 icons-div">
                              Last Name:&nbsp;
                              <p>{overviewData.director_last_name}</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  {/* Rates section */}
                  {this.state.ratesInfo && (
                    <div className="right-section-middle-body">
                      <h5>Current Prices</h5>
                      <div className="rates-table">
                        <table>
                          <thead>
                            <tr>
                              <th>Charging Items</th>
                              <th>Charging Rates or Amount</th>
                              <th>Remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <div className="ratesItem">MDR</div>{" "}
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="MDR"
                                    value={ratesData.MDR}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.MDR} %`
                                )}
                              </td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">
                                  Transaction Approved
                                </div>{" "}
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="txn_app"
                                    value={ratesData.txn_app}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${
                                    ratesData.txn_app
                                  } ${this.getCurrencySymbol(
                                    ratesData.currency
                                  )}`
                                )}
                              </td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">
                                  Transaction Declined
                                </div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="txn_dec"
                                    value={ratesData.txn_dec}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${
                                    ratesData.txn_dec
                                  } ${this.getCurrencySymbol(
                                    ratesData.currency
                                  )}`
                                )}
                              </td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">Refund Fees</div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="refund_fee"
                                    value={ratesData.refund_fee}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${
                                    ratesData.refund_fee
                                  } ${this.getCurrencySymbol(
                                    ratesData.currency
                                  )}`
                                )}
                              </td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">Chargeback Fees</div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="chargeback_fee"
                                    value={ratesData.chargeback_fee}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${
                                    ratesData.chargeback_fee
                                  } ${this.getCurrencySymbol(
                                    ratesData.currency
                                  )}`
                                )}
                              </td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">Rolling Reserve</div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="RR"
                                    value={ratesData.RR}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.RR} %`
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="RR_remark"
                                    value={ratesData.RR_remark}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.RR_remark}`
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">Setup Fees</div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="setup_fee"
                                    value={ratesData.setup_fee}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${
                                    ratesData.setup_fee
                                  } ${this.getCurrencySymbol(
                                    ratesData.currency
                                  )}`
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="setupFee_remark"
                                    value={ratesData.setupFee_remark}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.setupFee_remark}`
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">
                                  Settlement Cycle
                                </div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="settlement_cycle"
                                    value={ratesData.settlement_cycle}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  ratesData.settlement_cycle
                                )}
                              </td>
                              <td>-</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">Settlement Fees</div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="settlement_fee"
                                    value={ratesData.settlement_fee}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.settlement_fee} %`
                                )}
                              </td>

                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="settlementFee_remark"
                                    value={ratesData.settlementFee_remark}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.settlementFee_remark}`
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="ratesItem">
                                  Annual Maintenance Fees
                                </div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="annual_maintenance_fee"
                                    value={ratesData.annual_maintenance_fee}
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${
                                    ratesData.annual_maintenance_fee
                                  } ${this.getCurrencySymbol(
                                    ratesData.currency
                                  )}`
                                )}
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name=" annualMaintenanceFee_remark"
                                    value={
                                      ratesData.annualMaintenanceFee_remark
                                    }
                                    onChange={this.handleChange}
                                    className="editable-input"
                                  />
                                ) : (
                                  `${ratesData.annualMaintenanceFee_remark}`
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="rates-table-button-container">
                        {/* <button
                          className="btn-primary"
                          onClick={
                            isEditing ? this.handleSave : this.handleEditClick
                          }
                        >
                          {isEditing ? "Update" : "Edit"}
                        </button> */}
                      </div>
                    </div>
                  )}

                  {/* Settlement section */}
                  {this.state.settlementInfo && (
                    <div className="right-section-middle-body">
                      <div className="settlements-container">
                        <img
                          src={settlemntimg}
                          alt=""
                          className="settelmentimg"
                        />
                      </div>
                    </div>
                  )}

                  {this.state.secretsInfo && (
                    <div className="right-section-middle-body">
                      <div className="settlements-container">
                        <h4 className="head-head">API Key List & Access</h4>
                        <p className="head-head fonttt">
                          An API key is a simple encrypted string that
                          identifies an application without any principal. They
                          are useful for accessing public data anonymously, and
                          are used to associate API requests with your project
                          for quota and billing.
                        </p>
                        <div className="api-key-container">
                          <div className="api-key-container-head-div">
                            <div className="api-key-container-div">
                              <h6 className="heading-text">API Key</h6>
                              <div className="mini-container">
                                <p>Public Key</p>
                              </div>
                            </div>
                            <CustomTooltip
                              details={
                                <p className="white-color">
                                  Essential for API access. Protect it like a
                                  password.
                                </p>
                              }
                            >
                              <Infoicon className="icon2" />
                            </CustomTooltip>
                          </div>
                          <div className="api-key-content">
                            <div
                              className="icon-container"
                              onClick={() =>
                                this.toggleVisibility("showApiKey")
                              }
                            >
                              {showApiKey ? (
                                <EyeOff className="grey-icon" />
                              ) : (
                                <Eye className="grey-icon" />
                              )}
                            </div>
                            <div className="accntkey">
                              <p id="api-key">
                                {showApiKey ? apiKey : this.maskString(apiKey)}
                              </p>
                            </div>
                            <div
                              onClick={() =>
                                this.handleCopy(apiKey, "api", "api-key")
                              }
                            >
                              <Copy className="grey-icon zoom copy-icon-signupkey" />
                            </div>
                          </div>
                          <div className="subtext-api">
                            <p>Created on 28 Apr 2021, 18:20 GTM+4:10</p>
                          </div>
                        </div>

                        <div className="api-key-container">
                          <div className="api-key-container-head-div">
                            <div className="api-key-container-div">
                              <h6 className="heading-text">Secret Key</h6>
                              <div className="mini-container">
                                <p>Private Key</p>
                              </div>
                            </div>
                            <CustomTooltip
                              details={
                                <p className="white-color">
                                  {" "}
                                  Highest level of security for API
                                  authentication. Keep it confidential.
                                </p>
                              }
                            >
                              <Infoicon className="icon2" />
                            </CustomTooltip>
                          </div>
                          <div className="api-key-content">
                            <div
                              className="icon-container"
                              onClick={() =>
                                this.toggleVisibility("showSecretKey")
                              }
                            >
                              {showSecretKey ? (
                                <EyeOff className="grey-icon" />
                              ) : (
                                <Eye className="grey-icon" />
                              )}
                            </div>
                            <div className="accntkey">
                              <p id="secret-key">
                                {showSecretKey
                                  ? secretKey
                                  : this.maskString(secretKey)}
                              </p>
                            </div>
                            <div
                              onClick={() =>
                                this.handleCopy(
                                  secretKey,
                                  "secret",
                                  "secret-key"
                                )
                              }
                            >
                              <Copy className="grey-icon copy-icon-signupkey" />
                            </div>
                          </div>
                          <div className="subtext-api">
                            <p>Created on 28 Apr 2021, 18:20 GTM+4:10</p>
                          </div>
                        </div>

                        <div className="api-key-container">
                          <div className="api-key-container-head-div">
                            <div className="api-key-container-div">
                              <h6 className="heading-text">Webhook Url</h6>
                              <div className="mini-container">
                                <p>Web Url</p>
                              </div>
                            </div>
                            <div>
                              <CustomTooltip
                                details={
                                  <p className="white-color">
                                    This highly secure webhook URL for API
                                    authentication.
                                  </p>
                                }
                              >
                                <Infoicon className="icon2" />
                              </CustomTooltip>
                            </div>
                          </div>
                          <div className="login-key-container">
                            <div className="input-group">
                              <input
                                type="text"
                                id="weburl"
                                className="inputFeild web-input"
                                value={this.state.weburl}
                              />
                              <label className="inputLabel" htmlFor="email">
                                Web Url
                              </label>
                            </div>
                            <button
                              className="btn-primary"
                              onClick={this.handleSubmit}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* {this.state.secretsInfo && (
                    <div className="right-section-middle-body">
                      <div className="settlements-container">
                        <div className="integration-Key">
                          <h5>Integration Key</h5>
                          <div className="secret-field">
                            <p className="p2">API Key</p>
                            <div className="input-container">
                              <div
                                className="icon-container copy-icon"
                                onClick={() => this.handleCopy(apiKey)}
                              >
                                <Copy className="grey-icon" />
                              </div>
                              <input
                                className="inputFeild secretkey-input"
                                type="text"
                                id="apiKey"
                                value={
                                  showApiKey ? apiKey : this.maskString(apiKey)
                                }
                                readOnly
                              />
                              <div
                                className="icon-container eye-icon"
                                onClick={() =>
                                  this.toggleVisibility("showApiKey")
                                }
                              >
                                {showApiKey ? (
                                  <EyeOff className="grey-icon" />
                                ) : (
                                  <Eye className="grey-icon" />
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="secret-field">
                            <p className="p2">Secret Key</p>
                            <div className="input-container">
                              <div
                                className="icon-container copy-icon"
                                onClick={() => this.handleCopy(secretKey)}
                              >
                                <Copy className="grey-icon" />
                              </div>
                              <input
                                className="inputFeild secretkey-input"
                                type="text"
                                id="secretKey"
                                value={
                                  showSecretKey
                                    ? secretKey
                                    : this.maskString(secretKey)
                                }
                                readOnly
                              />
                              <div
                                className="icon-container eye-icon"
                                onClick={() =>
                                  this.toggleVisibility("showSecretKey")
                                }
                              >
                                {showSecretKey ? (
                                  <EyeOff className="grey-icon" />
                                ) : (
                                  <Eye className="grey-icon" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <h5>Account Creation Key</h5>
                        <div className="secret-field">
                          <p className="p2">Root User Sign Up Key</p>
                          <div className="input-container">
                            <div
                              className={`icon-container copy-icon ${
                                copied.signupKey ? "disabled" : ""
                              }`}
                              onClick={() =>
                                !copied.signupKey &&
                                this.handleCopy("userSignUpKey", signupKey)
                              }
                            >
                              <Copy className="grey-icon" />
                            </div>
                            <input
                              className="inputFeild secretkey-input"
                              type="text"
                              id="signupKey"
                              value={
                                showUserSignUpKey
                                  ? signupKey
                                  : this.maskString(signupKey)
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )} */}
                  {this.state.isAddMerchantPanelOpen && (
                    <MerchantForm
                      handleAddMerchant={this.handleAddMerchant}
                      merchantData={overviewData}
                      isAddMerchantPanelOpen={this.state.isAddMerchantPanelOpen}
                      submitButtonText="Update"
                      heading="Update Merchant"
                      refreshMerchantData={this.refreshMerchantData}
                      isDisable={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="icons-div">
						<img
						  src={calender}
						  alt="calender"
						  onClick={() => this.handleCalenderClick()}
						></img>
					  </div>
					  {this.state.calendarVisible && (
						<div className="dates-container">
						  <div className="dates-div">
							<label className="p2" htmlFor="fromDate">
							  From:{" "}
							</label>
							<p className="p2">{this.state.fromDate}</p>
							<input
							  type="datetime-local"
							  id="fromDate"
							  className="inputFeild date-input"
							  required
							  onChange={this.handleInputChange}
							  value={this.state.fromDate}
							/>
						  </div>
						  <div className="dates-div">
							<label className="p2" htmlFor="toDate">
							  To:{" "}
							</label>
							<p className="p2">{this.state.toDate}</p>
							<input
							  type="datetime-local"
							  id="toDate"
							  className="inputFeild date-input"
							  required
							  onChange={this.handleInputChange}
							  value={this.state.toDate}
							/>
						  </div>
						</div>
					  )} */}
        </>
      );
    }
  }
}

export default ViewMerchant;
