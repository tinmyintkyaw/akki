import checkDBConnection from "@/utils/startup-tasks/check-db-connection";
import checkDemoMode from "@/utils/startup-tasks/check-demo-mode";
import checkTypesenseDB from "@/utils/startup-tasks/check-typesense-db";

const runStartupTasks = async () => {
  try {
    await checkDBConnection();

    await checkTypesenseDB();

    await checkDemoMode();
  } catch (error) {
    process.exit(1);
  }
};

export default runStartupTasks;
