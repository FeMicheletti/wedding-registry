import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_DURATION_IN_DAYS } from "./constants";

function getSessionExpirationDate(): Date {
	const expiresAt = new Date();

	expiresAt.setDate(expiresAt.getDate() + ADMIN_SESSION_DURATION_IN_DAYS);

	return expiresAt;
}

export async function setAdminSessionCookie( token: string, expiresAt: Date ): Promise<void> {
	const cookieStore = await cookies();

	cookieStore.set(ADMIN_SESSION_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		expires: expiresAt,
	});
}

export async function getAdminSessionCookie(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? null;
}

export async function deleteAdminSessionCookie(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export function createAdminSessionExpirationDate(): Date {
	return getSessionExpirationDate();
}