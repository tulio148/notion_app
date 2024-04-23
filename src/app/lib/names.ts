import { getAreaNames, getCategoryNames, getHabitNames } from "../actions";

export async function fetchData() {
  try {
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
    return { areaNames, categoryNames, habitNames };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
