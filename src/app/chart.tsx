"use client";
import { Chart } from "react-google-charts";
import { useHabit } from "./context";
export default function ChartComponent({ completions, habitNames }) {
  let data = null;
  const { selectedArea, selectedCategory, selectedHabit } = useHabit();
  if (selectedHabit) {
    data = completions.filter(
      (completion) => completion.habit_name === selectedHabit
    );
  }
  console.log(habitNames);
  function transformDataForLineChart(data) {
    const result = [["Date", "Completion"]];
    data.forEach((entry) => {
      const date = new Date(entry.date);
      const completionRatio = parseFloat(entry.completion_ratio);
      result.push([date, completionRatio]);
    });

    return result;
  }
  if (data) {
    const lineChartData = transformDataForLineChart(data);
  }

  const options = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "Completion",
    },
    title: completions[0].habit_name,
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
        {data && (
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={lineChartData}
            options={options}
          />
        )}
      </div>
    </>
  );
}
