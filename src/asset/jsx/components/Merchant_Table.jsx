import React, { Component } from "react";
import { Link } from "react-router-dom";

// component
import MessageBox from "./Message_box";
import MerchantForm from "./Merchant_Form";

//SVG icons
import { RightSign, Oops, LeftSign } from "../../media/icon/SVGicons";
import searchImg from "../../media/image/search-transaction.png"

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      highlightedOptions: [],
      noResultsFound: false,
      errorMessage: "",
      messageType: "",
      token: localStorage.getItem("token"),
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
    };
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
      noResultsFound: filteredOptions.length === 0
    });
  };

  handleAddMerchant = (val) => {
    this.setState({
      isAddMerchantPanelOpen: val,
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
    const { headerLabels, showMerchants, apiData } = this.props;
    const {
      highlightedOptions,
      errorMessage,
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
            onClose={() => this.setState({ errorMessage: "" })}
          />
        )}
        <div className="Table-container">
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
                      <div className="searchTxn-result">
                        <div className="searchTxn-result-head">
                          <div>
                            <h4>Oops...</h4> <Oops className="primary-color-icon" />
                          </div>
                          <p className="p2">We couldn't find what you are looking for</p>
                        </div>
                        <div className="search-result-img">
                          <img src={searchImg} alt="search" className="full-width-img" />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
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
                  onClick={() => this.handlePageChange(-1)}
                  disabled={currentPage === 1}
                >
                  <LeftSign />
                </button>
                <button
                  onClick={() => this.handlePageChange(1)}
                  disabled={currentPage === totalPages}
                >
                  <RightSign />
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
