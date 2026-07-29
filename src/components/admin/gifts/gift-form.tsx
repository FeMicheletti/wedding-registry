"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { GiftActionState } from "@/app/admin/(protected)/presentes/action-state";

type GiftFormValues = {
	title: string;
	description: string;
	imageUrl: string;
	price: string;
	storeUrl: string;
	allowStorePurchase: boolean;
	allowPix: boolean;
	quotaCount: number | null;
	featured: boolean;
	displayOrder: number;
};

type GiftFormProps = {
	action: (
		state: GiftActionState,
		formData: FormData,
	) => Promise<GiftActionState>;
	initialState: GiftActionState;
	initialValues?: GiftFormValues;
	submitLabel: string;
};

const defaultValues: GiftFormValues = {
	title: "",
	description: "",
	imageUrl: "",
	price: "",
	storeUrl: "",
	allowStorePurchase: true,
	allowPix: true,
	quotaCount: null,
	featured: false,
	displayOrder: 0,
};

type FieldErrorProps = {
	errors?: string[];
};

function FieldError({ errors }: FieldErrorProps) {
	if (!errors?.length) return null;

	return (
		<div className="space-y-1">
			{errors.map((error) => (
				<p key={error} className="text-sm text-red-600">
					{error}
				</p>
			))}
		</div>
	);
}

const inputClassName = "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 hover:border-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10";

export function GiftForm({ action, initialState, initialValues = defaultValues, submitLabel }: GiftFormProps) {
	const [state, formAction, pending] = useActionState(action, initialState);
	const [allowStorePurchase, setAllowStorePurchase] = useState(initialValues.allowStorePurchase);
	const [hasQuotas, setHasQuotas] = useState(initialValues.quotaCount !== null);

	return (
		<form action={formAction} className="space-y-8">
			<section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
				<div className="mb-6">
					<h2 className="text-lg font-semibold text-zinc-950">
						Informações do presente
					</h2>

					<p className="mt-1 text-sm text-zinc-500">
						Informe os dados que serão apresentados na lista pública.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-2 md:col-span-2">
						<label htmlFor="title" className="text-sm font-medium text-zinc-800">
							Título
						</label>
						<input id="title" name="title" type="text" defaultValue={initialValues.title} placeholder="Ex.: Air Fryer" required className={inputClassName}/>
						<FieldError errors={state.fieldErrors?.title} />
					</div>

					<div className="space-y-2 md:col-span-2">
						<label htmlFor="description" className="text-sm font-medium text-zinc-800" >
							Descrição
						</label>
						<textarea id="description" name="description" rows={5} defaultValue={initialValues.description} placeholder="Conte como esse presente será útil no novo lar." required className={inputClassName}/>
						<FieldError errors={state.fieldErrors?.description}/>
					</div>

					<div className="space-y-2">
						<label htmlFor="price" className="text-sm font-medium text-zinc-800">
							Preço
						</label>
						<input id="price" name="price" type="text" inputMode="decimal" defaultValue={initialValues.price} placeholder="499,90" required className={inputClassName}/>
						<FieldError errors={state.fieldErrors?.price}/>
					</div>

					<div className="space-y-2">
						<label htmlFor="displayOrder" className="text-sm font-medium text-zinc-800">
							Ordem de exibição
						</label>
						<input id="displayOrder" name="displayOrder" type="number" min={0} defaultValue={initialValues.displayOrder} className={inputClassName}/>
						<FieldError errors={state.fieldErrors?.displayOrder}/>
					</div>

					<div className="space-y-2 md:col-span-2">
						<label htmlFor="imageUrl" className="text-sm font-medium text-zinc-800">
							URL da imagem
						</label>
						<input id="imageUrl" name="imageUrl" type="url" defaultValue={initialValues.imageUrl} placeholder="https://..." className={inputClassName}/>
						<FieldError errors={state.fieldErrors?.imageUrl}/>
					</div>
				</div>
			</section>

			<section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
				<div className="mb-6">
					<h2 className="text-lg font-semibold text-zinc-950">
						Formas de presentear
					</h2>

					<p className="mt-1 text-sm text-zinc-500">
						Escolha como os convidados poderão adquirir o presente.
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-200 p-4 transition hover:border-zinc-400 hover:bg-zinc-50">
						<input name="allowPix" type="checkbox" defaultChecked={initialValues.allowPix} className="mt-1 h-4 w-4 rounded border-zinc-300"/>
						<span>
							<span className="block font-medium text-zinc-900">
								Permitir Pix
							</span>
							<span className="mt-1 block text-sm text-zinc-500">
								O convidado envia o valor e vocês compram o presente.
							</span>
						</span>
					</label>

					<label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-200 p-4 transition hover:border-zinc-400 hover:bg-zinc-50">
						<input name="allowStorePurchase" type="checkbox" checked={allowStorePurchase} onChange={(event) => setAllowStorePurchase( event.target.checked)} className="mt-1 h-4 w-4 rounded border-zinc-300"/>
						<span>
							<span className="block font-medium text-zinc-900">
								Permitir compra na loja
							</span>
							<span className="mt-1 block text-sm text-zinc-500">
								O convidado será direcionado para a página do produto.
							</span>
						</span>
					</label>
				</div>

				{allowStorePurchase && (
					<div className="mt-6 space-y-2">
						<label htmlFor="storeUrl" className="text-sm font-medium text-zinc-800">
							Link da loja
						</label>
						<input id="storeUrl" name="storeUrl" type="url" defaultValue={initialValues.storeUrl} placeholder="https://loja.com/produto" className={inputClassName}/>
						<FieldError errors={state.fieldErrors?.storeUrl}/>
					</div>
				)}

				<FieldError errors={state.fieldErrors?.allowPix}/>
			</section>

			<section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
				<div className="mb-6">
					<h2 className="text-lg font-semibold text-zinc-950">
						Cotas
					</h2>
					<p className="mt-1 text-sm text-zinc-500">
						Divida presentes mais caros em contribuições menores.
					</p>
				</div>

				<label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-200 p-4 transition hover:border-zinc-400 hover:bg-zinc-50">
					<input name="hasQuotas" type="checkbox" checked={hasQuotas} onChange={(event) => setHasQuotas(event.target.checked)} className="mt-1 h-4 w-4 rounded border-zinc-300"/>
					<span>
						<span className="block font-medium text-zinc-900">
							Dividir este presente em cotas
						</span>
						<span className="mt-1 block text-sm text-zinc-500">
							Cada convidado poderá escolher uma ou mais cotas.
						</span>
					</span>
				</label>

				{hasQuotas && (
					<div className="mt-6 max-w-sm space-y-2">
						<label htmlFor="quotaCount" className="text-sm font-medium text-zinc-800">
							Quantidade de cotas
						</label>

						<input id="quotaCount" name="quotaCount" type="number" min={2} defaultValue={initialValues.quotaCount ?? 2} className={inputClassName}/>

						<FieldError errors={state.fieldErrors?.quotaCount}/>
					</div>
				)}
			</section>

			<section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
				<label className="flex cursor-pointer items-start gap-3">
					<input name="featured" type="checkbox" defaultChecked={initialValues.featured} className="mt-1 h-4 w-4 rounded border-zinc-300"/>
					<span>
						<span className="block font-medium text-zinc-900">
							Destacar este presente
						</span>
						<span className="mt-1 block text-sm text-zinc-500">
							Presentes destacados poderão aparecer na página inicial.
						</span>
					</span>
				</label>
			</section>

			{state.message && (
				<div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{state.message}
				</div>
			)}

			<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
				<Link href="/admin/presentes" className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100">
					Cancelar
				</Link>

				<button type="submit" disabled={pending} className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
					{pending ? "Salvando..." : submitLabel}
				</button>
			</div>
		</form>
	);
}