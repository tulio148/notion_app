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

  return (
    <>
      <p>{totalHabitRate}%</p>
      {tagRates.map((tag) => (
        //   <ul>
        //       <li key={tag.tagName}>
        //         {tag.tagName}: {tag.rate}%
        //       </li>
        <BarChart
          xAxis={[{ scaleType: "band", data: [tag.tagName] }]}
          series={[{ data: [tag.rate] }]}
          width={500}
          height={300}
          colors={["blue"]}
        />
      ))}
      {/* </ul> */}
    </>
  );
}
