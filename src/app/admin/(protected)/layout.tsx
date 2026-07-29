import type { ReactNode } from "react";

import Link from "next/link";

import { NavButton } from "@/components/admin/nav-button";
import { requireCurrentAdmin } from "@/lib/auth/session";

import { LogoutButton } from "../../../components/admin/logout-button";

type AdminLayoutProps = {
	children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
	const admin = await requireCurrentAdmin();

	return (
		<div className="min-h-screen bg-zinc-100">
			<header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
					<Link href="/admin" className="group">
						<p className="text-lg font-semibold tracking-tight text-zinc-950 transition group-hover:text-zinc-600">
							Nosso novo cantinho
						</p>

						<p className="text-sm text-zinc-500">
							Administração
						</p>
					</Link>

					<div className="flex items-center gap-3">
						<nav className="hidden items-center gap-2 md:flex">
							<NavButton href="/admin">
								Visão geral
							</NavButton>

							<NavButton href="/admin/presentes">
								Presentes
							</NavButton>

							<NavButton href="/admin/cartinhas">
								Cartinhas
							</NavButton>
						</nav>

						<div className="hidden h-8 w-px bg-zinc-200 md:block" />

						<LogoutButton />
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-6 py-8">
				{children}
			</main>
		</div>
	);
}