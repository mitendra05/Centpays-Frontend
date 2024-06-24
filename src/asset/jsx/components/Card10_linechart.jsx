import React, { PureComponent } from "react";
import { LineChart, Line, XAxis, ResponsiveContainer } from "recharts";

class Card10_LineChart extends PureComponent {

	formatXAxisTick = (value) => {
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dateString = value;
const [month] = dateString.split("/");
const abbreviatedMonthName = monthNames[parseInt(month) - 1];
return abbreviatedMonthName;
	};

	render() {
		const { salesByMonthData } = this.props;

		return (
			<ResponsiveContainer width="100%" height="80%" className={"card10-line"}>
				<LineChart width={300} height={300} data={salesByMonthData}>
					<defs>
						<linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
							<stop offset="0%" stopColor="rgba(111,210,38,1)" />
							<stop offset="100%" stopColor="rgba(244, 245, 250,1)" />
						</linearGradient>
					</defs>
					<XAxis
						dataKey="monthYear"
						axisLine={false}
						tickLine={false}
						tick={{ fontSize: 8 }}
						tickCount={6}
						tickFormatter={this.formatXAxisTick}
					/>
					<Line
						type="monotone"
						dataKey="sales"
						stroke="url(#gradient)"
						strokeWidth={8}
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		);
	}
}

export default Card10_LineChart;