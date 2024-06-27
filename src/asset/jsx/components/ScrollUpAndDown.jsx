import React, { Component } from 'react';
import { UpDoubleArrow, DownDoubleArrow } from "../../media/icon/SVGicons"; // Assuming you have both up and down arrow icons

class ScrollUpAndDown extends Component {
  state = {
    isTop: true, // Track if currently at top or bottom
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
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;

    if (isAtTop) {
      this.setState({ isTop: true });
    } else if (isAtBottom) {
      this.setState({ isTop: false });
    } else {
      this.setState({ isTop: false });
    }
  };

  scrollToTopOrBottom = () => {
    let tableBody = document.querySelector('.table-Body');
    if (!tableBody) {
      tableBody = document.querySelector('.txn-search-table-Body');
    }

    if (tableBody) {
      const { isTop } = this.state;
      const scrollHeight = tableBody.scrollHeight;

      if (isTop) {
        tableBody.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
        this.setState({ isTop: false });
      } else {
        tableBody.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        this.setState({ isTop: true });
      }
    }
  };

  render() {
    const { isTop } = this.state;

    return (
      <button
        onClick={this.scrollToTopOrBottom}
        className="scroll-top-and-bottom-button"
      >
        {isTop ? <DownDoubleArrow className='primary-color-icon top-icon'/> : <UpDoubleArrow className='top-icon'/>}
      </button>
    );
  }
}

export default ScrollUpAndDown;
