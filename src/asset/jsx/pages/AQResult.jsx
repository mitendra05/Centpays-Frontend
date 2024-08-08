import React, { Component } from "react";

// components
import Success from "../../media/image/success.gif";
import Failed from "../../media/image/Close.gif";

// import { LeftSign } from '../../media/icon/SVGicons';
import { LeftArrow } from "../../media/icon/SVGicons";

class AQResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      errorMessage: "",
      orderNo: this.extractOrderNoFromURL(), // Initialize orderNo from URL
      AqresultData: null,
      error: null,
    };
  }

  extractOrderNoFromURL() {
    return window.location.pathname.split("/paymentresult/")[1];
  }

  componentDidMount() {
    if (this.state.orderNo) {
      this.fetchData();
    }
    window.onpopstate = (event) => {
      // Check if there is a state in the history event
      if (event.state && event.state.url) {
        // Handle the navigation based on the URL in the state
        window.location.href = event.state.url;
      } else {
        // Default navigation or handle accordingly
        window.location.href = "https://centpays.online/acquirertestingenv";
      }
    };
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
      this.setState({ AqresultData: data.data });
      this.setState({ status: data.status });
    } catch (error) {
      this.setState({
        error: error.message || "An error occurred while fetching data.",
      });
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
    const { status } = this.state;
    const { AqresultData } = this.state;

    // Rendering based on whether AqresultData is available
    return (
      <div id="paymentscreen-result">
        <div className="paymentResult">
          {AqresultData ? (
            <>
              {status === "Success" ? (
                <div className="paymentSuccessfull">
                  <button
                    onClick={() =>
                      window.location.replace(
                        "https://centpays.online/acquirertestingenv"
                      )
                    }
                    className="paymentBack"
                  >
                    <LeftArrow />
                  </button>
                  <img src={Success} alt="Success GIF" className="statusGif" />
                  <h5>Transaction Successful!</h5>
                  <div className="paymentDetails">
                    <div className="paymentDetails-header">
                      <span>
                        <p>{AqresultData.name}</p>
                        <p className="p2">User Name</p>
                      </span>

                      <span className="secondBlock">
                        <p>
                          {AqresultData.amount} {AqresultData.currency}
                        </p>
                        <p className="p2">Amount</p>
                      </span>
                    </div>

                    <div className="paymentDetails-middle">
                      <span>
                        <p className="bold paymentresult-heading">Date :</p>
                        <p>
                          {new Date(
                            AqresultData.transactiondate
                          ).toLocaleDateString()}
                        </p>
                      </span>
                      <span>
                        <p className="bold paymentresult-heading">
                          Order No. :
                        </p>
                        <p>{AqresultData.orderNo}</p>
                      </span>
                      <span>
                        <p className="bold paymentresult-heading">
                          Transaction ID:
                        </p>
                        <p>{AqresultData.txnId}</p>
                      </span>
                      <span>
                        <p className="bold paymentresult-heading">Message</p>
                        <p>{AqresultData.message}</p>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="paymentFailed">
                  <button
                    onClick={() =>
                      window.location.replace(
                        "https://centpays.online/acquirertestingenv"
                      )
                    }
                    className="paymentBack"
                  >
                    <LeftArrow />
                  </button>
                  <img src={Failed} alt="Failed GIF" className="statusGif" />
                  <h5>Transaction Failed!</h5>
                  <div className="paymentDetails">
                    <div className="paymentDetails-header">
                      <span>
                        <p className="bold">{AqresultData.name}</p>
                        <p className="p2">User Name</p>
                      </span>

                      <span className="secondBlock">
                        <p className="bold">
                          {AqresultData.amount} {AqresultData.currency}
                        </p>
                        <p className="p2">Amount</p>
                      </span>
                    </div>

                    <div className="paymentDetails-middle">
                      <span>
                        <p className="bold paymentresult-heading">Date :</p>
                        <p>
                          {new Date(
                            AqresultData.transactiondate
                          ).toLocaleDateString()}
                        </p>
                      </span>
                      <span>
                        <p className="bold paymentresult-heading">
                          Order No. :
                        </p>
                        <p>{AqresultData.orderNo}</p>
                      </span>
                      <span>
                        <p className="bold paymentresult-heading">
                          Transaction ID:
                        </p>
                        <p>{AqresultData.txnId}</p>
                      </span>
                      <span>
                        <p className="bold paymentresult-heading">Message</p>
                        <p>{AqresultData.message}</p>
                      </span>
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
    );
  }

}

export default AQResult;
