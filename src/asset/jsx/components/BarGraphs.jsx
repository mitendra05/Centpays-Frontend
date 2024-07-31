import React, { Component } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Tooltip for ReBarChart
class ReBarChartTooltip extends Component {
  render() {
    const { active, payload } = this.props;
    if (active && payload && payload.length) {
      const successData = payload.find(entry => entry.dataKey === 'success');
      const failData = payload.find(entry => entry.dataKey === 'fail');
      const incompleteData = payload.find(entry => entry.dataKey === 'incomplete');

      return (
        <div className="custom-tooltip">
          <div className="tooltip-content">
            {successData && <p className="tooltip-success">Success: {successData.value}</p>}
            {failData && <p className="tooltip-fail">Fail: {failData.value}</p>}
            {incompleteData && <p className="tooltip-incomplete">Incomplete: {incompleteData.value}</p>}
          </div>
        </div>
      );
    }
    return null;
  }
}

// Tooltip for Bargraph
class BargraphTooltip extends Component {
  render() {
    const { active, payload } = this.props;
    if (active && payload && payload.length) {
      const { count } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="tooltip-content">
            <p className="tooltip-total">{count}</p>
          </div>
        </div>
      );
    }
    return null;
  }
}

// Tooltip for ThirdBargraph
class ThirdBargraphTooltip extends Component {
  render() {
    const { active, payload } = this.props;
    if (active && payload && payload.length) {
      const dataPoint = payload[0];
      return (
        <div className="custom-tooltip">
          <div className="tooltip-content">
            <p className="tooltip-fail">{` ${dataPoint.value}`}</p>
          </div>
        </div>
      );
    }
    return null;
  }
}

class BarGraph extends Component {
  formatXAxisTick = (value) => {
    const [month, day, year] = value.split('/');
    const dateObj = new Date(`${year}-${month}-${day}`);
    const options = { weekday: 'short' };
    return dateObj.toLocaleDateString('en-US', options);
  };

  render() {
    const { type, data } = this.props;
    const reversedData = [...data].reverse();

    switch (type) {
      case 'bargraph4':
        return (
          <div className="chart-container">
            <BarChart
              width={550}
              height={300}
              data={reversedData || []}
              margin={{ top: 20, right: 70, bottom: 10 }}
              barSize={12}
              barCategoryGap={20}
              style={{ stroke: '#fff', strokeWidth: 2 }}
            >
              <CartesianGrid strokeDasharray="5 5" horizontal={true} vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tickFormatter={this.formatXAxisTick} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<ReBarChartTooltip />} cursor={false} />
              <Bar dataKey="success" stackId="a" fill="#6FD226" maxBarSize={10} animationDuration={1500} radius={20} />
              <Bar dataKey="fail" stackId="a" fill="var(--primary)" maxBarSize={10} animationDuration={1500} radius={20} />
              <Bar dataKey="incomplete" stackId="a" fill="var(--total-color)" maxBarSize={10} animationDuration={1500} radius={20} />
            </BarChart>
          </div>
        );

      case 'bargraph5':
        return (
          <BarChart
            width={400}
            height={200}
            data={reversedData || []}
            margin={{ top: 20, right: 70, bottom: 1 }}
          >
            <XAxis dataKey="day" axisLine={false} tickLine={false} tickFormatter={this.formatXAxisTick} />
            <Bar
              dataKey="count"
              fill="var(--total-color)"
              maxBarSize={8}
              activeBar={{ strokeWidth: 0.5, fill: "#84878b" }}
              animationDuration={1500}
              radius={20}
            />
            <Tooltip content={<BargraphTooltip />} cursor={false} />
          </BarChart>
        );

      case 'bargraph7':
        const maxValue = Math.max(...data.map(item => item.successCount));
        return (
          <ResponsiveContainer className="barContainer" width="100%" height={140}>
            <BarChart data={reversedData || []}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tickFormatter={this.formatXAxisTick} />
              <Bar
                dataKey="successCount"
                maxBarSize={20}
                animationDuration={1500}
                radius={3}
              >
                {reversedData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.successCount === maxValue ? '#8c57ff' : '#F3EEFF'}
                  />
                ))}
              </Bar>
              <Tooltip content={<ThirdBargraphTooltip />} cursor={false} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  }
}

export default BarGraph;
