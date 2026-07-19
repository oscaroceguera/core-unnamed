"use client";

import { useTransition } from "react";

import { emailSender } from "./email-sender";

export const BtnSendEmail = () => {
  const [isPending, startTransition] = useTransition();

  const handleSendEmail = () => {
    startTransition(async () => {
      const result = await emailSender();
      console.log("emailSender result:", result);
    });
  };

  return (
    <button
      onClick={handleSendEmail}
      className="rounded-md bg-black p-2 text-white"
    >
      {isPending ? "Loading..." : "Send Email 📧"}
    </button>
  );
};
