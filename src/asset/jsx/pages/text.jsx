import React, { Component } from "react";

class ScrollingNames extends Component {
  constructor(props) {
    super(props);
    this.state = {
      names: ["Name 0", "Name 1", "Name 2", "Name 3", "Name 4", "Name 5", "Name 6", "Name 7", "Name 8", "Name 9"],
    };
    this.scrollContainer = React.createRef();
  }

  componentDidMount() {
    this.startScrolling();
  }

  startScrolling = () => {
    const container = this.scrollContainer.current;
    const height = container.scrollHeight / this.state.names.length;

    setInterval(() => {
      container.scrollBy({
        top: height,
        behavior: 'smooth'
      });

      this.setState(prevState => {
        const newNames = [...prevState.names];
        newNames.push(newNames.shift());
        return { names: newNames };
      });
    }, 2000);
  };

  render() {
    const { names } = this.state;

    return (
      <div className="scroll-container" ref={this.scrollContainer}>
        <div className="scroll-inner">
          <ul className="scroll-list">
            {names.map((name, index) => (
              <li
                key={index}
                className="scroll-item"
                style={{ 
                  fontSize: `${20 + Math.abs(5 - Math.abs(index - 5))}px`, 
                  transform: `scale(${1 + Math.abs(5 - Math.abs(index - 5)) / 10})`
                }}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default ScrollingNames;
