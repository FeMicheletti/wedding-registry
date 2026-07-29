import type { ReactNode } from "react";
import Link from "next/link";

type NavButtonProps = {
	href: string;
	children: ReactNode;
};

export function NavButton({ href, children }: NavButtonProps) {
	return (
		<Link href={href} className=" inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 active:scale-[0.98]">
			{children}
		</Link>
	);
}