import Link from "next/link";

import { GiftsTable } from "@/components/admin/gifts/gifts-table";
import { prisma } from "@/lib/prisma";

export default async function GiftsPage() {
	const gifts = await prisma.gift.findMany({
		select: {
			id: true,
			title: true,
			priceInCents: true,
			quotaCount: true,
			status: true,
			allowPix: true,
			allowStorePurchase: true,
			featured: true,
			_count: {
				select: {
					contributions: true,
					letters: true
				}
			}
		},
		orderBy: [
			{
				displayOrder: "asc",
			},
			{
				createdAt: "desc"
			}
		],
	});

	return (
		<div className="space-y-8">
			<header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-sm font-medium text-zinc-500">
						Administração
					</p>
					<h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
						Presentes
					</h1>
					<p className="mt-2 text-zinc-600">
						Gerencie os itens disponíveis na lista.
					</p>
				</div>
				<Link href="/admin/presentes/novo" className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md active:translate-y-0">
					Adicionar presente
				</Link>
			</header>
			<GiftsTable gifts={gifts} />
		</div>
	);
}