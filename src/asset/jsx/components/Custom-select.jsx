import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CustomSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: props.multiSelect ? [] : props.selectedValue || null, 
      isOpen: false,
      searchValue: ''
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  };

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  handleOptionSelect = (option) => {
    const { selectedOptions } = this.state;

    if (this.props.multiSelect) {
      const index = selectedOptions.indexOf(option);
      const updatedOptions = [...selectedOptions];
      if (index === -1) {
        updatedOptions.push(option);
      } else {
        updatedOptions.splice(index, 1);
      }
      this.setState({ selectedOptions: updatedOptions });
    } else {
      this.setState({ selectedOptions: option, isOpen: false });
    }
    this.props.onChange(option);
  };

  handleSearchChange = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  render() {
    const { options, width, height, showDropdownIcon, defaultLabel } = this.props; 
    const { selectedOptions, isOpen, searchValue } = this.state;

    const filteredOptions = options.filter(option =>
      typeof option === 'string' && option.toLowerCase().startsWith(searchValue.toLowerCase())
    );

    let dropdownIcon;
    if (showDropdownIcon) {
      dropdownIcon = isOpen ?  '⮝': '⮟'; 
    } else {
      dropdownIcon = isOpen ?  '👆': '👇'; 
    }
    
    return (
      <div className="custom-select-wrapper" ref={this.setWrapperRef} >
        <div className="custom-select-selected" onClick={() => this.setState({ isOpen: !isOpen })} style={{ width: width || '170px', height: height || 'auto'}}>
          {!this.props.multiSelect && selectedOptions ? selectedOptions : this.props.selectedOptionRenderer || defaultLabel || 'Select your option'}
          <div className="select-icon">
            {dropdownIcon}
          </div>
        </div>
        {isOpen && (
          <div className="custom-select-options">
            <input
              type="text"
              className="custom-select-search"
              placeholder="Search..."
              value={searchValue}
              onChange={this.handleSearchChange}
            />
            {defaultLabel && (
              <div
                key={defaultLabel}
                onClick={() => this.handleOptionSelect(defaultLabel)}
                className={selectedOptions === defaultLabel ? 'custom-select-option selected' : 'custom-select-option'}
              >
                {defaultLabel}
              </div>
            )}
            {filteredOptions.map((option) => (
              <div
                key={option}
                onClick={() => this.handleOptionSelect(option)}
                className={this.props.multiSelect ?
                  (selectedOptions && selectedOptions.includes(option) ? 'custom-select-option selected' : 'custom-select-option')
                  : (selectedOptions === option ? 'custom-select-option selected' : 'custom-select-option')
                }
              >
                {this.props.multiSelect ?
                  <label>
                    <input
                      type="checkbox"
                      value={option}
                      checked={selectedOptions.includes(option)}
                      onChange={() => this.handleOptionSelect(option)}
                    />
                    {option}
                  </label>
                  : option
                }
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

CustomSelect.propTypes = {
  options: PropTypes.array.isRequired,
  multiSelect: PropTypes.bool,
  selectedOptionRenderer: PropTypes.node,
  selectedValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  showDropdownIcon: PropTypes.bool,
  defaultLabel: PropTypes.string // New prop for default label
};

CustomSelect.defaultProps = {
  multiSelect: false,
  showDropdownIcon: false 
};

export default CustomSelect;
