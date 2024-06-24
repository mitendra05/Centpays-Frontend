import React, { Component } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

class CustomTooltip extends Component {
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

class Bargraph extends Component {
  formatXAxisTick = (value) => {
    const [month, day, year] = value.split('/');
    const dateObj = new Date(`${year}-${month}-${day}`);
    const options = { weekday: 'short' };
    const formattedDay = dateObj.toLocaleDateString('en-US', options);
    
    return formattedDay;
  };

  render() {
    const { data } = this.props;
    const maxValue = Math.max(...data.map(item => item.successCount));
    const reversedData = [...data].reverse();
    return (
      <ResponsiveContainer className="barContainer" width="100%" height={140}>
        <BarChart data={reversedData || []} >
          <XAxis dataKey="day" axisLine={false} tickLine={false} tickFormatter={this.formatXAxisTick} />
          
          <Bar
            dataKey="successCount" 
            maxBarSize={20}
            // activeBar={{ strokeWidth: 0.1, fill: "#9375fc" }}
            animationDuration={1500}
            radius={3}
          >
            
            {reversedData.map((entry) => (
            
            <Cell fill={entry.successCount === maxValue ? '#8c57ff' : '#F3EEFF' }/>
          
        ))}
            </Bar>
       
          <Tooltip content={<CustomTooltip />} cursor={false} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default Bargraph;
