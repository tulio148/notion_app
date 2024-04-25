"use client";
import { Chart } from "react-google-charts";
import { useHabit } from "./context";
import transformDataForLineChart from "./lib/chartFormatter";
import {
  findInstanceWithHighestCounts,
  calculateCompletionRate,
} from "./lib/completionFunctions";
import { Calligraffitti } from "next/font/google";

export default function ChartComponent({
  habitCompletions,
  categoryCompletions,
  areaCompletions,
}) {
  let data;

  const { selectedArea, selectedCategory, selectedHabit } = useHabit();

  if (selectedHabit) {
    data = habitCompletions.filter((item) => item.habit_name === selectedHabit);
  } else if (selectedCategory) {
    data = categoryCompletions.filter(
      (item) => item.category_name === selectedCategory
    );
  } else if (selectedArea) {
    data = areaCompletions.filter((item) => item.area_name === selectedArea);
  } else {
    data = null;
  }
  // console.log(data);
  let completionsCount, nonCompletionsCount, completionRate;

  if (selectedHabit) {
    const filteredHabitCompletions = habitCompletions.filter(
      (item) => item.habit_name === selectedHabit
    );

    const instanceWithHighestCounts = findInstanceWithHighestCounts(
      filteredHabitCompletions
    );

    if (instanceWithHighestCounts) {
      completionsCount = instanceWithHighestCounts.cumulative_done_count;
      nonCompletionsCount =
        instanceWithHighestCounts.cumulative_not_started_count;
      completionRate = calculateCompletionRate(
        completionsCount,
        nonCompletionsCount
      );
    } else {
      completionsCount = 0;
      nonCompletionsCount = 0;
      completionRate = 0;
    }
  } else if (selectedCategory) {
    const filteredCategoryCompletions = categoryCompletions.filter(
      (item) => item.category_name === selectedCategory
    );

    const instanceWithHighestCounts = findInstanceWithHighestCounts(
      filteredCategoryCompletions
    );

    if (instanceWithHighestCounts) {
      completionsCount = instanceWithHighestCounts.cumulative_done_count;
      nonCompletionsCount =
        instanceWithHighestCounts.cumulative_not_started_count;
      completionRate = calculateCompletionRate(
        completionsCount,
        nonCompletionsCount
      );
    } else {
      completionsCount = 0;
      nonCompletionsCount = 0;
      completionRate = 0;
    }
  } else if (selectedArea) {
    const filteredAreaCompletions = areaCompletions.filter(
      (item) => item.area_name === selectedArea
    );

    const instanceWithHighestCounts = findInstanceWithHighestCounts(
      filteredAreaCompletions
    );

    if (instanceWithHighestCounts) {
      completionsCount = instanceWithHighestCounts.cumulative_done_count;
      nonCompletionsCount =
        instanceWithHighestCounts.cumulative_not_started_count;
      completionRate = calculateCompletionRate(
        completionsCount,
        nonCompletionsCount
      );
    } else {
      completionsCount = 0;
      nonCompletionsCount = 0;
      completionRate = 0;
    }
  } else {
    completionsCount = "";
    nonCompletionsCount = "";
    completionRate = "";
  }

  const lineChartData = transformDataForLineChart(data);

  const options = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "Completion",
      minValue: 20, // Set the minimum value
      maxValue: 100,
    },
    backgroundColor: "#f1f8e9",
    title: "",
    curveType: "function",
    legend: "none",
    animation: {
      startup: true,
      easing: "inAndOut",
      duration: 150,
    },
  };

  return (
    <>
      <div className=" w-full h-96">
        {selectedArea && (
          <>
            <h1 className="text-3xl">{selectedArea}</h1>
            <p></p>
          </>
        )}
        {selectedCategory && (
          <span className="text-2xl">{selectedCategory}</span>
        )}
        {selectedHabit && <span className="text-2xl"> - {selectedHabit}</span>}

        <p>
          Completions: <span className="text-red">{completionsCount}</span>
        </p>
        <p>
          Non-Completions:{" "}
          <span className="text-red">{nonCompletionsCount}</span>
        </p>
        <p>
          Total:{" "}
          <span className="text-red">
            {completionsCount + nonCompletionsCount}
          </span>
        </p>
        <p>
          Completion Rate:{" "}
          <span className="text-red">
            {parseInt(completionRate).toFixed(2)}%
          </span>
        </p>

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
