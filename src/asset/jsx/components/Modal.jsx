import React, { Component } from "react";
import { Close } from "../../media/icon/SVGicons";

class Modal extends Component {
  constructor(props) {
    super(props);
    this.modalRef = React.createRef();
    this.state = {
      isDragging: false,
      offset: { x: 0, y: 0 },
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    if (this.props.stopScroll) {
      document.body.style.overflow = "hidden";
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    if (this.props.stopScroll) {
      document.body.style.overflow = "auto";
    }
  }

  handleClickOutside = (event) => {
    if (this.modalRef && !this.modalRef.current.contains(event.target)) {
      this.props.onClose();
    }
  };

  handleMouseDown = (e) => {
    if (this.props.enableDragging) {
      this.setState({
        isDragging: true,
        offset: {
          x: e.clientX - this.modalRef.current.getBoundingClientRect().left,
          y: e.clientY - this.modalRef.current.getBoundingClientRect().top,
        },
      });
      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("mouseup", this.handleMouseUp);
    }
  };

  handleMouseMove = (e) => {
    if (this.state.isDragging) {
      const modal = this.modalRef.current;
      modal.style.left = `${e.clientX - this.state.offset.x}px`;
      modal.style.top = `${e.clientY - this.state.offset.y}px`;
      modal.style.position = "absolute";
    }
  };

  handleMouseUp = () => {
    this.setState({ isDragging: false });
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  };

  render() {
    const { enableDragging,showBackground} = this.props;
    const cursorStyle = enableDragging ? 'move' : 'auto';

    return (
      <>
        <div className="modal" style={{ backgroundColor: showBackground ? "transparent":"#00000050" }}>
          <article
            className="modal-container"
            ref={this.modalRef}
            onMouseDown={this.handleMouseDown}
            style={{ cursor: cursorStyle }}
          >
            <header className="modal-container-header">
              <h4 className="modal-container-title">
                {this.props.modalHeading}
              </h4>
              <div onClick={this.props.onDecline}>
                <Close className="icon" />
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
                      {this.props.showDeclinebtn}
                    </button>
                  )}
                  {this.props.acceptbtnname && (
                  <button
                    className="btn-primary"
                    onClick={this.props.onAccept}
                  >
                    {this.props.acceptbtnname}
                  </button>
                  )}
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
