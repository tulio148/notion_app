import { fetchPersonalHabits, fetchFitnessHabits } from "./actions";
import { personalList, fitnessList } from "./lib/tags";
import Habit from "./habits";
export default async function Home() {
  const personalHabitsData = await fetchPersonalHabits();
  const fitnessHabitsData = await fetchFitnessHabits();
  return (
    <>
      <Habit habitsData={personalHabitsData} tagList={personalList} />
      <Habit habitsData={fitnessHabitsData} tagList={fitnessList} />
    </>
  );
}
