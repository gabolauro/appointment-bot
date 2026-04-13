import { startPoller } from "./services/poller";
import { config } from "./config";
import { logInfo, logError } from "./logger";
import { verifyTransport } from "./services/notifier";

const bootstrap = async () => {
  logInfo("Appointments monitor starting…");
  logInfo(`Monitoring ${config.apiUrl} at field ${config.apiFieldPath}`);
  await verifyTransport();
  startPoller();
};

bootstrap().catch((err) => {
  logError("Fatal error during startup", err);
  process.exit(1);
});
