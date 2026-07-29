export function formatCurrency(valueInCents: number): string {
	return new Intl.NumberFormat("pt-BR", {style: "currency",currency: "BRL"}).format(valueInCents / 100);
}

export function parseCurrencyToCents(value: string): number {
	const normalizedValue = value
		.trim()
		.replace(/\s/g, "")
		.replace(/R\$/gi, "")
		.replace(/\./g, "")
		.replace(",", ".");

	const parsedValue = Number(normalizedValue);

	if (!Number.isFinite(parsedValue)) return Number.NaN;

	return Math.round(parsedValue * 100);
}

export function formatCentsForInput(valueInCents: number ): string {
	return (valueInCents / 100).toFixed(2).replace(".", ",");
}