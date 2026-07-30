import { notFound } from "next/navigation";
import { approveLetterAction, hideLetterAction, rejectLetterAction, updateLetterAction } from "../actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { prisma } from "@/lib/prisma";

type LetterDetailsPageProps = {
	params: Promise<{
		id: string;
	}>;
};

const inputClassName = "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition hover:border-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10";

export default async function LetterDetailsPage({params}: LetterDetailsPageProps) {
	const { id } = await params;

	const letter = await prisma.letter.findUnique({
		where: {
			id,
		},
		include: {
			gift: {
				select: {
					title: true,
				},
			},
			contribution: {
				select: {
					id: true,
					amountInCents: true,
					method: true,
					status: true
				}
			}
		}
	});

	if (!letter) notFound();

	const updateAction = updateLetterAction.bind(null, letter.id);

	return (
		<div className="mx-auto max-w-4xl space-y-8">
			<header>
				<p className="text-sm font-medium text-zinc-500">
					Cartinhas
				</p>
				<h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
					Revisar cartinha
				</h1>
				<p className="mt-2 text-zinc-600">
					Confira o conteúdo antes de disponibilizá-lo publicamente.
				</p>
			</header>

			<section className="grid gap-4 sm:grid-cols-3">
				<article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
					<p className="text-sm text-zinc-500">
						Presente
					</p>
					<p className="mt-2 font-medium text-zinc-950">
						{letter.gift?.title ?? "Cartinha geral"}
					</p>
				</article>

				<article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
					<p className="text-sm text-zinc-500">
						Visibilidade
					</p>
					<p className="mt-2 font-medium text-zinc-950">
						{letter.isAnonymous ? "Autor anônimo" : "Nome público"}
					</p>
				</article>

				<article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
					<p className="text-sm text-zinc-500">
						Status
					</p>
					<div className="mt-2">
						<StatusBadge label={letter.status} variant={ letter.status === "APPROVED" ? "approved" : letter.status === "PENDING" ? "pending" : letter.status === "HIDDEN" ? "archived" : "canceled"}/>
					</div>
				</article>
			</section>

			<form action={updateAction} className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
				<div className="space-y-2">
					<label htmlFor="authorName" className="text-sm font-medium text-zinc-800">
						Nome do autor
					</label>
					<input id="authorName" name="authorName" defaultValue={letter.authorName} className={inputClassName}/>
				</div>

				<div className="space-y-2">
					<label htmlFor="message" className="text-sm font-medium text-zinc-800">
						Mensagem
					</label>
					<textarea id="message" name="message" rows={10} defaultValue={letter.message} className={inputClassName}/>
				</div>

				<label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-4 transition hover:bg-zinc-50">
					<input type="checkbox" name="isAnonymous" defaultChecked={letter.isAnonymous} className="mt-1 h-4 w-4"/>
					<span>
						<span className="block font-medium text-zinc-900">
							Exibir como anônima
						</span>
						<span className="mt-1 block text-sm text-zinc-500">
							O nome do autor não aparecerá no site público.
						</span>
					</span>
				</label>

				<button type="submit" className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">
					Salvar alterações
				</button>
			</form>

			<section className="flex flex-wrap gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
				<form action={approveLetterAction.bind( null, letter.id )}>
					<button type="submit" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700">
						Aprovar cartinha
					</button>
				</form>

				<form action={hideLetterAction.bind( null, letter.id )}>
					<button type="submit" className="rounded-xl bg-amber-100 px-5 py-3 text-sm font-medium text-amber-800 transition hover:bg-amber-200">
						Ocultar
					</button>
				</form>

				<form action={rejectLetterAction.bind( null, letter.id )}>
					<button type="submit" className="rounded-xl bg-red-100 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-200">
						Rejeitar
					</button>
				</form>
			</section>
		</div>
	);
}