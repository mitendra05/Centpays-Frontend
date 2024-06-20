import React, { Component } from 'react';
import { UpDoubleArrow } from "../../media/icon/SVGicons";
import "../../style/main.css";

class ScrollTableToTopButton extends Component {
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
    const scrollThreshold = scrollHeight * 0.5; 
    const isVisible = scrollTop >= scrollThreshold;
    this.setState({ isVisible });
  };

  scrollToTop = () => {
    let tableBody = document.querySelector('.table-Body');
    if (!tableBody) {
      tableBody = document.querySelector('.txn-search-table-Body');
    }

    if (tableBody) {
      tableBody.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  render() {
    const { isVisible } = this.state;

    return (
      <button
        onClick={this.scrollToTop}
        className={`scrollTable-to-top-button ${isVisible ? 'show' : 'hide'}`}
      >
        <UpDoubleArrow className='top-icon'/>
      </button>
    );
  }
}

export default ScrollTableToTopButton;
