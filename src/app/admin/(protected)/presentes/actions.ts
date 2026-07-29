"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { requireCurrentAdmin } from "@/lib/auth/session";
import { giftFormSchema } from "@/lib/validations/gift";
import { GiftActionState } from "./action-state";

async function generateUniqueGiftSlug(title: string, ignoredGiftId?: string): Promise<string> {
	const baseSlug = createSlug(title) || "presente";

	let slug = baseSlug;
	let suffix = 2;

	while (true) {
		const existingGift = await prisma.gift.findFirst({
			where: {
				slug,
				...(ignoredGiftId ? { id: { not: ignoredGiftId } } : {}),
			},
			select: {
				id: true
			}
		});

		if (!existingGift) return slug;

		slug = `${baseSlug}-${suffix}`;
		suffix += 1;
	}
}

export async function createGiftAction(_previousState: GiftActionState, formData: FormData): Promise<GiftActionState> {
	await requireCurrentAdmin();

	const validation = giftFormSchema.safeParse({
		title: formData.get("title"),
		description: formData.get("description"),
		imageUrl: formData.get("imageUrl"),
		price: formData.get("price"),
		storeUrl: formData.get("storeUrl"),
		allowStorePurchase: formData.get(
			"allowStorePurchase",
		),
		allowPix: formData.get("allowPix"),
		hasQuotas: formData.get("hasQuotas"),
		quotaCount: formData.get("quotaCount"),
		featured: formData.get("featured"),
		displayOrder: formData.get("displayOrder"),
	});

	if (!validation.success) {
		return {
			success: false,
			message: "Verifique os dados informados.",
			fieldErrors: validation.error.flatten().fieldErrors,
		};
	}

	const slug = await generateUniqueGiftSlug(validation.data.title);

	await prisma.gift.create({
		data: {
			...validation.data,
			slug,
			status: "AVAILABLE"
		},
	});

	revalidatePath("/admin");
	revalidatePath("/admin/presentes");
	revalidatePath("/presentes");

	redirect("/admin/presentes");
}

export async function updateGiftAction(giftId: string, _previousState: GiftActionState, formData: FormData): Promise<GiftActionState> {
	await requireCurrentAdmin();

	const existingGift = await prisma.gift.findUnique({
		where: {
			id: giftId,
		},
		select: {
			id: true,
			status: true,
		},
	});

	if (!existingGift) return { success: false, message: "Presente não encontrado." };

	const validation = giftFormSchema.safeParse({
		title: formData.get("title"),
		description: formData.get("description"),
		imageUrl: formData.get("imageUrl"),
		price: formData.get("price"),
		storeUrl: formData.get("storeUrl"),
		allowStorePurchase: formData.get("allowStorePurchase"),
		allowPix: formData.get("allowPix"),
		hasQuotas: formData.get("hasQuotas"),
		quotaCount: formData.get("quotaCount"),
		featured: formData.get("featured"),
		displayOrder: formData.get("displayOrder"),
	});

	if (!validation.success) return {success: false, message: "Verifique os dados informados.", fieldErrors: validation.error.flatten().fieldErrors };

	const slug = await generateUniqueGiftSlug(validation.data.title, giftId);

	await prisma.gift.update({
		where: {
			id: giftId,
		},
		data: {
			...validation.data,
			slug,
		},
	});

	revalidatePath("/admin");
	revalidatePath("/admin/presentes");
	revalidatePath(`/presentes/${slug}`);
	revalidatePath("/presentes");

	redirect("/admin/presentes");
}

export async function archiveGiftAction(giftId: string): Promise<void> {
	await requireCurrentAdmin();

	await prisma.gift.update({
		where: {
			id: giftId,
		},
		data: {
			status: "ARCHIVED",
		},
	});

	revalidatePath("/admin");
	revalidatePath("/admin/presentes");
	revalidatePath("/presentes");
}

export async function restoreGiftAction(giftId: string): Promise<void> {
	await requireCurrentAdmin();

	await prisma.gift.update({
		where: {
			id: giftId,
		},
		data: {
			status: "AVAILABLE",
		},
	});

	revalidatePath("/admin");
	revalidatePath("/admin/presentes");
	revalidatePath("/presentes");
}

export async function deleteGiftAction(giftId: string): Promise<void> {
	await requireCurrentAdmin();

	const gift = await prisma.gift.findUnique({
		where: {
			id: giftId
		},
		select: {
			id: true,
			_count: {
				select: {
					contributions: true,
					letters: true
				}
			}
		}
	});

	if (!gift) return;

	const hasRelatedRecords = gift._count.contributions > 0 || gift._count.letters > 0;

	if (hasRelatedRecords) {
		await prisma.gift.update({
			where: {
				id: giftId
			},
			data: {
				status: "ARCHIVED"
			}
		});
	} else {
		await prisma.gift.delete({
			where: {
				id: giftId
			}
		});
	}

	revalidatePath("/admin");
	revalidatePath("/admin/presentes");
	revalidatePath("/presentes");
}