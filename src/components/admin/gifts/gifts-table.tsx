import Link from "next/link";
import { archiveGiftAction, deleteGiftAction, restoreGiftAction } from "@/app/admin/(protected)/presentes/actions";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatCurrency } from "@/lib/money";

type GiftListItem = {
	id: string;
	title: string;
	priceInCents: number;
	quotaCount: number | null;
	status: | "AVAILABLE" | "RESERVED" | "COMPLETED" | "ARCHIVED";
	allowPix: boolean;
	allowStorePurchase: boolean;
	featured: boolean;
	_count: {
		contributions: number;
		letters: number;
	};
};

type GiftsTableProps = {
	gifts: GiftListItem[];
};

function getGiftStatusBadge(status: GiftListItem["status"]) {
	switch (status) {
		case "AVAILABLE":
			return (
				<StatusBadge label="Disponível" variant="available"/>
			);
		case "COMPLETED":
			return (
				<StatusBadge label="Completo" variant="completed"/>
			);
		case "RESERVED":
			return (
				<StatusBadge label="Reservado" variant="pending"/>
			);
		case "ARCHIVED":
			return (
				<StatusBadge label="Arquivado" variant="archived"/>
			);
	}
}

export function GiftsTable({ gifts }: GiftsTableProps) {
	const columns: DataTableColumn<GiftListItem>[] = [
		{
			key: "gift",
			header: "Presente",
			render: (gift) => (
				<div>
					<div className="flex items-center gap-2">
						<p className="font-medium text-zinc-950">
							{gift.title}
						</p>

						{gift.featured && (
							<span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
								Destaque
							</span>
						)}
					</div>
					<p className="mt-1 text-xs text-zinc-500">
						{gift._count.contributions} contribuições ·{" "}
						{gift._count.letters} cartinhas
					</p>
				</div>
			),
		},
		{
			key: "price",
			header: "Valor",
			headerAlign: "right",
			render: (gift) => (
				<div className="text-right">
					<p className="font-medium text-zinc-900">
						{formatCurrency(gift.priceInCents)}
					</p>
					{gift.quotaCount && (
						<p className="mt-1 text-xs text-zinc-500">
							{gift.quotaCount} cotas
						</p>
					)}
				</div>
			),
		},
		{
			key: "methods",
			header: "Formas",
			headerAlign: "center",
			render: (gift) => (
				<div className="flex flex-wrap gap-2 justify-center">
					{gift.allowPix && (
						<span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
							Pix
						</span>
					)}
					{gift.allowStorePurchase && (
						<span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
							Loja
						</span>
					)}
				</div>
			),
		},
		{
			key: "status",
			header: "Status",
			headerAlign: "center",
			render: (gift) => (
				<div className="flex justify-center">
					{getGiftStatusBadge(gift.status)}
				</div>
			),
		},
		{
			key: "actions",
			header: "Ações",
			headerAlign: "center",
			render: (gift) => (
				<div className="flex flex-wrap justify-evenly">
					<Link href={`/admin/presentes/${gift.id}/editar`} className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-950">
						Editar
					</Link>

					{gift.status === "ARCHIVED" ? (
						<form action={restoreGiftAction.bind( null, gift.id)} >
							<button type="submit" className="inline-flex items-center justify-center rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100">
								Restaurar
							</button>
						</form>
					) : (
						<form action={archiveGiftAction.bind( null, gift.id )}>
							<button type="submit" className="inline-flex items-center justify-center rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 transition hover:bg-amber-100">
								Arquivar
							</button>
						</form>
					)}

					<form action={deleteGiftAction.bind( null, gift.id )}>
						<button type="submit" className="inline-flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100">
							Excluir
						</button>
					</form>
				</div>
			),
		},
	];

	return (
		<DataTable
			data={gifts}
			columns={columns}
			getRowKey={(gift) => gift.id}
			emptyTitle="Nenhum presente cadastrado"
			emptyDescription="Crie o primeiro presente para iniciar sua lista."/>
	);
}