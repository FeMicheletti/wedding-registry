import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";

type PendingLetter = {
	id: string;
	authorName: string;
	message: string;
	isAnonymous: boolean;
	createdAt: Date;
	gift: {
		title: string;
	} | null;
};

type PendingLettersTableProps = {
	letters: PendingLetter[];
};

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(date);
}

export function PendingLettersTable({ letters }: PendingLettersTableProps) {
	const columns: DataTableColumn<PendingLetter>[] = [
		{
			key: "author",
			header: "Autor",
			render: (letter) => (
				<div>
					<p className="font-medium text-zinc-950">
						{letter.authorName}
					</p>
					{letter.isAnonymous && (
						<p className="mt-1 text-xs text-zinc-500">
							Será exibida como anônima
						</p>
					)}
				</div>
			),
		},
		{
			key: "gift",
			header: "Presente",
			render: (letter) => letter.gift?.title ?? "Cartinha geral",
		},
		{
			key: "message",
			header: "Mensagem",
			className: "max-w-md",
			render: (letter) => (
				<p className="line-clamp-2">
					{letter.message}
				</p>
			),
		},
		{
			key: "status",
			header: "Status",
			render: () => (
				<StatusBadge label="Pendente" variant="pending"/>
			),
		},
		{
			key: "date",
			header: "Enviada em",
			render: (letter) => formatDate(letter.createdAt),
		},
		{
			key: "actions",
			header: "Ações",
			render: (letter) => (
				<Link href={`/admin/cartinhas/${letter.id}`} className="inline-flex rounded-lg bg-zinc-950 px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-700">
					Revisar
				</Link>
			),
		},
	];

	return (
		<DataTable
			data={letters}
			columns={columns}
			getRowKey={(letter) => letter.id}
			emptyTitle="Nenhuma cartinha aguardando aprovação"
			emptyDescription="As novas mensagens aparecerão aqui."/>
	);
}