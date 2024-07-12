import React, { Component } from 'react';
import { UpDoubleArrow, DownDoubleArrow } from "../../media/icon/SVGicons"; 

class ScrollUpAndDown extends Component {
  state = {
    isTop: true, 
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
    
    // Update the state based on the current scroll position
    this.setState({ isTop: isAtTop });
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
      } else {
        tableBody.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
  
      this.setState({ isTop});
    }
  };
  

  render() {
    const { isTop } = this.state;

    return (
      <button
        onClick={this.scrollToTopOrBottom}
        className="scroll-top-and-bottom-button"
      >
        {isTop ? <DownDoubleArrow className='white-icon scrollupdown-icon'/> : <UpDoubleArrow className='white-icon scrollupdown-icon'/>}
      </button>
    );
  }
}

export default ScrollUpAndDown;
