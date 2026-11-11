import { db } from "#/db/db.js";
import { promises as fs } from "fs";
import { FileMigrationProvider, Migrator } from "kysely/migration";
import * as path from "path";

export const migrate = async () => {
  try {
    console.log("Running database migrations");

    const migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(process.cwd(), "src", "db", "migrations"),
      }),
    });

    const { error, results } = await migrator.migrateToLatest();

    results?.forEach((it) => {
      if (it.status === "Success") {
        console.log(
          `migration "${it.migrationName}" was executed successfully`,
        );
      } else if (it.status === "Error") {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(error, "Failed to migrate");
    process.exit(1);
  }
};
