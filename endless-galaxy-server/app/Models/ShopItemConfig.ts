export const enum ShopPricingMode {
	Absolute = 0,
	Relative = 1,
}

export default interface ShopItemConfig {
	pricing: ShopPricingMode;
	keepStock: number;
}

