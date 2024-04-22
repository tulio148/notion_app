import { getAreaNames, getCategoryNames, getHabitNames } from "./actions";
import { Buttons } from "./buttons";
import ChartComponent from "./chart";

export default async function Dashboard() {
  const areaNames = await getAreaNames();
  const categoryNames = [];
  for (const areaName of areaNames) {
    const categories = await getCategoryNames(areaName);
    categoryNames.push({ area: areaName, categories: categories });
  }

  const habitNames = [];
  await Promise.all(
    categoryNames.map(async (category) => {
      await Promise.all(
        category.categories.map(async (categoryName) => {
          const habits = await getHabitNames(categoryName);
          habitNames.push({
            area: category.area,
            category: categoryName,
            habits: habits,
          });
        })
      );
    })
  );

  console.log(habitNames);

  return (
    <div>
      <Buttons
        areas={areaNames}
        categories={categoryNames}
        habits={habitNames}
      />
      {/* <ChartComponent data={[]} /> */}
    </div>
  );
}
