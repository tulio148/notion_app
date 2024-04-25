import { fetchAndInsertHabits, populateHabitCompletionTable } from "./actions";
import Dashboard from "./dashboard";

export default async function Home() {
  fetchAndInsertHabits()
    .then(() => populateHabitCompletionTable())
    .catch((error) => {
      console.error("Error fetching and inserting habits:", error);
    });
  return (
    <>
      <Dashboard />
    </>
  );
}
