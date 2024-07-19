import React, { Component } from 'react';
import {UpDoubleArrow } from '../../media/icon/SVGicons';

class ScrollToTopButton extends Component {
  state = {
    isVisible: false 
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
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

  render() {
    const { isVisible } = this.state;

    return (
        <button
        onClick={this.scrollToTop}
        className={`scroll-top-and-bottom-button scroll-to-top-button ${isVisible ? 'show' : 'hide'}`}
      >
        <UpDoubleArrow className='white-icon scrollupdown-icon'/>
      </button>
    );
  }
}
  
export default ScrollToTopButton;