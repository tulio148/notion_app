"use client";
import { BarChart } from "@mui/x-charts";
export default function Habit({ habitsData, tagList }) {
  const today = new Date();

  const filteredHabits = habitsData.filter((item) => {
    const startDateString = item.properties.Date.date.start;
    const startDate = new Date(startDateString);
    return startDate < today;
  });

  let totalHabitRate = (
    (filteredHabits.reduce((acc, habit) => {
      if (habit.properties.Status.status.name === "Done") {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0) /
      filteredHabits.length) *
    100
  ).toFixed(1);

  const calculateTagRate = (tagName, data) => {
    const tagHabits = data.filter((habit) =>
      habit.properties.Tags.multi_select.some((item) => item.name === tagName)
    );

    const totalDoneCount = tagHabits.reduce((acc, habit) => {
      if (habit.properties.Status.status.name === "Done") {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    const totalCount = tagHabits.length;

    const rate = ((totalDoneCount / totalCount) * 100).toFixed(1);

    return {
      tagName: tagName,
      rate: rate,
      totalDoneCount: totalDoneCount,
      totalCount: totalCount,
    };
  };

  const tagRates = tagList.map((tagName) =>
    calculateTagRate(tagName, filteredHabits)
  );

  const valueFormatter = (value: number | null) => `${value}%`;
  return (
    <>
      <p>{totalHabitRate}%</p>
      <BarChart
        yAxis={[
          {
            label: "Completion (%)",
          },
        ]}
        xAxis={[
          {
            scaleType: "band",
            data: tagRates.map((item) => item.tagName),
            categoryGapRatio: 0.4,
          },
        ]}
        series={[{ data: tagRates.map((item) => item.rate), valueFormatter }]}
        width={1000}
        height={300}
        colors={["#2196F3", "#4CAF50", "#FFC107", "#E91E63", "#9C27B0"]}
        grid={{
          horizontal: true,
        }}
      />
    </>
  );
}
