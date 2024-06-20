import React, { Component } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

class ReBarChart extends Component {

	CustomTooltip = ({ active, payload}) => {
		if (active && payload && payload.length) {
			const successData = payload.find(entry => entry.dataKey === 'success');
			const failData = payload.find(entry => entry.dataKey === 'fail');
			const incompleteData = payload.find(entry => entry.dataKey === 'incomplete');

			return (
				<div className="custom-tooltip">
					<div className="tooltip-content">
						{successData && <p className="tooltip-success">Success: {successData.value}</p>}
						{failData && <p className="tooltip-fail">Fail: {failData.value}</p>}
						{incompleteData && <p className="tooltip-incomplete">Incompleted: {incompleteData.value}</p>}
					</div>
				</div>
			);
		}
		return null;
	};

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
			<div className="chart-container">
				<BarChart
					width={520}
					height={300}
					data={reversedData || []} 
					margin={{ top: 20, right: 70, bottom: 10 }}
					barSize={12}
					barCategoryGap={20}
					style={{ stroke: '#fff', strokeWidth: 2 }}
					
				>
					<CartesianGrid strokeDasharray="5 5" horizontal={true} vertical={false}/>
					<XAxis dataKey="day" axisLine={false} tickLine={false} tickFormatter={this.formatXAxisTick} />
					<YAxis axisLine={false} tickLine={false} />
					<Tooltip content={<this.CustomTooltip />} cursor={false} />
					<Bar dataKey="success" stackId="a" fill="#6FD226" maxBarSize={10} animationDuration={1500} radius={20} />
					<Bar dataKey="fail" stackId="a" fill="var(--primary)" maxBarSize={10} animationDuration={1500} radius={20} />
					<Bar dataKey="incomplete" stackId="a" fill="var(--total-color)" maxBarSize={10} animationDuration={1500} radius={20} />
				</BarChart>
			</div>
		);
	}
}

export default ReBarChart;