import React, { Component } from "react";

class CustomSelect extends Component {
  state = {
    selectedOptions: this.props.multiSelect
      ? []
      : this.props.selectedValue || null,
    isOpen: false,
    searchValue: "",
  };

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutside);
    this.setDefaultOption();
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
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
    this.setState((prevState) => {
      if (this.props.multiSelect) {
        const updatedOptions = prevState.selectedOptions.includes(option)
          ? prevState.selectedOptions.filter((opt) => opt !== option)
          : [...prevState.selectedOptions, option];
        this.props.onChange(updatedOptions);
        return { selectedOptions: updatedOptions };
      } else {
        this.props.onChange(option);
        return { selectedOptions: option, isOpen: false };
      }
    });
  };

  handleSearchChange = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  setDefaultOption = () => {
    const { options, defaultLabel, selectedValue } = this.props;
    if (!selectedValue && defaultLabel && options && options.length === 1) {
      this.setState({ selectedOptions: options[0] });
      this.props.onChange(options[0]);
    }
  };

  render() {
    const {
      options = [],
      width = "170px",
      height = "auto",
      showDropdownIcon = false,
      defaultLabel,
      selectedValue,
    } = this.props;

    const { selectedOptions, isOpen, searchValue } = this.state;

    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (defaultLabel && !filteredOptions.includes(defaultLabel)) {
      filteredOptions.unshift(defaultLabel);
    }

    const dropdownIcon = showDropdownIcon
      ? isOpen
        ? "⮝"
        : "⮟"
      : isOpen
      ? "👆"
      : "👇";

    return (
      <div className="custom-select-wrapper" ref={this.setWrapperRef}>
        <div
          className="custom-select-selected"
          onClick={() => {
            if (filteredOptions.length > 0) {
              this.setState({ isOpen: !isOpen });
            }
          }}
          style={{ width, height }}
        >
          <span>
            {selectedValue ||
              selectedOptions ||
              defaultLabel ||
              (options.length > 0 ? options[0] : "No options available")}
          </span>
          <div className="select-icon">{dropdownIcon}</div>
        </div>
        {isOpen && filteredOptions.length > 0 && (
          <div className="custom-select-options">
            <input
              type="text"
              className="custom-select-search"
              placeholder="Search..."
              value={searchValue}
              onChange={this.handleSearchChange}
            />
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => this.handleOptionSelect(option)}
                className={`custom-select-option ${
                  this.props.multiSelect
                    ? selectedOptions.includes(option)
                      ? "selected"
                      : ""
                    : selectedValue === option
                    ? "selected"
                    : ""
                }`}
              >
                {this.props.multiSelect ? (
                  <label>
                    <input
                      type="checkbox"
                      value={option}
                      checked={selectedOptions.includes(option)}
                      onChange={() => this.handleOptionSelect(option)}
                    />
                    {option}
                  </label>
                ) : (
                  option
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default CustomSelect;
