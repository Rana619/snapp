import { MoreHorizontal, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WidgetDataProps, SalesData } from "@/types";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useState } from "react";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Line, LabelList, LineChart } from "recharts";
import { navigate } from "wouter/use-browser-location";

export function LineChartWidget({ widget, data, cardHeight, cardWidth }: WidgetDataProps) {
  const [chartData, setChartData] = useState<SalesData[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // setChartData({
      //   labels: data.map((item: any) => item.name),
      //   values: data.map((item: any) => parseFloat(item.value) as number),
      // })
      setChartData(data.map((item: any) => { return { labels: item.name, values: item.value } }));
    }
  }, [data])



  // Handle undefined or empty data
  if (!chartData || chartData.length <= 0) {
    return (
      <Card
        className="widget-card hover:shadow-lg transition-all duration-200 flex flex-col"
        style={{
          height: cardHeight,
          width: cardWidth,
          // margin: "5px"
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4" >
          <CardTitle className="text-lg font-semibold" onClick={(event) => {
            navigate("/page/reports")
          }}
          >Growth Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 px-4 pb-4 pt-0 flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // const maxValue = Math.max(...chartData.values);

  return (
    <Card
      className="widget-card hover:shadow-lg transition-all duration-200 flex flex-col"
      style={{
        height: cardHeight,
        width: cardWidth,
        // margin: "5px"
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4 flex-shrink-0">
        <CardTitle className="text-lg font-semibold capitalize hover:text-blue-600 hover:cursor-default"
        onClick={(event)=>{
          event.stopPropagation()
          navigate("/page/reports")}}
        >
          {widget?.dataKey.split("_").map((s)=> `${s} `)}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-4 pb-4 pt-0 overflow-hidden">
        <div className="space-y-4 h-full w-full">
          <div className="relative flex items-end justify-between space-x-2 h-[55%] w-full">
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 50, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4facfe" />
                    <stop offset="100%" stopColor="#9b59b6" />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="labels" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value}`, "Value"]} />

                <Line
                  type="monotone"
                  dataKey="values"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: "#4facfe", strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                >
                  <LabelList dataKey="values" position="top" />
                </Line>
              </LineChart>
            </ResponsiveContainer>
            {/* {chartData.labels.map((label, index) => {
              const value = chartData.values[index];
              const height = (value / maxValue) * 100;

              return (
                <div key={label} className="flex-1 flex flex-col items-center">
                  <div className="relative flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-300 dark:from-purple-400 dark:to-purple-200 rounded-t transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-2">
                    {label}
                  </span>
                </div>
              );
            })} */}
          </div>

          <div className="border-t border-gray-100">
            <div className="grid grid-cols-4 gap-2 text-center">
              {chartData.map((item, index) => (
                <div key={index}>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.values}%
                  </p>
                  <p className="text-xs text-gray-500">{item.labels} Growth</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
