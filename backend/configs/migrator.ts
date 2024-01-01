import { db } from "@/configs/kysely.js";
import { promises as fs } from "fs";
import { FileMigrationProvider, Migrator } from "kysely";
import * as path from "path";

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(process.cwd(), "migrations"),
  }),
});

export { migrator };
