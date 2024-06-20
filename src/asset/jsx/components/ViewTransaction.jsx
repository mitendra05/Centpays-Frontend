import React, { Component } from "react";

//Components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CopyToClipboard from "./CopyToClipboard";

//SVG icons
import { LeftArrow } from "../../media/icon/SVGicons";

// Icons
import visa from "../../media/icon/logoVisa.png";
import mastercard from "../../media/icon/LogoMastercard.png";

class ViewTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      data: {},
    };
  }

  getCardImage(cardtype) {
    switch (cardtype) {
      case "Visa":
        return (
          <div className="view-txn-card-div">
            <img className="creditcard-img" src={visa} alt="visa"></img>
          </div>
        );
      case "Mastercard":
        return (
          <div className="view-txn-card-div">
            <img
              className="creditcard-img"
              src={mastercard}
              alt="mastercard"
            ></img>
          </div>
        );
      default:
        return <div className="collapsible-row-value"></div>;
    }
  }

  render() {
    const { data, onViewClick } = this.props;
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
          <div className="main-screen-rows transaction-monitoring-first-row">
            <div className="row-cards view-txn-container">
            <LeftArrow className="icon2" onClick={()=>onViewClick(null)}></LeftArrow>
              <div className="view-txn-header">
                
                {data.Status === "Success" ? (
                  <div className="status-amount-div">
                    
                    <div className="success-dot"></div>
                    <h3>
                      {data.amount}
                      {` `}
                      <span className="p2">{data.currency}</span>
                    </h3>
                  </div>
                ) : data.Status === "Failed" ? (
                  <div className="status-amount-div">
                    <div className="failed-dot"></div>
                    <h3>
                      {data.amount}
                      {` `}
                      <span className="p2">{data.currency}</span>
                    </h3>
                  </div>
                ) : (
                  <div className="status-amount-div">
                    <div className="incomplete-dot"></div>
                    <h3>
                      {data.amount}
                      {` `}
                      <span className="p2">{data.currency}</span>
                    </h3>
                  </div>
                )}

                <h4>{this.getCardImage(data.cardtype)}</h4>
                <div>
                  <h5>{data.merchant}</h5>
                  <h5> {data.paymentgateway? data.paymentgateway: `Not assigned`}</h5>
                </div>
              </div>
              <div className="view-txn-body">
                <div className="view-txn-body-left">
                  <div className="details-section">
                    <p>Basic Details</p>
                    <div className="row-div">
                      <div className="row-left">Livedata ID</div>
                      <div className="row-right">{data.livedata_id}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Transaction ID</div>
                      <div className="row-right"><CopyToClipboard text={data.txnid} /></div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Merchant Transaction ID</div>
                      <div className="row-right"><CopyToClipboard text={data.merchantTxnId} /></div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Order No</div>
                      <div className="row-right">{data.orderNo}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">MID</div>
                      <div className="row-right">{data.mid}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Merchant</div>
                      <div className="row-right">{data.merchant}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Merchant ID</div>
                      <div className="row-right">{data.merchant_id}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Payment Gateway</div>
                      <div className="row-right">{data.paymentgateway}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Payment Gateway ID</div>
                      <div className="row-right">{data.payment_id}</div>
                    </div>
                  </div>

                  <div className="details-section">
                    <p>Customer Details</p>
                    <div className="row-div">
                      <div className="row-left">Name</div>
                      <div className="row-right">{data.cname}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Email</div>
                      <div className="row-right">{data.email}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Phone No</div>
                      <div className="row-right">{data.requested_phone}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Country</div>
                      <div className="row-right">{data.country}</div>
                    </div>
                  </div>
                </div>

                <div className="view-txn-body-right">
                  <div className="details-section">
                    <p>Transaction Details</p>
                    <div className="row-div">
                      <div className="row-left">Transaction Date</div>
                      <div className="row-right">{data.transactiondate}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Status</div>
                      <div className="row-right">{data.Status}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Message</div>
                      <div className="row-right">{data.message}</div>
                    </div>
                  </div>
                  <div className="details-section">
                    <p>Payment Details</p>

                    <div className="row-div">
                      <div className="row-left">Amount</div>
                      <div className="row-right">{data.amount}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Currency</div>
                      <div className="row-right">{data.currency}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Card Number</div>
                      <div className="row-right">{data.cardnumber}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Card Type</div>
                      <div className="row-right">{data.cardtype}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Card Expire</div>
                      <div className="row-right">{data.cardExpire}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Card CVC</div>
                      <div className="row-right">{data.cardCVC}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Requested Mode</div>
                      <div className="row-right">{data.requestMode}</div>
                    </div>
                  </div>
                  <div className="details-section">
                    <p>Other Details</p>
                    <div className="row-div">
                      <div className="row-left">Web URL</div>
                      <div className="row-right">{data.web_url}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Router</div>
                      <div className="row-right">{data.router}</div>
                    </div>
                    <div className="row-div">
                      <div className="row-left">Environment</div>
                      <div className="row-right">{data.env}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ViewTransaction;
