"use client";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
export default function Habit({ habits, tags }) {
  const today = new Date();

  const filteredHabits = habits.filter((item) => {
    const startDateString = item.properties.Date.date.start;
    const startDate = new Date(startDateString);
    return startDate <= today;
  });
  console.log(new Date(habits[0].properties.Date.date.start));
  // console.log(today);
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

  const calculateNameRate = (tagName, data) => {
    const filteredHabits = data.filter((habit) =>
      habit.properties.Tags.multi_select.some((item) => item.name === tagName)
    );

    const nameGroups = filteredHabits.reduce((acc, habit) => {
      const habitName = habit.properties.Name.title[0].plain_text;
      acc[habitName] = acc[habitName] || { total: 0, done: 0 };
      acc[habitName].total++;
      if (habit.properties.Status.status.name === "Done") {
        acc[habitName].done++;
      }
      return acc;
    }, {});

    const nameRates = Object.entries(nameGroups).map(
      ([name, { done, total }]) => ({
        name,
        rate: ((done / total) * 100).toFixed(1),
        total: total,
        done: done,
      })
    );

    return nameRates;
  };
  // console.log(calculateNameRate(tags[0], filteredHabits));
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
  const tagRates = tags.map((tagName) => ({
    tagName,
    nameRates: calculateNameRate(tagName, filteredHabits),
  }));
  // console.log(tagRates);
  // const tagRates = tags.map((tagName) =>
  //   calculateTagRate(tagName, filteredHabits)
  // );
  const rows: GridRowsProp = [
    { id: 1, col1: "Hello", col2: "World" },
    { id: 2, col1: "DataGridPro", col2: "is Awesome" },
    { id: 3, col1: "MUI", col2: "is Amazing" },
  ];
  const transformedData = [];

  // Using nested loops to iterate over tagRates and nameRates
  tagRates.forEach((category, categoryId) => {
    const { tagName, nameRates } = category;

    nameRates.forEach((item, index) => {
      transformedData.push({
        id: index,
        habitName: item.name,
        category: tagName,
        completion: item.rate,
        total: item.total,
        done: item.done,
      });
    });
  });

  // console.log(transformedData);

  const columns: GridColDef[] = [
    { field: "habitName", headerName: "Name", width: 300 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "completion", headerName: "Completion", width: 100 },
  ];
  return (
    <>
      {" "}
      {/* <div className="p-5">
        <DataGrid rows={transformedData} columns={columns} />
      </div> */}
    </>
  );
}
