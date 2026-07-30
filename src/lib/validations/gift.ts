import { z } from "zod";

import { parseCurrencyToCents } from "@/lib/money";

const checkboxSchema = z
	.union([
		z.literal("on"),
		z.literal("true"),
		z.literal("false"),
		z.undefined(),
		z.null(),
	]).transform((value) => value === "on" || value === "true");

const optionalUrlSchema = z
	.string()
	.trim()
	.nullish()
	.transform((value) => value || null)
	.refine((value) => value === null || z.string().url().safeParse(value).success, "Informe uma URL válida." );

export const giftFormSchema = z
	.object({
		title: z
			.string()
			.trim()
			.min(3, "O título deve possuir pelo menos 3 caracteres.")
			.max(150, "O título deve possuir no máximo 150 caracteres."),

		description: z
			.string()
			.trim()
			.min(10, "A descrição deve possuir pelo menos 10 caracteres.")
			.max(5000, "A descrição é muito longa."),

		imageUrl: optionalUrlSchema,

		price: z
			.string()
			.trim()
			.min(1, "Informe o preço.")
			.transform(parseCurrencyToCents)
			.refine((value) => Number.isInteger(value) && value > 0, "Informe um preço válido."),

		storeUrl: optionalUrlSchema,

		allowStorePurchase: checkboxSchema,
		allowPix: checkboxSchema,
		hasQuotas: checkboxSchema,
		featured: checkboxSchema,

		quotaCount: z
			.string()
			.trim()
			.nullish()
			.transform((value) => {
				if (!value) return null;
				return Number(value);
			}),

		displayOrder: z
			.string()
			.trim()
			.transform((value) => Number(value || 0))
			.refine((value) => Number.isInteger(value) && value >= 0, "A ordem deve ser um número inteiro positivo."),
	}).superRefine((data, context) => {
		if (!data.allowPix && !data.allowStorePurchase) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["allowPix"],
				message: "Selecione pelo menos uma forma de presentear: Pix ou loja.",
			});
		}

		if (data.allowStorePurchase && !data.storeUrl) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["storeUrl"],
				message: "Informe o link da loja quando a compra pela loja estiver habilitada.",
			});
		}

		if (data.hasQuotas && (!data.quotaCount || !Number.isInteger(data.quotaCount) || data.quotaCount < 2)) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["quotaCount"],
				message:
				"Um presente dividido em cotas deve possuir pelo menos 2 cotas.",
			});
		}
	}).transform((data) => ({
		title: data.title,
		description: data.description,
		imageUrl: data.imageUrl,

		priceInCents: data.price,

		storeUrl: data.allowStorePurchase ? data.storeUrl : null,

		allowStorePurchase: data.allowStorePurchase,
		allowPix: data.allowPix,

		quotaCount: data.hasQuotas ? data.quotaCount : null,

		featured: data.featured,
		displayOrder: data.displayOrder,
}));

export type GiftFormData = z.infer<typeof giftFormSchema>;