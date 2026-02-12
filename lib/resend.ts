
import { Resend } from 'resend';

// Use a default key for build/dev if not provided, but it won't send.
const apiKey = process.env.RESEND_API_KEY || 're_123456789';

export const resend = new Resend(apiKey);

export const EMAIL_FROM = "DBKL Portal <onboarding@resend.dev>"; // Use standard Resend testing domain
