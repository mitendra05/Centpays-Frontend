import React, { Component } from "react";
import { Link } from "react-router-dom";
import company_logo from "../../media/image/centpays_full_logo.png";

// sidebar icon
import {
	CircleRing,
	Dashboard,
	MasterSettings,
	ManageMerchant,
	APIdoc,
	PaymentGateway,
	ManageUser,
	TransactionMonitoring,
	TransactionReport,
	ManageSettlement,
	DownSign,
	RightSign,
	TestApi,
} from "../../media/icon/SVGicons";

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sidebaropen: true,
			userRole: this.getCookie("role"),
			companyName: this.getCookie("company_name"),
			menuOpen: {
				masterSetting: false,
				manageMerchant: false,
				manageUser: false,
				transactionReport: false,
				manageSettlement: false,
				dashboard: true,
			},
		};
	}

	getCookie = (name) => {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(";").shift();
		return null;
	};

	handleMenuClick = (menuItem) => {
		this.setState((prevState) => ({
			menuOpen: {
				...prevState.menuOpen,
				[menuItem]: !prevState.menuOpen[menuItem],
			},
		}));
	};

	render() {
		const { sidebaropen, menuOpen, userRole, companyName } = this.state;
		const currentPath = window.location.pathname;

		if (userRole === "admin") {
			return (
				<>
					<div
						className={`sidebar ${sidebaropen ? "expanded-sidebar" : "collapsed-sidebar"
							}  `}
					>
						<div className="sidebar-container">
							<div className="sidebar-header">
								<img src={company_logo} alt="Centpays Company Logo" />
								<input type="radio" />
							</div>
							<div className="sidebar-middle">
								<ul>
									<li>
										<div
											className={`menu-item ${currentPath === "/dashboard" ? "sidebaractive" : ""
												}`}
										>
											<Dashboard className="icon menu-item-icon-color" />
											<Link to="/dashboard">
												<div
													className="menu-item-collapsive"
													onClick={() => this.handleMenuClick("dashboard")}
												>
													<p>
														Dashboard<i style={{ color: "red" }}>*</i>
													</p>
												</div>
											</Link>
										</div>
									</li>
									<li className="menuitem-disable">
										<div
											className={`menu-item ${menuOpen.masterSetting ? "sidebaractive" : ""
												}`}
										>
											<MasterSettings className="icon menu-item-icon-color" />
											<div
												className="menu-item-collapsive"
												onClick={() => this.handleMenuClick("masterSetting")}
											>
												<p>Master Setting</p>
												{menuOpen.masterSetting === true ? (
													<DownSign className="icon" />
												) : (
													<RightSign className="icon" />
												)}
											</div>
										</div>
									</li>
									{menuOpen.masterSetting && (
										<ul className="sub-menu">
											<Link to="/businesstype">
												<li>
													<CircleRing className="sub-menu-icon" />
													<div>
														<p>Business Types</p>
													</div>
												</li>
											</Link>
											<Link to="/categories">
												<li>
													<CircleRing className="sub-menu-icon" />
													<div>
														<p>Categories</p>
													</div>
												</li>
											</Link>
											<Link to="/businesssubcategories">
												<li>
													<CircleRing className="sub-menu-icon" />
													<div>
														<p>Business Sub Categories</p>
													</div>
												</li>
											</Link>
											<Link to="/managecurrencies">
												<li>
													<CircleRing className="sub-menu-icon" />
													<div>
														<p>Manage Currencies</p>
													</div>
												</li>
											</Link>
											<Link to="/documenttype">
												<li>
													<CircleRing className="sub-menu-icon" />
													<div>
														<p>Document Types</p>
													</div>
												</li>
											</Link>
											<Link to="/documentcategory">
												<li>
													<CircleRing className="sub-menu-icon" />
													<div>
														<p>Document Categories</p>
													</div>
												</li>
											</Link>
											<Link to="/bank">
												<li>
													<CircleRing className="sub-menu-icon" />
													<div>
														<p>Banks</p>
													</div>
												</li>
											</Link>
										</ul>
									)}
									<li>
										<div
											className={`menu-item ${currentPath === "/allmerchant" ? "sidebaractive" : ""
												}`}
										>
											<ManageMerchant className="icon menu-item-icon-color" />
											<Link to="/allmerchant">
												<div
													className="menu-item-collapsive"
													onClick={() => this.handleMenuClick("manageMerchant")}
												>
													<p>
														Manage Merchant<i style={{ color: "red" }}>*</i>
													</p>
												</div>
											</Link>
										</div>
									</li>
									<li className="menuitem-disable">
										<div
											className={`menu-item ${currentPath === "/apidoc" ? "sidebaractive" : ""
												}`}
										>
											<APIdoc className="icon menu-item-icon-color" />
											<div
												className="menu-item-collapsive"
												onClick={() => this.handleMenuClick("manageAPIDoc")}
											>
												<p>
													Manage API Doc<i style={{ color: "red" }}>*</i>
												</p>
											</div>
										</div>
									</li>
									<li className="menuitem-disable">
										<div
											className={`menu-item ${currentPath === "/paymentgateway" ? "sidebaractive" : ""
												}`}
										>
											<PaymentGateway className="icon menu-item-icon-color" />
											<div
												className="menu-item-collapsive"
												onClick={() => this.handleMenuClick("paymentGateway")}
											>
												<p>
													Payment Gateway<i style={{ color: "red" }}>*</i>
												</p>
											</div>
										</div>
									</li>
									<li>
										<div
											className={`menu-item ${currentPath === "/alluser" ? "sidebaractive" : ""
												}`}
										>
											<ManageUser  className="icon menu-item-icon-color" />
											<Link to="/alluser">
												<div
													className="menu-item-collapsive"
													onClick={() => this.handleMenuClick("manageUser")}
												>
													<p>
														Manage User<i style={{ color: "red" }}>*</i>
													</p>
												</div>
											</Link>
										</div>
									</li>
									<li>
										<div
											className={`menu-item ${currentPath === "/transactionmonitoring"
													? "sidebaractive"
													: ""
												}`}
										>
											<TransactionMonitoring className="icon menu-item-icon-color" />
											<Link to="/transactionmonitoring">
												<div className="menu-item-collapsive">
													<p>
														Transaction Monitoring
														<i style={{ color: "red" }}>*</i>
													</p>
												</div>
											</Link>
										</div>
									</li>
									<li className="menuitem-disable">
										<div
											className={`menu-item ${menuOpen.transactionReport ? "sidebaractive" : ""
												}`}
										>
											<TransactionReport className="icon menu-item-icon-color" />
											<div
												className="menu-item-collapsive"
												onClick={() =>
													this.handleMenuClick("transactionReport")
												}
											>
												<p>Transaction Report</p>
												{menuOpen.transactionReport === true ? (
													<DownSign className="icon" />
												) : (
													<RightSign className="icon" />
												)}
											</div>
										</div>
									</li>
									{menuOpen.transactionReport && (
										<ul className="sub-menu">
											<Link to="/transactionreport">
												<li>
													<div>
														<p>Transaction Report</p>
													</div>
												</li>
											</Link>
											<Link to="/tempreport">
												<li>
													<div>
														<p>Temp Report</p>
													</div>
												</li>
											</Link>
											<Link to="/tempureport">
												<li>
													<div>
														<p>Temp Unique Order Report</p>
													</div>
												</li>
											</Link>
											<Link to="/tempcreport">
												<li>
													<div>
														<p>Temp Common Order Report</p>
													</div>
												</li>
											</Link>
											<Link to="/payoutreport">
												<li>
													<div>
														<p>Payout Report</p>
													</div>
												</li>
											</Link>
											<Link to="/compare">
												<li>
													<div>
														<p>Compare</p>
													</div>
												</li>
											</Link>
										</ul>
									)}
									<li>
										<div
											className={`menu-item ${menuOpen.finance ? "sidebaractive" : ""
												}`}
										>
											<TransactionReport className="icon menu-item-icon-color" />
											<div
												className="menu-item-collapsive"
												onClick={() => this.handleMenuClick("finance")}
											>
												<p>Finance</p>
												{menuOpen.finance === true ? (
													<DownSign className="icon" />
												) : (
													<RightSign className="icon" />
												)}
											</div>
										</div>
									</li>
									{menuOpen.finance && (
										<ul className="sub-menu">
											<Link to="/settlements">
												<li>
													<div>
														<p>Merchant Settlement</p>
													</div>
												</li>
											</Link>
											<Link to="/banksettle">
												<li>
													<div>
														<p>Bank Settlement</p>
													</div>
												</li>
											</Link>
											<Link to="/compare">
												<li>
													<div>
														<p>Reconcile</p>
													</div>
												</li>
											</Link>
											<Link to="/livereport">
												<li>
													<div>
														<p>Live Report</p>
													</div>
												</li>
											</Link>
										</ul>
									)}
									<li>
										<div
											className={`menu-item ${currentPath === "/acquirertestingenv"
													? "sidebaractive"
													: ""
												}`}
										>
											<Dashboard className="icon menu-item-icon-color" />
											<Link to="/acquirertestingenv">
												<div
													className="menu-item-collapsive"
													onClick={() => this.handleMenuClick("aqtest")}
												>
													<p>
														Quick Pay<i style={{ color: "red" }}>*</i>
													</p>
												</div>
											</Link>
										</div>
									</li>
								</ul>
							</div>
							<div className="sidebar-footer"></div>
						</div>
					</div>
				</>
			);
		} else if (userRole === "merchant") {
			return (
				<>
					<div
						className={`sidebar ${sidebaropen ? "expanded-sidebar" : "collapsed-sidebar"
							}  `}
					>
						<div className="sidebar-container">
							<div className="sidebar-header">
								<img src={company_logo} alt="Centpays Company Logo" />
								<input type="radio" />
							</div>
							<div className="sidebar-middle">
								<ul>
									<li>
										<div
											className={`menu-item ${currentPath === "/dashboard" ? "sidebaractive" : ""
												}`}
										>
											<Dashboard className="icon menu-item-icon-color" />
											<Link to="/dashboard">
												<div
													className="menu-item-collapsive"
													onClick={() => this.handleMenuClick("dashboard")}
												>
													<p>
														Dashboard<i style={{ color: "red" }}>*</i>
													</p>
												</div>
											</Link>
										</div>
									</li>
									<li>
										<div
											className={`menu-item ${currentPath === "/transactionmonitoring"
													? "sidebaractive"
													: ""
												}`}
										>
											<TransactionMonitoring className="icon menu-item-icon-color" />
											<Link to="/transactionmonitoring">
												<div className="menu-item-collapsive">
													<p>
														Transaction Monitoring
														<i style={{ color: "red" }}>*</i>
													</p>
												</div>
											</Link>
										</div>
									</li>
									<li>
										<div
											className={`menu-item ${menuOpen.finance ? "sidebaractive" : ""
												}`}
										>
											<TransactionReport className="icon menu-item-icon-color" />
											<div
												className="menu-item-collapsive"
												onClick={() => this.handleMenuClick("finance")}
											>
												<p>Finance</p>
												{menuOpen.finance === true ? (
													<DownSign className="icon" />
												) : (
													<RightSign className="icon" />
												)}
											</div>
										</div>
									</li>
									{menuOpen.finance && (
										<ul className="sub-menu">
											<Link to={`/previewsettlement/${companyName}`}>
												<li>
													<div>
														<p>Settelment Report</p>
													</div>
												</li>
											</Link>
											<Link to="/banksettle">
												<li>
													<div>
														<p>Settelment Invoice</p>
													</div>
												</li>
											</Link>
										</ul>
									)}

									<li>
										<div
											className={`menu-item ${menuOpen.myprofile ? "sidebaractive" : ""
												}`}
										>
											<ManageMerchant className="icon menu-item-icon-color" />
											<div
												className="menu-item-collapsive"
												onClick={() => this.handleMenuClick("myprofile")}
											>
												<p>Your Profile</p>
												{menuOpen.myprofile === true ? (
													<DownSign className="icon" />
												) : (
													<RightSign className="icon" />
												)}
											</div>
										</div>
									</li>
									{menuOpen.myprofile && (
										<ul className="sub-menu">
											<Link to="/settings">
												<li>
													<div>
														<p>Settings</p>
													</div>
												</li>
											</Link>
											<Link to={`/viewmerchant/${companyName}`}>
												<li>
													<div>
														<p>Manage User Login</p>
													</div>
												</li>
											</Link>
										</ul>
									)}

									<li>
										<div
											className={`menu-item ${currentPath === "/acquirertestingenv"
													? "sidebaractive"
													: ""
												}`}
										>
											<Dashboard className="icon menu-item-icon-color" />
											<Link to="/acquirertestingenv">
												<div
													className="menu-item-collapsive"
													onClick={() => this.handleMenuClick("aqtest")}
												>
													<p>
														Quick Pay<i style={{ color: "red" }}>*</i>
													</p>
												</div>
											</Link>
										</div>
									</li>

									<li>
										<div
											className={`menu-item ${menuOpen.testApi ? "sidebaractive" : ""
												}`}
										>
											<TestApi className="icon menu-item-icon-color" />
											<div
												className="menu-item-collapsive"
												onClick={() => this.handleMenuClick("testApi")}
											>
												<p>Test Api</p>
												{menuOpen.testApi === true ? (
													<DownSign className="icon" />
												) : (
													<RightSign className="icon" />
												)}
											</div>
										</div>
									</li>
									{menuOpen.testApi && (
										<ul className="sub-menu">
											<Link to="/settings">
												<li>
													<div>
														<p>Refund Req</p>
													</div>
												</li>
											</Link>
											<Link to={`/viewmerchant/${companyName}`}>
												<li>
													<div>
														<p>Check Status</p>
													</div>
												</li>
											</Link>
											<Link to="/settings">
												<li>
													<div>
														<p>Your Details</p>
													</div>
												</li>
											</Link>
										</ul>
									)}
									<li className="menuitem-disable">
										<div
											className={`menu-item ${currentPath === "/apidoc" ? "sidebaractive" : ""
												}`}
										>
											<APIdoc className="icon menu-item-icon-color" />
											<div
												className="menu-item-collapsive"
												onClick={() => this.handleMenuClick("manageAPIDoc")}
											>
												<p>
													Centpays API Doc<i style={{ color: "red" }}>*</i>
												</p>
											</div>
										</div>
									</li>
								</ul>
							</div>
							<div className="sidebar-footer"></div>
						</div>
					</div>
				</>
			);
		} else if (userRole === "employee") {
			return (
				<>
					<div
						className={`sidebar ${sidebaropen ? "expanded-sidebar" : "collapsed-sidebar"
							}  `}
					>
						<div className="sidebar-container">
							<div className="sidebar-header">
								<img src={company_logo} alt="Centpays Company Logo" />
								<input type="radio" />
							</div>
							<div className="sidebar-middle">
								<ul>
									<li>
										<div
											className={`menu-item ${currentPath === "/dashboard" ? "sidebaractive" : ""
												}`}
										>
											<Dashboard className="icon menu-item-icon-color" />
											<Link to="/dashboard">
												<div
													className="menu-item-collapsive"
													onClick={() => this.handleMenuClick("dashboard")}
												>
													<p>
														Dashboard<i style={{ color: "red" }}>*</i>
													</p>
												</div>
											</Link>
										</div>
									</li>
									<li>
										<div
											className={`menu-item ${currentPath === "/transactionmonitoring"
													? "sidebaractive"
													: ""
												}`}
										>
											<TransactionMonitoring className="icon menu-item-icon-color" />
											<Link to="/transactionmonitoring">
												<div className="menu-item-collapsive">
													<p>
														Transaction Monitoring
														<i style={{ color: "red" }}>*</i>
													</p>
												</div>
											</Link>
										</div>
									</li>
									<li>
										<div
											className={`menu-item ${currentPath === "/settlements" ? "sidebaractive" : ""
												}`}
										>
											<ManageSettlement className="icon menu-item-icon-color" />
											<Link to={`/settlements`}>
												<div
													className="menu-item-collapsive"
													onClick={() =>
														this.handleMenuClick("manageSettlement")
													}
												>
													<p>
														Settlement<i style={{ color: "red" }}>*</i>
													</p>
												</div>
											</Link>
										</div>
									</li>
								</ul>
							</div>
							<div className="sidebar-footer"></div>
						</div>
					</div>
				</>
			);
		}
	}
}

export default Sidebar;