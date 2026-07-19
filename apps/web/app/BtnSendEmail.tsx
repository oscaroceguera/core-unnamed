"use client";

import { startTransition } from "react";

import { emailSender } from "./email-sender";

export const BtnSendEmail = () => {
  const handleSendEmail = () => {
    startTransition(async () => {
      const result = await emailSender();
      console.log("emailSender result:", result);
    });
  };

  return (
    <button
      onClick={handleSendEmail}
      className="rounded-2xl border bg-orange-700 p-4 text-white"
    >
      Send Email
    </button>
  );
};
