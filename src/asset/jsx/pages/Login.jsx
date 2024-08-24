import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";

// import component
import Modal from "../components/Modal";
import MessageBox from "../components/Message_box";

// import images
import tree1 from "../../media/image/bg-tree-1.png";
import tree2 from "../../media/image/bg-tree-2.png";
import fullLogo from "../../media/image/centpays_full_logo.png";
import left_ic from "../../media/icon/singLeft.png";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			token: this.getCookie('token'),
			isModal: false,
			userLogged: false,
			errorMessage: "",
			messageType: "",
			isOtpModal: false,
			isnewPasswordModal: false,
			new_otp: "",
			otp_timestamp: null,
			email: "",
			password: "",
		};
	}

	getCookie = (name) => {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
		return null;
	}

	componentDidMount() {
		const storedEmail = this.getCookie("registeredEmail");
		const storedPassword = this.getCookie("registeredPassword");
		if (storedEmail && storedPassword) {
			this.setState({
				userEmail: storedEmail,
				userPassword: storedPassword,
			});
		}
	}

	handleInputChange = (event) => {
		this.setState({ [event.target.id]: event.target.value });
	};

	handleSubmit = async (e) => {
		const backendURL = process.env.REACT_APP_BACKEND_URL;
		e.preventDefault();
		const { userEmail, userPassword } = this.state;
		try {
			const response = await fetch(`${backendURL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: userEmail,
					password: userPassword,
				}),
			});
			if (response.ok) {
				const data = await response.json();
				if (data) {
					document.cookie = `token=${data.token};path=/`;
					document.cookie = `role=${data.user.role};path=/`;
					document.cookie = `behavior=${data.user.behavior};path=/`;
					document.cookie = `status=${data.user.status};path=/`;
					document.cookie = `email=${data.user.email};path=/`;
					document.cookie = `name=${data.user.name};path=/`;
					document.cookie = `company_name=${data.user.company_name};path=/`;
	
					localStorage.setItem('lastLogin', data.user.lastLogin);
	
					this.setState({
						userEmail: "",
						userPassword: "",
					});
					const token = this.getCookie('token');
					this.setState({ userLogged: true });
				} else {
					this.setState({ errorMessage: "Token not generated", messageType: "fail" });
				}
			} else {
				this.setState({ errorMessage: "Wrong Username & Password", messageType: "fail" });
			}
		} catch (error) {
			this.setState({ errorMessage: "There was a problem with your fetch operation:", messageType: "fail" });
		}
	};

	handleModalToggle = (action) => {
		this.setState({ isModal: action === "open" ? true : false });
	};

	handleotpModalToggle = (action) => {
		this.setState((prevState) => ({
			isOtpModal: action === "open" ? true : false,
		}));
	};

	handlenewpasswordModalToggle = (action) => {
		this.setState((prevState) => ({
			isnewPasswordModal: action === "open" ? true : false,
		}));
	};

	generateOtp = () => {
		const otp = Math.floor(1000 + Math.random() * 9000).toString();
		const otp_timestamp = new Date().getTime();
		this.setState({ new_otp: otp, otp_timestamp });
		this.otpTimer = setTimeout(() => {
			this.setState({ new_otp: "", otp_timestamp: null });
		}, 600000);
		return otp;
	};

	handleForgotPassword = async (e) => {
		e.preventDefault();
		const otp = this.generateOtp();
		const backendURL = process.env.REACT_APP_BACKEND_URL;
		try {
			const response = await fetch(
				`${backendURL}/forgotpassword`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: this.state.userEmail,
						otp: otp,
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					this.handleModalToggle("close");
					this.handleotpModalToggle("open");
				} else {
					console.log("Something happened wrong");
				}
			} else {
				console.log("Some Error Occured");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	handleotpsubmit = async (e) => {
		e.preventDefault();
		const currentTime = new Date().getTime();
		const { new_otp, userotp, otp_timestamp } = this.state;
		if (!(new_otp === userotp && currentTime - otp_timestamp <= 600000)) {
			window.alert("Wrong OTP or expired");
		} else {
			console.log("Otp is verified");
			this.handleotpModalToggle("close");
			this.handlenewpasswordModalToggle("open");
		}
	};

	handleResetPassword = async (e) => {
		e.preventDefault();
		const { userEmail, newpassword, confirmpassword } = this.state;
		const backendURL = process.env.REACT_APP_BACKEND_URL;
		try {
			const response = await fetch(
				`${backendURL}/resetpassword`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: userEmail,
						newpassword,
						confirmpassword,
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					this.handlenewpasswordModalToggle("close");
					this.setState({ errorMessage: "Password Reset Successfully", messageType: "Success" });
				} else {
					console.log("Something happened wrong");
				}
			} else {
				console.log("Some Error Occured");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	render() {
		const { 
			data,
			errorMessage, 
			isModal, 
			userLogged, 
			isOtpModal, 
			isnewPasswordModal, 
			messageType } = this.state;

		if (userLogged) {
			return <Navigate to="/dashboard" />;
			
		}

		return (
			<>
				{errorMessage && <MessageBox message={errorMessage} messageType={messageType} onClose={() => this.setState({ errorMessage: "" })} />}
				{isModal && (
					<Modal
						onClose={() => this.handleModalToggle("close")}
						onDecline={() => this.handleModalToggle("decline")}
						onAccept={() => this.handleModalToggle("accept")}
						showFotter={false}
						modalHeading={"Forgot Password 🔒"}
						modalBody={
							<div className="auth-content forgotpass-modal">
								<p className="p1">
									Enter your email and we'll send you instructions to reset your
									password
								</p>
								<form onSubmit={this.handleForgotPassword}>
									<div className="input-group">
										<input
											type="email"
											id="userEmail"
											className="inputFeild auth-input"
											required
											value={this.state.userEmail}
											onChange={this.handleInputChange}
										/>
										<label htmlFor="usertEmail" className="inputLabel">
											Email
										</label>
									</div>
									<button
										type="submit"
										className="btn-primary auth-btn modalBtn"
									>
										Send OTP
									</button>
									<p
										onClick={() => this.handleModalToggle("close")}
										className="highlight-text baktologin"
									>
										<img src={left_ic} alt="left arrow icon" className="icon" /> Back to Login
									</p>
								</form>
							</div>
						}
					/>
				)}

				{isOtpModal && (
					<Modal
						onClose={() => this.handleotpModalToggle("close")}
						onDecline={() => this.handleotpModalToggle("decline")}
						onAccept={() => this.handleotpModalToggle("accept")}
						// showDeclinebtn={false}
						// acceptbtnname={'Accept'}
						showFotter={false}
						modalHeading={"Enter OTP 🔑"}
						modalBody={
							<div className="auth-content forgotpass-modal">
								<p className="p1">Enter OTP sent to your email address</p>
								<form onSubmit={this.handleotpsubmit}>
									<div className="input-group">
										<input
											type="text"
											id="userotp"
											className="inputFeild auth-input"
											required
											onChange={this.handleInputChange}
										/>
										<label htmlFor="userotp" className="inputLabel">
											OTP
										</label>
									</div>
									<button
										type="submit"
										className="btn-primary auth-btn modalBtn"
									>
										Verify
									</button>
									<p
										onClick={() => this.handleModalToggle("close")}
										className="highlight-text baktologin"
									>
										<img src={left_ic} alt="left arrow icon" className="icon" /> Back to Login
									</p>
								</form>
							</div>
						}
					/>
				)}

				{/* New password MOdal*/}
				{isnewPasswordModal && (
					<Modal
						onClose={() => this.handlenewpasswordModalToggle("close")}
						onDecline={() => this.handlenewpasswordModalToggle("decline")}
						onAccept={() => this.handlenewpasswordModalToggle("accept")}
						// showDeclinebtn={false}
						// acceptbtnname={'Accept'}
						showFotter={false}
						modalHeading={"Enter New Password 🔐"}
						modalBody={
							<div className="auth-content forgotpass-modal">
								<p className="p1">Enter New Password</p>
								<form onSubmit={this.handleResetPassword}>
									<div className="input-group">
										<input
											type="text"
											id="newpassword"
											className="inputFeild auth-input"
											required
											onChange={this.handleInputChange}
										/>
										<label htmlFor="newpassword" className="inputLabel">
											New Password
										</label>
									</div>
									<div className="input-group">
										<input
											type="text"
											id="confirmpassword"
											className="inputFeild auth-input"
											required
											onChange={this.handleInputChange}
										/>
										<label htmlFor="confirmpassword" className="inputLabel">
											Confirm Password
										</label>
									</div>
									<button
										type="submit"
										className="btn-primary auth-btn modalBtn"
									>
										Reset Password
									</button>
									<p
										onClick={() => this.handleModalToggle("close")}
										className="highlight-text baktologin"
									>
										<img src={left_ic} alt="left arrow icon" className="icon" /> Back to Login
									</p>
								</form>
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
						<div className="auth-main-container forlogin ">
							<div className="auth-content">
								<div className="logo-container">
									<img className="logo" src={fullLogo} alt="Centpays"></img>
								</div>
								<h4>Welcome to Centpays!👋🏻</h4>
								<p className="p2">
									Please sign-in to your account and start the adventure
								</p>
								<form onSubmit={this.handleSubmit}>
									<div className="input-group">
										<input
											type="email"
											id="userEmail"
											className="inputFeild auth-input"
											required
											value={this.state.userEmail}
											onChange={this.handleInputChange}
										/>
										<label htmlFor="userEmail" className="inputLabel">
											Email
										</label>
									</div>
									<div className="input-group">
										<input
											type="password"
											id="userPassword"
											className="inputFeild auth-input"
											required
											value={this.state.userPassword}
											onChange={this.handleInputChange}
										/>
										<label htmlFor="userPassword" className="inputLabel">
											Password
										</label>
									</div>
									<div className="checkbox-container">
										<p
											onClick={() => this.handleModalToggle("open")}
											className="highlight-text"
										>
											Forgot Password?
										</p>
									</div>
									<button type="submit" className="btn-primary auth-btn">
										Log In
									</button>
									<p className="bottom-line">
										New on our platform?
										<Link to="/signup" className="highlight-text">
											Create an Account
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

export default Login;