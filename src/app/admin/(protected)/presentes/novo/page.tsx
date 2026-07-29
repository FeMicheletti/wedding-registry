import { initialGiftActionState } from "../action-state";
import { createGiftAction } from "../actions";

import { GiftForm } from "@/components/admin/gifts/gift-form";

export default function NewGiftPage() {
	return (
		<div className="mx-auto max-w-4xl space-y-8">
			<header>
				<p className="text-sm font-medium text-zinc-500">
					Presentes
				</p>
				<h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
					Novo presente
				</h1>
				<p className="mt-2 text-zinc-600">
					Adicione um novo item à lista de presentes.
				</p>
			</header>

			<GiftForm action={createGiftAction} initialState={initialGiftActionState} submitLabel="Criar presente"/>
		</div>
	);
}