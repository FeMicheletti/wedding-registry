import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { createAdminSessionExpirationDate, deleteAdminSessionCookie, getAdminSessionCookie, setAdminSessionCookie } from "./session-cookie";
import { generateSessionToken, hashSessionToken } from "./token";
import { AdminStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { ADMIN_LOGIN_PATH } from "./constants";

export async function createAdminSession( adminUserId: string ): Promise<void> {
	const token = generateSessionToken();
	const tokenHash = hashSessionToken(token);
	const expiresAt = createAdminSessionExpirationDate();

	await prisma.adminSession.deleteMany({
		where: {
			expiresAt: {
				lte: new Date()
			}
		}
	});

	await prisma.adminSession.create({
		data: {
			adminUserId,
			tokenHash,
			expiresAt
		}
	});

	await setAdminSessionCookie(token, expiresAt);
}

export const getCurrentAdmin = cache(async () => {
	const token = await getAdminSessionCookie();
	if (!token) return null;

	const tokenHash = hashSessionToken(token);
	const now = new Date();

	const session = await prisma.adminSession.findUnique({
		where: {
			tokenHash,
		},
		include: {
			adminUser: {
				select: {
					id: true,
					name: true,
					email: true,
					status: true
				}
			}
		}
	});

	if (!session) return null;

	if (session.expiresAt <= now) {
		await prisma.adminSession.delete({
			where: {
				id: session.id,
			}
		});
		return null;
	}

	if (session.adminUser.status !== AdminStatus.ACTIVE) {
		await prisma.adminSession.deleteMany({
			where: {
				adminUserId: session.adminUserId,
			}
		});
		return null;
	}

	return {
		id: session.adminUser.id,
		name: session.adminUser.name,
		email: session.adminUser.email,
		sessionId: session.id,
		expiresAt: session.expiresAt,
	};
});

export async function deleteCurrentAdminSession(): Promise<void> {
	const token = await getAdminSessionCookie();

	if (token) {
		const tokenHash = hashSessionToken(token);
		await prisma.adminSession.deleteMany({
			where: {
				tokenHash,
			},
		});
	}

	await deleteAdminSessionCookie();
}

export async function requireCurrentAdmin() {
	const admin = await getCurrentAdmin();
	if (!admin) redirect(ADMIN_LOGIN_PATH);
	return admin;
}