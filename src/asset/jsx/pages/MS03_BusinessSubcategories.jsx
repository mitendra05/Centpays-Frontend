import React, { Component } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

class BusinessSubcategory extends Component {
  constructor(props) {
    super(props);
    this.state = {sidebaropen: true,}; }

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
           <h1>Business Sub Category</h1>
        </div>
        
      </>
    );
  }
}

export default BusinessSubcategory;
