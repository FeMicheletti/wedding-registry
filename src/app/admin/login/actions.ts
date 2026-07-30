"use server";

import { compare } from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { ADMIN_HOME_PATH } from "@/lib/auth/constants";
import { createAdminSession } from "@/lib/auth/session";
import { adminLoginSchema } from "@/lib/validations/login";
import { AdminStatus } from "@prisma/client";

export type LoginActionState = {
	success: boolean;
	message: string | null;
	fieldErrors?: {
		email?: string[];
		password?: string[];
	};
};

export async function loginAdminAction( _previousState: LoginActionState, formData: FormData ): Promise<LoginActionState> {
	const validation = adminLoginSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password")
	});

	if (!validation.success) {
		return {
			success: false,
			message: "Verifique os dados informados.",
			fieldErrors: validation.error.flatten().fieldErrors
		};
	}

	const { email, password } = validation.data;

	const admin = await prisma.adminUser.findUnique({
		where: {
			email
		},
		select: {
			id: true,
			passwordHash: true,
			status: true
		}
	});

	if (!admin) return { success: false, message: "E-mail ou senha inválidos." };

	if (admin.status !== AdminStatus.ACTIVE) return { success: false, message: "Este usuário está desativado." };

	const passwordMatches = await compare(
		password,
		admin.passwordHash,
	);

	if (!passwordMatches) return { success: false, message: "E-mail ou senha inválidos." };

	await createAdminSession(admin.id);
	redirect(ADMIN_HOME_PATH);
}