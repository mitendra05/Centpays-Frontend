import React, { Component } from "react";

// components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import SettlementTable from "../components/Settlement_Table";
import MessageBox from "../components/Message_box";

// images

import { Article, DollarCircle, User, Wallet } from "../../media/icon/SVGicons";


class ListSettlement extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sidebaropen: true,
			token: this.getCookie('token'),
			headerLabels: [
				
				{ id: 1, heading: "Client", label: "company_name" },
				{ id: 2, heading: "Status", label: "status" },
				{ id: 3, heading: "Type", label: "type" },
				{ id: 4, heading: "Issued On", label: "last_settled_date" },
			],
			apiData: [],
			listData: [],
			showRates: true,
			errorMessage: "",
			loading:false,
		};
	}

	componentDidMount() {
		this.fetchData();
		this.fetchListData();
	}

	getCookie = (name) => {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
		return null;
	  }

	fetchData = async () => {
		const { token } = this.state;
		const backendURL = process.env.REACT_APP_BACKEND_URL;
		this.setState({loading:true})
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
				data.sort((a, b) => {
					if (!a.last_settled_date) return 1;
					if (!b.last_settled_date) return -1;
					return new Date(b.last_settled_date) - new Date(a.last_settled_date);
				});
				this.setState({ apiData: data,loading:false });
			} else {
				console.error("Error fetching data:", response.statusText);
				this.setState({
					errorMessage: "Error in Fetching data. Please try again later.",
					messageType: "fail",
					loading:false
				});
			}
		} catch (error) {
		  console.error("An unexpected error occurred:", error);
		  this.setState({
			errorMessage: "An unexpected error occurred. Please try again later.",
			messageType: "",
			loading:false
		  });
		}
	  };

	fetchListData = async () => {
		const backendURL = process.env.REACT_APP_BACKEND_URL;
		const { token } = this.state;
		try {
			const response = await fetch(
				`${backendURL}/listsettlement`, {
					method: "GET",
					headers: {
					  "Content-Type": "application/json",
					  Authorization: `Bearer ${token}`,
					},
				  }
			);

			if (response.ok) {
				const data = await response.json();
				this.setState({ listData: data });
			} else {
				this.setState({ errorMessage: "Error in Fetching data. Please try again later.", messageType: "Fail" });
			}
		} catch (error) {
			this.setState({ errorMessage: "An unexpected error occurred. Please try again later.", messageType: " " });
		}
	};

	//Utility functions
	formatValue = (val) => {
		return `${(val / 1000).toFixed(1)}k`;
	};

	render() {
		const { headerLabels, apiData, showRates, listData, errorMessage,loading } = this.state;

		return (
			<>
				<Header />
				<Sidebar />
				{errorMessage && <MessageBox message={errorMessage} onClose={() => this.setState({ errorMessage: "", messageType: " " })} />}
				<div
					className={`main-screen ${this.state.sidebaropen
							? "collapsed-main-screen"
							: "expanded-main-screen"
						}  `}
				>
					<div className="main-screen-rows settlement-first-row">
						<div className="row-cards settlement-card">
							<div className="settlement-card-section">
								<div>
									<h4>{listData.client_length}</h4>
									<p className="p2">Clients</p>
								</div>
								<div>
									<div className="creditcard-div">
										<User
											className="creditcard-img black-icon" width="28" height="28"
										/>
									</div>
								</div>
							</div>
							<div className="vertical-line-card1"></div>
							<div className="settlement-card-section">
								<div>
									<h4>{listData.settlement_length}</h4>
									<p className="p2">Invoices</p>
								</div>
								<div>
									<div className="creditcard-div">
										<Article
											className="creditcard-img black-icon"
										/>
									</div>
								</div>
							</div>
							<div className="vertical-line-card1"></div>
							<div className="settlement-card-section">
								<div>
									<h4>${this.formatValue(listData.totalVolSum)}</h4>
									<p className="p2">Total Volume</p>
								</div>
								<div>
									<div className="creditcard-div">
										<Wallet
											className="creditcard-img black-icon"
										></Wallet>
									</div>
								</div>
							</div>
							<div className="vertical-line-card1"></div>
							<div className="settlement-card-section">
								<div>
									<h4>${this.formatValue(listData.settlementVolSum)}</h4>
									<p className="p2">Settled Volume</p>
								</div>
								<div>
									<div className="creditcard-div">
										<DollarCircle
											className="creditcard-img black-icon"
										></DollarCircle>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="main-screen-rows settlement-second-row">
						<div className="row-cards table-card">
							<SettlementTable
								headerLabels={headerLabels}
								apiData={apiData}
								showRates={showRates}
								loading={loading}
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default ListSettlement;