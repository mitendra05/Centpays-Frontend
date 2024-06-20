import React, { Component } from "react";

//SVG icons
import { DownSign, RightSign, UpSign, LeftSign } from "../../media/icon/SVGicons";

import visa from "../../media/icon/logoVisa.png";
import mastercard from "../../media/icon/LogoMastercard.png"
import CopyToClipboard from "./CopyToClipboard";
import ScrollTableToBottomButton from "../components/ScrollTableToBottom";
import ScrollTableToTopButton from "../components/ScrollTableToTop";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem("token"),
      expandedRows: [],
      viewTransaction: false,
      currentPage: 1,
      rowsPerPage: 10,
      showTotalAmount: false,
    };
  }

  toggleRow = (id) => {
    this.setState((prevState) => {
      const { expandedRows } = prevState;
      return {
        expandedRows: expandedRows.includes(id)
          ? expandedRows.filter((rowId) => rowId !== id)
          : [...expandedRows, id]
      };
    });
  };

  getStatusText(status) {
    switch (status) {
      case "Success":
        return (
          <div className="status-div success-status">
            <p>Success</p>
          </div>
        );
      case "Failed":
        return (
          <div className="status-div failed-status">
            <p>Failed</p>
          </div>
        );
      default:
        return (
          <div className="status-div incompleted-status">
            <p>Incompleted</p>
          </div>
        );
    }
  }

  getCardImage(cardtype) {
    switch (cardtype) {
      case "Visa":
        return (
          <img className="cardtype-img" src={visa} alt="visa"></img>
        );
      case "Mastercard":
        return (
          <img className="cardtype-img" src={mastercard} alt="mastercard"></img>
        );
      default:
        return (
          <></>
        );
    }
  }

  handlePageChange = (direction) => {
    this.setState((prevState) => {
      const { currentPage } = prevState;
      const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
      return { currentPage: newPage };
    }, () => {
      const { currentPage, rowsPerPage } = this.state;
      const { dataToRender } = this.props;
      const totalRows = dataToRender.length;
      const totalPages = Math.ceil(totalRows / rowsPerPage);

      this.setState({
        showTotalAmount: currentPage === totalPages
      });
    });
  };

  handleRowsPerPageChange = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value), currentPage: 1, showTotalAmount: false });
  };

  render() {
    const { headerLabels, dataToRender, onViewClick } = this.props;
    const { expandedRows, currentPage, rowsPerPage, showTotalAmount } = this.state;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = dataToRender.slice(startIndex, endIndex);

    const totalRows = dataToRender.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const totalAmountCurrentPage = currentData.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0);
    const totalAmountAllPages = dataToRender.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0);

    return (
      <>
        <div className="txn-search-table-container">
          <div className="txn-search-table-Body">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th className="p1">S.No.</th>
                  {headerLabels.slice(0, 7).map((item, index) => (
                    <th className="p1" key={index}>{item.heading}</th>
                  ))}
                  <th>{<ScrollTableToBottomButton/>}</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, index) => (
                  <React.Fragment key={startIndex + index}>
                    <tr className="p2">
                      <td onClick={() => this.toggleRow(startIndex + index)}>
                        {expandedRows.includes(startIndex + index) ? <UpSign className="icon2" /> : <DownSign className="icon2" />}
                      </td>
                      <td>{startIndex + index + 1}</td>
                      {headerLabels.slice(0, 7).map((collabel, labelIndex) => (
                        <td key={labelIndex}>
                          {collabel.id === 1 || collabel.id === 2 ? (
                        <CopyToClipboard text={row[collabel.label]} />
                      ) : (
                        collabel.id === 5
                          ? this.getStatusText(row[collabel.label])
                          : row[collabel.label]
                      )}
                    </td>
                      ))}
                      <td onClick={() => onViewClick(row)}>
                        <RightSign className="icon2" />
                      </td>
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
                                    {collabel.id === 15
                                      ? this.getCardImage(row[collabel.label])
                                      : row[collabel.label]}
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
                <ScrollTableToTopButton/>
                <tr className="p2 total-amount-row">
                  <td className="txn-amount-blank" colSpan={4}></td>
                  <td className="txn-amount-head" colSpan={4}>Subtotal</td>
                  <td className="txn-amount-value">{totalAmountCurrentPage.toFixed(2)}</td>
                </tr>
                {showTotalAmount && (
                         <tr className="p2 total-amount-row">
                         <td className="txn-amount-blank" colSpan={4}></td>
                         <td className="txn-amount-head" colSpan={4}>Total</td>
                         <td className="txn-amount-value">{totalAmountAllPages.toFixed(2)}</td>
                       </tr>
                      )}
              </tbody>
            </table>
          </div>
          <div className="table-Footer txn-search-table-Footer">
            <div className="table-footer-rows-div">
              <label htmlFor="noRows">Rows per page</label>
              <select id="noRows" value={rowsPerPage} onChange={this.handleRowsPerPageChange}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="table-footer-buttons-div">
              <p>
                {`${startIndex + 1}-${Math.min(endIndex, dataToRender.length)} of ${dataToRender.length}`}
              </p>
              <button onClick={() => this.handlePageChange('prev')} disabled={currentPage === 1}>
                <LeftSign />
              </button>
              <button onClick={() => this.handlePageChange('next')} disabled={currentPage === totalPages}>
                <RightSign />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Table;

