import { LettersTable } from "@/components/admin/letters/letters-table";
import { prisma } from "@/lib/prisma";

type LettersPageProps = {
	searchParams: Promise<{
		status?: string;
	}>;
};

const validStatuses = ["PENDING", "APPROVED", "HIDDEN", "REJECTED"] as const;

export default async function LettersPage({searchParams}: LettersPageProps) {
	const { status } = await searchParams;

	const selectedStatus = validStatuses.find(
		(item) => item === status,
	);

	const letters = await prisma.letter.findMany({
		where: selectedStatus ? {
			status: selectedStatus,
		} : undefined,

		select: {
			id: true,
			authorName: true,
			message: true,
			isAnonymous: true,
			status: true,
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
	});

	const filters = [
		{
			label: "Todas",
			href: "/admin/cartinhas",
			active: !selectedStatus
		},
		{
			label: "Pendentes",
			href: "/admin/cartinhas?status=PENDING",
			active: selectedStatus === "PENDING"
		},
		{
			label: "Aprovadas",
			href: "/admin/cartinhas?status=APPROVED",
			active: selectedStatus === "APPROVED"
		},
		{
			label: "Ocultas",
			href: "/admin/cartinhas?status=HIDDEN",
			active: selectedStatus === "HIDDEN"
		},
		{
			label: "Rejeitadas",
			href: "/admin/cartinhas?status=REJECTED",
			active: selectedStatus === "REJECTED"
		}
	];

	return (
		<div className="space-y-8">
			<header>
				<p className="text-sm font-medium text-zinc-500">
					Administração
				</p>
				<h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
					Cartinhas
				</h1>
				<p className="mt-2 text-zinc-600">
					Revise e modere as mensagens enviadas pelos convidados.
				</p>
			</header>

			<nav className="flex flex-wrap gap-2">
				{filters.map((filter) => (
					<a key={filter.href} href={filter.href} className={ filter.active ? "rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm" : "rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950"}>
						{filter.label}
					</a>
				))}
			</nav>

			<LettersTable letters={letters} />
		</div>
	);
}