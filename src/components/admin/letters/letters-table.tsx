import Link from "next/link";
import { approveLetterAction, deleteLetterAction, hideLetterAction } from "@/app/admin/(protected)/cartinhas/actions";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";

type LetterListItem = {
	id: string;
	authorName: string;
	message: string;
	isAnonymous: boolean;
	status: | "PENDING" | "APPROVED" | "HIDDEN" | "REJECTED";
	createdAt: Date;
	gift: {
		title: string;
	} | null;
};

type LettersTableProps = {
	letters: LetterListItem[];
};

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(date);
}

function getStatusBadge(status: LetterListItem["status"]) {
	switch (status) {
		case "PENDING":
			return (
				<StatusBadge label="Pendente" variant="pending"/>
			);
		case "APPROVED":
			return (
				<StatusBadge label="Aprovada" variant="approved"/>
			);
		case "HIDDEN":
			return (
				<StatusBadge label="Oculta" variant="archived"/>
			);
		case "REJECTED":
			return (
				<StatusBadge label="Rejeitada" variant="canceled"/>
			);
	}
}

export function LettersTable({letters}: LettersTableProps) {
	const columns: DataTableColumn<LetterListItem>[] = [
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
							Exibida como anônima
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
				<p className="line-clamp-2 leading-6">
					{letter.message}
				</p>
			),
		},
		{
			key: "date",
			header: "Enviada em",
			render: (letter) => formatDate(letter.createdAt),
		},
		{
			key: "status",
			header: "Status",
			render: (letter) => getStatusBadge(letter.status),
		},
		{
			key: "actions",
			header: "Ações",
			render: (letter) => (
				<div className="flex flex-wrap gap-2">
					<Link href={`/admin/cartinhas/${letter.id}`} className="inline-flex rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100">
						Visualizar
					</Link>

					{letter.status !== "APPROVED" && (
						<form action={approveLetterAction.bind(null, letter.id)}>
							<button type="submit" className="inline-flex rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100">
								Aprovar
							</button>
						</form>
					)}

					{letter.status === "APPROVED" && (
						<form action={hideLetterAction.bind(null, letter.id)}>
							<button type="submit" className="inline-flex rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 transition hover:bg-amber-100">
								Ocultar
							</button>
						</form>
					)}

					<form action={deleteLetterAction.bind(null, letter.id)}>
						<button type="submit" className="inline-flex rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100">
							Excluir
						</button>
					</form>
				</div>
			),
		},
	];

	return (
		<DataTable
			data={letters}
			columns={columns}
			getRowKey={(letter) => letter.id}
			emptyTitle="Nenhuma cartinha encontrada"
			emptyDescription="As mensagens enviadas pelos convidados aparecerão aqui."
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
						<div className="shrink-0">
							{getStatusBadge(letter.status)}
						</div>
					</div>

					<div className="mt-4 rounded-xl bg-zinc-50 p-4">
						<p className="whitespace-pre-wrap wrap-break-words text-sm leading-6 text-zinc-700">
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

					<div className="mt-5 grid grid-cols-2 gap-2">
						<Link href={`/admin/cartinhas/${letter.id}`} className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100">
							Visualizar
						</Link>

						{letter.status !== "APPROVED" && (
							<form action={approveLetterAction.bind( null, letter.id )}>
								<button type="submit" className="w-full rounded-xl bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100">
									Aprovar
								</button>
							</form>
						)}

						{letter.status === "APPROVED" && (
							<form action={hideLetterAction.bind( null, letter.id )}>
								<button type="submit" className="w-full rounded-xl bg-amber-50 px-3 py-3 text-sm font-medium text-amber-700 transition hover:bg-amber-100">
									Ocultar
								</button>
							</form>
						)}

						<form action={deleteLetterAction.bind( null, letter.id )} className="col-span-2">
							<button type="submit" className="w-full rounded-xl bg-red-50 px-3 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100">
								Excluir
							</button>
						</form>
					</div>
				</article>
			)}/>
	);
}