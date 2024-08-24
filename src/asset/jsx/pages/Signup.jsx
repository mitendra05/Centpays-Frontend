import React, { Component } from "react";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";

// import component
import MessageBox from "../components/Message_box";
import Modal from "../components/Modal";

// import images
import fullLogo from "../../media/image/centpays_full_logo.png";
import tree1 from "../../media/image/bg-tree-1.png";
import tree2 from "../../media/image/bg-tree-2.png";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      messageType: "",
      isSignupSuccessful: false,
      // api states
      userName: "",
      userEmail: "",
      userMobile_no: "",
      userCountry: "",
      userCompany_name: "",
      userCompany_URL: "",
      userSocial_id: "",
      userPassword: "",
      userConfirm_password: "",
    };
  }

  handleInputChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleSignupSuccessModalToggle = (action) => {
    if (action === "open") {
      this.setState({ isSignupSuccessful: true });
    } else if (action === "close") {
      this.setState({ isSignupSuccessful: false }, () => {
        if (this.state.redirectToLogin) {
          this.props.history.push('/');
        }
      });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const {
      userName,
      userEmail,
      userMobile_no,
      userCountry,
      userCompany_name,
      userCompany_URL,
      userSocial_id,
      userPassword,
      userConfirm_password,
    } = this.state;

    if (userPassword !== userConfirm_password) {
      this.setState({
        errorMessage: "Passwords do not match. Please try again.",
        messageType: "Failed",
      });
      console.log("Passwords do not match.");
      return;
    }

    // Validate password format
    if (userPassword.length < 8) {
      this.setState({
        errorMessage: "Password must be at least 8 characters long.",
        messageType: "Failed",
      });
      console.log("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(userPassword)) {
      this.setState({
        errorMessage: "Password must contain at least one uppercase letter.",
        messageType: "Failed",
      });
      console.log("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[0-9]/.test(userPassword)) {
      this.setState({
        errorMessage: "Password must contain at least one digit.",
        messageType: "Failed",
      });
      console.log("Password must contain at least one digit.");
      return;
    }
    if (!/[!@#$%^&*]/.test(userPassword)) {
      this.setState({
        errorMessage: "Password must contain at least one special character.",
        messageType: "Failed",
      });
      console.log("Password must contain at least one special character.");
      return;
    }

    const requestBody = {
      name: userName,
      email: userEmail,
      mobile_no: userMobile_no,
      country: userCountry,
      password: userPassword,
      confirmPassword: userConfirm_password,
      company_name: userCompany_name,
      company_url: userCompany_URL,
      poc_id: userSocial_id,
    };

    console.log("Request Body:", requestBody);

    try {
      const response = await fetch(`${backendURL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        document.cookie = `signupEmail=${userEmail};path=/`;
        this.setState({
          userName: "",
          userEmail: "",
          userMobile_no: "",
          userCountry: "",
          userCompany_name: "",
          userCompany_URL: "",
          userSocial_id: "",
          userPassword: "",
          userConfirm_password: "",
          errorMessage: "",
          messageType: "",
          isSignupSuccessful: true,
        });
      } else {
        const errorData = await response.json();
        console.log("Error Data:", errorData);
        this.setState({
          errorMessage:
            errorData.message || "Error creating user. Please try again later.",
          messageType: "Failed",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "Failed",
      });
    }
  };

  render() {
    const { isSignupSuccessful, errorMessage, messageType } = this.state;
    return (
      <>
        {errorMessage && (
          <MessageBox
            message={errorMessage}
            messageType={messageType}
            onClose={() => this.setState({ errorMessage: "" })}
          />
        )}
        {isSignupSuccessful && (
          <Modal
            onClose={() => this.handleSignupSuccessModalToggle("close")}
            onDecline={() => this.handleSignupSuccessModalToggle("decline")}
            onAccept={() => this.handleSignupSuccessModalToggle("accept")}
            showFooter={false}
            modalHeading={"Congratulations! 🎉"}
            modalBody={
              <div className="auth-content loginsuccessful-modal">
                <h5 className="line-spacing">
                  Your Account has been set-up successfully.
                </h5>
                <button
                  className="btn-primary loginbutton-modal"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Login
                </button>
                <p className="p1 content-modal">
                  *Login to access your account
                </p>
              </div>
            }
          />
        )}

        <div id="auth">
          <div className="auth-bg-top"></div>
          <div className="auth-bg-bottom"></div>
          <img className="tree1" src={tree1} alt="tree"></img>
          <img className="tree2" src={tree2} alt="tree"></img>
          <div className="auth-container forsignup">
            <div className="auth-main-container ">
              <div className="auth-content">
                <div className="logo-container">
                  <img className="logo" src={fullLogo} alt="Centpays"></img>
                </div>
                <h4>Adventure starts here🚀</h4>
                <p className="p2">Make your payment management easy and fun!</p>
                <form onSubmit={this.handleSubmit}>
                  <div className="input-group-div">
                    <div className="input-group">
                      <input
                        type="text"
                        id="userName"
                        className="inputFeild auth-input"
                        required
                        value={this.state.userName}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="name" className="inputLabel">
                        Name
                      </label>
                    </div>
                    <div className="input-group">
                      <input
                        type="email"
                        id="userEmail"
                        className="inputFeild auth-input"
                        required
                        value={this.state.userEmail}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="password" className="inputLabel">
                        Email
                      </label>
                    </div>
                  </div>
                  <div className="input-group-div">
                    <div className="input-group">
                      <input
                        type="text"
                        id="userMobile_no"
                        className="inputFeild auth-input"
                        required
                        value={this.state.userMobile_no}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="mobile_no" className="inputLabel">
                        Mobile No
                      </label>
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        id="userCountry"
                        className="inputFeild auth-input"
                        required
                        value={this.state.userCountry}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="country" className="inputLabel">
                        Country
                      </label>
                    </div>
                  </div>

                  <div className="input-group-div">
                    <div className="input-group">
                      <input
                        type="text"
                        id="userCompany_name"
                        className="inputFeild auth-input"
                        required
                        value={this.state.userCompany_name}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="company_name" className="inputLabel">
                        Company Name
                      </label>
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        id="userCompany_URL"
                        className="inputFeild auth-input"
                        required
                        value={this.state.userCompany_URL}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="companyurl" className="inputLabel">
                        Company URL
                      </label>
                    </div>
                  </div>

                  <div className="input-group">
                    <input
                      type="text"
                      id="userSocial_id"
                      className="inputFeild auth-input"
                      required
                      value={this.state.userSocial_id}
                      onChange={this.handleInputChange}
                    />
                    <label htmlFor="country" className="inputLabel">
                      Skype/Telegram
                    </label>
                  </div>

                  <div className="input-group-div">
                    <div className="input-group">
                      <input
                        type="password"
                        id="userPassword"
                        className="inputFeild "
                        required
                        value={this.state.userPassword}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="password" className="inputLabel">
                        Password
                      </label>
                    </div>
                    <div className="input-group">
                      <input
                        type="password"
                        id="userConfirm_password"
                        className="inputFeild "
                        require
                        value={this.state.userConfirm_password}
                        onChange={this.handleInputChange}
                      />
                      <label htmlFor="confirm password" className="inputLabel">
                        Confirm Password
                      </label>
                    </div>
                  </div>

                  <div className="checkbox-container">
                    <div>
                      <input type="checkbox" required></input>
                      <label className="p2">
                        I agree to
                        <Link
                          to="/termsandcondition"
                          className="highlight-text"
                        >
                          privacy policy and terms
                        </Link>
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary auth-btn">
                    Sign Up
                  </button>

                  <p className="bottom-line">
                    Already have an account?
                    <Link to="/" className="highlight-text">
                      Sign in
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Signup;
