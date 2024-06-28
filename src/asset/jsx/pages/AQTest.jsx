import React, { Component } from 'react';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import cardimage from "../../media/image/credit-card.png";
import loackicon from "../../media/image/padlock.png";
import Loader from "../../media/image/Loader.gif";
import Success from "../../media/image/success.gif";
import Failed from "../../media/image/Close.gif";
import { LeftArrow } from '../../media/icon/SVGicons';
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";

export class AQTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebaropen: true,
            errorMessage: "",
            token: null,
            userName: null,
            userRole: null,
            orderNo: this.extractOrderNoFromURL(),
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

    extractOrderNoFromURL() {
        const currentPath = window.location.pathname;
        const orderNo = currentPath.split("/acquirertestingenv/")[1];
        return orderNo;
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        const userName = localStorage.getItem('company_name'); // Assuming you store 'userName' during login
        const userRole = localStorage.getItem('role'); // Assuming you store 'userRole' during login
    
        console.log("Loaded cookies data:", { token, userName, userRole });
    
        if (token && userName && userRole) {
            this.setState({
                token: token,
                userName: userName,
                userRole: userRole
            });
        }

        if (this.state.orderNo) {
            this.fetchData();
        }
    }

    fetchData = async () => {
        this.setState({ isLoading: true, error: null });
        try {
            const API_URL = `https://paylinkup.online/transactionflow/get_transaction?orderNo=${this.state.orderNo}`;
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            const data = await response.json();
            this.setState({ data });
            console.log("Fetched data:", data);     
            this.setState({status: data.status})
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
        e.preventDefault();
        const { billingName, billingEmail, billingPhoneNumber, amount, selectedCurrency, cardHolderName, cardNumder, expiryDate, cvvno, selectedCard } = this.state;
    
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
            merchantID: "1044",
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
    
        console.log("Payment payload:", payload);
    
        const headers = {
            'Content-Type': 'application/json',
        };
    
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/paymentlink`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Response data:", data);
    
            if (data.redirectUrl) {
                // Save session data in cookies before redirecting
                Cookies.set('token', this.state.token, { expires: 1 ,secure: true }); // Expires in 1 day
                Cookies.set('name', this.state.userName, { expires: 1 ,secure: true});
                Cookies.set('role', this.state.userRole, { expires: 1 ,secure: true});
    
                console.log("Cookies set:", {
                    token: this.state.token,
                    userName: this.state.userName,
                    userRole: this.state.userRole
                });
                window.location.href = data.redirectUrl;
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
            proceedClicked, cardHolderName, cardNumder, expiryDate, cvvno, selectedCard, userName, userRole, status, isLoader,data } = this.state;

        if (status === " ") {
            return (
                <>
                    <Header />
                    <Sidebar />
                    <div className={`main-screen ${this.state.sidebaropen ? "collapsed-main-screen" : "expanded-main-screen"}`}>
                        <div id='paymentscreen'>
                            <div className='paymentscreen'>
                                <div className='paymentDetails'>
                                    {isLoader ? <img src={Loader} className='loadingIcon' alt='loading gif' /> : (
                                        <>
                                            {proceedClicked ?
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
                                                            <p className={`selectedCurrency ${selectedCurrency === 'USD' ? '' : 'nocolor'}`} onClick={() => this.toggleCurrency('USD')}>USD</p>
                                                            <p className={`selectedCurrency ${selectedCurrency === 'EUR' ? '' : 'nocolor'}`} onClick={() => this.toggleCurrency('EUR')}>EUR</p>
                                                        </div>
                                                    </div>
                                                    <div className='max-billingdetals-middle'>
                                                        <input type='text' className='paymentInput' name='billingName' placeholder='Billing Name' value={billingName} required onChange={this.handleInputChange} />
                                                        <input type='text' className='paymentInput' name='billingEmail' placeholder='Billing Email' value={billingEmail} required onChange={this.handleInputChange} />
                                                        <input type='text' className='paymentInput' name='billingPhoneNumber' placeholder='Billing Phone Number' value={billingPhoneNumber} required onChange={this.handleInputChange} />
                                                        <input type='text' className='paymentInput' name='amount' placeholder={`Amount ${selectedCurrency}`} value={amount} required onChange={this.handleInputChange} />
                                                    </div>
                                                    <div className='max-billingdetals-footer'>
                                                        <button type='submit' className='btn-primary'>Procced</button>
                                                    </div>
                                                </form>
                                            }
                                            {proceedClicked ?
                                                <div className='max-carddetails'>
                                                    <div className='max-carddetails-header'>
                                                        <p className='cardDetails-heading'>Payment Method</p>
                                                        <div className='currencyToggel'>
                                                            <p className={`selectedCurrency ${selectedCard === 'Visa' ? '' : 'nocolor'}`} onClick={() => this.toggleCard('Visa')}>Visa</p>
                                                            <p className={`selectedCurrency ${selectedCard === 'MC' ? '' : 'nocolor'}`} onClick={() => this.toggleCard('MC')}>Mastercard</p>
                                                        </div>
                                                    </div>
                                                    <form className='max-cardDetails-middle' onSubmit={this.handlePay}>
                                                        <p className='p1'>Enter card details</p>
                                                        <input type='text' className='paymentInput' name='cardHolderName' placeholder='Card Holder Name' value={cardHolderName} required onChange={this.handleInputChange} />
                                                        <input type='text' className='paymentInput' name='cardNumder' placeholder='Card Number' value={cardNumder} required onChange={this.handleInputChange} />
                                                        <span>
                                                            <input type='text' className='paymentInput' name='expiryDate' placeholder='Expiry Date' value={expiryDate} required onChange={this.handleInputChange} />
                                                            <input type='text' className='paymentInput' name='cvvno' placeholder='CVV/CSS' value={cvvno} required onChange={this.handleInputChange} />
                                                        </span>
                                                        <div className='max-billingdetals-footer'>
                                                            <button type='submit' className='btn-primary'>Pay</button>
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
                                                </div>
                                            }
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <Header />
                    <Sidebar />
                    <div className={`main-screen ${this.state.sidebaropen ? "collapsed-main-screen" : "expanded-main-screen"}`}>
                        <div id='paymentscreen'>
                            <div className='paymentscreen'>
                                <div className='paymentResult'>
                                    {status === "Success" ?
                                        <div className='paymentSuccessfull'>
                                            <LeftArrow className="paymentBack" />
                                            <img src={Success} alt='Success GIF' className='statusGif' />
                                            <h5>Transaction Successful!</h5>
                                            <div className='paymentDetails'>
                                                <div className='paymentDetails-header'>
                                                    <span>
                                                        <p>{data.name }</p>
                                                        <p className='p2'>Recipient</p>
                                                    </span>
                                                    <span className='secondBlock'>
                                                        <p>{data.amount+" "+data.currency}</p>
                                                        <p className='p2'>Amount</p>
                                                    </span>
                                                </div>
                                                <div className='paymentDetails-middle'>
                                                    <span><p>Date :</p><p>{data.transactiondate}</p></span>
                                                    <span><p>Order No. :</p><p>{data.orderNo}</p></span>
                                                    <span><p>Transaction ID:</p><p>{data.txnId}</p></span>
                                                    <p>{this.getStatusText("Successful")}</p>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className='paymentFailed'>
                                            <Link to="/acquirertestingenv"><LeftArrow className="paymentBack" /></Link>
                                            <img src={Failed} alt='Success GIF' className='statusGif' />
                                            <h5>Transaction Failed!</h5>
                                            <div className='paymentDetails'>
                                                <div className='paymentDetails-header'>
                                                    <span>
                                                        <p>{data.name }</p>
                                                        <p className='p2'>Recipient</p>
                                                    </span>
                                                    <span className='secondBlock'>
                                                        <p>{data.amount+" "+data.currency}</p>
                                                        <p className='p2'>Amount</p>
                                                    </span>
                                                </div>
                                                <div className='paymentDetails-middle'>
                                                    <span><p>Date :</p><p>{data.transactiondate}</p></span>
                                                    <span><p>Order No. :</p><p>{data.orderNo}</p></span>
                                                    <span><p>Transaction ID:</p><p>{data.txnId}</p></span>
                                                    <p>{this.getStatusText("Failed")}</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }
}

export default AQTest;
