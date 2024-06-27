import React, { Component } from 'react'

// components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import cardimage from "../../media/image/credit-card.png";
import loackicon from "../../media/image/padlock.png";
import Loader from "../../media/image/Loader.gif";
import Success from "../../media/image/success.gif"
import Failed from "../../media/image/Close.gif"

// import { LeftSign } from '../../media/icon/SVGicons';
import { LeftArrow } from '../../media/icon/SVGicons';

export class AQTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebaropen: true,
            errorMessage: "",
            token: localStorage.getItem("token"),
            userName: localStorage.getItem("name"),
            userRole: localStorage.getItem("role"),
            orderNo: this.extractENameFromURL(),
            billingName: "",
            billingEmail: "",
            billingPhoneNumber: "",
            amount: "",
            selectedCurrency: "USD",
            proceedClicked: false,
            selectedCard: 'Visa',
            cardHolderName: "",
            cardNumder: "",
            expiryDate: "",
            cvvno: "",

            status: " ",
            isLoader: false,
        };
    }
//
    
  extractENameFromURL() {
    const currentPath = window.location.pathname;
    const orderNo = currentPath.split("/acquirertestingenv/")[1];
    return orderNo;
  }
  
  componentDidMount() {
    if( this.state.orderNo!=""){
        this.fetchData();
    }
    
  }

    fetchData = async () => {
        this.setState({ isLoading: true, error: null });

        try {
        const API_URL = `https:// paylinkup.online/transactionflow/get_transaction?orderNo=${this.state.orderNo}`; // Replace with your actual API endpoint
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        this.setState({ data });
        console.log(data)
        } catch (error) {
        this.setState({ error: error.message || 'An error occurred while fetching data.' });
        } finally {
        this.setState({ isLoading: false });
        }
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    toggleCurrency = (currency) => {
        this.setState({ selectedCurrency: currency });
    };

    toggleCard = (card) => {
        this.setState({ selectedCard: card });
    };

    handleProceed = (e) => {
        e.preventDefault();
        this.setState({ proceedClicked: true });
    };

    handlePay = async (e) => {
        const backendURL = process.env.REACT_APP_BACKEND_URL;
        e.preventDefault();
        const { billingName, billingEmail, billingPhoneNumber, amount,
            selectedCurrency, cardHolderName, cardNumder, expiryDate, cvvno, selectedCard, isLoader } = this.state;

        // Generate random transaction ID and order number
        const generateRandomString = (length) => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        };

        const transaction_id = generateRandomString(6);
        const order_number = generateRandomString(6);

        const payload = {
            merchantID: "123",
            name: cardHolderName,
            email: billingEmail,
            phone: billingPhoneNumber,
            amount: amount,
            currency: selectedCurrency,
            transactionID: transaction_id,
            orderNo: order_number,
            backURL: 'https://www.centpays.online/acquirertestingenv',
            requestMode: 'Card',
            cardnumber: cardNumder,
            cardExpire: expiryDate,
            cardCVV: cvvno
        };

        console.log(payload);
        const headers = {
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch(`${backendURL}/paymentlink`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl; // Perform the redirect
            } else {
                console.error('No redirect URL found in response');
            }
        } catch (error) {
            console.error('Error:', error);
        }


        this.setState({
            billingName: '',
            billingEmail: '',
            billingPhoneNumber: '',
            amount: '',
            cardHolderName: '',
            cardNumder: '',
            expiryDate: '',
            cvvno: '',
            proceedClicked: false,
            isLoader: true,
        });
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
        const { billingName, billingEmail, billingPhoneNumber, amount, selectedCurrency,
            proceedClicked, cardHolderName, cardNumder, expiryDate, cvvno, selectedCard, userName, userRole, status, isLoader } = this.state;

        if (status === " ") {
            return (
                <>
                    <Header />
                    <Sidebar />
                    <div className={`main-screen ${this.state.sidebaropen
                        ? "collapsed-main-screen"
                        : "expanded-main-screen "
                        }  `}
                    >
                        <div id='paymentscreen'>
                            <div className='paymentscreen'>
                                <div className='paymentDetails'>
                                    {isLoader ? <img src={Loader} className='loadingIcon' alt='loading gif' /> : <>{proceedClicked ?
                                        <div className='min-cardDetails'>
                                            <div className='userImage'></div>
                                            <span className='min-billingdetails-header'><p>{userName}</p><p className='p1'>{userRole}</p></span>
                                            <div className='min-billingaount-header'>{amount + " " + selectedCurrency}</div>
                                        </div>
                                        :
                                        <form className='max-billingdetails' onSubmit={this.handleProceed}>
                                            <div className='max-billingdetails-header'>
                                                <div className='userImage'></div>
                                                <span className='max-billingdetails-header-userDetails'><p>{userName}</p><p className='p1'>{userRole}</p></span>
                                                <div className='currencyToggel'>
                                                    <p
                                                        className={`selectedCurrency ${selectedCurrency === 'USD' ? '' : 'nocolor'}`}
                                                        onClick={() => this.toggleCurrency('USD')}
                                                    >
                                                        USD
                                                    </p>
                                                    <p
                                                        className={`selectedCurrency ${selectedCurrency === 'EUR' ? '' : 'nocolor'}`}
                                                        onClick={() => this.toggleCurrency('EUR')}
                                                    >
                                                        EUR
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='max-billingdetals-middle'>
                                                <input
                                                    className='paymentInput'
                                                    type='text'
                                                    name='billingName'
                                                    placeholder='Billing Name'
                                                    value={billingName}
                                                    required
                                                    onChange={this.handleInputChange}
                                                />
                                                <input
                                                    className='paymentInput'
                                                    type='text'
                                                    name='billingEmail'
                                                    placeholder='Billing Email'
                                                    value={billingEmail}
                                                    required
                                                    onChange={this.handleInputChange}
                                                />
                                                <input
                                                    className='paymentInput'
                                                    type='text'
                                                    name='billingPhoneNumber'
                                                    placeholder='Billing Phone Number'
                                                    value={billingPhoneNumber}
                                                    required
                                                    onChange={this.handleInputChange}
                                                />
                                                <input
                                                    className='paymentInput'
                                                    type='text'
                                                    name='amount'
                                                    placeholder={`Amount ${selectedCurrency}`}
                                                    value={amount}
                                                    required
                                                    onChange={this.handleInputChange}
                                                />
                                            </div>
                                            <div className='max-billingdetals-footer'>
                                                <button type='submit' className='btn-primary'>Procced</button>
                                            </div>
                                        </form>}
                                        {proceedClicked ?
                                            <div className='max-carddetails'>
                                                <div className='max-carddetails-header'>
                                                    <p className='cardDetails-heading'>Payment Method</p>
                                                    <div className='currencyToggel'>
                                                        <p
                                                            className={`selectedCurrency ${selectedCard === 'Visa' ? '' : 'nocolor'}`}
                                                            onClick={() => this.toggleCard('Visa')}
                                                        >
                                                            Visa
                                                        </p>
                                                        <p
                                                            className={`selectedCurrency ${selectedCard === 'MC' ? '' : 'nocolor'}`}
                                                            onClick={() => this.toggleCard('MC')}
                                                        >
                                                            Mastercard
                                                        </p>
                                                    </div>
                                                </div>
                                                <form className='max-cardDetails-middle' onSubmit={this.handlePay}>
                                                    <p className='p1'>Enter card details</p>
                                                    <input
                                                        className='paymentInput'
                                                        type='text'
                                                        name='cardHolderName'
                                                        placeholder='Card Holder Name'
                                                        value={cardHolderName}
                                                        required
                                                        onChange={this.handleInputChange}
                                                    />
                                                    <input
                                                        className='paymentInput'
                                                        type='text'
                                                        name='cardNumder'
                                                        placeholder='Card Number'
                                                        value={cardNumder}
                                                        required
                                                        onChange={this.handleInputChange}
                                                    />
                                                    <span>
                                                        <input
                                                            className='paymentInput'
                                                            type='text'
                                                            name='expiryDate'
                                                            placeholder='Expiry Date'
                                                            value={expiryDate}
                                                            required
                                                            onChange={this.handleInputChange}
                                                        />
                                                        <input
                                                            className='paymentInput'
                                                            type='text'
                                                            name='cvvno'
                                                            placeholder='CVV/CSS'
                                                            value={cvvno}
                                                            required
                                                            onChange={this.handleInputChange}
                                                        />
                                                    </span>
                                                    <div className='max-billingdetals-footer'>
                                                        <button type='submit' className='btn-primary' >Pay</button>
                                                    </div>
                                                </form>


                                                <div className='carddetails-agrementFooter'>
                                                    <span>
                                                        <p className='p1'>By clicking pay you accept the</p>
                                                        <p className='cp-card-agreement'>user agreement</p>
                                                    </span>
                                                    <div className='LOCK-icon'><img src={loackicon} alt='Lock icon' /></div>
                                                </div>
                                            </div>
                                            :
                                            <div className='min-cardDetails'>
                                                <img src={cardimage} alt='credit card icone' className='cardImage' />
                                                <span><p>Enter Card Details</p><p className='p1'>MasterCard, Visa</p></span>
                                                <div className='LOCK-icon'><img src={loackicon} alt='Lock icon' /></div>
                                            </div>}</>}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (status) {
            return (
                <>
                    <Header />
                    <Sidebar />
                    <div className={`main-screen ${this.state.sidebaropen
                        ? "collapsed-main-screen"
                        : "expanded-main-screen "
                        }  `}
                    >
                        <div id='paymentscreen'>
                            <div className='paymentscreen'>
                                <div className='paymentResult'>
                                    {status === "Success" ? 
                                        <div className='paymentSuccessfull'>
                                            <LeftArrow  className="paymentBack"/>
                                            <img src={Success} alt='Success GIF' className='statusGif'/>
                                            <h5>Transaction Successful!</h5>
                                            <div className='paymentDetails'>
                                                <div className='paymentDetails-header'>
                                                    <span>
                                                        <p>User Name</p>
                                                        <p className='p2'>Recipient</p>
                                                    </span>

                                                    <span className='secondBlock'>
                                                        <p>10000 USD</p>
                                                        <p className='p2'>Amount</p>
                                                    </span>
                                                </div>

                                                <div className='paymentDetails-middle'>
                                                    <span>
                                                        <p>Date :</p><p>25/06/2024</p>
                                                    </span>
                                                    <span>
                                                        <p>Order No. :</p><p>dfkhgewlkfew</p>
                                                    </span>
                                                    <span>
                                                        <p>Transaction ID:</p><p>aekfuhlasdjbgr</p>
                                                    </span>
                                                    <p>{this.getStatusText("Successful")}</p>
                                                </div>

                                            </div>
                                        </div> 
                                    : 
                                        <div className='paymentFailed'>
                                            <LeftArrow  className="paymentBack"/>
                                            <img src={Failed} alt='Success GIF' className='statusGif'/>
                                            <h5>Transaction Failed!</h5>
                                            <div className='paymentDetails'>
                                                <div className='paymentDetails-header'>
                                                    <span>
                                                        <p>User Name</p>
                                                        <p className='p2'>Recipient</p>
                                                    </span>

                                                    <span className='secondBlock'>
                                                        <p>10000 USD</p>
                                                        <p className='p2'>Amount</p>
                                                    </span>
                                                </div>

                                                <div className='paymentDetails-middle'>
                                                    <span>
                                                        <p>Date :</p><p>25/06/2024</p>
                                                    </span>
                                                    <span>
                                                        <p>Order No. :</p><p>dfkhgewlkfew</p>
                                                    </span>
                                                    <span>
                                                        <p>Transaction ID:</p><p>aekfuhlasdjbgr</p>
                                                    </span>
                                                    <p>{this.getStatusText("Failed")}</p>
                                                </div>

                                            </div>
                                        </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }
}

export default AQTest