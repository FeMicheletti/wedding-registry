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
			emptyDescription="As novas mensagens aparecerão aqui."
			renderMobileItem={(letter) => (
				<article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0">
							<p className="font-semibold text-zinc-950">
								{letter.authorName}
							</p>

							{letter.isAnonymous && (
								<p className="mt-1 text-xs text-zinc-500">
									Será exibida como anônima
								</p>
							)}
						</div>

						<StatusBadge label="Pendente" variant="pending"/>
					</div>

					<div className="mt-4 rounded-xl bg-zinc-50 p-4">
						<p className="line-clamp-4 wrap-break-words text-sm leading-6 text-zinc-700">
							{letter.message}
						</p>
					</div>

					<dl className="mt-4 grid gap-3 text-sm">
						<div className="flex items-start justify-between gap-4">
							<dt className="text-zinc-500">
								Presente
							</dt>

							<dd className="text-right font-medium text-zinc-900">
								{letter.gift?.title ?? "Cartinha geral"}
							</dd>
						</div>

						<div className="flex items-start justify-between gap-4">
							<dt className="text-zinc-500">
								Enviada em
							</dt>

							<dd className="text-right text-zinc-700">
								{formatDate(letter.createdAt)}
							</dd>
						</div>
					</dl>

					<Link href={`/admin/cartinhas/${letter.id}`} className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98]">
						Revisar cartinha
					</Link>
				</article>
			)}/>
	);
}