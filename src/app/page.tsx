import { fetchHabits } from "./actions";
import { personalList, fitnessList, houseList } from "./lib/tags";
import Habit from "./habits";
export default async function Home() {
  const personalDB = process.env.NOTION_PERSONAL_HABITS;
  const fitnessDB = process.env.NOTION_FITNESS_HABITS;
  const houseDB = process.env.NOTION_HOUSE_HABITS;
  const personalHabitsData = await fetchHabits(personalDB);
  const fitnessHabitsData = await fetchHabits(fitnessDB);
  const houseHabitsData = await fetchHabits(houseDB);
  return (
    <>
      <Habit habitsData={personalHabitsData} tagList={personalList} />
      <Habit habitsData={fitnessHabitsData} tagList={fitnessList} />
      <Habit habitsData={houseHabitsData} tagList={houseList} />
    </>
  );
}
