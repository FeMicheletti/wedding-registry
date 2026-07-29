import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";

type PendingContribution = {
	id: string;
	buyerName: string;
	amountInCents: number;
	method: "PIX" | "STORE";
	createdAt: Date;
	gift: {
		title: string;
	};
};

type PendingContributionsTableProps = {
	contributions: PendingContribution[];
};

function formatCurrency(valueInCents: number): string {
	return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valueInCents / 100);
}

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export function PendingContributionsTable({ contributions }: PendingContributionsTableProps) {
	const columns: DataTableColumn<PendingContribution>[] = [
		{
			key: "gift",
			header: "Presente",
			render: (contribution) => (
				<div>
					<p className="font-medium text-zinc-950">
						{contribution.gift.title}
					</p>
					<p className="mt-1 text-xs text-zinc-500">
						Por {contribution.buyerName}
					</p>
				</div>
			),
		},
		{
			key: "method",
			header: "Forma",
			render: (contribution) => (
				<StatusBadge label={ contribution.method === "PIX" ? "Pix" : "Compra na loja"} variant="pending" />
			),
		},
		{
			key: "amount",
			header: "Valor",
			render: (contribution) => (
				<span className="font-medium text-zinc-900">
					{formatCurrency(contribution.amountInCents)}
				</span>
			),
		},
		{
			key: "date",
			header: "Enviado em",
			render: (contribution) => formatDate(contribution.createdAt),
		},
		{
			key: "actions",
			header: "Ações",
			render: (contribution) => (
				<Link href={`/admin/contribuicoes/${contribution.id}`} className="inline-flex rounded-lg bg-zinc-950 px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-700" >
					Revisar
				</Link>
			),
		},
	];

	return (
		<DataTable
			data={contributions}
			columns={columns}
			getRowKey={(contribution) => contribution.id}
			emptyTitle="Nenhum presente aguardando aprovação"
			emptyDescription="As novas contribuições aparecerão aqui." />
	);
}