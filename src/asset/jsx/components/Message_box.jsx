import React, { Component } from "react";

class MessageBox extends Component {
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            hovered: false,
        };
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.props.onClose();
        }, 2000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    handleMouseEnter = () => {
        clearTimeout(this.timer);
        this.setState({ hovered: true });
    };

    handleMouseLeave = () => {
        this.timer = setTimeout(() => {
            this.props.onClose();
        }, 2000);
        this.setState({ hovered: false });
    };

    render() {
        const { message, onClose, messageType } = this.props;
        const { hovered } = this.state;
        let emoji;
        let textColor;
        let borderColor;
        let emojiColor;
        let emojiClass;
        let backgroundColor; 

        switch (messageType) {
            case "success":
                emoji = "🥳";
                textColor = "#155724";
                borderColor = "#d4edda";
                emojiColor = "#d4edda";
                backgroundColor = "#b9f6ca";
                emojiClass = hovered ? "" : "bounce";
                break;
            case "fail":
                emoji = "😔";
                textColor = "#721c24";
                borderColor = "#f8d7da";
                emojiColor = "#f8d7da";
                emojiClass = hovered ? "" : "bounce";
                break;
            case "notFound":
                emoji = "⚠️"; 
                textColor = "#856404";
                borderColor = "#ffeeba";
                backgroundColor = "#fff3cd";
                break;
            default:
                emoji = "😊";
                textColor = "#333";
                borderColor = "#f3f3f3";
                emojiColor = "#f3f3f3";
                emojiClass = hovered ? "" : "bounce";
                break;
        }

        return (
            <div
                className={`message-box ${message ? "" : "hidden"}`}
                style={{ borderColor: borderColor, backgroundColor: backgroundColor }} 
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <span className="close-btn" style={{ color: textColor }} onClick={onClose}>
                    &times;
                </span>
                <span
                    className={`emoji-span ${emojiClass}`}
                    style={{ backgroundColor: emojiColor }}
                >
                    {emoji}
                </span>
                <p className="p2" style={{ color: textColor, cursor: "pointer" }}>
                    {message}
                </p>
                <div className="moving-line" style={{ backgroundColor: textColor }} />
            </div>
        );
    }
}

export default MessageBox;
