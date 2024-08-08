import React, { Component } from "react";

// components
import MessageBox from "../components/Message_box";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

// images
import companyLogo from "../../media/image/centpays_full_logo.png";

class PreviewReport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			token: this.getCookie('token'),
			id: this.extractidFromURL(),
			reportData: [],
			errorMessage: "",
			rateData:[],
			company_name:"",
		};
	}

	getCookie = (name) => {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
		return null;
	  }

	componentDidMount() {
		this.handleFetchReport(this.state.id);
		this.handleFetchRate();
	}

	extractidFromURL() {
		const currentPath = window.location.pathname;
		const afterpreviewsettlement = currentPath.split("/previewreport/")[1];
		return afterpreviewsettlement;
	}

	handleFetchReport = async () => {
		const backendURL = process.env.REACT_APP_BACKEND_URL;
		const { id, token } = this.state;
		try {
		  const response = await fetch(
			`${backendURL}/getsettlementrecordforpdf?id=${id}`,
			{
			  method: "GET",
			  headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			  },
			}
		  );
		  const result = await response.json();
		  this.setState({ reportData: result, company_name: result.company_name });
		  this.handleFetchRate(); 
		} catch (error) {
		  this.setState({
			errorMessage: "Error fetching settlement details:",
			messageType: "Failed",
		  });
		}
	  };
	
	  handleFetchRate = async () => {
		const backendURL = process.env.REACT_APP_BACKEND_URL;
		const { token, company_name } = this.state; 
		try {
		  const rateResponse = await fetch(
			`${backendURL}/ratetables?company_name=${company_name}`,
			{
			  method: "GET",
			  headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			  },
			}
		  );
		  const rateData = await rateResponse.json();
		  this.setState({ rateData: rateData }); 
		} catch (error) {
		  this.setState({
			errorMessage: "Error fetching rate details:", 
			messageType: "Failed",
		  });
		}
	  };
	
	  generatePDF = () => {
		const originalContents = document.body.innerHTML;
		const pdfContent = document.getElementById('pdf-content').innerHTML;
		document.body.innerHTML = pdfContent;
	
		window.print();
	
		setTimeout(() => {
			document.body.innerHTML = originalContents;
			window.location.reload();
		}, 100);
	};	

	handleDeleteReport = async () => {
		const backendURL = process.env.REACT_APP_BACKEND_URL;
		const { id, token } = this.state;
		try {
			const response = await fetch(`${backendURL}/deletesettlementrecord`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ _id: id }),
			});
			const result = await response.json();
			if (response.status === 200) {
				alert("Settlement deleted successfully");
				this.handleBack();
			} else {
				this.setState({ errorMessage: result.message || "Error deleting settlement record" });
			}
		} catch (error) {
			this.setState({ errorMessage: "Error deleting settlement record" });
		}
	};

	handleBack = () => {
		const { id,company_name} = this.state;
		const currentPath = window.location.pathname;
		if (currentPath === `/previewreport/${id}`) {
		  window.location.href = `/previewsettlement/${company_name}`;
		} else {
		  window.history.back();
		}
	  };


	render() {
		const { reportData, errorMessage,rateData} = this.state;

		return (
			<>

				<div className="previewreportbuttons">
					<button className="btn-primary previewReportPrintBtn" onClick={this.generatePDF}>
						Print
					</button>
					<button className="btn-primary previewReportPrintBtn" onClick={this.handleBack}>
						Back
					</button>
					<button className="btn-primary" onClick={this.handleDeleteReport}>Delete</button>
				</div>
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
				></div>
				{reportData && (
					<div id="pdf-content" className="previewReport">
						<div className="row-cards create-settlement-left-container ">
							<div className="create-settlement-left-container-header">
								<div className="settlement-header-left">
									<img className="logo" src={companyLogo} alt="Centpays"></img>
									<div>
										<p className="p2">info@centpays.com</p>
										<p className="p2">sales@centpays.com</p>
										<p className="p2">live:.cid.b31237494431be4a</p>
									</div>
								</div>
								<div className="settlement-header-right preview-HR">
									<label htmlFor="report #">Report #</label>
									<p className="highlight-text ">{reportData.report_id}</p>

									<label htmlFor="fromDate">Settlement From</label>
									<p className="highlight-text ">{reportData.fromDate}</p>

									<label htmlFor="toDate">Settlement To</label>
									<p className="highlight-text ">{reportData.toDate}</p>
								</div>
							</div>
							<div className="create-settlement-left-second-container">
								<div className="settlement-second-container-grid">
									<label htmlFor="merchant">To: </label>
									<p>{reportData.company_name}</p>
								</div>
								<div className="second-container-right">
									<p>Currency:</p>
									<p>USDT</p>
								</div>
							</div>

							<div className="create-settelment-list-block">
								<div className="create-settelment-list-block">
									<p>
										Dealing {"currencies"}:{" "}
										<i className="p2">{"USD, EUR"}</i>
									</p>
								</div>
								<div className="prewive-list-table ">
									<table>
										<thead>
											<tr>
												<th>Currency</th>
												<th>#Approved</th>
												<th>#Decline</th>
												<th>#Refund</th>
												<th>Refund Amount</th>
												<th>#Chargeback</th>
												<th>Chargeback Amount</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>USD</td>
												<td>{reportData.usd_app_count}</td>
												<td>{reportData.usd_dec_count}</td>
												<td>{reportData.usd_no_of_refund}</td>
												<td>{reportData.usd_refund_amount}</td>
												<td>{reportData.usd_no_of_chargeback}</td>
												<td>{reportData.usd_chargeback_amount}</td>
											</tr>
											<tr>
												<td>EUR</td>
												<td>{reportData.eur_app_count}</td>
												<td>{reportData.eur_dec_count}</td>
												<td>{reportData.eur_no_of_refund}</td>
												<td>{reportData.eur_refund_amount}</td>
												<td>{reportData.eur_no_of_chargeback}</td>
												<td>{reportData.eur_chargeback_amount}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>

							<div className="create-settelment-rates-block preview-TA-Countainer">
								<div className="total-amount-countainer ">
									<p>
										Total Amount - {reportData.total_vol}
										{"$"}
									</p>
								</div>
								<div className="create-settelments-horizontal-line"></div>
								<div className="create-settelment-rates-list">
									<div className="create-settelment-rates-list-title">
										<ul>
											<li>MDR Base Rates</li>
											<li>Approved Transaction Fee</li>
											<li>Decline Transaction Fee</li>
											<li>Refund Fee</li>
											<li>Chargeback Fee</li>
											<li>Rolling Reserve</li>
											<li>Settelment Fee</li>
										</ul>
									</div>
									<div className="create-settelment-rates-list-rates">
										<div className="create-settelment-rates-list-FeeRates">
											<p>Fee Rates {rateData.currency}</p>
											<ul>
												<li>{rateData.MDR}</li>
												<li>{rateData.txn_app}</li>
												<li>{rateData.txn_dec}</li>
												<li>{rateData.refund_fee}</li>
												<li>{rateData.chargeback_fee}</li>
												<li>{rateData.RR}</li>
												<li>{rateData.settlement_fee}</li>
											</ul>
										</div>
										<div className="rates-divider">
											<ul>
												<li>-</li>
												<li>-</li>
												<li>-</li>
												<li>-</li>
												<li>-</li>
												<li>-</li>
												<li>-</li>
											</ul>
										</div>
										<div className="create-settelment-rates-list-amounts">
											<p>Amounts</p>
											<ul>
												<li>{reportData.MDR_amount}</li>
												<li>{reportData.app_amount}</li>
												<li>{reportData.dec_amount}</li>
												<li>{reportData.total_refund_amount}</li>
												<li>{reportData.total_chargeback_amount}</li>
												<li>{reportData.RR_amount}</li>
												<li>{reportData.settlement_fee_amount}</li>
											</ul>
										</div>
									</div>
								</div>
							</div>

							<div className="create-settelment-Fee-Total">
								<p>Fee Total</p>
								<p>
									{reportData.MDR_amount +
										reportData.app_amount +
										reportData.dec_amount +
										reportData.total_refund_amount +
										reportData.total_chargeback_amount +
										reportData.RR_amount +
										reportData.settlement_fee_amount}
								</p>
							</div>

							<div className="create-settelment-Total">
								<p>Settelment Total</p>
								<p>{reportData.settlement_vol}</p>
							</div>

							<div className="create-settelment-Total">
								<p>Settelment Total in USDT</p>
								<p>{reportData.total_amount_in_usdt}</p>
							</div>
							<div className="create-settelments-horizontal-line"></div>
							<div className="create-settelment-userNote  usernote-div">
								<p>Note:</p>
								<div className="preview-userNote">
									<p>{reportData.note}</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}
}

export default PreviewReport;