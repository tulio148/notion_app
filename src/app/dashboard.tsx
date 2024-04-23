import { Buttons } from "./buttons";
import { fetchData } from "./lib/names";
import { getHabitCompletion } from "./actions";
import ChartComponent from "./chart";
export default async function Dashboard() {
  const { areaNames, categoryNames, habitNames } = await fetchData();
  const completions = await getHabitCompletion();
  console.log(completions);
  return (
    <div>
      <Buttons
        areas={areaNames}
        categories={categoryNames}
        habits={habitNames}
      />
      <ChartComponent completions={completions} habitNames={habitNames} />
    </div>
  );
}
