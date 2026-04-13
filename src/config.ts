import dotenv from "dotenv";
import { AppConfig } from "./types";

dotenv.config();

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return ["true", "1", "yes"].includes(value.toLowerCase());
};

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const n = Number(value);
  if (Number.isNaN(n)) return fallback;
  return n;
};

export const config: AppConfig = {
  apiUrl: required("API_URL"),
  apiFieldPath: required("API_FIELD_PATH"),
  apiAvailableValue: required("API_AVAILABLE_VALUE"),
  pollTimeoutMs: parseNumber(process.env.POLL_TIMEOUT_MS, 8000),
  smtp: {
    host: required("SMTP_HOST"),
    port: parseNumber(process.env.SMTP_PORT, 587),
    secure: parseBoolean(process.env.SMTP_SECURE, false),
    user: required("SMTP_USER"),
    pass: required("SMTP_PASS"),
  },
  email: {
    from: required("EMAIL_FROM"),
    to: required("EMAIL_TO"),
  },
};
