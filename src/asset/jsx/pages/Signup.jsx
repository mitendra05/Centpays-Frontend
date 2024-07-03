import React, { Component } from "react";
import { Link } from "react-router-dom";

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
			userCompany_name: "",
			userCountry: "",
			userPassword: "",
			userConfirm_password: "",
		};
	}

	handleInputChange = (event) => {
		this.setState({ [event.target.id]: event.target.value });
	};

	getCookie = (name) => {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
		return null;
	}


	handleSubmit = async (e) => {
		const backendURL = process.env.REACT_APP_BACKEND_URL;
		e.preventDefault();
		const {
			userName,
			userEmail,
			userMobile_no,
			userCompany_name,
			userCountry,
			userPassword,
			userConfirm_password,
		} = this.state;

		const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

		if (!passwordRegex.test(userPassword)) {
			this.setState({
				errorMessage: "Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one special character.", messageType: "Failed"
			});
			return;
		}

		try {
			const response = await fetch(`${backendURL}/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: userName,
					email: userEmail,
					mobile_no: userMobile_no,
					country: userCountry,
					password: userPassword,
					confirm_password: userConfirm_password,
					company_name: userCompany_name,
				}),
			});
			if (response.ok) {

				document.cookie = `signupEmail=${userEmail};path=/`;
				// localStorage.setItem("signupEmail", userEmail);
				this.setState({
					userName: "",
					userEmail: "",
					userMobile_no: "",
					userCountry: "",
					userPassword: "",
					userConfirm_password: "",
					userCompany_name: "",
				});
				this.handleSignupSuccessModalToggle("open");
			} else {
				this.setState({ errorMessage: "Error creating user. Please try again later.", messageType: "Failed" });
			}
		} catch (error) {
			this.setState({ errorMessage: "An unexpected error occurred. Please try again later.", messageType: "Failed" });
		}
	};

	handleSignupSuccessModalToggle = (action) => {
		this.setState({ isSignupSuccessful: action === "open" ? true : false });
	};

	render() {
		const { isSignupSuccessful } = this.state;
		return (
			<>
				{isSignupSuccessful && <Modal onClose={() => this.setState({ isSignupSuccessful: false })} />}
				{isSignupSuccessful && (
					<Modal
						onClose={() => this.handleSignupSuccessModalToggle("close")}
						onDecline={() => this.handleSignupSuccessModalToggle("decline")}
						onAccept={() => this.handleSignupSuccessModalToggle("accept")}
						showFooter={false}
						modalHeading={"Congratulations! 🎉"}
						modalBody={
							<div className="auth-content loginsuccessful-modal">
								<h7 className="line-spacing">
									Your Account has been set-up successfully.
								</h7>
								<p></p>
								<p></p>
								<p className="p1 content-modal">Login to access your account</p>
								<button className="btn-primary loginbutton-modal" onClick={() => window.location.href = "/"}>Login</button>
							</div>
						}
					/>
				)}
				<div id="auth">
					<div className="auth-bg-top"></div>
					<div className="auth-bg-bottom"></div>
					<img className="tree1" src={tree1} alt="tree"></img>
					<img className="tree2" src={tree2} alt="tree"></img>
					<div className="auth-container">
						<div className="auth-main-container forsignup">
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

									<div className="input-group">
										<input
											type="text"
											id="userSignUpKey"
											className="inputFeild auth-input"
											required
											value={this.state.userSignUpKey}
											onChange={this.handleInputChange}
										/>
										<label htmlFor="country" className="inputLabel">
											Sign-Up Key
										</label>
									</div>

									<div className="checkbox-container">
										<div>
											<input type="checkbox" required></input>
											<label className="p2">
												I agree to
												<Link to="/termsandcondition" className="highlight-text">
													privacy policy and terms
												</Link>
											</label>
										</div>
									</div>
									<button type="submit" className="btn-primary auth-btn-signup">
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