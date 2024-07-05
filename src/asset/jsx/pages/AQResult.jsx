import React, { Component } from "react";

// components
import Success from "../../media/image/success.gif";
import Failed from "../../media/image/Close.gif";

// import { LeftSign } from '../../media/icon/SVGicons';
import { LeftArrow } from "../../media/icon/SVGicons";

export class AQTest extends Component {
  constructor(props) {
    super(props);
     this.state = {
      sidebaropen: true,
      errorMessage: "",
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("name"),
      userRole: localStorage.getItem("role"),
      orderNo: this.extractOrderNoFromURL(), // Initialize orderNo from URL
      isLoading: false,
      AqresultData: null,
      error: null,
    };
  }

  extractOrderNoFromURL() {
    const currentPath = window.location.pathname;
    const orderNo = currentPath.split("/aqresult/")[1]; 
    return orderNo;
  }
  
  componentDidMount() {
    const { orderNo } = this.state;
    if (orderNo) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    const { orderNo } = this.state;
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    this.setState({ isLoading: true, error: null });

    try {
      const API_URL = `${backendURL}/transactionflow/get_transaction?orderNo=${orderNo}`;
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      // Store fetched data in AqresultData
      this.setState({ AqresultData: data.data });
      console.log("Fetched data:", data.data);
    } catch (error) {
      this.setState({ error: error.message || 'An error occurred while fetching data.' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  getStatusText(status) {
    switch (status) {
      case "Successful":
        return (
          <div className="status-div success-status">
            <p>Successful</p>
          </div>
        );
      case "Failed":
        return (
          <div className="status-div failed-status">
            <p>Failed</p>
          </div>
        );
      case "Pending":
        return (
          <div className="status-div pending-status">
            <p>Pending</p>
          </div>
        );
      default:
        return "";
    }
  }

  render() {
    const { status } = this.props;
    const { AqresultData } = this.state;
  
    // Rendering based on whether AqresultData is available
    return (
      <div id="paymentscreen2">
        <div className="paymentscreen">
          <div className="paymentResult">
            {AqresultData ? (
              <>
                {status === "Success" ? (
                  <div className="paymentSuccessfull">
                    <LeftArrow className="paymentBack" />
                    <img src={Success} alt="Success GIF" className="statusGif" />
                    <h5>Transaction Successful!</h5>
                    <div className="paymentDetails">
                      <div className="paymentDetails-header">
                        <span>
                          <p>User Name</p>
                          <p className="p2">{AqresultData.name}</p>
                        </span>
  
                        <span className="secondBlock">
                          <p>{AqresultData.amount} {AqresultData.currency}</p>
                          <p className="p2">Amount</p>
                        </span>
                      </div>
  
                      <div className="paymentDetails-middle">
                        <span>
                          <p>Date :</p>
                          <p>{new Date(AqresultData.transactiondate).toLocaleDateString()}</p>
                        </span>
                        <span>
                          <p>Order No. :</p>
                          <p>{AqresultData.orderNo}</p>
                        </span>
                        <span>
                          <p>Transaction ID:</p>
                          <p>{AqresultData.txnId}</p>
                        </span>
                        <p>{this.getStatusText(AqresultData.status)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="paymentFailed">
                    <img src={Failed} alt="Failed GIF" className="statusGif" />
                    <h5>Transaction Failed!</h5>
                    <div className="paymentDetails">
                      <div className="paymentDetails-header">
                        <span>
                          <p>User Name</p>
                          <p className="p2">{AqresultData.name}</p>
                        </span>
  
                        <span className="secondBlock">
                          <p>{AqresultData.amount} {AqresultData.currency}</p>
                          <p className="p2">Amount</p>
                        </span>
                      </div>
  
                      <div className="paymentDetails-middle">
                        <span>
                          <p>Date :</p>
                          <p>{new Date(AqresultData.transactiondate).toLocaleDateString()}</p>
                        </span>
                        <span>
                          <p>Order No. :</p>
                          <p>{AqresultData.orderNo}</p>
                        </span>
                        <span>
                          <p>Transaction ID:</p>
                          <p>{AqresultData.txnId}</p>
                        </span>
                        <p>{this.getStatusText(AqresultData.status)}</p>
                        <p>{AqresultData.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div>No transaction data available.</div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
}

export default AQTest;
