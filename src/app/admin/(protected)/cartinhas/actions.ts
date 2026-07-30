"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireCurrentAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function revalidateLetterPages(): void {
	revalidatePath("/admin");
	revalidatePath("/admin/cartinhas");
	revalidatePath("/cartinhas");
}

export async function approveLetterAction(letterId: string): Promise<void> {
	await requireCurrentAdmin();

	await prisma.letter.update({
		where: {
			id: letterId,
		},
		data: {
			status: "APPROVED",
		},
	});

	revalidateLetterPages();
}

export async function hideLetterAction(letterId: string): Promise<void> {
	await requireCurrentAdmin();

	await prisma.letter.update({
		where: {
			id: letterId,
		},
		data: {
			status: "HIDDEN",
		},
	});

	revalidateLetterPages();
}

export async function rejectLetterAction(letterId: string): Promise<void> {
	await requireCurrentAdmin();

	await prisma.letter.update({
		where: {
			id: letterId,
		},
		data: {
			status: "REJECTED",
		},
	});

	revalidateLetterPages();
}

export async function updateLetterAction(letterId: string, formData: FormData): Promise<void> {
	await requireCurrentAdmin();

	const authorName = String(formData.get("authorName") ?? "").trim();
	const message = String(formData.get("message") ?? "").trim();
	const isAnonymous = formData.get("isAnonymous") === "on";

	if (authorName.length < 2) throw new Error("Informe o nome do autor.");
	if (message.length < 2) throw new Error("Informe o conteúdo da cartinha.");

	await prisma.letter.update({
		where: {
			id: letterId,
		},
		data: {
			authorName,
			message,
			isAnonymous
		}
	});

	revalidateLetterPages();

	redirect("/admin/cartinhas");
}

export async function deleteLetterAction(letterId: string): Promise<void> {
	await requireCurrentAdmin();

	await prisma.letter.delete({
		where: {
			id: letterId
		}
	});

	revalidateLetterPages();
}