import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function fetchItems(dbId, type) {
  const allItems = [];

  try {
    let cursor = undefined;

    while (true) {
      let response;

      if (type === "tags") {
        response = await notion.databases.retrieve({
          database_id: dbId,
        });

        response.properties.Tags.multi_select.options.forEach((item) =>
          allItems.push(item.name)
        );

        break;
      } else if (type === "habits") {
        response = await notion.databases.query({
          database_id: dbId,
          start_cursor: cursor,
          page_size: 100,
        });

        const { results, has_more, next_cursor } = response;

        allItems.push(...results);

        if (!has_more) {
          break;
        }

        cursor = next_cursor;
      } else {
        throw new Error("Invalid type specified");
      }
    }
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return [];
  }

  return allItems;
}

export async function getHabits(dbId) {
  try {
    const tags = await fetchItems(dbId, "tags");
    const habits = await fetchItems(dbId, "habits");
    return { tags, habits };
  } catch (error) {
    console.error("Error getting habits:", error);
    return { tags: [], habits: [] };
  }
}
