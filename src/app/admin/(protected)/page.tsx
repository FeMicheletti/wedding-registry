import { PendingApprovals } from "@/components/admin/dashboard/pending-approvals";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
	const [ giftCount, availableGiftCount, completedGiftCount, pendingLetterCount, pendingContributions, pendingLetters ] = await prisma.$transaction([
		prisma.gift.count(),

		prisma.gift.count({
			where: {
				status: "AVAILABLE",
			}
		}),

		prisma.gift.count({
			where: {
				status: "COMPLETED",
			}
		}),

		prisma.letter.count({
			where: {
				status: "PENDING",
			}
		}),

		prisma.contribution.findMany({
			where: {
				status: {
					in: ["PENDING", "RESERVED"]
				}
			},
			select: {
				id: true,
				buyerName: true,
				amountInCents: true,
				method: true,
				createdAt: true,
				gift: {
					select: {
						title: true
					}
				}
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 10,
		}),

		prisma.letter.findMany({
			where: {
				status: "PENDING",
			},

			select: {
				id: true,
				authorName: true,
				message: true,
				isAnonymous: true,
				createdAt: true,
				gift: {
					select: {
						title: true
					}
				}
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 10,
		})
	]);

	const cards = [
		{
			label: "Presentes cadastrados",
			value: giftCount,
		},
		{
			label: "Presentes disponíveis",
			value: availableGiftCount,
		},
		{
			label: "Presentes completos",
			value: completedGiftCount,
		},
		{
			label: "Cartinhas pendentes",
			value: pendingLetterCount,
		},
	];

	return (
		<div className="space-y-8 sm:space-y-10">
			<div>
				<p className="text-sm font-medium text-zinc-500">
					Administração
				</p>
				<h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
					Visão geral
				</h1>
				<p className="mt-2 text-zinc-600">
					Acompanhe os presentes e mensagens recebidas.
				</p>
			</div>

			<section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
				{cards.map((card) => (
					<article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md sm:p-6">
						<p className="text-sm font-medium text-zinc-500">
							{card.label}
						</p>

						<strong className="mt-3 block text-3xl font-semibold text-zinc-950">
							{card.value}
						</strong>
					</article>
				))}
			</section>

			<PendingApprovals contributions={pendingContributions} letters={pendingLetters}/>
		</div>
	);
}