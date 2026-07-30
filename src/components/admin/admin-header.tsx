"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdminAction } from "@/app/admin/(protected)/actions";

type AdminHeaderProps = {
	admin: {
		name: string;
		email: string;
	};
};

const links = [
	{
		label: "Visão geral",
		href: "/admin",
	},
	{
		label: "Presentes",
		href: "/admin/presentes",
	},
	{
		label: "Cartinhas",
		href: "/admin/cartinhas",
	},
];

export function AdminHeader({ admin }: AdminHeaderProps) {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	function isActive(href: string): boolean {
		if (href === "/admin") return pathname === "/admin";
		return pathname.startsWith(href);
	}

	return (
		<header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
			<div className="mx-auto max-w-7xl px-4 sm:px-6">
				<div className="flex min-h-16 items-center justify-between gap-4">
					<Link href="/admin" className="min-w-0" onClick={() => setMobileMenuOpen(false)}>
						<p className="truncate text-base font-semibold tracking-tight text-zinc-950 sm:text-lg">
							Nosso novo cantinho
						</p>

						<p className="text-xs text-zinc-500 sm:text-sm">
							Administração
						</p>
					</Link>

					<nav className="hidden items-center gap-2 md:flex">
						{links.map((link) => (
							<Link key={link.href} href={link.href} className={isActive(link.href) ? "inline-flex items-center justify-center rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm" : "inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950"}>
								{link.label}
							</Link>
						))}

						<div className="mx-1 h-8 w-px bg-zinc-200" />

						<form action={logoutAdminAction}>
							<button type="submit" className="inline-flex items-center justify-center rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 hover:text-red-800">
								Sair
							</button>
						</form>
					</nav>

					<button type="button" aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((current) => !current)} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-100 md:hidden">
						<span className="text-xl leading-none">
							{mobileMenuOpen ? "×" : "☰"}
						</span>
					</button>
				</div>

				{mobileMenuOpen && (
					<div className="border-t border-zinc-200 py-4 md:hidden">
						<nav className="grid gap-2">
							{links.map((link) => (
								<Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={isActive(link.href) ? "rounded-xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white" : "rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"}>
									{link.label}
								</Link>
							))}

							<form action={logoutAdminAction}>
								<button type="submit" className="w-full rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-700 transition hover:bg-red-100">
									Sair
								</button>
							</form>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}