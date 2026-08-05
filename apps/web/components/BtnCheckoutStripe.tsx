"use client";

import { useActionState } from "react";

import { checkoutStripe } from "@/actions/checkoutStripe";

export const BtnCheckoutStripe = () => {
  const [state, fromAction, pending] = useActionState(checkoutStripe, {
    ok: false,
  });
  console.log("🚀 ~ BtnCheckoutStripe ~ state:", state);

  return (
    <form action={fromAction}>
      <button className="rounded-md bg-black p-2 text-white">
        {pending ? "Loading..." : "Checkout 💵"}
      </button>
    </form>
  );
};
