import { MoreHorizontal, Eye, Download, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WidgetDataProps, SalesData } from "@/types";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { navigate } from "wouter/use-browser-location";

export function BarChartWidget({ widget, data, cardHeight, cardWidth }: WidgetDataProps) {
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  useEffect(() => {
    console.log("data: ", data);
    if (data && data.length > 0) {
      // setSalesData({
      //   labels: data.map((item: any) => item.month),
      //   values: data.map((item: any) => parseFloat(item.revenue) as number),
      // })
      setSalesData(data.map((item: any) => { return { "labels": item.month, "values": item.revenue } }));
    }
  }, [data])

  // Handle undefined or empty data
  if (!salesData || salesData.length == 0) {
    return (
      <Card
        className="widget-card hover:shadow-lg transition-all duration-200 flex flex-col"
        style={{
          height: cardHeight,
          width: cardWidth,
          // margin: "5px"
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4">
          <CardTitle className="text-lg font-semibold">Sales Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 px-4 pb-4 pt-0 flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // const maxValue = Math.max(...salesData.values);

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
          navigate("/page/reports")}} >
          {widget?.dataKey.split("_").map((s)=> `${s} `)}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/page/reports")}>
              <Eye className="mr-2 h-4 w-4" />
              View Full Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Download chart")}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Refresh data")}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 px-4 pb-4 pt-0 overflow-hidden">
        <div className="space-y-4 h-[75%] w-full">
          <ResponsiveContainer>
            <BarChart
              data={salesData}
              layout="vertical"
              margin={{ top: 20, right: 70, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4facfe" />
                  <stop offset="100%" stopColor="#9b59b6" />
                </linearGradient>
              </defs>

              <XAxis type="number" domain={[0, 2]} hide />
              <YAxis
                dataKey="labels"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip wrapperClassName="text-black" formatter={(value: number) => [`$${value.toFixed(1)}M`, "Sales"]} />
              <Bar
                dataKey="values"
                fill="url(#barGradient)"
                barSize={15}
                radius={[10, 10, 10, 10]}
              >
                <LabelList
                  dataKey="values"
                  position="right"
                  formatter={(val: number) => `$${(val / 1000000).toFixed(1)}M`}
                  style={{ fontWeight: "bold" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
              {salesData.map((item, index) => (
                <div key={index} style={{ width: "20%", textAlign: "center" }}>
                  {item.labels}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
              {salesData.map((item) => (
                <div key={item.labels + "-val"} style={{ width: "20%", textAlign: "center" }}>
                  ${(Number(item.values) / 1000000).toFixed(1)}M
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* <div className="space-y-4">
          {salesData.labels.map((label, index) => {
            const value = salesData.values[index];
            const percentage = (value / maxValue) * 100;

            return (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-8">
                  {label}
                </span>
                <div className="flex-1 mx-4 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-20 text-right">
                  ${(value / 1000000).toFixed(1)}M
                </span>
              </div>
            );
          })}
        </div> */}
        {/* <div className="mt-2 grid grid-cols-5 gap-2 text-center border-t border-gray-100 pt-1">
          {salesData.labels.map((label, index) => (
            <div key={label}>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                ${(salesData.values[index] / 1000000).toFixed(1)}M
              </p>
            </div>
          ))}
        </div> */}
      </CardContent>
    </Card>
  );
}