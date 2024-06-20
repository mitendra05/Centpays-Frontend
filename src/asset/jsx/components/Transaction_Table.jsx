import React, { Component } from "react";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { tableName, headerLabels, apiData } = this.props;
    return (
      <div className="Table-container">
        <h4 className="tableHeader">{tableName}</h4>
        <table>
          <thead>
            <tr>
              <th className="p1">ID</th>
              {headerLabels.map((item) => (
                <th className="p1">{item.heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {apiData.map((row, index) => (
              <tr className="p2" key={index}>
                <td>{index + 1}</td>
                {headerLabels.map((collabel, labelIndex) => (
                  <td key={labelIndex}>{row[collabel.label]}</td>
                ))}
                <td>MNM</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
