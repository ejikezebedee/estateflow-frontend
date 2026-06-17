export function euro(value?: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value ?? 0);
}

export function cls(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
