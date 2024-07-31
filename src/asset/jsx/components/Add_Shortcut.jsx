import React, { Component } from "react";
import { Search, PlusSymbol } from "../../media/icon/SVGicons";

class SearchWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.getCookie("token"),
      searchText: "",
      showModal: false,
      selectedOption: null,
      newOptionName: "",
      isBlankWindowOpen: true,
      shortcutList: [],
    };
  }

  getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };
  componentDidMount() {
    this.fetchShortcuts();
  }

  handleSearchChange = (event) => {
    this.setState({ searchText: event.target.value });
  };

  handleCheckboxChange = (id) => {
    console.log("Checkbox with id", id, "changed!");
  };

  handleOptionClick = (option) => {
    this.setState({
      showModal: true,
      selectedOption: option,
      newOptionName: " ",
      isBlankWindowOpen: false,
    });
  };

  handleModalInputChange = (event) => {
    this.setState({ newOptionName: event.target.value });
  };

  handleModalSave = () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { newOptionName, selectedOption, token } = this.state;
    const originalName = selectedOption.name;

    const dataToSend = {
      shortcuts: [
        {
          shortcut: originalName,
          edited_name: newOptionName,
        },
      ],
    };

    fetch(`${backendURL}/usershortcut`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data posted successfully:", data);
        this.setState({ showModal: false, isBlankWindowOpen: true });
        this.addShortcut({
          shortcut: originalName,
          edited_name: newOptionName,
        });
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  };

  fetchShortcuts = async () => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token } = this.state;
    try {
      const response = await fetch(`${backendURL}/getshortcuts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      this.setState({ shortcutList: data.shortcuts });
    } catch (error) {
      console.error("Error fetching shortcuts:", error);
    }
  };

  handleRemoveShortcut = async (shortcut) => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const { token, shortcutList } = this.state;
    try {
      const response = await fetch(`${backendURL}/deleteshortcut`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shortcut: shortcut.shortcut,
          edited_name: shortcut.edited_name,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const updatedList = shortcutList.filter(
        (item) =>
          item.shortcut !== shortcut.shortcut ||
          item.edited_name !== shortcut.edited_name
      );
      this.setState({ shortcutList: updatedList });
    } catch (error) {
      console.error("Error deleting shortcut:", error);
    }
  };

  addShortcut = (newOption) => {
    this.setState((prevState) => ({
      shortcutList: [...prevState.shortcutList, newOption],
    }));
  };

  render() {
    const { options, onClose } = this.props;
    const {
      searchText,
      showModal,
      selectedOption,
      newOptionName,
      isBlankWindowOpen,
      shortcutList,
    } = this.state;

    const filteredOptions = options.filter((option) =>
      option.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
      <div>
        {isBlankWindowOpen && (
          <div className="search-window usershorcut-modal">
            <header className="modal-container-header">
              <h4>Add New Shortcut</h4>
              <PlusSymbol
                className="icon"
                onClick={() => this.setState({ isBlankWindowOpen: false })}
              />
              <span className="close" onClick={onClose}>
                &times;
              </span>
            </header>
            <div className="Shortcut-options">
              {shortcutList.length === 0 ? (
                <h4 className="centered-message">Add Shortcut</h4>
              ) : (
                shortcutList.slice(0, 6).map((shortcut, index) => {
                  const matchedOptions = options.filter(
                    (option) => option.name === shortcut.shortcut
                  );
                  return matchedOptions.map((matchedOption, i) => (
                    <div className="shortcut-item" key={`${index}-${i}`}>
                      <img
                        src={matchedOption.icon}
                        className="icon"
                        alt={matchedOption.name}
                        onClick={() =>
                          this.openShortcutLink(matchedOption.path)
                        }
                      />
                      <span
                        className="remove-option"
                        onClick={(e) => {
                          e.stopPropagation();
                          this.handleRemoveShortcut(shortcut);
                        }}
                      >
                        &times;
                      </span>
                      <div className="neweditedname">
                        <p>{shortcut.shortcut}</p>
                        <p className="p2">{shortcut.edited_name}</p>
                      </div>
                    </div>
                  ));
                })
              )}
            </div>
          </div>
        )}

        {!isBlankWindowOpen && (
          <div className="forshortcut">
            <div className="search-input-container">
              <Search className="icon" />
              <input
                type="text"
                className="search-input-container"
                placeholder="Search..."
                value={searchText}
                onChange={this.handleSearchChange}
              />
              <span className="close" onClick={onClose}>
                &times;
              </span>
            </div>
            <hr />
            <ul className="options-list">
              {filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className="option-item"
                  onClick={() => this.handleOptionClick(option)}
                >
                  <input
                    type="checkbox"
                    className="option-checkbox"
                    checked={option.checked}
                    onChange={() => this.handleCheckboxChange(option.id)}
                  />
                  <label className="option-label">{option.name}</label>
                </li>
              ))}
            </ul>
            {showModal && selectedOption && (
              <div className="modal-for-shortcut">
                <div className="modal-content">
                  <span
                    className="close"
                    onClick={() => this.setState({ showModal: false })}
                  >
                    &times;
                  </span>
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="Add shortcut"
                    value={newOptionName}
                    onChange={this.handleModalInputChange}
                  />
                  <button className="modal-btn" onClick={this.handleModalSave}>
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default SearchWindow;
