import { config } from "../config";
import { logError, logInfo } from "../logger";
import { ApiPayload, ApiResult, AvailabilityStatus, EnumStatusType } from "../types";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const isApiPayload = (data: unknown): data is ApiPayload => {
  if (!data || typeof data !== "object") return false;
  const maybe = data as Record<string, unknown>;
  return Array.isArray(maybe.dias) && Array.isArray(maybe.periodos);
};

const evaluateStatus = (data: unknown): AvailabilityStatus => {
  if (!isApiPayload(data)) return "unknown";
  const hasActiveDay = data.dias.some((d) => d.estado === EnumStatusType.ACTIVE || d.estado === 0);
  return hasActiveDay ? "available" : "unavailable";
};

const fetchWithTimeout = async (url: string, timeoutMs: number) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

export const fetchAvailability = async (): Promise<ApiResult> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(config.apiUrl, config.pollTimeoutMs);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const json = (await response.json()) as unknown;
      const status = evaluateStatus(json);
      return { raw: json, status };
    } catch (error) {
      lastError = error;
      logError(`[poll] attempt ${attempt} failed: ${(error as Error).message}`);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Unknown fetch error");
};
