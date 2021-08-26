import formatter from 'format-number';

export const format = formatter({
	prefix: '',
	integerSeparator: ' ',
	negativeLeftOut: false,
	decimal: ',',
	round: 2,
	padRight: 2,
});

export function prefix(num: number): string {
	if (num === 0) {
		return '00';
	} else if (num < 10) {
		return `0${ num }`;
	} else {
		return num.toString();
	}
}
