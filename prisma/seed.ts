import "dotenv/config";

import { hash } from "bcryptjs";
import { AdminStatus } from "@prisma/client";
import { prisma } from "./prisma-client";

function getRequiredEnvironmentVariable(name: string): string {
	const value = process.env[name];

	if (!value) throw new Error(`A variável de ambiente ${name} não foi definida.`);
	return value;
}

async function seedAdminUser() {
	const name = process.env.ADMIN_NAME ?? "Administrador";
	const email = getRequiredEnvironmentVariable("ADMIN_EMAIL").trim().toLowerCase();
	const password = getRequiredEnvironmentVariable("ADMIN_PASSWORD");

	if (password.length < 8) throw new Error("ADMIN_PASSWORD deve possuir pelo menos 8 caracteres.");

	const passwordHash = await hash(password, 12);

	const admin = await prisma.adminUser.upsert({
		where: {
			email
		},
		update: {
			name,
			passwordHash,
			status: AdminStatus.ACTIVE
		},
		create: {
			name,
			email,
			passwordHash,
			status: AdminStatus.ACTIVE
		},
	});

	console.log(`Administrador configurado: ${admin.email}`);
}

async function seedSiteSettings() {
	await prisma.siteSettings.upsert({
		where: {
			id: "main",
		},

		update: {},

		create: {
			id: "main",
			coupleName: "Felipe e Maria Laura",
			heroTitle: "Nosso novo cantinho",
			heroDescription: "Estamos começando uma nova fase das nossas vidas e, em breve, teremos nosso primeiro cantinho juntos. Criamos este espaço para compartilhar esse momento e organizar nossa lista de presentes de uma forma simples e especial.",
			lettersEnabled: true,
			publicGiftValues: true,
		},
	});

	console.log("Configurações iniciais do site configuradas.");
}

async function main() {
	console.log("Iniciando seed...");

	await seedAdminUser();
	await seedSiteSettings();

	console.log("Seed concluído com sucesso.");
}

main().catch((error: unknown) => {
    console.error("Erro ao executar o seed:", error);
    process.exitCode = 1;
}).finally(async () => {
    await prisma.$disconnect();
});