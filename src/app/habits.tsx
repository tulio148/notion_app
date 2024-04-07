"use client";
export default function Habit({ habitsData, tagList }) {
  let totalHabitRate = (
    (habitsData.reduce((acc, habit) => {
      if (habit.properties.Status.status.name === "Done") {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0) /
      habitsData.length) *
    100
  ).toFixed(2);

  const calculateTagRate = (tagName, habitsData) => {
    const filteredHabits = habitsData.filter((habit) =>
      habit.properties.Tags.multi_select.some((item) => item.name === tagName)
    );

    const totalDoneCount = filteredHabits.reduce((acc, habit) => {
      if (habit.properties.Status.status.name === "Done") {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    const totalCount = filteredHabits.length;

    const rate = ((totalDoneCount / totalCount) * 100).toFixed(1);

    return {
      tagName: tagName,
      rate: rate,
      totalDoneCount: totalDoneCount,
      totalCount: totalCount,
    };
  };

  const tagRates = tagList.map((tagName) =>
    calculateTagRate(tagName, habitsData)
  );

  return (
    <>
      <p>{totalHabitRate}</p>
      <ul>
        {tagRates.map((tag) => (
          <li key={tag.tagName}>
            {tag.tagName}: {tag.rate}
          </li>
        ))}
      </ul>
    </>
  );
}
