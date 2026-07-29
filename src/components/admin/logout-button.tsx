import { logoutAdminAction } from "../../app/admin/(protected)/actions";

export function LogoutButton() {
	return (
		<form action={logoutAdminAction}>
			<button type="submit" className=" inline-flex items-center justify-center rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 hover:text-red-800 active:scale-[0.98]">
				Sair
			</button>
		</form>
	);
}