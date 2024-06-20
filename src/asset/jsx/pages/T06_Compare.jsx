import React, { Component } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";


class Compare extends Component {
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
            <h1>Compare</h1>
        </div>
       
      </>
    );
  }
}

export default Compare;
