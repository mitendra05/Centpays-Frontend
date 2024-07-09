import React, { Component } from "react";

//Components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MerchantForm from "../components/Merchant_Form";
import MessageBox from "../components/Message_box";
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
      errorMessage: "",
      messageType: "",
      signupKey: " ",
      apiKey: "0987654321",
      secretKey: "1122334455",
      showUserSignUpKey: false,
      showApiKey: false,
      showSecretKey: false,
      copied: {
        signupKey: false,
        apiKey: false,
        secretKey: false,
      },
    };
  }

  extractENameFromURL() {
    const currentPath = window.location.pathname;
    const companyName = currentPath.split("/viewmerchant/")[1];
    return companyName;
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  fetchSignupKey = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { role, companyName } = this.state;

    const company_name =
      role === "merchant" ? companyName : this.state.company_name;

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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      this.setState({ signupKey: data.signupKey });
      console.log(data.signupKey);
    } catch (error) {
      this.setState({
        errorMessage: `Error fetching signup key: ${error.message}`,
        messageType: "fail",
      });
    }
  };

  componentDidMount() {
    const { company_name: stateCompanyName, companyName, role } = this.state;

    const company_name = role === "merchant" ? companyName : stateCompanyName;

    let date = new Date().toISOString().split("T")[0];
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    this.fetchSignupKey();
    this.fetchData(
      `${backendURL}/viewclient?company_name=${company_name}`,
      "overviewData",
      (data) => {
        // Ensure data exists before accessing properties
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
  }

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
        // Ensure data exists before accessing properties
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
      MDR: ratesData.MDR,
      txn_app: ratesData.txn_app,
      txn_dec: ratesData.txn_dec,
      refund_fee: ratesData.refund_fee,
      chargeback_fee: ratesData.chargeback_fee,
      RR: ratesData.RR,
      setup_fee: ratesData.setup_fee,
      settlement_cycle: ratesData.settlement_cycle,
      settlement_fee: ratesData.settlement_fee,
      annual_maintenance_fee: ratesData.annual_maintenance_fee,
      RR_remark: ratesData.RR_remark,
      setupFee_remark: ratesData.setupFee_remark,
      settlementFee_remark: ratesData.settlementFee_remark,
      annualMaintenanceFee_remark: ratesData.annualMaintenanceFee_remark,
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
      () => {
        this.updateMerchantStatus(newStatusText, idforEdit);
      }
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
    if (current === "showApprovalRatio") {
      this.setState({
        showApprovalRatio: false,
        showSettledVolume: true,
        showTotalVolume: false,
      });
    } else if (current === "showTotalVolume") {
      this.setState({
        showApprovalRatio: true,
        showSettledVolume: false,
        showTotalVolume: false,
      });
    } else if (current === "showSettledVolume") {
      this.setState({
        showApprovalRatio: false,
        showSettledVolume: false,
        showTotalVolume: true,
      });
    }
  };

  handleNextArrowclick = (current) => {
    if (current === "showApprovalRatio") {
      this.setState({
        showApprovalRatio: false,
        showSettledVolume: false,
        showTotalVolume: true,
      });
    } else if (current === "showTotalVolume") {
      this.setState({
        showApprovalRatio: false,
        showSettledVolume: true,
        showTotalVolume: false,
      });
    } else if (current === "showSettledVolume") {
      this.setState({
        showApprovalRatio: true,
        showSettledVolume: false,
        showTotalVolume: false,
      });
    }
  };

  handleButtonClick = (buttonName) => {
    if (buttonName === "overviewInfo") {
      this.setState({
        overviewInfo: true,
        ratesInfo: false,
        settlementInfo: false,
        secretsInfo: false,
      });
    } else if (buttonName === "ratesInfo") {
      this.setState({
        overviewInfo: false,
        ratesInfo: true,
        settlementInfo: false,
        secretsInfo: false,
      });
      this.fetchRatesData();
    } else if (buttonName === "settlementInfo") {
      this.setState({
        overviewInfo: false,
        ratesInfo: false,
        settlementInfo: true,
        secretsInfo: false,
      });
    } else if (buttonName === "secretsInfo") {
      this.setState({
        overviewInfo: false,
        ratesInfo: false,
        settlementInfo: false,
        secretsInfo: true,
      });
    }
  };

  formatNumber = (number) => {
    const numStr = String(number);
    if (numStr.length > 12) {
      const stars = "*".repeat(numStr.length - 12);
      return `${numStr.slice(0, 7)}${stars}${numStr.slice(-5)}`;
    }
    return numStr;
  };

  handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    this.setState({ errorMessage: "Key Copied!", messageType: "success" });
    this.setState((prevState) => ({
      copied: {
        ...prevState.copied,
        [key]: true,
      },
    }));
  };

  toggleVisibility = (key) => {
    this.setState((prevState) => ({ [key]: !prevState[key] }));
  };

  renderButtons = () => {
    const { overviewInfo, ratesInfo, settlementInfo, secretsInfo } = this.state;
    return (
      <div className="btn-container">
        {overviewInfo ? (
          <button className="btn-primary btn3">
            <div className="Info-btn">
              <PendingUserIcon className=" white-icon" width="20" height="20" />
              <p>Overview</p>
            </div>
          </button>
        ) : (
          <div
            onClick={() => this.handleButtonClick("overviewInfo")}
            className="btn-secondary btn-inactive"
          >
            {/* <img className="" src={overviewBlack} alt="overview"></img> */}
            <PendingUserIcon className=" black-icon" width="20" height="20" />
            <p className="p2">Overview</p>
          </div>
        )}
        {ratesInfo ? (
          <button className="btn-primary btn3">
            <div className="Info-btn">
              <MerchantRates className=" white-icon" />
              <p>Rates</p>
            </div>
          </button>
        ) : (
          <div
            onClick={() => this.handleButtonClick("ratesInfo")}
            className="btn-secondary btn-inactive"
          >
            <MerchantRates className=" black-icon" />
            <p className="p2">Rates</p>
          </div>
        )}
        {settlementInfo ? (
          <button className="btn-primary btn3">
            <div className="Info-btn">
              <MerchantSettlements className=" white-icon" />

              <p>Settlements</p>
            </div>
          </button>
        ) : (
          <div
            onClick={() => this.handleButtonClick("settlementInfo")}
            className="btn-secondary btn-inactive"
          >
            <MerchantSettlements className=" black-icon" />
            <p className="p2">Settlements</p>
          </div>
        )}
        {secretsInfo ? (
          <button className="btn-primary btn3">
            <div className="Info-btn">
              <Eye className=" white-icon" />

              <p>Secrets</p>
            </div>
          </button>
        ) : (
          <div
            onClick={() => this.handleButtonClick("secretsInfo")}
            className="btn-secondary btn-inactive"
          >
            <Eye className=" black-icon" />
            <p className="p2">Secrets</p>
          </div>
        )}
      </div>
    );
  };

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
      signupKey,
      apiKey,
      secretKey,
      showUserSignUpKey,
      showApiKey,
      showSecretKey,
      copied,
    } = this.state;
    const getCurrencySymbol = (currencyCode) => {
      switch (currencyCode) {
        case "USD":
          return "$";
        case "EUR":
          return "€";
        default:
          return currencyCode;
      }
    };

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
                      statusText === "Active"
                        ? "success-status"
                        : "failed-status"
                    }`}
                  >
                    <p>{statusText}</p>
                  </div>
                  {this.state.showApprovalRatio && (
                    <div className="approve-volume-container">
                      <LeftSign
                        className="icon2"
                        onClick={() =>
                          this.handleBackArrowclick("showApprovalRatio")
                        }
                      ></LeftSign>

                      <div className="approval-div-section">
                        <div>
                          <div className="creditcard-div">
                            <ApprovalRatio className="creditcard-img primary-color-icon" />
                          </div>
                        </div>
                        <div>
                          <h5>
                            {this.state.approvalData &&
                            this.state.approvalData.approvalRatio !== undefined
                              ? parseFloat(
                                  this.state.approvalData.approvalRatio.toFixed(
                                    2
                                  )
                                )
                              : "N/A"}%
                          </h5>

                          <p className="p2">Approval Ratio</p>
                        </div>
                      </div>
                      <RightSign
                        className="icon2"
                        onClick={() =>
                          this.handleNextArrowclick("showApprovalRatio")
                        }
                      />
                    </div>
                  )}
                  {this.state.showTotalVolume && (
                    <div className="approve-volume-container">
                      <LeftSign
                        className="icon2"
                        onClick={() =>
                          this.handleBackArrowclick("showTotalVolume")
                        }
                      />

                      <div className="approval-div-section">
                        <div>
                          <div className="creditcard-div">
                            <CreaditCard className="creditcard-img primary-color-icon" />
                          </div>
                        </div>
                        <div>
                          <h5>
                            $
                            {this.formatValue(
                              this.state.volumeData["totalVolume"]
                            )}
                          </h5>
                          <p className="p2">Total Volume</p>
                        </div>
                      </div>
                      <RightSign
                        className="icon2"
                        onClick={() =>
                          this.handleNextArrowclick("showTotalVolume")
                        }
                      />
                    </div>
                  )}
                  {this.state.showSettledVolume && (
                    <div className="approve-volume-container">
                      <LeftSign
                        className="icon2"
                        onClick={() =>
                          this.handleBackArrowclick("showSettledVolume")
                        }
                      />

                      <div className="approval-div-section">
                        <div>
                          <div className="creditcard-div">
                            <DollarCircle className="creditcard-img primary-color-icon" />
                          </div>
                        </div>
                        <div>
                          <h5>
                            $
                            {this.formatValue(
                              this.state.volumeData["settledVolume"]
                            )}
                          </h5>
                          <p className="p2">Settled Volume</p>
                        </div>
                      </div>
                      <RightSign
                        className="icon2"
                        onClick={() =>
                          this.handleNextArrowclick("showSettledVolume")
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="left-section-middle">
                  <p>Details</p>
                  <div className="create-settelments-horizontal-line"></div>
                  <div className="left-section-middle-body">
                    <p>ABOUT</p>
                    <ul>
                      <li>
                        <div className="p2 icons-div">
                          <User className="merchant-icon" width="20" height="20"/>
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
                  <button
                    className="btn-primary"
                    onClick={() => this.handleAddMerchant()}
                    disabled={isSuspended}
                  >
                    Edit
                  </button>
                  <button
                    className={`btn-secondary ${
                      statusText === "Active" ? "btn-suspend" : "btn-activate"
                    }`}
                    onClick={this.handleStatusChange}
                  >
                    {buttonLabel}
                  </button>
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
                                  `${ratesData.txn_app} ${getCurrencySymbol(
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
                                  `${ratesData.txn_dec} ${getCurrencySymbol(
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
                                  `${ratesData.refund_fee} ${getCurrencySymbol(
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
                                  } ${getCurrencySymbol(ratesData.currency)}`
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
                                  `${ratesData.setup_fee} ${getCurrencySymbol(
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
                                  } ${getCurrencySymbol(ratesData.currency)}`
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
                                  : this.formatNumber(signupKey)
                              }
                              readOnly
                            />
                            {/* <div
                              className="icon-container eye-icon"
                              onClick={() =>
                                this.toggleVisibility("showUserSignUpKey")
                              }
                            >
                              {showUserSignUpKey ? (
                                <Eye className="grey-icon" />
                              ) : (
                                <Eye className="grey-icon" />
                              )}
                            </div> */}
                          </div>
                        </div>

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
                                  showApiKey
                                    ? apiKey
                                    : this.formatNumber(apiKey)
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
                                    : this.formatNumber(secretKey)
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
                <LeftArrow
                  className="icon2"
                  onClick={this.handleBackButtonClick}
                />
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
                  {this.state.showApprovalRatio && (
                    <div className="approve-volume-container">
                      <LeftSign
                        className="icon2"
                        onClick={() =>
                          this.handleBackArrowclick("showApprovalRatio")
                        }
                      ></LeftSign>

                      <div className="approval-div-section">
                        <div>
                          <div className="creditcard-div">
                            <ApprovalRatio className="creditcard-img primary-color-icon" />
                          </div>
                        </div>
                        <div>
                        <h5>
                            {this.state.approvalData &&
                            this.state.approvalData.approvalRatio !== undefined
                              ? parseFloat(
                                  this.state.approvalData.approvalRatio.toFixed(
                                    2
                                  )
                                )
                              : "N/A"}%
                          </h5>
                          <p className="p2">Approval Ratio</p>
                        </div>
                      </div>
                      <RightSign
                        className="icon2"
                        onClick={() =>
                          this.handleNextArrowclick("showApprovalRatio")
                        }
                      />
                    </div>
                  )}
                  {this.state.showTotalVolume && (
                    <div className="approve-volume-container">
                      <LeftSign
                        className="icon2"
                        onClick={() =>
                          this.handleBackArrowclick("showTotalVolume")
                        }
                      />

                      <div className="approval-div-section">
                        <div>
                          <div className="creditcard-div">
                            <CreaditCard className="creditcard-img primary-color-icon" />
                          </div>
                        </div>
                        <div>
                          <h5>
                            $
                            {this.formatValue(
                              this.state.volumeData["totalVolume"]
                            )}
                          </h5>
                          <p className="p2">Total Volume</p>
                        </div>
                      </div>
                      <RightSign
                        className="icon2"
                        onClick={() =>
                          this.handleNextArrowclick("showTotalVolume")
                        }
                      />
                    </div>
                  )}
                  {this.state.showSettledVolume && (
                    <div className="approve-volume-container">
                      <LeftSign
                        className="icon2"
                        onClick={() =>
                          this.handleBackArrowclick("showSettledVolume")
                        }
                      />

                      <div className="approval-div-section">
                        <div>
                          <div className="creditcard-div">
                            <DollarCircle className="creditcard-img primary-color-icon" />
                          </div>
                        </div>
                        <div>
                          <h5>
                            $
                            {this.formatValue(
                              this.state.volumeData["settledVolume"]
                            )}
                          </h5>
                          <p className="p2">Settled Volume</p>
                        </div>
                      </div>
                      <RightSign
                        className="icon2"
                        onClick={() =>
                          this.handleNextArrowclick("showSettledVolume")
                        }
                      />
                    </div>
                  )}
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
                <div className="left-section-bottom">
                  {/* <button
                    className="btn-primary"
                    onClick={() => this.handleAddMerchant()}
                    disabled={isSuspended}
                  >
                    Edit
                  </button> */}
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
                                  `${ratesData.txn_app} ${getCurrencySymbol(
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
                                  `${ratesData.txn_dec} ${getCurrencySymbol(
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
                                  `${ratesData.refund_fee} ${getCurrencySymbol(
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
                                  } ${getCurrencySymbol(ratesData.currency)}`
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
                                  `${ratesData.setup_fee} ${getCurrencySymbol(
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
                                  } ${getCurrencySymbol(ratesData.currency)}`
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
                                  : this.formatNumber(signupKey)
                              }
                              readOnly
                            />
                            {/* <div
                              className="icon-container eye-icon"
                              onClick={() =>
                                this.toggleVisibility("showUserSignUpKey")
                              }
                            >
                              {showUserSignUpKey ? (
                                <Eye className="grey-icon" />
                              ) : (
                                <Eye className="grey-icon" />
                              )}
                            </div> */}
                          </div>
                        </div>

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
                                  showApiKey
                                    ? apiKey
                                    : this.formatNumber(apiKey)
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
                                    : this.formatNumber(secretKey)
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
    }
  }
}

export default ViewMerchant;
