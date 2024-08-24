import React, { Component } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MerchantTable from "../components/Merchant_Table";
import MessageBox from "../components/Message_box";

import { TotalUserIcon, ActiveUserIcon, InactiveUserIcon, PendingUserIcon } from "../../media/icon/SVGicons";

class ListSettlement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      token: this.getCookie('token'),
      headerLabels: [
        { id: 1, heading: "Client", label: "company_name" },
        { id: 2, heading: "Status", label: "status" },
        { id: 3, heading: "Email", label: "email" },
        { id: 4, heading: "Country", label: "country" },
        { id: 5, heading: "Skype ID", label: "poc_id" },
        { id: 6, heading: "URL", label: "website_url" },
      ],
      apiData: [],
      tempData: [],
      showMerchants: "all",  
      showTempMerchants: "all",
      selectedDataSource: "apiData", 
      errorMessage: "",
      messageType: "",
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchData();
    this.fetchTempData();
    this.handleQueryParams();
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  fetchData = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token } = this.state;
    this.setState({ loading: true });

    try {
      const response = await fetch(`${backendURL}/clients`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        let data = await response.json();
        this.setState({
          apiData: data,
          loading: false,
        });
        console.log("api data", this.state.apiData)
      } else {
        console.error("Error fetching data:", response.statusText);
        this.setState({
          errorMessage: "Error in fetching data. Please try again later.",
          messageType: "fail",
          loading: false,
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "",
        loading: false,
      });
    }
  };

  fetchTempData = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token } = this.state;
    this.setState({ loading: true });

    try {
      const response = await fetch(`${backendURL}/tempusers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Ensure that the data received is in the correct format
        if (Array.isArray(data)) {
          this.setState({
            tempData: data,
            loading: false,
          });
          console.log("tempData:", this.state.tempData);
        } else {
          console.error("Unexpected data format:", data);
          this.setState({
            errorMessage: "Unexpected data format received. Please try again later.",
            messageType: "fail",
            loading: false,
          });
        }
      } else {
        console.error("Error fetching temp data:", response.statusText);
        this.setState({
          errorMessage: "Error in fetching temp data. Please try again later.",
          messageType: "fail",
          loading: false,
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "fail",
        loading: false,
      });
    }
  };

  handleTabClick = (status, type = "clients") => {
    if (type === "temp") {
      this.setState({
        selectedDataSource: "tempData",
        showTempMerchants: status,
        showMerchants: "all",
      });
    } else {
      this.setState({
        selectedDataSource: "apiData",
        showMerchants: status,
        showTempMerchants: "all", // Reset other filters
      });
    }
  };


  handleQueryParams = () => {
    const query = new URLSearchParams(window.location.search);
    const showPending = query.get('showPending');

    if (showPending === 'true') {
      this.setState({ showMerchants: 'Pending' });
    }
  };

  render() {
    const { headerLabels, apiData, tempData, showMerchants, showTempMerchants, errorMessage, messageType, selectedDataSource, filteredData } = this.state;

    const filteredApiData =
      showMerchants === "all"
        ? apiData
        : apiData.filter((item) => item.status === showMerchants);

    const filteredTempData =
      showTempMerchants === "all"
        ? tempData
        : tempData.filter((item) => item.status === showTempMerchants);

    const tableData =
      selectedDataSource === "apiData" ? filteredApiData : filteredTempData;

    const totalMerchants = apiData.filter((item) => item.type === "Merchant").length;
    const totalPsps = apiData.filter((item) => item.type === "PSP").length;
    const activeMerchants = apiData.filter(
      (item) => item.status === "Active" && item.type === "Merchant"
    ).length;
    const activePsps = apiData.filter(
      (item) => item.status === "Active" && item.type === "PSP"
    ).length;
    const inactiveMerchants = apiData.filter(
      (item) => item.status === "Inactive" && item.type === "Merchant"
    ).length;
    const inactivePsps = apiData.filter(
      (item) => item.status === "Inactive" && item.type === "PSP"
    ).length;
    const pendingMerchants = apiData.filter(
      (item) => item.status === "Pending" && item.type === "Merchant"
    ).length;
    const pendingPsps = apiData.filter(
      (item) => item.status === "Pending" && item.type === "PSP"
    ).length;

    const tempTotal = tempData.length;
    const tempPendingMerchants = tempData.filter(
      (item) => item.status === "Pending" && item.type === "Merchant"
    ).length;
    const tempPendingPsps = tempData.filter(
      (item) => item.status === "Pending" && item.type === "PSP"
    ).length;


    return (
      <>
        <Header
          errorMessage={errorMessage}
          messageType={messageType}
          onClearMessage={() => this.setState({ errorMessage: "", messageType: "" })}
        />
        <Sidebar />
        {errorMessage && (
          <MessageBox
            message={errorMessage}
            messageType={messageType}
            onClose={() => this.setState({ errorMessage: "", messageType: "" })}
          />
        )}
        <div
          className={`main-screen ${this.state.sidebaropen
            ? "collapsed-main-screen"
            : "expanded-main-screen"
            }`}
        >
          <div className="main-screen-rows settlement-first-row">
            <div className="row-cards merchant-card" onClick={() => this.handleTabClick("all")}>
              <div className="merchant-card-top">
                <div className="merchant-card-left">
                  <p className="p2">Total</p>
                  <h4>{apiData.length}</h4>
                </div>
                <div className="merchant-card-right">
                  <div className="creditcard-div">
                    <TotalUserIcon className="creditcard-img primary-color-icon" />
                  </div>
                </div>
              </div>
              <div className="merchant-card-details">
                <div className="p2">{apiData.filter(item => item.type === "Merchant").length} Merchants</div>
                <div className="p2">{apiData.filter(item => item.type === "PSP").length} PSPs</div>
              </div>
            </div>
            <div className="row-cards merchant-card" onClick={() => this.handleTabClick("Active")}>
              <div className="merchant-card-top">
                <div className="merchant-card-left">
                  <p className="p2">Active</p>
                  <h4>{apiData.filter(item => item.status === "Active").length}</h4>
                </div>
                <div className="merchant-card-right">
                  <div className="creditcard-div active-merchant">
                    <ActiveUserIcon className="creditcard-img green-icon" />
                  </div>
                </div>
              </div>
              <div className="merchant-card-details">
                <div className="p2">{apiData.filter(item => item.status === "Active" && item.type === "Merchant").length} Merchants</div>
                <div className="p2">{apiData.filter(item => item.status === "Active" && item.type === "PSP").length} PSPs</div>
              </div>
            </div>
            <div className="row-cards merchant-card" onClick={() => this.handleTabClick("Inactive")}>
              <div className="merchant-card-top">
                <div className="merchant-card-left">
                  <p className="p2">Inactive</p>
                  <h4>{apiData.filter(item => item.status === "Inactive").length}</h4>
                </div>
                <div className="merchant-card-right">
                  <div className="creditcard-div inactive-merchant">
                    <InactiveUserIcon className="creditcard-img red-icon" />
                  </div>
                </div>
              </div>
              <div className="merchant-card-details">
                <div className="p2">{apiData.filter(item => item.status === "Inactive" && item.type === "Merchant").length} Merchants</div>
                <div className="p2">{apiData.filter(item => item.status === "Inactive" && item.type === "PSP").length} PSPs</div>
              </div>
            </div>
            <div className="row-cards merchant-card" onClick={() => this.handleTabClick("Pending")}>
              <div className="merchant-card-top">
                <div className="merchant-card-left">
                  <p className="p2">Pending</p>
                  <h4>{apiData.filter(item => item.status === "Pending").length}</h4>
                </div>
                <div className="merchant-card-right">
                  <div className="creditcard-div pending-merchant">
                    <PendingUserIcon className="creditcard-img yellow-icon" />
                  </div>
                </div>
              </div>
              <div className="merchant-card-details">
                <div className="p2">{apiData.filter(item => item.status === "Pending" && item.type === "Merchant").length} Merchants</div>
                <div className="p2">{apiData.filter(item => item.status === "Pending" && item.type === "PSP").length} PSPs</div>
              </div>
            </div>
            <div className="row-cards merchant-card" onClick={() => this.handleTabClick("Pending", "temp")}>
              <div className="merchant-card-top">
                <div className="merchant-card-left">
                  <p className="p2">Temp - Users</p>
                  <h4>{tempData.length}</h4>
                </div>
                <div className="merchant-card-right">
                  <div className="creditcard-div pending-merchant">
                    <PendingUserIcon className="creditcard-img yellow-icon" />
                  </div>
                </div>
              </div>
              <div className="merchant-card-details">
                <div className="p2">{tempPendingMerchants} Merchants</div>
                <div className="p2">{tempPendingPsps} PSPs</div>
              </div>
            </div>
          </div>

          <div className="main-screen-rows settlement-second-row">
            <div className="row-cards merchant-table-card">
              <MerchantTable
                headerLabels={this.state.headerLabels}
                apiData={tableData}
                showMerchants={showMerchants}
                loading={this.state.loading}
                buttonname={"Add New Merchant"}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ListSettlement;
