import formatter from 'format-number';

export const format = formatter({
	prefix: '',
	integerSeparator: ' ',
	negativeLeftOut: false,
	decimal: ',',
	round: 2,
	padRight: 2,
});
