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
			emptyDescription="As novas contribuições aparecerão aqui." 
			renderMobileItem={(contribution) => (
				<article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0">
							<h3 className="font-semibold text-zinc-950">
								{contribution.gift.title}
							</h3>

							<p className="mt-1 text-sm text-zinc-500">
								Enviado por {contribution.buyerName}
							</p>
						</div>

						<StatusBadge label={contribution.method === "PIX" ? "Pix" : "Compra na loja"} variant="pending"/>
					</div>

					<div className="mt-5 rounded-xl bg-zinc-50 p-4">
						<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
							Valor
						</p>

						<p className="mt-1 text-xl font-semibold text-zinc-950">
							{formatCurrency( contribution.amountInCents )}
						</p>
					</div>

					<dl className="mt-4 grid gap-3 text-sm">
						<div className="flex items-start justify-between gap-4">
							<dt className="text-zinc-500">
								Forma
							</dt>
							<dd className="text-right font-medium text-zinc-900">
								{contribution.method === "PIX" ? "Pagamento por Pix" : "Compra pela loja"}
							</dd>
						</div>

						<div className="flex items-start justify-between gap-4">
							<dt className="text-zinc-500">
								Enviado em
							</dt>
							<dd className="text-right text-zinc-700">
								{formatDate(contribution.createdAt)}
							</dd>
						</div>
					</dl>

					<Link href={`/admin/contribuicoes/${contribution.id}`} className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98]">
						Revisar contribuição
					</Link>
				</article>
			)}/>
	);
}