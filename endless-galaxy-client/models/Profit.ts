export default interface Profit {
	id: number;
	week: number;
	user_id: number;
	total: number;
	profit_data: Record<string, ProfitEntry[]>;
}

export interface ProfitEntry {
	key: string;
	meta?: string;
	amounts: number[];
}
