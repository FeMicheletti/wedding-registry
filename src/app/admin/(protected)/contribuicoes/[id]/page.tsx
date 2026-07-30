import { notFound } from "next/navigation";
import { cancelContributionAction, confirmContributionAction, deleteContributionAction, reopenContributionAction } from "../actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatCurrency } from "@/lib/money";
import { prisma } from "@/lib/prisma";

type ContributionPageProps = {
	params: Promise<{
		id: string;
	}>;
};

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "long",
		timeStyle: "short",
	}).format(date);
}

export default async function ContributionPage({params}: ContributionPageProps) {
	const { id } = await params;

	const contribution = await prisma.contribution.findUnique({
		where: {
			id,
		},
		include: {
			gift: {
				select: {
					title: true,
					priceInCents: true,
					quotaCount: true,
				},
			},
			letter: {
				select: {
					id: true,
					authorName: true,
					message: true,
					status: true,
				},
			},
		},
	});

	if (!contribution) notFound();

	return (
		<div className="mx-auto max-w-5xl space-y-8">
			<header>
				<p className="text-sm font-medium text-zinc-500">
					Contribuições
				</p>
				<h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
					Revisar presente
				</h1>
				<p className="mt-2 text-zinc-600">
					Confirme o pagamento ou a compra realizada pelo convidado.
				</p>
			</header>

			<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
					<p className="text-sm text-zinc-500">
						Presente
					</p>
					<p className="mt-2 font-medium text-zinc-950">
						{contribution.gift.title}
					</p>
				</article>

				<article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
					<p className="text-sm text-zinc-500">
						Valor
					</p>
					<p className="mt-2 font-medium text-zinc-950">
						{formatCurrency(contribution.amountInCents)}
					</p>
				</article>

				<article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
					<p className="text-sm text-zinc-500">
						Forma
					</p>
					<p className="mt-2 font-medium text-zinc-950">
						{contribution.method === "PIX" ? "Pix" : "Compra na loja"}
					</p>
				</article>

				<article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
					<p className="text-sm text-zinc-500">
						Status
					</p>
					<div className="mt-2">
						<StatusBadge label={contribution.status} variant={contribution.status === "CONFIRMED" ? "confirmed" : contribution.status === "CANCELED" ? "canceled" : "pending"}/>
					</div>
				</article>
			</section>

			<section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
				<h2 className="text-lg font-semibold text-zinc-950">
					Informações do convidado
				</h2>

				<dl className="mt-6 grid gap-6 sm:grid-cols-2">
					<div>
						<dt className="text-sm text-zinc-500">
							Nome
						</dt>
						<dd className="mt-1 font-medium text-zinc-950">
							{contribution.buyerName}
						</dd>
					</div>

					<div>
						<dt className="text-sm text-zinc-500">
							E-mail
						</dt>
						<dd className="mt-1 font-medium text-zinc-950">
							{contribution.buyerEmail ?? "Não informado"}
						</dd>
					</div>

					<div>
						<dt className="text-sm text-zinc-500">
							Telefone
						</dt>
						<dd className="mt-1 font-medium text-zinc-950">
							{contribution.buyerPhone ?? "Não informado"}
						</dd>
					</div>

					<div>
						<dt className="text-sm text-zinc-500">
							Enviado em
						</dt>
						<dd className="mt-1 font-medium text-zinc-950">
							{formatDate(contribution.createdAt)}
						</dd>
					</div>

					{contribution.quotaQuantity && (
						<div>
							<dt className="text-sm text-zinc-500">
								Quantidade de cotas
							</dt>
							<dd className="mt-1 font-medium text-zinc-950">
								{contribution.quotaQuantity}
							</dd>
						</div>
					)}
				</dl>
			</section>

			{contribution.paymentReceiptUrl && (
				<section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
					<h2 className="text-lg font-semibold text-zinc-950">
						Comprovante
					</h2>
					<a href={contribution.paymentReceiptUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">
						Abrir comprovante
					</a>
				</section>
			)}

			{contribution.letter && (
				<section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
					<h2 className="text-lg font-semibold text-zinc-950">
						Cartinha enviada
					</h2>
					<p className="mt-4 whitespace-pre-wrap leading-7 text-zinc-700">
						{contribution.letter.message}
					</p>
					<p className="mt-4 text-sm font-medium text-zinc-950">
						— {contribution.letter.authorName}
					</p>
				</section>
			)}

			<section className="flex flex-wrap gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
				{contribution.status !== "CONFIRMED" && (
					<form action={confirmContributionAction.bind(null, contribution.id)}>
						<button type="submit" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700">
							Confirmar presente
						</button>
					</form>
				)}

				{contribution.status !== "CANCELED" && (
					<form action={cancelContributionAction.bind( null, contribution.id )}>
						<button type="submit" className="rounded-xl bg-amber-100 px-5 py-3 text-sm font-medium text-amber-800 transition hover:bg-amber-200">
							Cancelar contribuição
						</button>
					</form>
				)}

				{contribution.status === "CANCELED" && (
					<form action={reopenContributionAction.bind( null, contribution.id )}>
						<button type="submit" className="rounded-xl bg-blue-100 px-5 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-200">
							Reabrir análise
						</button>
					</form>
				)}

				<form action={deleteContributionAction.bind( null, contribution.id )} >
					<button type="submit" className="rounded-xl bg-red-100 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-200">
						Excluir registro
					</button>
				</form>
			</section>
		</div>
	);
}