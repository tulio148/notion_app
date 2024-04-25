import { Buttons } from "./buttons";
import { fetchNames } from "./lib/names";
import { fetchCompletions } from "./lib/completions";
import ChartComponent from "./chart";
export default async function Dashboard() {
  const { areaNames, categoryNames, habitNames } = await fetchNames();
  const { habitCompletions, categoryCompletions, areaCompletions } =
    await fetchCompletions();

  return (
    <div className="p-2 flex flex-col gap-3 ">
      <Buttons
        areas={areaNames}
        categories={categoryNames}
        habits={habitNames}
      />
      <ChartComponent
        habitCompletions={habitCompletions}
        categoryCompletions={categoryCompletions}
        areaCompletions={areaCompletions}
      />
    </div>
  );
}
