import React, { Component } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

class Compare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      AQlist: [],
      paymentgateway:"",
      currency:"",
    };
  }

  componentDidMount() {
		this.fetchAcquirerList();
	}

  fetchAcquirerList = async () => {
		const { token } = this.state;
    const backendURL = process.env.REACT_APP_BACKEND_URL;
		try {
			const response = await fetch(`${backendURL}/acquirerlist`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			this.setState({ AQlist: data });
		} catch (error) {
			this.setState({
				errorMessage: "Error in Fetching data. Please try again later.",
				messageType: "",
			});
		}
	};

  render() {
    return (
      <>
      <Header />
      <Sidebar />
      <div
          className={`main-screen ${
            this.state.sidebaropen
              ? "collapsed-main-screen"
              : "expanded-main-screen"
          }  `}
        >
            <h1>Reconcile Reports</h1>
            <label className={`id-label ${this.state.paymentgateway ? "filled-id-label" : ""} `} htmlFor="paymentgateway">
								Payment Gateway:
							  </label>
		  
							  <select
								className="id-input"
								id="paymentgateway"
								value={this.state.paymentgateway}
								onChange={this.handleInputChange}
							  >
								<option value="">Select Payment Gateway</option>
								{this.state.AQlist.map((paymentgateway) => (
								  <option key={paymentgateway} value={paymentgateway}>
									{paymentgateway}
								  </option>
								))}
							  </select>

                <label className={`id-label ${this.state.currency ? "filled-id-label" : ""} `} htmlFor="currency">
								Currency:
							  </label>
							  <select
								className="id-input"
								id="currency"
								value={this.state.currency}
								onChange={this.handleInputChange}
							  >
								<option value="">Select Currency</option>
								<option value="USD">USD</option>
								<option value="EUR">EUR</option>
							  </select>
        </div>
       
      </>
    );
  }
}

export default Compare;
