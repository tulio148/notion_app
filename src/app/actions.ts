import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function fetchHabits(dbId) {
  const allHabits = [];
  let cursor = undefined;

  try {
    while (true) {
      const response = await notion.databases.query({
        database_id: dbId,
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
