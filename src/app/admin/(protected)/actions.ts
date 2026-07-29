"use server";

import { redirect } from "next/navigation";
import { ADMIN_LOGIN_PATH } from "@/lib/auth/constants";
import { deleteCurrentAdminSession } from "@/lib/auth/session";

export async function logoutAdminAction(): Promise<void> {
	await deleteCurrentAdminSession();
	redirect(ADMIN_LOGIN_PATH);
}