import nodemailer from "nodemailer";
import { config } from "../config";
import { logInfo, logError } from "../logger";

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

export const sendAvailabilityEmail = async (message: string) => {
  const mail = {
    from: config.email.from,
    to: config.email.to,
    subject: "Appointments available",
    text: message,
  };

  await transporter.sendMail(mail);
  logInfo("[notify] availability email sent");
};

export const sendHealthEmail = async () => {
  const mail = {
    from: config.email.from,
    to: config.email.to,
    subject: "Appointment bot heartbeat",
    text: "Appointment bot is working and looking for a free spot.",
  };

  await transporter.sendMail(mail);
  logInfo("[notify] health email sent");
};

export const verifyTransport = async () => {
  try {
    await transporter.verify();
    logInfo("[notify] SMTP connection verified");
  } catch (err) {
    logError("[notify] SMTP verification failed", err);
    throw err;
  }
};
