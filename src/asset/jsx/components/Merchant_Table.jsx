import React, { Component } from "react";
import { Link } from "react-router-dom";

// components
import MessageBox from "./Message_box";
import MerchantForm from "./Merchant_Form";
import Loader from "./Loder";

// SVG icons
import { RightSign, Oops, LeftSign, LeftDoubleArrow, RightDoubleArrow } from "../../media/icon/SVGicons";
import searchImg from "../../media/image/search-transaction.png";
import ScrollTopAndBottomButton from "./ScrollUpAndDown";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.getCookie("token"),
      searchText: '',
      highlightedOptions: [],
      noResultsFound: false,
      errorMessage: "",
      messageType: "",
      isAddMerchantPanelOpen: false,
      merchantData: {
        company_name: "",
        username: "",
        email: "",
        phone_number: "",
        postal_code: "",
        country: "",
        state: "",
        city: "",
        street_address: "",
        street_address2: "",
        industries_id: "",
        business_type: "",
        business_category: "",
        business_subcategory: "",
        buiness_registered_on: "",
        merchant_pay_in: "",
        merchant_pay_out: "",
        turnover: "",
        website_url: "",
        settlement_charge: "",
        expected_chargeback_percentage: "",
        director_first_name: "",
        director_last_name: "",
        skype_id: "",
      },
      rowsPerPage: 10,
      currentPage: 1,
      loading: false, 
    };
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  getStatusText(status) {
    switch (status) {
      case "Active":
        return (
          <div className="status-div success-status">
            <p>Active</p>
          </div>
        );
      case "Inactive":
        return (
          <div className="status-div failed-status">
            <p>Inactive</p>
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

  handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    const { apiData, headerLabels } = this.props;

    const filteredOptions = apiData.filter((row) =>
      headerLabels.some((label) =>
        String(row[label.label]).toLowerCase().includes(searchText)
      )
    );

    this.setState({
      searchText,
      highlightedOptions: filteredOptions,
      noResultsFound: filteredOptions.length === 0,
      currentPage: 1
    });
  };

  handleAddMerchant = (val) => {
    this.setState({ isAddMerchantPanelOpen: false }, () => {
      this.setState({ isAddMerchantPanelOpen: val });
    });
  };

  handleRowsChange = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      currentPage: 1,
    });
  };

  handlePageChange = (direction) => {
    this.setState((prevState) => ({
      currentPage: prevState.currentPage + direction,
    }));
  };

  render() {
    const { headerLabels, showMerchants,loading,} = this.props;
    const {
      highlightedOptions,
      errorMessage,
      messageType,
      searchText,
      noResultsFound,
      rowsPerPage,
      currentPage,
   
    } = this.state;

    const dataToRender =
      highlightedOptions.length > 0 ? highlightedOptions : this.props.apiData;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = dataToRender.slice(startIndex, endIndex);
    const totalPages = Math.ceil(dataToRender.length / rowsPerPage);

    return (
      <>
        {errorMessage && (
          <MessageBox
            message={errorMessage}
            messageType={messageType}
            onClose={() => this.setState({ errorMessage: "" })}
          />
        )}
        <div className="Table-container">
          {!noResultsFound && <ScrollTopAndBottomButton />}
          <div className="table-Header">
            <input
              className="inputFeild search-input"
              type="text"
              placeholder="Search"
              onChange={this.handleSearch}
              value={searchText}
            />
            {showMerchants && (
              <button
                className="btn-primary"
                onClick={() => this.handleAddMerchant(true)}
              >
                Add New Merchant
              </button>
            )}
            {this.state.isAddMerchantPanelOpen && (
              <MerchantForm
                handleAddMerchant={this.handleAddMerchant}
                merchantData={this.state.merchantData}
                isAddMerchantPanelOpen={this.state.isAddMerchantPanelOpen}
              />
            )}
          </div>
          <div className="table-Body">
            {loading ? (
              <Loader /> // Display Loader while loading
            ) : (
              <table>
                {!noResultsFound && (
                  <thead>
                    <tr>
                      <th className="p1">S.No.</th>
                      {headerLabels.map((item) => (
                        <th key={item.label} className="p1">
                          {item.heading}
                        </th>
                      ))}
                      <th></th>
                      {showMerchants && <th></th>}
                    </tr>
                  </thead>
                )}
                {!noResultsFound ? (
                  <tbody>
                    {paginatedData.map((row, index) => (
                      <tr className="p2" key={index}>
                        <td>{startIndex + index + 1}</td>
                        {headerLabels.map((collabel, labelIndex) => (
                          <td key={labelIndex}>
                            {collabel.id === 2 && showMerchants
                              ? this.getStatusText(row[collabel.label])
                              : row[collabel.label]}
                          </td>
                        ))}
                        {showMerchants && (
                          <td>
                            <Link to={`/viewmerchant/${row.company_name}`}>
                              <RightSign className="icon2" title="View More" />
                            </Link>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={headerLabels.length + (showMerchants ? 2 : 1)}>
                        <div>
                          <div className="search-result-head">
                            <div>
                              <h4>Oops...</h4> <Oops className="primary-color-icon" />
                            </div>
                            <p className="p2">
                              We couldn't find what you are looking for.
                            </p>
                          </div>
                          <div className="search-result-img">
                            <img src={searchImg} alt="search"></img>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            )}
          </div>
          {!noResultsFound && (
            <div className="table-Footer">
              <div className="table-footer-rows-div">
                <label htmlFor="noRows">Rows per page</label>
                <select id="noRows" value={rowsPerPage} onChange={this.handleRowsChange}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="table-footer-buttons-div">
                <p>
                  {`${startIndex + 1}-${Math.min(endIndex, dataToRender.length)} of ${dataToRender.length}`}
                </p>
                <button
                onClick={() => this.setState({ currentPage: 1 })}
                disabled={currentPage === 1}
                className={currentPage === 1 ? 'disabled-button' : ''}
              >
                <LeftDoubleArrow />
              </button>
                <button
                  onClick={() => this.handlePageChange(-1)}
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? 'disabled-button' : ''}
                >
                  <LeftSign />
                </button>
                <button
                  onClick={() => this.handlePageChange(1)}
                  disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'disabled-button' : ''}
                >
                  <RightSign />
                </button>
                <button
                onClick={() => this.setState({ currentPage: totalPages })}
                className={currentPage === totalPages ? 'disabled-button' : ''}
              >
                <RightDoubleArrow />
              </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default Table;
