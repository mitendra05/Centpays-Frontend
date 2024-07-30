import React, { Component } from 'react';
import { UpDoubleArrow, DownDoubleArrow } from "../../media/icon/SVGicons"; 

class ScrollUpAndDown extends Component {
  state = {
    isTop: true, 
    isScrollable: false,
    isVisible: false,
  };

  resizeObserver = null;

  componentDidMount() {
    const { showScrollToTopButton } = this.props;
    if (showScrollToTopButton) {
      window.addEventListener('scroll', this.handleScrollForTopButton);
    } else {
      this.initializeTableBody();
    }
  }

  componentWillUnmount() {
    const { showScrollToTopButton } = this.props;
    if (showScrollToTopButton) {
      window.removeEventListener('scroll', this.handleScrollForTopButton);
    } else {
      this.cleanupTableBody();
    }
  }

  initializeTableBody = () => {
    let tableBody = document.querySelector('.table-Body') || document.querySelector('.txn-search-table-Body');
    
    if (tableBody) {
      tableBody.addEventListener('scroll', this.handleScrollForTableBody);
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
      tableBody.removeEventListener('scroll', this.handleScrollForTableBody);
      if (this.resizeObserver) {
        this.resizeObserver.unobserve(tableBody);
      }
    }
  };

  handleScrollForTableBody = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    this.checkScrollVisibility(scrollTop, scrollHeight, clientHeight);
  };

  handleScrollForTopButton = () => {
    const scrollY = window.scrollY;
    const isVisible = scrollY > 100; 
    this.setState({ isVisible });
  };

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  };

  checkScrollVisibility = (scrollTop, scrollHeight, clientHeight) => {
    const isAtTop = scrollTop === 0;
    const isScrollable = scrollHeight > clientHeight;
    this.setState({ isTop: isAtTop, isScrollable });
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
    const { showScrollToTopButton } = this.props;
    const { isTop, isScrollable, isVisible } = this.state;

    if (!isScrollable && !showScrollToTopButton) {
      return null;
    }

    return (
      <div>
        {!showScrollToTopButton && (
          <button
            onClick={this.scrollToTopOrBottom}
            className="scroll-top-and-bottom-button scroll-top-and-bottom-btn-div"
          >
            {isTop ? <DownDoubleArrow className='white-icon scrollupdown-icon'/> : <UpDoubleArrow className='white-icon scrollupdown-icon'/>}
          </button>
        )}

        {showScrollToTopButton && (
          <button
            onClick={this.scrollToTop}
            className={`scroll-top-and-bottom-button scroll-to-top-button ${isVisible ? 'show' : 'hide'}`}
          >
            <UpDoubleArrow className='white-icon scrollupdown-icon'/>
          </button>
        )}
      </div>
    );
  }
}

export default ScrollUpAndDown;
