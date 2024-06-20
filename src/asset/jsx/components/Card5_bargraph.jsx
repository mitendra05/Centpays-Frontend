import React, { Component } from "react";
import { BarChart, Bar, XAxis, Tooltip } from "recharts";

class CustomTooltip extends Component {
  getDayName = (dateString) => {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  render() {
    const { active, payload } = this.props;
    if (active && payload && payload.length) {
      const { count } = payload[0].payload;
      // const day = this.getDayName(date);
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
    const reversedData = [...data].reverse();

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
        <Tooltip content={<CustomTooltip />} cursor={false} />
      </BarChart>
    );
  }
}

export default Bargraph;
