import React, { Component } from "react";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";

// import component
// import MessageBox from "../components/Message_box";
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
      isSignupSuccessful: false,
      // api states
      userName: "",
      userEmail: "",
      userMobile_no: "",
      userCountry: "",
      userPassword: "",
      userConfirm_password: "",
      userSignupKey: "",
    };
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  // decodeSignedToken = (token) => {
  //   try {
  //     const bytes = CryptoJS.AES.decrypt(
  //       token,
  //       process.env.REACT_APP_KEY_SECRET
  //     );
  //     const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  //     return decryptedData;
  //   } catch (error) {
  //     console.error("Error decoding token:", error.message);
  //     return null;
  //   }
  // };

  decodeSignedToken = (token) => {
    try {
      let decryptedString;
  
      if (/^[A-Za-z0-9_-]+$/.test(token)) {
        let base64Token = token.replace(/-/g, '+').replace(/_/g, '/');
        while (base64Token.length % 4 !== 0) {
          base64Token += '=';
        }
  
        const encryptedString = atob(base64Token);
        const bytes = CryptoJS.AES.decrypt(encryptedString, process.env.REACT_APP_KEY_SECRET);
        decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      } else {
        const bytes = CryptoJS.AES.decrypt(token, process.env.REACT_APP_KEY_SECRET);
        decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      }
  
      if (!decryptedString) {
        console.error("Decrypted string is empty or undefined.");
        console.log("Token:", token);
        return null;
      }
  
      console.log("Decrypted String:", decryptedString); // Debugging output
      try {
        const decryptedData = JSON.parse(decryptedString);
        return decryptedData;
      } catch (jsonError) {
        console.error("Error parsing decrypted string as JSON:", jsonError.message);
        return null;
      }
    } catch (error) {
      console.error("General error decoding token:", error.message);
      return null;
    }
  };
  

  // handleSubmit = async (e) => {
  //   const backendURL = process.env.REACT_APP_BACKEND_URL;
  //   e.preventDefault();
  //   const {
  //     userName,
  //     userEmail,
  //     userMobile_no,
  //     userCountry,
  //     userPassword,
  //     userConfirm_password,
  //     userSignupKey,
  //   } = this.state;
  //   console.log("signup key", userSignupKey);
  //   const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

  //   if (!passwordRegex.test(userPassword)) {
  //     this.setState({
  //       errorMessage:
  //         "Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character.",
  //       messageType: "Failed",
  //     });
  //     return;
  //   }
  //   const signupKey = this.decodeSignedToken(
  //     userSignupKey,
  //     process.env.REACT_APP_KEY_SECRET
  //   );
  //   console.log("decoded key", signupKey);
  //   try {
  //     const response = await fetch(`${backendURL}/signup`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: userName,
  //         email: userEmail,
  //         mobile_no: userMobile_no,
  //         country: userCountry,
  //         password: userPassword,
  //         confirm_password: userConfirm_password,
  //         client_id: signupKey.clientId,
  //         role: signupKey.role,
  //       }),
  //     });
  //     if (response.ok) {
  //       document.cookie = `signupEmail=${userEmail};path=/`;
  //       this.setState({
  //         userName: "",
  //         userEmail: "",
  //         userMobile_no: "",
  //         userCountry: "",
  //         userPassword: "",
  //         userConfirm_password: "",
  //         userSignupKey: "",
  //       });
  //       this.handleSignupSuccessModalToggle("open");
  //     } else {
  //       this.setState({
  //         errorMessage: "Error creating user. Please try again later.",
  //         messageType: "Failed",
  //       });
  //     }
  //   } catch (error) {
  //     this.setState({
  //       errorMessage: "An unexpected error occurred. Please try again later.",
  //       messageType: "Failed",
  //     });
  //   }
  // };

  handleSubmit = async (e) => {
    e.preventDefault();
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const {
      userName,
      userEmail,
      userMobile_no,
      userCountry,
      userPassword,
      userConfirm_password,
      userSignupKey,
    } = this.state;
  
    // Validate password format
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(userPassword)) {
      this.setState({
        errorMessage:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character.",
        messageType: "Failed",
      });
      return;
    }
  
    // Decode signup key
    const signupKey = this.decodeSignedToken(userSignupKey, process.env.REACT_APP_KEY_SECRET);
    console.log("Decoded key:", signupKey);
  
    // Prepare request body
    const requestBody = {
      name: userName,
      email: userEmail,
      mobile_no: userMobile_no,
      country: userCountry,
      password: userPassword,
      confirm_password: userConfirm_password,
      client_id: signupKey ? signupKey.clientId : null,
      role: signupKey ? signupKey.role : null,
    };
  
    try {
      // Send POST request
      const response = await fetch(`${backendURL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      // Handle response
      if (response.ok) {
        document.cookie = `signupEmail=${userEmail};path=/`;
        this.setState({
          userName: "",
          userEmail: "",
          userMobile_no: "",
          userCountry: "",
          userPassword: "",
          userConfirm_password: "",
          userSignupKey: "",
        });
        this.handleSignupSuccessModalToggle("open");
      } else {
        const errorText = await response.text(); // Get error message from response
        this.setState({
          errorMessage: `Error creating user: ${errorText}`,
          messageType: "Failed",
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "Failed",
      });
    }
  };
  

  handleSignupSuccessModalToggle = (action) => {
    this.setState({ isSignupSuccessful: action === "open" ? true : false });
  };

  render() {
    const { isSignupSuccessful } = this.state;
    return (
      <>
        {isSignupSuccessful && (
          <Modal onClose={() => this.setState({ isSignupSuccessful: false })} />
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
                  onClick={() => (window.location.replace("/"))}
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
                  
                  <div className="input-group">
                    <input
                      type="password"
                      id="userSignupKey"
                      className="inputFeild auth-input"
                      required
                      value={this.state.userSignupKey}
                      onChange={this.handleInputChange}
                    />
                    <label htmlFor="country" className="inputLabel">
                      Sign-Up Key
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
