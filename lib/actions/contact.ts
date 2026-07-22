"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

// ponytail: in-memory map, resets on cold start and isn't shared across
// serverless instances. Swap for Upstash/Vercel KV if abuse becomes real.
const submissions = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = submissions.get(ip);

  if (!entry || now > entry.resetAt) {
    submissions.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
  /** Honeypot - real users never fill this in. */
  company?: string;
}

export interface ContactFormResult {
  success: boolean;
  message: string;
}

export async function sendContactMessage(
  input: ContactFormInput,
): Promise<ContactFormResult> {
  // Bots fill hidden fields humans never see - reject silently, no error shown.
  if (input.company) {
    return { success: true, message: "Message sent successfully." };
  }

  const name = input.name?.trim();
  const email = input.email?.trim();
  const message = input.message?.trim();

  if (!name || !email || !message) {
    return { success: false, message: "Please fill in all fields." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return {
      success: false,
      message: "Too many messages sent. Please try again later.",
    };
  }

  try {
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <contact@akshforge.com>",
      to: "aksh.patil2706@gmail.com",
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      return {
        success: false,
        message: "Failed to send message. Please try again later.",
      };
    }

    return { success: true, message: "Message sent successfully." };
  } catch {
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
  }
}
