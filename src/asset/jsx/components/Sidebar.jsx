import React, { Component } from "react";
import { Link } from "react-router-dom";
import company_logo from "../../media/image/centpays_full_logo.png";
import {
  CircleRing,
  Dashboard,
  MasterSettings,
  ManageMerchant,
  APIdoc,
  PaymentGateway,
  ManageUser,
  TransactionMonitoring,
  TransactionReport,
  DownSign,
  RightSign,
  TestApi,
} from "../../media/icon/SVGicons";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      userRole: this.getCookie("role"),
      userStatus: this.getCookie("status"),
      companyName: this.getCookie("company_name"),
      menuOpen: {
        masterSetting: false,
        manageMerchant: false,
        manageUser: false,
        transactionReport: false,
        finance: false,
        myprofile: false,
        testApi: false,
        dashboard: true,
      },
    };
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  handleMenuClick = (menuItem) => {
    this.setState((prevState) => ({
      menuOpen: {
        ...prevState.menuOpen,
        [menuItem]: !prevState.menuOpen[menuItem],
      },
    }));
  };

  isActiveMenuItem = (path, text, hasSubMenu) => {
    const currentPath = window.location.pathname;
    const { companyName } = this.state;

    if (
      (path === "/allmerchant" &&
        (currentPath === "/allmerchant" ||
          currentPath.includes(`/viewmerchant/${companyName}`))) ||
      (path === "/alluser" &&
        (currentPath === "/alluser" ||
          currentPath.includes(`/viewuser/${companyName}`)))
    ) {
      return (
        <p>
          {text}
          {!hasSubMenu && <i style={{ color: "red" }}>*</i>}
        </p>
      );
    }
    return (
      <p>
        {text}
        {!hasSubMenu && <i style={{ color: "red" }}>*</i>}
      </p>
    );
  };

  renderMenuItem = (path, icon, text, menuItem, subMenuItems, disabled) => {
    const { menuOpen } = this.state;
    const isActive =
      window.location.pathname === path ||
      (path === "/allmerchant" &&
        window.location.pathname.includes("/viewmerchant/")) ||
      (path === "/alluser" && window.location.pathname.includes("/viewuser/"));

    const shouldLink = path && !subMenuItems;

    return (
      <li key={text} className={disabled ? "disabled-menu-item" : ""}>
        <div
          className={`menu-item ${isActive ? "sidebaractive" : ""} ${
            disabled ? "menu-item-disabled" : ""
          }`}
        >
          {icon}
          <div
            className="menu-item-collapsive"
            onClick={() => {
              if (menuItem && !disabled) {
                this.handleMenuClick(menuItem);
              }
            }}
          >
            {shouldLink ? (
              <Link to={path}>
                {this.isActiveMenuItem(path, text, !!subMenuItems)}
              </Link>
            ) : (
              <p>{this.isActiveMenuItem(path, text, !!subMenuItems)}</p>
            )}
            {subMenuItems &&
              (menuOpen[menuItem] ? (
                <DownSign className="icon" />
              ) : (
                <RightSign className="icon" />
              ))}
          </div>
        </div>
        {menuOpen[menuItem] && subMenuItems && (
          <ul className="sub-menu">
            {subMenuItems.map((subItem) => (
              <li key={subItem.path}>
                <Link to={subItem.path}>
                  <p>{subItem.text}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  render() {
    const { sidebaropen, userRole, companyName,userStatus} = this.state;
    const isProfileVisible = userRole === 'Merchant' && userStatus === 'Pending';
    const blurClass = isProfileVisible ? 'blur-effect' : '';

    const adminMenuItems = [
      {
        path: "/dashboard",
        icon: <Dashboard className="icon menu-item-icon-color" />,
        text: "Dashboard",
      },
      {
        path: "/masterSetting",
        icon: <MasterSettings className="icon menu-item-icon-color" />,
        text: "Master Setting",
        menuItem: "masterSetting",
        disabled: true, // Disable this item
        subMenuItems: [
          { path: "/businesstype", text: "Business Types" },
          { path: "/categories", text: "Categories" },
          { path: "/businesssubcategories", text: "Business Sub Categories" },
          { path: "/managecurrencies", text: "Manage Currencies" },
          { path: "/documenttype", text: "Document Types" },
          { path: "/documentcategory", text: "Document Categories" },
          { path: "/bank", text: "Banks" },
        ],
      },
      {
        path: "/allmerchant",
        icon: <ManageMerchant className="icon menu-item-icon-color" />,
        text: "Manage Merchant",
        menuItem: "manageMerchant",
      },
      {
        icon: <APIdoc className="icon menu-item-icon-color" />,
        text: "Manage API Doc",
      },
      {
        icon: <PaymentGateway className="icon menu-item-icon-color" />,
        text: "Payment Gateway",
      },
      {
        path: "/alluser",
        icon: <ManageUser className="icon menu-item-icon-color" />,
        text: "Manage User",
        menuItem: "manageUser",
      },
      {
        path: "/transactionmonitoring",
        icon: <TransactionMonitoring className="icon menu-item-icon-color" />,
        text: "Transaction Monitoring",
      },
      {
        path: "/transactionReport",
        icon: <TransactionReport className="icon menu-item-icon-color" />,
        text: "Transaction Report",
        disabled: true,
        menuItem: "transactionReport",
        subMenuItems: [
          { path: "/transactionreport", text: "Transaction Report" },
          { path: "/tempreport", text: "Temp Report" },
          { path: "/tempureport", text: "Temp Unique Order Report" },
          { path: "/tempcreport", text: "Temp Common Order Report" },
          { path: "/payoutreport", text: "Payout Report" },
          { path: "/compare", text: "Compare" },
        ],
      },
      {
        path: "/finance",
        icon: <TransactionReport className="icon menu-item-icon-color" />,
        text: "Finance",
        menuItem: "finance",
        subMenuItems: [
          { path: "/settlements", text: "Merchant Settlement" },
          { path: "/banksettle", text: "Bank Settlement" },
          { path: "/compare", text: "Reconcile" },
          { path: "/livereport", text: "Live Report" },
        ],
      },
      {
        path: "/acquirertestingenv",
        icon: <Dashboard className="icon menu-item-icon-color" />,
        text: "Quick Pay",
      },
    ];

    const merchantMenuItems = [
      {
        path: "/dashboard",
        icon: <Dashboard className="icon menu-item-icon-color" />,
        text: "Dashboard",
      },
      {
        path: "/transactionmonitoring",
        icon: <TransactionMonitoring className="icon menu-item-icon-color" />,
        text: "Transaction Monitoring",
      },
      {
        path: "/finance",
        icon: <TransactionReport className="icon menu-item-icon-color" />,
        text: "Finance",
        menuItem: "finance",
        subMenuItems: [
          {
            path: `/previewsettlement/${companyName}`,
            text: "Settlement Report",
          },
          { path: "/settlements", text: "Settlement Invoice" },
        ],
      },
      {
        path: "/settings",
        icon: <ManageMerchant className="icon menu-item-icon-color" />,
        text: "Your Profile",
        menuItem: "myprofile",
        subMenuItems: [
          { path: "/settings", text: "Settings" },
          { path: `/viewmerchant/${companyName}`, text: "Manage User Login" },
        ],
      },
      {
        path: "/acquirertestingenv",
        icon: <Dashboard className="icon menu-item-icon-color" />,
        text: "Quick Pay",
      },
      {
        path: "/testapi",
        icon: <TestApi className="icon menu-item-icon-color" />,
        text: "Test Api",
        menuItem: "testApi",
        subMenuItems: [
          { path: "/refundreq", text: "Refund Req" },
          { path: `/checkstatus/${companyName}`, text: "Check Status" },
          { path: "/yourdetails", text: "Your Details" },
        ],
      },
      {
        path: "/apidoc",
        icon: <APIdoc className="icon menu-item-icon-color" />,
        text: "Centpays API Doc",
        disabled: true,
      },
    ];

    const menuItems = userRole === "admin" ? adminMenuItems : merchantMenuItems;

    return (
      <div
        className={`sidebar ${
          sidebaropen ? "expanded-sidebar" : "collapsed-sidebar"
        }`}
      >
        <div className="sidebar-container">
          <div className="sidebar-header">
            <img src={company_logo} alt="Centpays Company Logo" />
            <input type="radio" />
          </div>
          <div className="sidebar-middle">
            <ul>
              {menuItems.map((item) =>
                this.renderMenuItem(
                  item.path,
                  item.icon,
                  item.text,
                  item.menuItem,
                  item.subMenuItems,
                  item.disabled
                )
              )}
            </ul>
          </div>
          <div className="sidebar-footer"></div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
