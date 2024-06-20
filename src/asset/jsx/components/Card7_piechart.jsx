import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const colors = ["#dcf0fa", "#16b1ff", "#5fc6fa", "#95d7f8"];

const formatValue = (val) => {
	if (val >= 1000) {
		return `${(val / 1000).toFixed(1)}k`;
	}
	return val;
};

const renderActiveShape = (props) => {
	const {
		cx,
		cy,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		fill,
		payload,
		value,
	} = props;

	const words = payload.region.split(" ");
	const regionAbbreviation = words.length > 1 ?
		words.map(word => word.charAt(0).toUpperCase()).join("") :
		payload.region;

	return (
		<g>
			<text x={cx} y={cy} dy={1} textAnchor="middle">
				<tspan x={cx} dy={1} fill="#000" style={{ fontSize: "24px" }}>
					{formatValue(value)}
				</tspan>
				<tspan x={cx} dy={20} fill="#6c6777" style={{ fontSize: "15px", display: "block" }}>
					{regionAbbreviation}
				</tspan>
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
		</g>
	);
};

class Card7_Piechart extends PureComponent {
	state = {
		activeIndex: 0,
	};

	onPieEnter = (_, index) => {
		this.setState({
			activeIndex: index,
		});
	};

	render() {
		const { card7_data } = this.props;

		return (
			<ResponsiveContainer width="40%" height="80%" className="card7_pie">
				<PieChart width={400} height={400}>
					<Pie
						activeIndex={this.state.activeIndex}
						activeShape={renderActiveShape}
						data={card7_data || []} 
						cx="50%"
						cy="50%"
						innerRadius={60}
						outerRadius={80}
						fill="#8884d8"
						dataKey="no"
						onMouseEnter={this.onPieEnter}
					>
						{(card7_data || []).map((entry, index) => ( 
							<Cell
								key={`cell-${index}`}
								fill={colors[index % colors.length]}
							/>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		);
	}
}

export default Card7_Piechart;