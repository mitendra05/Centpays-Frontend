import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

class ApprovalRatioChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      range: '1D',
      interval: 'hour'
    };
  }

  componentDidMount() {
    this.fetchApprovalRatios(this.state.range, this.state.interval);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.range !== this.state.range) {
      let interval;
      switch (this.state.range) {
        case '1D':
          interval = 'hour';
          break;
        case '1W':
          interval = 'day';
          break;
        case '1M':
          interval = 'day';
          break;
        case '3M':
          interval = 'week';
          break;
        case '6M':
          interval = 'week';
          break;
        case '1Y':
          interval = 'month';
          break;
        default:
          interval = 'hour';
      }
      this.setState({ interval }, () => {
        this.fetchApprovalRatios(this.state.range, this.state.interval);
      });
    }
  }

  fetchApprovalRatios = async (range, interval) => {
    const now = new Date();
    let startDate;

    switch (range) {
      case '1D':
        startDate = new Date(now - 24 * 60 * 60 * 1000).toISOString();
        break;
      case '1W':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case '1M':
        startDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        break;
      case '3M':
        startDate = new Date(now.setMonth(now.getMonth() - 3)).toISOString();
        break;
      case '6M':
        startDate = new Date(now.setMonth(now.getMonth() - 6)).toISOString();
        break;
      case '1Y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
        break;
      default:
        startDate = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    }

    const endDate = new Date().toISOString();

    try {
      const response = await fetch(`/api/approval-ratios?startDate=${startDate}&endDate=${endDate}&interval=${interval}`);
      const data = await response.json();
      this.setState({ data });
    } catch (error) {
      console.error('Error fetching approval ratios:', error);
    }
  };

  handleRangeChange = (range) => {
    this.setState({ range });
  };

  render() {
    return (
      <div>
        <h1>Approval Ratio Line Chart</h1>
        <div>
          {['1D', '1W', '1M', '3M', '6M', '1Y'].map((timeRange) => (
            <button key={timeRange} onClick={() => this.handleRangeChange(timeRange)}>
              {timeRange}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={this.state.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ratio" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default ApprovalRatioChart;
