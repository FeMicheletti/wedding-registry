"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

async function recalculateGiftStatus(giftId: string): Promise<void> {
	const gift = await prisma.gift.findUnique({
		where: {
			id: giftId
		},
		select: {
			id: true,
			priceInCents: true,
			quotaCount: true,
			status: true
		}
	});

	if (!gift || gift.status === "ARCHIVED") return;

	const confirmedContributions = await prisma.contribution.findMany({
		where: {
			giftId,
			status: "CONFIRMED"
		},
		select: {
			amountInCents: true,
			quotaQuantity: true
		}
	});

	let completed = false;

	if (gift.quotaCount) {
		const confirmedQuotaCount =
		confirmedContributions.reduce((total, contribution) => total + (contribution.quotaQuantity ?? 0), 0);

		completed = confirmedQuotaCount >= gift.quotaCount;
	} else {
		const confirmedAmount =
		confirmedContributions.reduce((total, contribution) => total + contribution.amountInCents, 0);

		completed = confirmedAmount >= gift.priceInCents;
	}

	await prisma.gift.update({
		where: {
			id: giftId,
		},
		data: {
			status: completed ? "COMPLETED" : "AVAILABLE"
		}
	});
}

function revalidateContributionPages(): void {
	revalidatePath("/admin");
	revalidatePath("/admin/presentes");
	revalidatePath("/presentes");
}

export async function confirmContributionAction(contributionId: string): Promise<void> {
	await requireCurrentAdmin();

	const contribution = await prisma.contribution.update({
		where: {
			id: contributionId
		},
		data: {
			status: "CONFIRMED",
			confirmedAt: new Date(),
			canceledAt: null,
			reservedUntil: null
		},
		select: {
			giftId: true
		}
	});

	await recalculateGiftStatus(contribution.giftId);

	revalidateContributionPages();

	redirect("/admin");
}

export async function cancelContributionAction(contributionId: string): Promise<void> {
	await requireCurrentAdmin();

	const contribution = await prisma.contribution.update({
		where: {
			id: contributionId
		},
		data: {
			status: "CANCELED",
			canceledAt: new Date(),
			confirmedAt: null,
			reservedUntil: null
		},
		select: {
			giftId: true
		}
	});

	await recalculateGiftStatus(contribution.giftId);

	revalidateContributionPages();

	redirect("/admin");
}

export async function reopenContributionAction(contributionId: string): Promise<void> {
	await requireCurrentAdmin();

	const contribution = await prisma.contribution.update({
		where: {
			id: contributionId
		},
		data: {
			status: "PENDING",
			canceledAt: null,
			confirmedAt: null
		},
		select: {
			giftId: true
		}
	});

	await recalculateGiftStatus(contribution.giftId);

	revalidateContributionPages();
}

export async function deleteContributionAction(contributionId: string): Promise<void> {
	await requireCurrentAdmin();

	const contribution = await prisma.contribution.findUnique({
		where: {
			id: contributionId
		},
		select: {
			giftId: true
		}
	});

	if (!contribution) return;

	await prisma.contribution.delete({
		where: {
			id: contributionId,
		},
	});

	await recalculateGiftStatus(contribution.giftId);

	revalidateContributionPages();

	redirect("/admin");
}