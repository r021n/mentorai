import { beforeAll } from "../test-utils.js";
import { initTables, client } from "../../src/db/index.js";
import { seed } from "../../src/db/seed.js";

export async function clearAllTables() {
  await client.execute("DELETE FROM answers;");
  await client.execute("DELETE FROM questions;");
  await client.execute("DELETE FROM topics;");
  await client.execute("DELETE FROM users WHERE username != 'admin';");
}

beforeAll(async () => {
  await initTables();
  await clearAllTables();
  await seed();
});
