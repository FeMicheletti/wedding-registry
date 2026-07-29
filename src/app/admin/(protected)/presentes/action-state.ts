export type GiftActionState = {
	success: boolean;
	message: string | null;

	fieldErrors?: {
		title?: string[];
		description?: string[];
		imageUrl?: string[];
		price?: string[];
		storeUrl?: string[];
		allowStorePurchase?: string[];
		allowPix?: string[];
		quotaCount?: string[];
		displayOrder?: string[];
	};
};

export const initialGiftActionState: GiftActionState = {
	success: false,
	message: null
};