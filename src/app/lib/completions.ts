import {
  getHabitCompletion,
  getCategoryCompletion,
  getAreaCompletion,
} from "../actions";
export async function fetchCompletions() {
  try {
    const habitCompletions = await getHabitCompletion();
    const categoryCompletions = await getCategoryCompletion();
    const areaCompletions = await getAreaCompletion();
    return { habitCompletions, categoryCompletions, areaCompletions };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
