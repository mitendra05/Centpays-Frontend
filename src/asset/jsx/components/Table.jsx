import React, { Component } from "react";
import * as XLSX from "xlsx";

// SVG icons
import {
  DownSign,
  RightSign,
  UpSign,
  LeftSign,
  RightDoubleArrow,
  LeftDoubleArrow,
  Ascending,
  Descending,
  ExportIcon,
  DoubleTick,
  MailStatus,
} from "../../media/icon/SVGicons";

import visa from "../../media/icon/logoVisa.png";
import mastercard from "../../media/icon/LogoMastercard.png";
import CopyToClipboard from "./CopyToClipboard";
import ScrollTopAndBottomButton from "../../jsx/components/ScrollUpAndDown";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRows: [],
      currentPage: 1,
      rowsPerPage: 10,
      isDescending: true,
      sortedData: props.dataToRender,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dataToRender !== this.props.dataToRender) {
      this.setState({ expandedRows: [], sortedData: this.props.dataToRender });
    }
  }

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

  getStatusText(status) {
    const statusClass =
      status === "Success"
        ? "success-status"
        : status === "Failed"
        ? "failed-status"
        : "incompleted-status";
    return (
      <div className={`status-div ${statusClass}`}>
        <p>{status}</p>
      </div>
    );
  }

  getCardImage(cardType) {
    if (cardType === "Visa")
      return <img className="cardtype-img" src={visa} alt="visa" />;
    if (cardType === "Mastercard")
      return <img className="cardtype-img" src={mastercard} alt="mastercard" />;
    return null;
  }

  handlePageChange = (direction) => {
    this.setState((prevState) => {
      const { currentPage } = prevState;
      const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;

      return { currentPage: newPage };
    });
  };

  handleRowsPerPageChange = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value),
      currentPage: 1,
    });
  };

  sortData = () => {
    const { isDescending, sortedData } = this.state;
    const newSortedData = [...sortedData].sort((a, b) => {
      const dateA = new Date(a.transactiondate);
      const dateB = new Date(b.transactiondate);
      return isDescending ? dateA - dateB : dateB - dateA; // Toggle sorting
    });

    this.setState({ sortedData: newSortedData, isDescending: !isDescending });
  };

  exportData = () => {
    const { dataToRender } = this.props;

    // Extract only the specified fields
    const extractedFields = dataToRender.map((item) => {
      const {
        txnid,
        merchantTxnId,
        merchant,
        amount,
        merchant_id,
        transactiondate,
        Status,
        email,
        currency,
        mode,
        paymentgateway,
        message,
        requested_phone,
        orderNo,
        cname,
        cardtype,
        cardnumber,
        country,
      } = item;
      return {
        txnid,
        merchantTxnId,
        merchant,
        amount,
        merchant_id,
        transactiondate,
        Status,
        email,
        currency,
        mode,
        paymentgateway,
        message,
        requested_phone,
        orderNo,
        cname,
        cardtype,
        cardnumber,
        country,
      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(extractedFields);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction Details");

    XLSX.writeFile(workbook, "Transaction_Details.xlsx");
  };

  render() {
    const { headerLabels, onViewClick, shouldRenderRightSign } = this.props;
    const { expandedRows, currentPage, rowsPerPage, sortedData, isDescending } =
      this.state;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = sortedData.slice(startIndex, startIndex + rowsPerPage);

    const totalRows = sortedData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const totalAmountCurrentPage = currentData.reduce(
      (sum, row) => sum + parseFloat(row.amount || 0),
      0
    );
    const totalAmountAllPages = sortedData.reduce(
      (sum, row) => sum + parseFloat(row.amount || 0),
      0
    );
    const shouldShowTotal = totalPages === 1 || currentPage === totalPages;

    return (
      <div className="txn-search-table-container">
        <div className="table-Header table-head-btn">
          <button className="btn-primary" onClick={this.exportData}>
            <ExportIcon className="white-icon" />
            <p>Export</p>
          </button>
          {totalRows > 1 && (
            <div>
              {isDescending ? (
                <div className="ascndicon2">
                  <Descending
                    className="ascndicon"
                    width="30"
                    height="30"
                    onClick={this.sortData}
                  />
                </div>
              ) : (
                <div className="ascndicon2">
                  <Ascending
                    className="ascndicon"
                    width="30"
                    height="30"
                    onClick={this.sortData}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="txn-search-table-Body">
          <ScrollTopAndBottomButton />
          <table>
            <thead>
              <tr>
                <th></th>
                <th className="p1">S.No.</th>
                {headerLabels.slice(0, 7).map((item, index) => (
                  <th className="p1" key={index}>
                    {item.heading}
                  </th>
                ))}
                <th></th>
                {shouldRenderRightSign && <th></th>}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) => (
                <React.Fragment key={startIndex + index}>
                  <tr className="p2">
                    <td onClick={() => this.toggleRow(startIndex + index)}>
                      {expandedRows.includes(startIndex + index) ? (
                        <UpSign className="icon2" />
                      ) : (
                        <DownSign className="icon2" />
                      )}
                    </td>
                    <td>{startIndex + index + 1}</td>
                    {headerLabels.slice(0, 7).map((collabel, labelIndex) => (
                      <td key={labelIndex}>
                        {collabel.id === 1 || collabel.id === 2 ? (
                          <CopyToClipboard text={row[collabel.label]} />
                        ) : collabel.id === 5 ? (
                          this.getStatusText(row[collabel.label])
                        ) : collabel.label === "isBankSettled" ? (
                          row[collabel.label] === 0 ? (
                            <DoubleTick className="creditcard-img green-icon" />
                          ) : (
                            <MailStatus className="creditcard-img primary-color-icon" />
                          )
                        ) : collabel.label === "paymentgateway" &&
                          row[collabel.label].length > 7 ? (
                          <div className="word-wrap">{row[collabel.label]}</div>
                        ) : (
                          row[collabel.label]
                        )}
                      </td>
                    ))}
                    {shouldRenderRightSign && (
                      <td onClick={() => onViewClick(row)}>
                        <RightSign className="icon2" />
                      </td>
                    )}
                    {shouldRenderRightSign && <td></td>}
                  </tr>
                  {expandedRows.includes(startIndex + index) && (
                    <tr className="p2">
                      <td colSpan={headerLabels.length + 3}>
                        <div className="txn-search-table-collapsible-row">
                          {headerLabels.slice(7).map((collabel) => (
                            <div key={collabel.id}>
                              <div className="collapsible-row-div">
                                <div className="collapsible-row-head">{`${collabel.heading}:`}</div>
                                <div className="collapsible-row-value">
                                  {collabel.id === 15 ? (
                                    this.getCardImage(row[collabel.label])
                                  ) : collabel.label === "isBankSettled" ? (
                                    row[collabel.label] === 0 ? (
                                      <DoubleTick className="creditcard-img green-icon" />
                                    ) : (
                                      <MailStatus className="creditcard-img primary-color-icon" />
                                    )
                                  ) : collabel.label === "paymentgateway" &&
                                    row[collabel.label].length > 7 ? (
                                    <div className="word-wrap">
                                      {row[collabel.label]}
                                    </div>
                                  ) : (
                                    row[collabel.label]
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

              <tr className="p2 total-amount-row">
                <td className="txn-amount-blank" colSpan={4}></td>
                <td className="txn-amount-head" colSpan={4}>
                  Subtotal
                </td>
                <td className="txn-amount-value">
                  {totalAmountCurrentPage.toFixed(2)}
                </td>
              </tr>
              {shouldShowTotal && (
                <tr className="p2 total-amount-row">
                  <td className="txn-amount-blank" colSpan={4}></td>
                  <td className="txn-amount-head" colSpan={4}>
                    Total
                  </td>
                  <td className="txn-amount-value">
                    {totalAmountAllPages.toFixed(2)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-Footer txn-search-table-Footer">
          <div className="table-footer-rows-div">
            <label htmlFor="noRows">Rows per page</label>
            <select
              id="noRows"
              value={rowsPerPage}
              onChange={this.handleRowsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="table-footer-buttons-div">
            <p>{`${startIndex + 1}-${Math.min(
              startIndex + rowsPerPage,
              totalRows
            )} of ${totalRows}`}</p>
            <button
              onClick={() => this.setState({ currentPage: 1 })}
              disabled={currentPage === 1}
              className={currentPage === 1 ? "disabled-button" : ""}
            >
              <LeftDoubleArrow />
            </button>
            <button
              onClick={() => this.handlePageChange("prev")}
              disabled={currentPage === 1}
              className={currentPage === 1 ? "disabled-button" : ""}
            >
              <LeftSign />
            </button>
            <button
              onClick={() => this.handlePageChange("next")}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "disabled-button" : ""}
            >
              <RightSign />
            </button>
            <button
              onClick={() => this.setState({ currentPage: totalPages })}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "disabled-button" : ""}
            >
              <RightDoubleArrow />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
