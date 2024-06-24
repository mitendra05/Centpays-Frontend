import React, { Component } from 'react';

class TransactionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchData(); 
    this.interval = setInterval(this.fetchData, 2000); 
  }

  componentWillUnmount() {
    clearInterval(this.interval); 
  }

  fetchData = () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    fetch(`${backendURL}/latest100`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        this.setState({ data, loading: false });
      })
      .catch(error => {
        this.setState({ error: error.message, loading: false });
      });
  };

  render() {
    const { data } = this.state;
  
    const headings = ['S. No.', 'livedata_id', 'txnid', 'merchantTxnId','merchant','amount','transactiondate','Status','currency','paymentgateway','Country'];
    const headingKeys = {
      'S. No.': 's_no',
      'livedata_id': 'livedata_id',
      'txnid': 'txnid',
      'merchantTxnId': 'merchantTxnId',
      'merchant': 'merchant',
      'amount': 'amount',
      'transactiondate': 'transactiondate',
      'Status': 'Status',
      'currency': 'currency',
      'paymentgateway': 'paymentgateway',
      'Country': 'country'
    };
  
    return (
      <div className="transaction-table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              {headings.map((heading, index) => (
                <th key={index}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{rowIndex + 1}</td>
                {headings.slice(1).map((heading, index) => {
                  const value = row[headingKeys[heading]];
                  return (
                    <td key={index} style={{ color: value === 'Success' ? 'green' : value === 'Failed' ? 'red' : 'black' }}>{value}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
}

export default TransactionTable;
