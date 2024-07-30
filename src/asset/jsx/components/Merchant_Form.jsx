import React, { Component } from "react";
import CryptoJS from 'crypto-js';

// component
import MessageBox from "./Message_box";
import Modal from "./Modal";

//SVG icons
import { LeftArrow, RightArrow, Reset, Close,Copy } from "../../media/icon/SVGicons";
import CustomTooltip from "./Custom-tooltip";

class MerchantForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.getCookie('token'),
      errorMessage: "",
      messageType: "",
      isAddMerchantPanelOpen: this.props.isAddMerchantPanelOpen,
      companyInfo: true,
      businessInfo: false,
      directorInfo: false,
      ...props.merchantData,
      isUpdate: false,
      showSecretKeyModal: false,
      rootAccountKey: ""
    };
  }

  componentDidUpdate(prevState) {
    if (
      prevState.isAddMerchantPanelOpen !== this.state.isAddMerchantPanelOpen
    ) {
      if (this.state.isAddMerchantPanelOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

  componentDidMount() {
    if (this.props.isAddMerchantPanelOpen) {
      document.body.style.overflow = "hidden";
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = "auto";
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleBack = () => {
    const { businessInfo, directorInfo } = this.state;
    if (businessInfo) {
      this.setState({ companyInfo: true, businessInfo: false }, () => {});
    } else if (directorInfo) {
      this.setState({ businessInfo: true, directorInfo: false }, () => {});
    }
  };

  handleReset = () => {
    const { companyInfo, businessInfo, directorInfo } = this.state;

    if (companyInfo) {
      this.setState({
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
      });
    } else if (businessInfo) {
      this.setState({
        business_type: "",
        business_category: "",
        business_subcategory: "",
        business_registered_on: "",
        merchant_pay_in: "",
        merchant_pay_out: "",
        turnover: "",
        website_url: "",
        settlement_charge: "",
        expected_chargeback_percentage: "",
      });
    } else if (directorInfo) {
      this.setState({
        director_first_name: "",
        director_last_name: "",
        skype_id: "",
      });
    }
  };

generateSignedToken = (clientId, role) => {
  const payload = { clientId, role };
  const payloadString = JSON.stringify(payload);
  const encrypted = CryptoJS.AES.encrypt(
    payloadString,
    process.env.REACT_APP_KEY_SECRET
  ).toString();
  let token = btoa(encrypted);
  token = token.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return token;
};

decodeSignedToken = (token) => {
  try {
    let decryptedString;
    if (/^[A-Za-z0-9]+$/.test(token)) {
      let base64Token = token.replace(/0/g, '+').replace(/1/g, '/');
      while (base64Token.length % 4) {
        base64Token += '=';
      }
      const encryptedString = atob(base64Token);
      const bytes = CryptoJS.AES.decrypt(encryptedString, process.env.REACT_APP_KEY_SECRET);
      decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    } else {
      const bytes = CryptoJS.AES.decrypt(token, process.env.REACT_APP_KEY_SECRET);
      decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    }

    const decryptedData = JSON.parse(decryptedString);
    return decryptedData;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
};


 handleSubmit = async (event) => {
  event.preventDefault();
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const { companyInfo, businessInfo, directorInfo, token } = this.state;

  const newData = {
    company_name: this.state.company_name,
    username: this.state.username,
    email: this.state.email,
    phone_number: this.state.phone_number,
    postal_code: this.state.postal_code,
    country: this.state.country,
    state: this.state.state,
    city: this.state.city,
    street_address: this.state.street_address,
    street_address2: this.state.street_address2,
    industries_id: this.state.industries_id,
    business_type: this.state.business_type,
    business_category: this.state.business_category,
    business_subcategory: this.state.business_subcategory,
    business_registered_on: this.state.business_registered_on,
    merchant_pay_in: this.state.merchant_pay_in,
    merchant_pay_out: this.state.merchant_pay_out,
    turnover: this.state.turnover,
    website_url: this.state.website_url,
    settlement_charge: this.state.settlement_charge,
    expected_chargeback_percentage: this.state.expected_chargeback_percentage,
    director_first_name: this.state.director_first_name,
    director_last_name: this.state.director_last_name,
    skype_id: this.state.skype_id,
  };
  const isUpdate = !!this.state._id;
  const url = isUpdate ? `${backendURL}/updateclient/` : `${backendURL}/clients`;
  const method = isUpdate ? "PATCH" : "POST";
  const data = isUpdate ? { id: this.state._id, ...newData } : newData;

  if (companyInfo) {
    this.setState({ companyInfo: false, businessInfo: true });
  } else if (businessInfo) {
    this.setState({ businessInfo: false, directorInfo: true });
  } else if (directorInfo) {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const client_data = await response.json();
        let rootAccountKey;
        if (!isUpdate) {
          console.log("id",client_data.client.client_id)
          rootAccountKey = this.generateSignedToken(client_data.client.client_id, 'merchant');
          this.setState({ showSecretKeyModal:true, rootAccountKey})
        }

        this.setState({
          isAddMerchantPanelOpen:false,

          showSecretKeyModal: !isUpdate,
          errorMessage: isUpdate
            ? "Data Updated Successfully"
            : "Data Submitted Successfully",
          messageType: "success",
          companyInfo: true,
          businessInfo: false,
          directorInfo: false,
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
          business_registered_on: "",
          merchant_pay_in: "",
          merchant_pay_out: "",
          turnover: "",
          website_url: "",
          settlement_charge: "",
          expected_chargeback_percentage: "",
          director_first_name: "",
          director_last_name: "",
          skype_id: "",
        });
        
        if (isUpdate) {
          this.props.refreshMerchantData();
        }
      } else {
        const errorData = await response.json();
        this.setState({
          errorMessage: errorData.message || "Please fill all the fields",
          messageType: "fail",
        });
      }
    } catch (error) {
      this.setState({
        errorMessage: "Error submitting data",
        messageType: "fail",
      });
      console.error(error);
    }
  }
};

  secretKeyModalClose = () => {
    this.setState({ showSecretKeyModal: false });
  };

  copyKeyToClipboard = () => {
    navigator.clipboard.writeText(this.state.rootAccountKey)
      .then(() => {
        this.setState({errorMessage:"copied!"});
      })
      .catch(err => {
        this.setState({errorMessage:"Fail to copied!"})
      });
      this.setState({ showSecretKeyModal: false });

  };

  maskString = (number) => {
    const numStr = String(number);
    if (numStr.length > 12) {
      const stars = "*".repeat(numStr.length - 12);
      return `${numStr.slice(0, 6)}${stars}${numStr.slice(-6)}`;
    }
    return numStr;
  };
  
  render() {
    const { handleAddMerchant, submitButtonText, heading,isDisable} = this.props;
    const { errorMessage, messageType, showSecretKeyModal, rootAccountKey } = this.state;

    return (
      <>
        {errorMessage && (
          <MessageBox
            message={errorMessage}
            messageType={messageType}
            onClose={() => this.setState({ errorMessage: "" })}
          />
        )}

        {showSecretKeyModal && (
           <Modal
           onClose={() => this.secretKeyModalClose()}
           onDecline={() => this.secretKeyModalClose()}
           showDeclinebtn={false}
           showFotter={true}
           onAccept={() => this.copyKeyToClipboard()}
           modalHeading={"Secret Key 📝"}
           acceptbtnname={"Copy"}
           modalBody={
             <div>
              <h5 className="secretkey-head">Merchant Root Account Signup Key</h5>
               <p className="p2 secret-key">{this.maskString(rootAccountKey)}</p>
             </div>
           }
         />
       )}

       {this.state.isAddMerchantPanelOpen && (<><div className="overlay"></div>
        <div className="sendPanel">
          <div className="sendPanel-header">
            {" "}
            <h5>{heading || "Add New Merchant"}</h5>
            <Close
              className="icon"
              onClick={() => handleAddMerchant(false)}
            ></Close>
          </div>
          <div className="sendPanel-body add-merchant-body">
            {this.state.companyInfo && (
              <div className="add-merchant-form">
                <p className="p2">Company Info</p>
                <form onSubmit={this.handleSubmit}>
                  <div className="add-merchant-form-top">
                    <div className="input-group add-merchant-input-group">
                      {isDisable ? (
                        <input
                          type="text"
                          id="company_name"
                          className="inputFeild add-merchant-input"
                          value={this.state.company_name}
                          onChange={this.handleInputChange}
                          disabled
                        />
                      ) : (
                        <input
                          type="text"
                          id="company_name"
                          className="inputFeild add-merchant-input"
                          value={this.state.company_name}
                          onChange={this.handleInputChange}
                        />
                      )}
                      <label htmlFor="company_name" className="inputLabel">
                        Company Name
                      </label>

                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="username"
                        className="inputFeild add-merchant-input"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="userName" className="inputLabel">
                        Username
                      </label>
                    </div>

                    <div className="input-group add-merchant-input-group">
                      <input
                        type="email"
                        id="email"
                        className="inputFeild add-merchant-input"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="password" className="inputLabel">
                        Email
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="phone_number"
                        className="inputFeild add-merchant-input"
                        value={this.state.phone_number}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="phoneNo" className="inputLabel">
                        Phone Number
                      </label>
                    </div>

                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="postal_code"
                        className="inputFeild add-merchant-input"
                        value={this.state.postal_code}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="postalCode" className="inputLabel">
                        Postal Code
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="country"
                        className="inputFeild add-merchant-input"
                        value={this.state.country}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="country" className="inputLabel">
                        Country/Region
                      </label>
                    </div>

                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="state"
                        className="inputFeild add-merchant-input"
                        value={this.state.state}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="state" className="inputLabel">
                        State
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="city"
                        className="inputFeild add-merchant-input"
                        value={this.state.city}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="city" className="inputLabel">
                        City
                      </label>
                    </div>

                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="street_address"
                        className="inputFeild add-merchant-input"
                        value={this.state.street_address}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="streetadd1" className="inputLabel">
                        Street Address
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="street_address2"
                        className="inputFeild add-merchant-input"
                        value={this.state.street_address2}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="streetadd2" className="inputLabel">
                        Street Address 2
                      </label>
                    </div>

                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="industries_id"
                        className="inputFeild add-merchant-input"
                        value={this.state.industries_id}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="industriesId" className="inputLabel">
                        Industries Id
                      </label>
                    </div>
                  </div>
                  <div className="add-merchant-form-bottom">
                    <CustomTooltip title="Reset" topMargin={-70}>
                      <button
                        className="add-merchant-panel-btn"
                        onClick={this.handleReset}
                      >
                        <Reset />
                      </button>
                    </CustomTooltip>
                    <CustomTooltip title="Next" topMargin={-70}>
                      <button type="submit" className="add-merchant-panel-btn">
                        <RightArrow />
                      </button>
                    </CustomTooltip>
                  </div>
                </form>
              </div>
            )}
            {/* {/ Business Info /} */}
            {this.state.businessInfo && (
              <div className="add-merchant-form">
                <p className="p2">Business Info</p>
                <form onSubmit={this.handleSubmit}>
                  <div className="add-merchant-form-top">
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="business_type"
                        className="inputFeild add-merchant-input"
                        value={this.state.business_type}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="businessType" className="inputLabel">
                        Business Type
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="business_category"
                        className="inputFeild add-merchant-input"
                        value={this.state.business_category}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="businessCategory" className="inputLabel">
                        Business Category
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="business_subcategory"
                        className="inputFeild add-merchant-input"
                        value={this.state.business_subcategory}
                        onChange={this.handleInputChange}
                      />
                      <label
                        htmlFor="businessSubcategory"
                        className="inputLabel"
                      >
                        Business Subcategory
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="date"
                        id="business_registered_on"
                        className="inputFeild add-merchant-input"
                        value={this.state.business_registered_on}
                        onChange={this.handleInputChange}
                      />
                      <label
                        htmlFor="businnesRegisteredOn"
                        className="inputLabel"
                      >
                        Business Registered On
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="merchant_pay_in"
                        className="inputFeild add-merchant-input"
                        value={this.state.merchant_pay_in}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="merchantPayin" className="inputLabel">
                        Merchant Pay In
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="merchant_pay_out"
                        className="inputFeild add-merchant-input"
                        value={this.state.merchant_pay_out}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="merchantPayout" className="inputLabel">
                        Merchant Pay Out
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="turnover"
                        className="inputFeild add-merchant-input"
                        value={this.state.turnover}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="turnover" className="inputLabel">
                        Turnover
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="website_url"
                        className="inputFeild add-merchant-input"
                        value={this.state.website_url}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="websiteURL" className="inputLabel">
                        Website URL
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="settlement_charge"
                        className="inputFeild add-merchant-input"
                        value={this.state.settlement_charge}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="settlementCharge" className="inputLabel">
                        Settlement Charge
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="expected_chargeback_percentage"
                        className="inputFeild add-merchant-input"
                        value={this.state.expected_chargeback_percentage}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="chargebackPercent" className="inputLabel">
                        Expected Chargeback Percentage
                      </label>
                    </div>
                  </div>
                  <div className="add-merchant-form-bottom">
                    <CustomTooltip title="Reset" topMargin={-70}>
                      <button
                        className="add-merchant-panel-btn"
                        onClick={this.handleReset}
                      >
                        <Reset />
                      </button>
                    </CustomTooltip>
                    <CustomTooltip title="Previous" topMargin={-70}>
                      <button
                        className="add-merchant-panel-btn"
                        onClick={this.handleBack}
                      >
                        <LeftArrow />
                      </button>
                    </CustomTooltip>
                    <CustomTooltip title="Next" topMargin={-70}>
                      <button type="submit" className="add-merchant-panel-btn">
                        <RightArrow />
                      </button>
                    </CustomTooltip>
                  </div>
                </form>
              </div>
            )}

            {/*Director Info */}
            {this.state.directorInfo && (
              <div className="add-merchant-form">
                <p className="p2">Director Info</p>
                <form onSubmit={this.handleSubmit}>
                  <div className="add-merchant-form-top">
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="director_first_name"
                        className="inputFeild add-merchant-input"
                        value={this.state.director_first_name}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="firstName" className="inputLabel">
                        First Name
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="director_last_name"
                        className="inputFeild add-merchant-input"
                        value={this.state.director_last_name}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="lastName" className="inputLabel">
                        Last Name
                      </label>
                    </div>
                    <div className="input-group add-merchant-input-group">
                      <input
                        type="text"
                        id="skype_id"
                        className="inputFeild add-merchant-input"
                        value={this.state.skype_id}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="skype" className="inputLabel">
                        Skype Id
                      </label>
                    </div>
                  </div>
                  <div className="add-merchant-form-bottom">
                    <CustomTooltip title="Reset" topMargin={-70}>
                      <button
                        className="add-merchant-panel-btn"
                        onClick={this.handleReset}
                      >
                        <Reset />
                      </button>
                    </CustomTooltip>
                    <CustomTooltip title="Previous" topMargin={-70}>
                      <button
                        className="add-merchant-panel-btn"
                        onClick={this.handleBack}
                      >
                        <LeftArrow />
                      </button>
                    </CustomTooltip>
                    <button type="submit" className="btn-primary">
                      {submitButtonText || "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div></>)}

      </>
    );
  }
}

export default MerchantForm;
