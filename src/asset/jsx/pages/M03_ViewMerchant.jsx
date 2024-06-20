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
      token: localStorage.getItem("token"),
      company_name: this.extractENameFromURL(),
      overviewData: [],
      ratesData: [],
      approvalData: [],
      volumeData: [],
      showApprovalRatio: true,
      showTotalVolume: false,
      showSettledVolume: false,
      overviewInfo: true,
      ratesInfo: false,
      settlementInfo: false,
      isAddMerchantPanelOpen: false,
      companyInfo: true,
      businessInfo: false,
      directorInfo: false,
      isEditing: false,
      isSuspended: false,
      // calendarVisible: false,
      // fromDate: "22/5/24",
      // toDate: "22/5/24"
    };
  }

  extractENameFromURL() {
    const currentPath = window.location.pathname;
    const companyName = currentPath.split("/viewmerchant/")[1];
    return companyName;
  }

  componentDidMount() {
    const {company_name} = this.state;
    // let date = new Date().toISOString();
    // date = date.split("T")[0]
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    this.fetchData(
      `https://www.paylinkup.online/viewclient?company_name=${company_name}`,
      "overviewData",
      (data) => {
        this.setState({
          idforEdit: data._id,
          isActive: data.status === " ",
          statusText: data.status,
          buttonLabel: data.status === "Active" ? "Suspend" : "Activate",
        });
        console.log("ID for Edit set to:", data._id);
      }
    );
    // this.fetchData(`${backendURL}/approvalratio?merchant=${company_name}&fromDate=${date}&toDate=${date}`,'approvalData');
    this.fetchData(`${backendURL}/volumesum?company_name=${company_name}`,'volumeData');
  }

  fetchData = async (url, dataVariable, callback = null, Body) => {
    const { token } = this.state;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Body),
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ [dataVariable]: data }, () => {
          if (callback) callback(data);
          console.log(`${dataVariable} fetched data:`, data);
        });
      } else {
        console.error("Error fetching data:", response.statusText);
        this.setState({
          errorMessage: "Error in Fetching data. Please try again later.",
          messageType: "fail",
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "",
      });
    }
  };

  updateMerchantStatus = (statusText, idforEdit) => {
    const { token } = this.state;
    console.log(idforEdit, statusText);

    fetch("https://www.paylinkup.online/updateclient", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: idforEdit, status: statusText }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Status updated successfully:", data);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  fetchRatesData = async () => {
    const { token, company_name } = this.state;
    try {
      const response = await fetch(
        `https://www.paylinkup.online/ratetables?company_name=${company_name}`,
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
        console.log("Fetched data:", data);

        if (data && data._id) {
          this.setState({ ratesData: data, idforRatedata: data._id });
          console.log("Fetched ID:", data._id);
        } else {
          console.error("Data format is incorrect or _id not found");
          this.setState({
            errorMessage:
              "Data format is incorrect or _id not found. Please try again later.",
            messageType: "fail",
          });
        }
      } else {
        console.error("Error fetching data:", response.statusText);
        this.setState({
          errorMessage: "Error in Fetching data. Please try again later.",
          messageType: "fail",
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "",
      });
    }
  };

  handleSave = () => {
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
      annualMaintenanceFee_remark: ratesData.annualMaintenanceFee_remark
    };
  
    fetch(`https://www.paylinkup.online/updateratetable`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateRate),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        console.log("Data updated successfully:", data);
        // Show success message or perform other actions upon successful update
        this.setState({ ratesData: data.rates, isEditing: false,errorMessage: "Data Edited Successfully.",
          messageType: "success", });
        
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        // Show error message or perform other error handling
        this.setState({
          errorMessage: "Error updating data. Please try again.",
          messageType: "fail",
        });
        alert("Error updating data. Please try again."); // Optional: You can remove this alert
      });
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

  // handleCalenderClick = () => {
  //   console.log("clicked");
  //   this.setState({
  //     calendarVisible: !this.state.calendarVisible,
  //   });
  // };

  
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
      });
    } else if (buttonName === "ratesInfo") {
      this.setState({
        overviewInfo: false,
        ratesInfo: true,
        settlementInfo: false,
      });
      this.fetchRatesData();
    } else if (buttonName === "settlementInfo") {
      this.setState({
        overviewInfo: false,
        ratesInfo: false,
        settlementInfo: true,
      });
    }
  };

  renderButtons = () => {
    const { overviewInfo, ratesInfo, settlementInfo } = this.state;
    return (
      <div className="btn-container">
        {overviewInfo ? (
          <button className="btn-primary btn3">
            <div><PendingUserIcon className=" white-icon" width="20" height="20" /></div>  
            <p>Overview</p>
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
            <div><MerchantRates className=" white-icon" /></div>
            <p>Rates</p>
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
            <div>
           <MerchantSettlements className=" white-icon"/>
           </div>
           <p>Settlements</p>
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
      </div>
    );
  };

  render() {
    const { isSuspended,
      overviewData,
      isEditing,
      ratesData,
      statusText,
      buttonLabel,
      errorMessage,
      messageType} = this.state;
      const getCurrencySymbol = (currencyCode) => {
        switch (currencyCode) {
            case 'USD':
                return '$';
            case 'EUR':
                return '€';
            default:
                return currencyCode; 
        }
    };

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
                      : "pending-status"
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
                        <h5>99%</h5>
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
                        <h5>${this.formatValue(this.state.volumeData["totalVolume"])}</h5>
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
                        <h5>${this.formatValue(this.state.volumeData["settledVolume"])}</h5>
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
                <button
                  className="btn-primary"
                  onClick={() => this.handleAddMerchant()}
                  disabled={isSuspended}
                >
                  Edit
                </button>
                <button
                   className={`btn-secondary ${statusText === 'Active' ?'btn-suspend':'btn-activate'}`}
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
                            <p>{overviewData.expected_chargeback_percentage}</p>
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
                            <td><div className="ratesItem">MDR</div> </td>
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
                            <td><div className="ratesItem">Transaction Approved</div> </td>
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
                                 `${ratesData.txn_app} ${getCurrencySymbol(ratesData.currency)}`
                              )}
                            </td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td><div className="ratesItem">Transaction Declined</div></td>
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
                                `${ratesData.txn_dec} ${getCurrencySymbol(ratesData.currency)}`
                              )}
                            </td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td><div className="ratesItem">Refund Fees</div></td>
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
                                `${ratesData.refund_fee} ${getCurrencySymbol(ratesData.currency)}`
                              )}
                            </td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td><div className="ratesItem">Chargeback Fees</div></td>
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
                                `${ratesData.chargeback_fee} ${getCurrencySymbol(ratesData.currency)}`
                              )}
                            </td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td><div className="ratesItem">Rolling Reserve</div></td>
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
                            <td><div className="ratesItem">Setup Fees</div></td>
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
                                `${ratesData.setup_fee} ${getCurrencySymbol(ratesData.currency)}`
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
                            <td><div className="ratesItem">Settlement Cycle</div></td>
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
                            <td><div className="ratesItem">Settlement Fees</div></td>
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
                            <td><div className="ratesItem">Annual Maintenance Fees</div></td>
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
                                `${ratesData.annual_maintenance_fee} ${getCurrencySymbol(ratesData.currency)}`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name=" annualMaintenanceFee_remark"
                                  value={ratesData.annualMaintenanceFee_remark}
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
                {this.state.isAddMerchantPanelOpen && (
                  <MerchantForm
                    handleAddMerchant={this.handleAddMerchant}
                    merchantData={overviewData}
                    isAddMerchantPanelOpen={this.state.isAddMerchantPanelOpen}
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

export default ViewMerchant;
