import { express } from "@/configs/express.js";
import { checkDemoMode } from "@/startup/check-demo-mode.js";
import { checkMellisearchDB } from "@/startup/check-meilisearch-db.js";
import { checkDBConnection } from "@/startup/checkDBConnection.js";
import { commitMeilisearchCredentialsToRedis } from "@/startup/commit-meilisearch-key-to-redis.js";
import { migrateToLatest } from "@/startup/migrate-to-latest.js";

await checkDBConnection();
await migrateToLatest();
await checkMellisearchDB();
await checkDemoMode();
await commitMeilisearchCredentialsToRedis();

express.listen(3300, () => console.log("Listening on port 3300"));
