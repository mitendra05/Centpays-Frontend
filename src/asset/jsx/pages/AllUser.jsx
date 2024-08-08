import React, { Component } from "react";

// components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MerchantTable from "../components/Merchant_Table"
import MessageBox from "../components/Message_box";

//SVG Icons
import { TotalUserIcon, ActiveUserIcon, InactiveUserIcon, PendingUserIcon } from "../../media/icon/SVGicons";

class AllUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebaropen: true,
            token: this.getCookie('token'),
            headerLabels: [
              { id: 1, heading: "User", label: "name" },
              { id: 3, heading: "Email", label: "email" },
              { id: 4, heading: "Role", label: "role" },
              { id: 5, heading: "Client", label: "company_name" },
              { id: 2, heading: "Status", label: "status" },
              { id: 6, heading: "Sub-User", label: "sub-User" },
              { id: 7, heading: "Action", label: "action" },
            ],
            apiData: [],
            showMerchants: true,
            errorMessage: "",
            loading: false,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    fetchData = async () => {
        const backendURL = process.env.REACT_APP_BACKEND_URL;
        const { token } = this.state;
        this.setState({ loading: true });
        try {
            const response = await fetch(`${backendURL}/getuserdetails`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                let data = await response.json();
                this.setState({ apiData: data, loading: false });
            } else {
                console.error("Error fetching data:", response.statusText);
                this.setState({
                    errorMessage: "Error in Fetching data. Please try again later.",
                    messageType: "fail",
                    loading: false
                });
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error);
            this.setState({
                errorMessage: "An unexpected error occurred. Please try again later.",
                messageType: "",
                loading: false
            });
        }
    };

    render() {
        const { headerLabels, apiData, showMerchants, errorMessage } = this.state;

        const merchants = apiData.filter(item => item.type === "Merchant").length;
        const psps = apiData.filter(item => item.type === "PSP").length;
        const activeMerchants = apiData.filter(item => item.status === "Active" && item.type === "Merchant").length;
        const activePsps = apiData.filter(item => item.status === "Active" && item.type === "PSP").length;
        const inactiveMerchants = apiData.filter(item => item.status === "Inactive" && item.type === "Merchant").length;
        const inactivePsps = apiData.filter(item => item.status === "Inactive" && item.type === "PSP").length;
        const pendingMerchants = apiData.filter(item => item.status === "Pending" && item.type === "Merchant").length;
        const pendingPsps = apiData.filter(item => item.status === "Pending" && item.type === "PSP").length;

        return (
            <>
                <Header />
                <Sidebar />
                {errorMessage && (
                    <MessageBox
                        message={errorMessage}
                        onClose={() =>
                            this.setState({ errorMessage: "", messageType: " " })
                        }
                    />
                )}
                <div
                    className={`main-screen ${this.state.sidebaropen
                        ? "collapsed-main-screen"
                        : "expanded-main-screen"
                        }  `}
                >
                    <div className="main-screen-rows settlement-first-row">
                        <div className="row-cards merchant-card">
                            <div className="merchant-card-top">
                                <div className="merchant-card-left">
                                    <p className="p2">Total Root User</p>

                                    <h4>{apiData.length}</h4>
                                </div>
                                <div className="merchant-card-right">
                                    <div className="creditcard-div">
                                        <TotalUserIcon
                                            className="creditcard-img primary-color-icon"
                                        ></TotalUserIcon>
                                    </div>
                                </div>
                            </div>
                            <div className="merchant-card-details">
                                <li className="p2">{merchants} Online</li>
                                <li className="p2">{psps} Offline</li>
                            </div>
                        </div>
                        <div className="row-cards merchant-card">
                            <div className="merchant-card-top">
                                <div className="merchant-card-left">
                                    <p className="p2">Total Agent User</p>

                                    <h4>{activeMerchants + activePsps}</h4>
                                </div>
                                <div className="merchant-card-right">
                                    <div className="creditcard-div pending-merchant">
                                        <PendingUserIcon
                                            className="creditcard-img yellow-icon"
                                        ></PendingUserIcon>
                                    </div>

                                </div>
                            </div>
                            <div className="merchant-card-details">
                                <li className="p2">{merchants} Online</li>
                                <li className="p2">{psps} Offline</li>
                            </div>
                        </div>
                        <div className="row-cards merchant-card">
                            <div className="merchant-card-top">
                                <div className="merchant-card-left">
                                    <p className="p2">Total Active User</p>
                                    <h4>{inactiveMerchants + inactivePsps}</h4>
                                </div>
                                <div className="merchant-card-right">
                                    <div className="creditcard-div active-merchant">
                                        <ActiveUserIcon
                                            className="creditcard-img green-icon"
                                        ></ActiveUserIcon>
                                    </div>
                                </div>
                            </div>
                            <div className="merchant-card-details">
                                <li className="p2">{merchants} Online</li>
                                <li className="p2">{psps} Offline</li>
                            </div>
                        </div>
                        <div className="row-cards merchant-card">
                            <div className="merchant-card-top">
                                <div className="merchant-card-left">
                                    <p className="p2">Total Inactive User</p>

                                    <h4>{pendingMerchants + pendingPsps}</h4>
                                </div>
                                <div className="merchant-card-right">
                                    <div className="creditcard-div inactive-merchant">
                                        <InactiveUserIcon
                                            className="creditcard-img red-icon"
                                        ></InactiveUserIcon>
                                    </div>
                                </div>
                            </div>
                            <div className="merchant-card-details">
                                <li className="p2">{merchants} Online</li>
                                <li className="p2">{psps} Offline</li>
                            </div>
                        </div>
                    </div>
                    <div className="main-screen-rows settlement-second-row">
                        <div className="row-cards merchant-table-card">
                            <MerchantTable
                                headerLabels={headerLabels}
                                apiData={apiData}
                                showMerchants={showMerchants}
                                loading={this.state.loading}
                                buttonname={"Add New User"}
                                forAllUser={true}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default AllUser;
