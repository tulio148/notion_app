import { getHabits } from "./actions";
import Habit from "./habits";
export default async function Home() {
  const personalDB = process.env.NOTION_PERSONAL_HABITS;
  const fitnessDB = process.env.NOTION_FITNESS_HABITS;
  const houseDB = process.env.NOTION_HOUSE_HABITS;
  const workDB = process.env.NOTION_WORK_HABITS;
  const financeDB = process.env.NOTION_FINANCE_HABITS;

  const { tags: personalHabitsTags, habits: personalHabits } = await getHabits(
    personalDB
  );
  const { tags: fitnessHabitsTags, habits: fitnessHabits } = await getHabits(
    fitnessDB
  );
  const { tags: houseHabitsTags, habits: houseHabits } = await getHabits(
    houseDB
  );
  const { tags: workHabitsTags, habits: workHabits } = await getHabits(workDB);
  const { tags: financeHabitsTags, habits: financeHabits } = await getHabits(
    financeDB
  );

  return (
    <>
      <Habit habits={personalHabits} tags={personalHabitsTags} />
      <Habit habits={fitnessHabits} tags={fitnessHabitsTags} />
      <Habit habits={houseHabits} tags={houseHabitsTags} />
      <Habit habits={workHabits} tags={workHabitsTags} />
      <Habit habits={financeHabits} tags={financeHabitsTags} />
    </>
  );
}
