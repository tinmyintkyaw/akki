import checkDBConnection from "@/utils/startup-tasks/check-db-connection";
import checkDemoMode from "@/utils/startup-tasks/check-demo-mode";
import checkTypesenseDB from "@/utils/startup-tasks/check-typesense-db";
import setDefaultSearchKey from "@/utils/startup-tasks/set-default-search-key";
import validateEnvVariables from "@/utils/startup-tasks/validate-env-variables";

const runStartupTasks = async () => {
  try {
    validateEnvVariables();

    await checkDBConnection();

    await checkTypesenseDB();

    await checkDemoMode();

    await setDefaultSearchKey();
  } catch (error) {
    process.exit(1);
  }
};

export default runStartupTasks;
