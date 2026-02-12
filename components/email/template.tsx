import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  message,
  actionUrl,
  actionText,
}) => (
  <div style={{ fontFamily: "sans-serif", padding: "20px", color: "#333" }}>
    <h1>Hello, {firstName}!</h1>
    <p style={{ fontSize: "16px", lineHeight: "1.5" }}>{message}</p>

    {actionUrl && (
      <div style={{ marginTop: "20px" }}>
        <a
          href={actionUrl}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "10px 20px",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          {actionText || "View Details"}
        </a>
      </div>
    )}

    <hr
      style={{ margin: "30px 0", border: "none", borderTop: "1px solid #eee" }}
    />
    <p style={{ fontSize: "12px", color: "#666" }}>
      DBKL Flat Management Portal
    </p>
  </div>
);
