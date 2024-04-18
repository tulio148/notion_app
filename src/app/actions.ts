import { Client } from "@notionhq/client";
import { conn } from "./lib/db";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function fetchAndInsertHabits() {
  const databases = [
    { dbId: process.env.NOTION_PERSONAL_HABITS, area: "Personal" },
    { dbId: process.env.NOTION_FITNESS_HABITS, area: "Fitness" },
    { dbId: process.env.NOTION_HOUSE_HABITS, area: "House" },
    { dbId: process.env.NOTION_WORK_HABITS, area: "Work" },
    { dbId: process.env.NOTION_FINANCE_HABITS, area: "Finance" },
  ];

  try {
    const allItems = [];

    await Promise.all(
      databases.map(async ({ dbId }) => {
        let cursor = undefined;

        while (true) {
          const response = await notion.databases.query({
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
        }
      })
    );

    const habitsToInsert = allItems.map((item) => ({
      id: item.id,
      last_edited: item.last_edited_time,
      category_name: item.properties.Category.select.name,
      category_id: item.properties.Category.select.id,
      status: item.properties.Status.status.name,
      date: item.properties.Date.date.start,
      name: item.properties.Name.title[0].plain_text,
      area: item.parent.database_id.replace(/-/g, ""),
    }));

    const client = await conn.connect();

    await client.query("BEGIN");

    try {
      for (const habit of habitsToInsert) {
        const existingHabitResult = await client.query(
          `
          SELECT last_edited
          FROM habit
          WHERE id = $1
          `,
          [habit.id]
        );

        if (existingHabitResult.rows.length > 0) {
          const existingLastEdited = existingHabitResult.rows[0].last_edited;

          if (existingLastEdited !== habit.last_edited) {
            await client.query(
              `
              UPDATE habit
              SET last_edited = $1,
                  category_name = $2,
                  status = $3,
                  date = $4,
                  name = $5
              WHERE id = $6;
              `,
              [
                habit.last_edited,
                habit.category_name,
                habit.status,
                habit.date,
                habit.name,
                habit.id,
              ]
            );
          }
        } else {
          await client.query(
            `
            INSERT INTO category (name, area_id)
            VALUES ($1, $2)
            ON CONFLICT (name) DO NOTHING;
            `,
            [habit.category_name, habit.area]
          );
          await client.query(
            `
            INSERT INTO habit (id, last_edited, category_name, status, date, name)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING;
            `,
            [
              habit.id,
              habit.last_edited,
              habit.category_name,
              habit.status,
              habit.date,
              habit.name,
            ]
          );
        }
      }

      await client.query("COMMIT");
      console.log("Habits and categories inserted or updated successfully!");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(
        "Error inserting or updating habits and categories:",
        error
      );
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching and inserting habits:", error);
    throw error;
  }
}

export async function populateCompletionTable() {
  const client = await conn.connect();

  try {
    const getAllQuery = `SELECT id, name, 
    date, 
 SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) 
   OVER (PARTITION BY name ORDER BY date) AS cumulative_done_count,
 SUM(CASE WHEN status = 'Not started' THEN 1 ELSE 0 END) 
   OVER (PARTITION BY name ORDER BY date) AS cumulative_not_started_count
FROM habit
ORDER BY name, date DESC;`;
    const result = await client.query(getAllQuery);
    for (const row of result.rows) {
      await client.query(
        `INSERT INTO habit_completion (habit_id, habit_name, date, cumulative_done_count, cumulative_not_started_count, completion_ratio) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (habit_id) DO UPDATE SET habit_name = $2, date = $3, cumulative_done_count = $4, cumulative_not_started_count = $5, completion_ratio = $6;
         `,
        [
          row.id,
          row.name,
          row.date,
          row.cumulative_done_count,
          row.cumulative_not_started_count,
          (parseInt(row.cumulative_done_count) /
            (parseInt(row.cumulative_done_count) +
              parseInt(row.cumulative_not_started_count))) *
            100,
        ]
      );
    }
    console.log("Completion table updated successfully!");
  } catch (error) {
    console.error("Error populating completion table:", error);
  } finally {
    client.release();
  }
}

export async function getHabitCompletionByArea(areaName) {
  const client = await conn.connect();
  try {
    const areaQuery = "SELECT id FROM area WHERE name = $1";
    const areaResult = await client.query(areaQuery, [areaName]);
    const areaId = areaResult.rows[0]?.id;

    if (!areaId) {
      throw new Error(`Area '${areaName}' not found.`);
    }

    const completionQuery = `
      SELECT hc.*
      FROM habit_completion hc
      JOIN habit h ON hc.habit_id = h.id
      JOIN category c ON h.category_name = c.name
      WHERE c.area_id = $1
      ORDER BY hc.date;
    `;
    const completionResult = await client.query(completionQuery, [areaId]);
    return completionResult.rows;
  } finally {
    client.release();
  }
}

export async function getHabitCompletionByCategory(categoryName) {
  const client = await conn.connect();
  try {
    const categoryQuery = "SELECT name FROM category WHERE name = $1";
    const categoryResult = await client.query(categoryQuery, [categoryName]);
    const categoryId = categoryResult.rows[0]?.id;

    if (!categoryId) {
      throw new Error(`Category '${categoryName}' not found.`);
    }

    const completionQuery = `
      SELECT hc.*
      FROM habit_completion hc
      JOIN habit h ON hc.habit_id = h.id
      WHERE h.category_name = $1
      ORDER BY hc.date;
    `;
    const completionResult = await client.query(completionQuery, [categoryId]);
    return completionResult.rows;
  } finally {
    client.release();
  }
}

export async function getHabitCompletionByName(habitName) {
  const client = await conn.connect();
  try {
    const habitQuery = "SELECT id FROM habit WHERE name = $1";
    const habitResult = await client.query(habitQuery, [habitName]);
    const habitId = habitResult.rows[0]?.id;

    if (!habitId) {
      throw new Error(`Habit '${habitName}' not found.`);
    }

    const completionQuery = `
      SELECT *
      FROM habit_completion
      WHERE habit_id = $1
      ORDER BY date;
    `;
    const completionResult = await client.query(completionQuery, [habitId]);
    return completionResult.rows;
  } finally {
    client.release();
  }
}

export async function getAreaNames() {
  const client = await conn.connect();
  try {
    const areaQuery = "SELECT name FROM area ORDER BY name";
    const areaResult = await client.query(areaQuery);
    return areaResult.rows.map((row) => row.name);
  } finally {
    client.release();
  }
}

export async function getCategoryNames(areaName) {
  const client = await conn.connect();
  try {
    const areaQuery = "SELECT id FROM area WHERE name = $1";
    const areaResult = await client.query(areaQuery, [areaName]);
    const areaId = areaResult.rows[0]?.id;

    if (!areaId) {
      throw new Error(`Area '${areaName}' not found.`);
    }

    const categoryQuery = `
      SELECT name
      FROM category
      WHERE area_id = $1
      ORDER BY name;
    `;
    const categoryResult = await client.query(categoryQuery, [areaId]);
    return categoryResult.rows.map((row) => row.name);
  } finally {
    client.release();
  }
}

export async function getHabitNames(categoryName) {
  const client = await conn.connect();
  try {
    if (!categoryName) {
      throw new Error(`Category '${categoryName}' not found.`);
    }

    const habitQuery = `
      SELECT DISTINCT name
      FROM habit
      WHERE category_name = $1
      ORDER BY name;
    `;
    const habitResult = await client.query(habitQuery, [categoryName]);
    return habitResult.rows.map((row) => row.name);
  } finally {
    client.release();
  }
}
