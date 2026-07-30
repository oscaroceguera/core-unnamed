import * as FacturapiModule from "facturapi";

type Facturapi = FacturapiModule.default;
type FacturapiCtor = new (
  apiKey: string,
  options?: FacturapiModule.FacturapiOptions
) => Facturapi;

const Facturapi = FacturapiModule.default as unknown as FacturapiCtor;

let facturapiInstance: Facturapi | null = null;

export function getFaturapi(): Facturapi {
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

export const factuapi = new Proxy({} as Facturapi, {
  get: (_target, prop) => {
    return getFaturapi()[prop as keyof Facturapi];
  },
});
