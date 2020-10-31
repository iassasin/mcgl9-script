function printer(pre: string) {
	return function() { return sys.log(pre + [].map.call(arguments, x => x)); } as (...args) => any;
}

export default {
	log: printer(''),
	info: printer('[INFO] '),
	warn: printer('[WARN] '),
	error: printer('[ERROR] '),
} as Console;