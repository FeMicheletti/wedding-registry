import { notFound } from "next/navigation";
import { GiftForm } from "@/components/admin/gifts/gift-form";
import { formatCentsForInput } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { updateGiftAction } from "../../actions";
import { initialGiftActionState } from "../../action-state";

type EditGiftPageProps = {
	params: Promise<{
		id: string;
	}>;
};

export default async function EditGiftPage({ params }: EditGiftPageProps) {
	const { id } = await params;

	const gift = await prisma.gift.findUnique({
		where: {
			id,
		},
	});

	if (!gift) notFound();

	const action = updateGiftAction.bind( null, gift.id );

	return (
		<div className="mx-auto max-w-4xl space-y-8">
			<header>
				<p className="text-sm font-medium text-zinc-500">
					Presentes
				</p>
				<h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
					Editar presente
				</h1>
				<p className="mt-2 text-zinc-600">
					Atualize as informações de {gift.title}.
				</p>
			</header>

			<GiftForm
				action={action}
				initialState={initialGiftActionState}
				submitLabel="Salvar alterações"
				initialValues={{
					title: gift.title,
					description: gift.description,
					imageUrl: gift.imageUrl ?? "",
					price: formatCentsForInput(gift.priceInCents),
					storeUrl: gift.storeUrl ?? "",
					allowStorePurchase: gift.allowStorePurchase,
					allowPix: gift.allowPix,
					quotaCount: gift.quotaCount,
					featured: gift.featured,
					displayOrder: gift.displayOrder
				}}/>
		</div>
	);
}