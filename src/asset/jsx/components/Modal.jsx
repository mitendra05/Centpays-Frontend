import React, { Component } from "react";
import { Close } from "../../media/icon/SVGicons";

class Modal extends Component {
	constructor(props) {
		super(props);
		this.modalRef = React.createRef();
	}

	componentDidMount(){
		document.addEventListener("mousedown", this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClickOutside);
	}

	handleClickOutside = (event) => {
		if (this.modalRef && !this.modalRef.current.contains(event.target)) {
			this.props.onClose();
		}
	};

	render() {
		return (
			<>
				<div className="modal">
					<article className="modal-container" ref={this.modalRef}>
						<header className="modal-container-header">
							<h4 className="modal-container-title">
								{this.props.modalHeading}
							</h4>
							<div onClick={this.props.onDecline}>
								<Close className="icon"/>
							</div>
						</header>

						<section className="modal-container-body rtf">
							<p>{this.props.modalBody}</p>
						</section>

						{this.props.showFotter && (
							<footer className="modal-container-footer">
								<div className="modal-footer-button">
									{this.props.showDeclinebtn && (
										<button 
											className="btn-secondary"
											onClick={this.props.onDecline}
										>
											Decline
										</button>
									)}
									<button className="btn-primary" onClick={this.props.onAccept}>
										{this.props.acceptbtnname}
									</button>
								</div>
							</footer>
						)}
					</article>
				</div>
			</>
		);
	}
}

export default Modal;