export default interface User {
	id: number;
	player_name: string;

	email_verified: boolean;
	email_verify_sent: Date | string;

	company_name?: string;
	money: number;
	money_loaned: number;
}
