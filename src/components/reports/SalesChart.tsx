import React from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const SalesChart = ({ chartData, chartId }: { chartData: any, chartId: string }) => {
  var xAxisKey = chartId == "growth-analysis" ? "name" : "month"
  var tooltip = chartId == "growth-analysis" ? "%" : "Sales"
  var YAxisKey = chartId == "growth-analysis" ? "value" : "revenue"
  console.log("chart Data:", chartData)
  return (
    <ResponsiveContainer width="95%" height="100%"  >
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}   >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip labelClassName='text-black' formatter={(value: any) => [
            `${chartId == "growth-analysis" ? "" : "$"}${value.toLocaleString()}${tooltip}`,
          ]}
        />
        <Line
          type="monotone"
          dataKey={YAxisKey}
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ fill: "#2563eb", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SalesChart