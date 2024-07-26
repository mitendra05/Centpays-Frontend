import React, { Component } from 'react';
import { UpDoubleArrow, DownDoubleArrow } from "../../media/icon/SVGicons"; 

class ScrollUpAndDown extends Component {
  state = {
    isTop: true, 
    isScrollable: false,
  };

  resizeObserver = null;

  componentDidMount() {
    this.initializeTableBody();
  }

  componentWillUnmount() {
    this.cleanupTableBody();
  }

  initializeTableBody = () => {
    let tableBody = document.querySelector('.table-Body') || document.querySelector('.txn-search-table-Body');
    
    if (tableBody) {
      tableBody.addEventListener('scroll', this.handleScroll);
      this.checkScrollVisibility(tableBody.scrollTop, tableBody.scrollHeight, tableBody.clientHeight);

      this.resizeObserver = new ResizeObserver(() => {
        this.checkScrollVisibility(tableBody.scrollTop, tableBody.scrollHeight, tableBody.clientHeight);
      });

      this.resizeObserver.observe(tableBody);
    }
  };

  cleanupTableBody = () => {
    let tableBody = document.querySelector('.table-Body') || document.querySelector('.txn-search-table-Body');
    
    if (tableBody) {
      tableBody.removeEventListener('scroll', this.handleScroll);
      if (this.resizeObserver) {
        this.resizeObserver.unobserve(tableBody);
      }
    }
  };

  handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    this.checkScrollVisibility(scrollTop, scrollHeight, clientHeight);
  };

  checkScrollVisibility = (scrollTop, scrollHeight, clientHeight) => {
    const isAtTop = scrollTop === 0;
    const isScrollable = scrollHeight > clientHeight;
    this.setState({ isTop: isAtTop, isScrollable });
    
    // Update the state based on the current scroll position
    this.setState({ isTop: isAtTop });
  };
  
  scrollToTopOrBottom = () => {
    let tableBody = document.querySelector('.table-Body') || document.querySelector('.txn-search-table-Body');
    
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

      this.setState({ isTop });
    }
  };
  

  render() {
    const { isTop, isScrollable } = this.state;

    if (!isScrollable) {
      return null;
    }

    return (
      <button
        onClick={this.scrollToTopOrBottom}
        className="scroll-top-and-bottom-button scroll-top-and-bottom-btn-div"
      >
        {isTop ? <DownDoubleArrow className='white-icon scrollupdown-icon'/> : <UpDoubleArrow className='white-icon scrollupdown-icon'/>}
      </button>
    );
  }
}

export default ScrollUpAndDown;
