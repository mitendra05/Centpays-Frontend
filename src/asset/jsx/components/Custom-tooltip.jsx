import React, { Component } from "react";

class CustomTooltip extends Component {
  render() {
    const {
      title,
      details,
      children,
      bullet,
      maxWidth = 200,
      topMargin,
      leftMargin
    } = this.props;

    return (
      <div className="custom-tooltip-container">
        <div className="custom-tooltip-content">
          {title && (
            <h3
              className="custom-tooltip-title"
              style={{
                marginTop: `${topMargin}px`,
                marginLeft: `${leftMargin}px`,
              }}
            >
              {title}
            </h3>
          )}
          {details && (
            <p
              className={`custom-tooltip-details ${bullet ? "bullet" : ""}`}
              style={{
                width: `${maxWidth}px`,
                left: `-${maxWidth / 2.5}px`,
                marginTop: `${topMargin}px`,
                marginLeft: `${leftMargin}px`,
              }}
            >
              {bullet ? (
                <ul
                  dangerouslySetInnerHTML={{
                    __html: details,
                  }}
                />
              ) : (
                details
              )}
            </p>
          )}
          {children}
        </div>
      </div>
    );
  }
}

export default CustomTooltip;
