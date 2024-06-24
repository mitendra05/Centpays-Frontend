import React, { Component } from 'react';
import { DownDoubleArrow } from "../../media/icon/SVGicons";
import "../../style/main.css";

class ScrollTableToBottomButton extends Component {
  state = {
    isVisible: false,
  };

  componentDidMount() {
    let tableBody = document.querySelector('.table-Body');
    if (!tableBody) {
      tableBody = document.querySelector('.txn-search-table-Body');
    }

    if (tableBody) {
      tableBody.addEventListener('scroll', this.handleScroll);
      this.checkScrollVisibility(tableBody.scrollTop, tableBody.scrollHeight, tableBody.clientHeight);
    }
  }

  componentWillUnmount() {
    let tableBody = document.querySelector('.table-Body');
    if (!tableBody) {
      tableBody = document.querySelector('.txn-search-table-Body');
    }

    if (tableBody) {
      tableBody.removeEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    this.checkScrollVisibility(scrollTop, scrollHeight, clientHeight);
  };

  checkScrollVisibility = (scrollTop, scrollHeight, clientHeight) => {
    const scrollThreshold = scrollHeight / 2;
    const isVisible = scrollTop < scrollThreshold;
    this.setState({ isVisible });
  };

  scrollToBottom = () => {
    let tableBody = document.querySelector('.table-Body');
    if (!tableBody) {
      tableBody = document.querySelector('.txn-search-table-Body');
    }

    if (tableBody) {
      tableBody.scrollTo({
        top: tableBody.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  render() {
    const { isVisible } = this.state;

    return (
      <button
        onClick={this.scrollToBottom}
        className={`scroll-to-bottom-button ${isVisible ? 'show' : 'hide'}`}
      >
        <DownDoubleArrow className='bottom-icon'/>
      </button>
    );
  }
}

export default ScrollTableToBottomButton;
