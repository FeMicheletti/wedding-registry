import type { ReactNode } from "react";

import Link from "next/link";

import { NavButton } from "@/components/admin/nav-button";
import { requireCurrentAdmin } from "@/lib/auth/session";

import { LogoutButton } from "../../../components/admin/logout-button";
import { AdminHeader } from "@/components/admin/admin-header";

type AdminLayoutProps = {
	children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
	const admin = await requireCurrentAdmin();

	return (
		<div className="min-h-screen bg-zinc-100">
			<AdminHeader admin={{ name: admin.name, email: admin.email }}/>

			<main className="mx-auto max-w-7xl px-6 py-8">
				{children}
			</main>
		</div>
	);
}