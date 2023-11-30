import checkDBConnection from "@/utils/startup-tasks/check-db-connection";
import checkDemoMode from "@/utils/startup-tasks/check-demo-mode";
import checkMellisearchDB from "@/utils/startup-tasks/check-meilisearch-db";
import setDefaultSearchKey from "@/utils/startup-tasks/set-default-search-key";
import validateEnvVariables from "@/utils/startup-tasks/validate-env-variables";

const runStartupTasks = async () => {
  try {
    validateEnvVariables();

    await checkDBConnection();

    await checkMellisearchDB();

    await checkDemoMode();

    await setDefaultSearchKey();
  } catch (error) {
    process.exit(1);
  }
};

export default runStartupTasks;
