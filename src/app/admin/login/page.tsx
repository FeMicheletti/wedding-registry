import { redirect } from "next/navigation";
import { ADMIN_HOME_PATH } from "@/lib/auth/constants";
import { getCurrentAdmin } from "@/lib/auth/session";
import { LoginForm } from "../../../components/admin/login-form";

export default async function AdminLoginPage() {
	const admin = await getCurrentAdmin();
	if (admin) redirect(ADMIN_HOME_PATH);

	return (
		<main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12">
			<section className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
				<div className="mb-8 space-y-2">
					<p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
						Lista de presentes
					</p>

					<h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
						Administração
					</h1>

					<p className="text-sm leading-6 text-zinc-600">
						Entre para gerenciar presentes, contribuições e cartinhas.
					</p>
				</div>
				<LoginForm />
			</section>
		</main>
	);
}