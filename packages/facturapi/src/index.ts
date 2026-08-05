import * as FacturapiModule from "facturapi";

type Facturapi = FacturapiModule.default;
const Facturapi = FacturapiModule.default as unknown as {
  new (
    apiKey: string,
    options?: FacturapiModule.FacturapiOptions
  ): Facturapi;
};

let facturapiInstance: Facturapi | null = null;

export function getFacturapi(): Facturapi {
  if (!facturapiInstance) {
    const apiKey = process.env.FACTURA_API_KEY;
    if (!apiKey) {
      throw new Error(
        "FACTURA_API_KEY is not defined in environment variables"
      );
    }

    facturapiInstance = new Facturapi(apiKey, { apiVersion: "v2" });
  }

  return facturapiInstance;
}

export const facturapi = new Proxy({} as Facturapi, {
  get: (_target, prop) => {
    return getFacturapi()[prop as keyof Facturapi];
  },
});
