"use client";
import { Chart } from "react-google-charts";
import { useHabit } from "./context";
export default function ChartComponent({
  habitCompletions,
  categoryCompletions,
  areaCompletions,
}) {
  let data = null;
  const { selectedArea, selectedCategory, selectedHabit } = useHabit();
  if (selectedHabit) {
    data = habitCompletions.filter((item) => item.habit_name === selectedHabit);
  } else if (selectedCategory) {
    data = categoryCompletions.filter(
      (item) => item.category_name === selectedCategory
    );
  } else {
    data = areaCompletions.filter((item) => item.area_name === selectedArea);
  }

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
    backgroundColor: "#f1f8e9",
    title: "",
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
