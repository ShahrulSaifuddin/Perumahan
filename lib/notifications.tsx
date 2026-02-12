import { resend, EMAIL_FROM } from "./resend";
import { EmailTemplate } from "@/components/email/template";

// In a real app, you might want to queue these or handle errors more robustly.

export async function sendComplaintReceivedEmail(
  email: string,
  name: string,
  complaintId: string,
  title: string,
) {
  if (!email) return;

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [email],
      subject: `Complaint Received: ${title}`,
      react: (
        <EmailTemplate
          firstName={name}
          message={`We have received your complaint "${title}". Reference ID: #${complaintId.slice(0, 8)}. Our team will review it shortly.`}
          actionUrl={`${process.env.NEXT_PUBLIC_APP_URL}/complaints/${complaintId}`}
          actionText="View Complaint"
        />
      ),
    });

    if (error) console.error("Resend Error (Received):", error);
  } catch (e) {
    console.error("Email Send Failed:", e);
  }
}

export async function sendComplaintStatusUpdateEmail(
  email: string,
  name: string,
  complaintId: string,
  status: string,
  title: string,
) {
  if (!email) return;

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [email],
      subject: `Complaint Update: ${title}`,
      react: (
        <EmailTemplate
          firstName={name}
          message={`Your complaint "${title}" has been updated to status: ${status}.`}
          actionUrl={`${process.env.NEXT_PUBLIC_APP_URL}/complaints/${complaintId}`}
          actionText="View Update"
        />
      ),
    });

    if (error) console.error("Resend Error (Status):", error);
  } catch (e) {
    console.error("Email Send Failed:", e);
  }
}

export async function sendTransactionStatusUpdateEmail(
  email: string,
  name: string,
  type: string,
  status: string,
  amount: number,
) {
  if (!email) return;

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [email],
      subject: `Transaction ${status}: RM ${amount}`,
      react: (
        <EmailTemplate
          firstName={name}
          message={`Your ${type} transaction for RM ${amount} has been ${status}.`}
          actionUrl={`${process.env.NEXT_PUBLIC_APP_URL}/finance/transactions`}
          actionText="View Finance"
        />
      ),
    });

    if (error) console.error("Resend Error (Transaction):", error);
  } catch (e) {
    console.error("Email Send Failed:", e);
  }
}
