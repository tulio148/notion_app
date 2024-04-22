"use client";
import { Chart } from "react-google-charts";
export default function ChartComponent({ data }) {
  function transformDataForLineChart(data) {
    const result = [["Date", "Completion"]];
    data.forEach((entry) => {
      const date = new Date(entry.date);
      const completionRatio = parseFloat(entry.completion_ratio);
      result.push([date, completionRatio]);
    });

    return result;
  }
  const lineChartData = transformDataForLineChart(data);

  const options = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "Completion",
    },
    title: data[0].habit_name,
    curveType: "function",
    legend: "none",
    animation: {
      startup: true,
      easing: "linear",
      duration: 1500,
    },
  };

  return (
    <>
      <div className=" w-full h-96">
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={lineChartData}
          options={options}
        />
      </div>
    </>
  );
}
