import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function fetchPersonalHabits() {
  const allHabits = [];
  let cursor = undefined;

  try {
    while (true) {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_PERSONAL_HABITS,
        start_cursor: cursor,
        page_size: 100,
      });

      const { results, has_more, next_cursor } = response;

      allHabits.push(...results);

      if (!has_more) {
        break;
      }

      cursor = next_cursor;
    }
  } catch (error) {
    console.error("Error fetching habits:", error);
  }
  return allHabits;
}
export async function fetchFitnessHabits() {
  const allHabits = [];
  let cursor = undefined;

  try {
    while (true) {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_FITNESS_HABITS,
        start_cursor: cursor,
        page_size: 100,
      });

      const { results, has_more, next_cursor } = response;

      allHabits.push(...results);

      if (!has_more) {
        break;
      }

      cursor = next_cursor;
    }
  } catch (error) {
    console.error("Error fetching habits:", error);
  }
  console.log(allHabits);
  return allHabits;
}
