const DAYS_IN_YEAR = 364;
const DAYS_IN_WEEK = 7;

export interface DateParts {
	days: number;
	weeks: number;
	years: number;
}

export function calculateDateParts(day: number): DateParts {
	let years = Math.floor(day / DAYS_IN_YEAR);
	let yearDays = years * DAYS_IN_YEAR;

	let weeks = Math.floor((day - yearDays) / DAYS_IN_WEEK);
	let weekDays = weeks * DAYS_IN_WEEK;

	let days = day - yearDays - weekDays;

	return {
		years: years + 1,
		weeks: weeks + 1,
		days: days + 1,
	}
}
