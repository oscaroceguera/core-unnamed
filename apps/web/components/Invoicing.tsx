"use client";

import { useActionState } from "react";
import { Card } from "@repo/ui/Card";

import { createInvoice } from "@/actions/invoice-action";
import type { InvoicingState } from "@/types/invoice-schema";

const FIELDS = [
  { name: "rfc", value: "OEBO850514QL5" },
  { name: "legalName", value: "Oscar Eduardo Oceguera Bibriesca" },
  { name: "taxRegime", value: "616" },
  { name: "postalCode", value: "80140" },
  { name: "cfdiUse", value: "S01" },
  { name: "buyerEmail", value: "oscar@jsconf.mx" },
  { name: "orderId", value: "test-order-id" },
  { name: "checkoutSessionId", value: "test-checkout-session-id" },
  { name: "ticketType", value: "early-bird" },
  { name: "quantity", value: "1" },
];

const initialState: InvoicingState = {};

export function Invoicing() {
  const [state, formAction, pending] = useActionState(
    createInvoice,
    initialState
  );
  console.log("🚀 ~ Invoicing ~ state:", state);

  return (
    <Card title="Checkout with stripe">
      <p className="py-5">Invoice</p>
      <form className="grid grid-cols-2 gap-2" action={formAction}>
        {FIELDS.map((field) => (
          <input
            key={field.name}
            defaultValue={field.value}
            name={field.name}
            className="rounded-md border border-slate-300 px-2 py-1"
          />
        ))}
        <button
          type="submit"
          className="rounded-md border bg-green-600 font-bold text-white"
        >
          {pending ? "Loading.." : "Invoice"}
        </button>
      </form>
      {state.success && <p className="text-green-600">Invoice sent!</p>}
      {state.facturapiError && (
        <p className="text-red-600">{state.facturapiError}</p>
      )}
      {state.errors && (
        <pre className="text-red-600">
          {JSON.stringify(state.errors, null, 2)}
        </pre>
      )}
    </Card>
  );
}
