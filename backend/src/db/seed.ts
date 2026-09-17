import bcrypt from "bcryptjs";
import { db, initTables } from "./index.js";
import { users } from "./schema.js";
import { eq } from "drizzle-orm";

export async function seed(): Promise<void> {
  await initTables();

  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.username, "admin"),
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("123", 10);
    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });
    console.log("Admin account seeded successfully (username: admin, password: 123)");
  } else {
    console.log("Admin account already exists.");
  }
}

if (process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js")) {
  seed()
    .then(() => {
      console.log("Seeding complete.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}
