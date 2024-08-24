import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

// components
import MessageBox from "./Message_box";
import MerchantForm from "./Merchant_Form";
import Loader from "./Loder";

// SVG icons
import {
  RightSign,
  Oops,
  LeftSign,
  LeftDoubleArrow,
  RightDoubleArrow,
  UpSign,
  DownSign,
  ExportIcon,
  Delete,
  Eye,
  More,
} from "../../media/icon/SVGicons";
import searchImg from "../../media/image/search-transaction.png";
import ScrollTopAndBottomButton from "./ScrollUpAndDown";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.getCookie("token"),
      searchText: "",
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
      expandedRows: [],
      companyList: [],
      selectedRows: new Set(),
      isAllSelected: false,
    };
  }

  componentDidMount() {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    this.fetchMerchants(`${backendURL}/companylist`, "companyList");
  }

  fetchMerchants = async (url, dataVariable) => {
    const { token } = this.state;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      this.setState({ [dataVariable]: data });
    } catch (error) {
      this.setState({
        errorMessage: "Error in Fetching data. Please try again later.",
        messageType: "",
      });
    }
  };

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  handleInputChange = (event) => {
    const { id, value } = event.target;

    this.setState({
      [id]: value,
    });
  };

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
      currentPage: 1,
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

  toggleRow = (id) => {
    this.setState((prevState) => {
      const { expandedRows } = prevState;
      const index = expandedRows.indexOf(id);
      const newExpandedRows = [...expandedRows];

      if (index === -1) {
        newExpandedRows.push(id);
      } else {
        newExpandedRows.splice(index, 1);
      }

      return { expandedRows: newExpandedRows };
    });
  };

  handleCheckboxChange = (index) => {
    this.setState((prevState) => {
      const selectedRows = new Set(prevState.selectedRows);
      if (selectedRows.has(index)) {
        selectedRows.delete(index);
      } else {
        selectedRows.add(index);
      }
      return { selectedRows };
    });
  };

  handleSelectAll = (event) => {
    const { checked } = event.target;
    const { paginatedData, startIndex } = this.getPaginatedData();
    if (checked) {
      // Select all rows
      const allIndexes = paginatedData.map((_, index) => startIndex + index);
      this.setState({ selectedRows: new Set(allIndexes), isAllSelected: true });
    } else {
      // Deselect all rows
      this.setState({ selectedRows: new Set(), isAllSelected: false });
    }
  };

  getPaginatedData = () => {
    const { highlightedOptions, currentPage, rowsPerPage } = this.state;
    const dataToRender =
      highlightedOptions.length > 0 ? highlightedOptions : this.props.apiData;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = dataToRender.slice(startIndex, endIndex);
    return { paginatedData, startIndex };
  };

  exportData = () => {
    const { apiData, headerLabels } = this.props;
    const { highlightedOptions } = this.state;

    const columnToExclude = "Action";

    const dataToExport =
      highlightedOptions.length > 0 ? highlightedOptions : apiData;
    const formattedData = dataToExport.map((row) =>
      headerLabels.reduce((acc, label) => {
        if (label.heading !== columnToExclude) {
          acc[label.heading] = row[label.label];
        }
        return acc;
      }, {})
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "exported_data.xlsx");
  };

  deleteRow = (index) => {
    const { highlightedOptions, apiData } = this.state;
    let dataToRender = highlightedOptions.length > 0 ? highlightedOptions : apiData;

    if (dataToRender && dataToRender.length > index) {
      dataToRender.splice(index, 1);
      this.setState({
        highlightedOptions: highlightedOptions.length > 0 ? [...dataToRender] : [],
        apiData: highlightedOptions.length === 0 ? [...dataToRender] : apiData,
      });
    } else {
      console.error("Data to render is undefined or index out of bounds");
    }
  };

  render() {
    const { headerLabels, showMerchants, loading, buttonname, forAllUser } =
      this.props;
    const {
      highlightedOptions,
      errorMessage,
      messageType,
      searchText,
      noResultsFound,
      rowsPerPage,
      currentPage,
      expandedRows,
      merchant,
      selectedRows,
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

          {forAllUser && (
            <div className="user-table-header">
              <div className="search-select-div input-user">
                <select
                  className="id-input"
                  id="role"
                  value={this.state.role}
                  onChange={this.handleInputChange}
                >
                  <option value="">Select Role</option>
                  <option value="Success">Centpays</option>
                  <option value="Failed">Merchant Agent</option>
                  <option value="Incompleted">Centpays Employee</option>
                </select>
              </div>
              <div className="search-select-div input-user">
                <select
                  className="id-input"
                  id="merchant"
                  value={merchant}
                  onChange={this.handleInputChange}
                >
                  <option value="">Select Merchant</option>
                  {this.state.companyList.map((merchant, index) => (
                    <option key={index} value={merchant}>
                      {merchant}
                    </option>
                  ))}
                </select>
              </div>
              <div className="search-select-div input-user">
                <select
                  className="id-input"
                  id="status"
                  value={this.state.status}
                  onChange={this.handleInputChange}
                  onKeyDown={this.handleKeyDown}
                >
                  <option value="">Select Behaviour</option>
                  <option value="Success">Success</option>
                  <option value="Failed">Failed</option>
                  <option value="Incompleted">Incompleted</option>
                </select>
              </div>
            </div>
          )}

          <div className="table-Header">
            {forAllUser && (
              <button className="btn-primary" onClick={this.exportData}>
                <ExportIcon className="white-icon" />
                <p>Export</p>
              </button>
            )}
            <input
              className={
                forAllUser
                  ? "inputFeild search-input foralluser-text"
                  : "inputFeild search-input"
              }
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
                {buttonname}
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
              <Loader />
            ) : (
              <table>
                {!noResultsFound && (
                  <thead>
                    <tr>
                      {forAllUser && <th></th>}
                      {forAllUser && (
                        <th>
                          <input
                            type="checkbox"
                            checked={this.state.isAllSelected}
                            onChange={this.handleSelectAll}
                          />
                        </th>
                      )}
                      <th className="p1">S.No.</th>

                      {headerLabels.map((item) => (
                        <th key={item.label} className="p1">
                          {item.heading}
                        </th>
                      ))}
                      <th></th>
                      {showMerchants && !forAllUser && <th></th>}
                      {forAllUser && <th></th>}
                    </tr>
                  </thead>
                )}
                {!noResultsFound ? (
                  <tbody>
                    {paginatedData.map((row, index) => (
                      <React.Fragment key={index}>
                        <tr className="p2">
                          {forAllUser && (
                            <td
                            onClick={() => this.toggleRow(startIndex + index)}
                            className={expandedRows.includes(startIndex + index) ? 'no-border-bottom' : ''}
                          >
                            {expandedRows.includes(startIndex + index) ? (
                              <UpSign className="icon2" />
                            ) : (
                              <DownSign className="icon2" />
                            )}
                          </td>
                          
                          )}
                          {forAllUser && (
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedRows.has(startIndex + index)}
                                onChange={() =>
                                  this.handleCheckboxChange(startIndex + index)
                                }
                              />
                            </td>
                          )}
                          <td>{startIndex + index + 1}</td>

                          {headerLabels.map((collabel, labelIndex) => (
                            <td key={labelIndex}>
                              {collabel.id === 2 && showMerchants ? (
                                this.getStatusText(row[collabel.label])
                              ) : collabel.id === 7 && forAllUser ? (
                                <div>
                                  <Delete className="icon2" onClick={() => this.deleteRow(index)} />
                                  <Link
                                    to={`/viewuser/${row.company_name}`}
                                  >
                                    <Eye className="icon2" />
                                  </Link>
                                  <More className="icon2" />
                                </div>
                              ) : collabel.id === 6 && forAllUser ? (
                                "0"
                              ) : (
                                row[collabel.label]
                              )}
                            </td>
                          ))}
                          {showMerchants && !forAllUser && (
                            <td>
                              <Link to={`/viewmerchant/${row.company_name}?id=${row._id}`}>
                                <RightSign
                                  className="icon2"
                                  title="View More"
                                />
                              </Link>
                            </td>
                          )}
                          <td className={expandedRows.includes(startIndex + index) ? 'no-border-bottom' : ''}></td>
                          {forAllUser && <td className={expandedRows.includes(startIndex + index) ? 'no-border-bottom' : ''}></td>}
                        </tr>
                        {forAllUser &&
                          expandedRows.includes(startIndex + index) && (
                            <>
                              <td
                                colSpan={
                                  headerLabels.length + (showMerchants ? 5 : 3)
                                }
                              >
                                <div className="coloumn-width">
                                  No Sub-User Found{" "}
                                </div>
                              </td>
                            </>
                          )}
                      </React.Fragment>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td
                        colSpan={headerLabels.length + (showMerchants ? 3 : 2)}
                      >
                        <div>
                          <div className="search-result-head">
                            <div>
                              <h4>Oops...</h4>{" "}
                              <Oops className="primary-color-icon" />
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
                <select
                  id="noRows"
                  value={rowsPerPage}
                  onChange={this.handleRowsChange}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="table-footer-buttons-div">
                <p>
                  {`${startIndex + 1}-${Math.min(
                    endIndex,
                    dataToRender.length
                  )} of ${dataToRender.length}`}
                </p>
                <button
                  onClick={() => this.setState({ currentPage: 1 })}
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? "disabled-button" : ""}
                >
                  <LeftDoubleArrow />
                </button>
                <button
                  onClick={() => this.handlePageChange(-1)}
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? "disabled-button" : ""}
                >
                  <LeftSign />
                </button>
                <button
                  onClick={() => this.handlePageChange(1)}
                  disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages ? "disabled-button" : ""
                  }
                >
                  <RightSign />
                </button>
                <button
                  onClick={() => this.setState({ currentPage: totalPages })}
                  disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages ? "disabled-button" : ""
                  }
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
