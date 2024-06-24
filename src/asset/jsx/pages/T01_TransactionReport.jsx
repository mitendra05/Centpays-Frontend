import React, { Component } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

class TransactionReport extends Component {
  constructor(props) {
    super(props);
    this.state = {sidebaropen: true,};
  }

  render() {
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
            <div className="main-screen-rows report-first-row">
            <div className="row-cards settlement-card"></div>
            </div>
        </div>
      </>
    );
  }
}

export default TransactionReport;
