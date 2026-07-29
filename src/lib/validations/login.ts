import { z } from "zod";

export const adminLoginSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Informe o e-mail.")
		.email("Informe um e-mail válido.")
		.transform((email) => email.toLowerCase()),

	password: z
		.string()
		.min(1, "Informe a senha.")
		.max(200, "Senha inválida."),
});

export type AdminLoginInput = z.infer< typeof adminLoginSchema >;