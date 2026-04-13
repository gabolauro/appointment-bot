import cron from "node-cron";
import { fetchAvailability } from "../providers/appointmentsApi";
import { sendAvailabilityEmail, sendHealthEmail } from "./notifier";
import { AvailabilityStatus } from "../types";
import { logInfo, logError } from "../logger";

const businessHoursSchedule = "*/5 8-20 * * *"; // every 5 min 08:00-20:59
const offHoursSchedule = "0 0-7,21-23 * * *"; // top of every hour outside business hours
const healthSchedule = "0 8 * * *"; // once daily at 08:00

let lastStatus: AvailabilityStatus | null = null;

const logStatus = (status: AvailabilityStatus) => {
  logInfo(`[poll] status=${status} previous=${lastStatus ?? "none"}`);
};

const maybeNotify = async (status: AvailabilityStatus) => {
  const becameAvailable = status === "available" && lastStatus !== "available";
  if (!becameAvailable) return;

  const body = "Appointments just became available. Visit the portal to book.";
  try {
    await sendAvailabilityEmail(body);
  } catch (err) {
    logError("[notify] failed to send email", err);
  }
};

const runCheck = async () => {
  try {
    const result = await fetchAvailability();
    logStatus(result.status);
    await maybeNotify(result.status);
    lastStatus = result.status;
  } catch (err) {
    logError("[poll] error", err);
  }
};

export const startPoller = () => {
  // run immediately on startup
  void runCheck();

  cron.schedule(businessHoursSchedule, () => {
    logInfo("[cron] business hours tick");
    void runCheck();
  });

  cron.schedule(offHoursSchedule, () => {
    logInfo("[cron] off hours tick");
    void runCheck();
  });

  cron.schedule(healthSchedule, () => {
    logInfo("[cron] health check tick");
    void sendHealthEmail().catch((err) => logError("[notify] health email failed", err));
  });

  logInfo("[poll] schedules registered");
};
