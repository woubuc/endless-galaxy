export default interface Profit {
	id: number;
	day: number;
	user_id: number;
	total: number;
	profit_data: Record<string, ProfitEntry[]>;
}

export interface ProfitEntry {
	id: string;
	amount: number;
}
