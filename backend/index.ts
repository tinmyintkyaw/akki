import { parsedProcessEnv } from "@/configs/env-variables.js";
import { express } from "@/configs/express.js";
import { logger } from "@/configs/logger.js";
import { checkDBConnection } from "@/startup/check-db-connection.js";
import { checkDemoMode } from "@/startup/check-demo-mode.js";
import { checkMellisearchDB } from "@/startup/check-meilisearch-db.js";
import { commitMeilisearchCredentialsToRedis } from "@/startup/commit-meilisearch-key-to-redis.js";
import { migrateToLatest } from "@/startup/migrate-to-latest.js";

await checkDBConnection();
await migrateToLatest();
await checkMellisearchDB();
await checkDemoMode();
await commitMeilisearchCredentialsToRedis();

const port = parsedProcessEnv.PORT;
express.listen(port, () => logger.info(`Listening on port ${port}`));
