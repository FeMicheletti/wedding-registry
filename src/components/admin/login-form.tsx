"use client";

import { useActionState } from "react";
import { loginAdminAction, type LoginActionState } from "../../app/admin/login/actions";

const initialState: LoginActionState = {
	success: false,
	message: null,
};

export function LoginForm() {
	const [state, formAction, pending] = useActionState( loginAdminAction, initialState );

	return (
		<form action={formAction} className="space-y-5">
			<div className="space-y-2">
				<label htmlFor="email" className="text-sm font-medium text-zinc-800">
					E-mail
				</label>

				<input id="email" name="email" type="email" autoComplete="email" placeholder="admin@localhost.com" required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-900 text-black"/>

				{state.fieldErrors?.email?.map((error) => (
					<p key={error} className="text-sm text-red-600">
						{error}
					</p>
				))}
			</div>

			<div className="space-y-2">
				<label htmlFor="password" className="text-sm font-medium text-zinc-800">
					Senha
				</label>

				<input id="password" name="password" type="password" autoComplete="current-password" placeholder="Sua senha" required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none transition focus:border-zinc-900 text-black"/>

				{state.fieldErrors?.password?.map((error) => (
					<p key={error} className="text-sm text-red-600">
						{error}
					</p>
				))}
			</div>

			{state.message && (
				<div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{state.message}
				</div>
			)}

			<button type="submit" disabled={pending} className="w-full rounded-xl bg-zinc-950 px-4 py-3 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer">
				{pending ? "Entrando..." : "Entrar"}
			</button>
		</form>
	);
}