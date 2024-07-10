import React, { Component } from 'react';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Loader from "../../media/image/Loader.gif";

class PaymentResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebaropen: true,
            token: this.getCookie("token"),
            // userRole: this.getCookie("role"),
            // userName: this.getCookie("name"),
            isLoading: false,
            data: null,
            error: null,
        };
    }

    getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

	componentDidMount() {
		const userRole = localStorage.getItem('userRole');
		if (userRole) {
			this.setState({ userRole });
		}
		this.fetchData();
	}

    fetchData = async () => {
        this.setState({ isLoading: true, error: null });
        const backendURL = process.env.REACT_APP_BACKEND_URL;
        try {
            const API_URL = `${backendURL}/transactionflow/get_transaction?orderNo=${this.state.orderNo}`;
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            const data = await response.json();
            this.setState({ data, status: data.status });
            console.log("Fetched data:", data);
        } catch (error) {
            this.setState({ error: error.message || 'An error occurred while fetching data.' });
        } finally {
            this.setState({ isLoading: false });
        }
    };

    render() {
        const { data, isLoading, error, sidebaropen} = this.state;

        return (
            <>
                <Header />
                <Sidebar />
                <div className={`main-screen ${sidebaropen ? "collapsed-main-screen" : "expanded-main-screen"}`}>
                    {isLoading ? (
                        <img src={Loader} className='loadingIcon' alt='loading gif' />
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : (
                        <div className="paymentResult">
                            {data ? (
                                <>
                                    <p>Payment Status: {data.status}</p>
                                    <p>Transaction ID: {data.transactionID}</p>
                                    <p>Order No: {data.orderNo}</p>
                                </>
                            ) : (
                                <p>No data available.</p>
                            )}
                        </div>
                    )}
                </div>
            </>
        );
    }
}

export default PaymentResult;
