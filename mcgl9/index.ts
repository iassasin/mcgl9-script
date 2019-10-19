let inits = [] as Function[];
let updates = [] as Function[];

export function applier<T extends Function>(arr: T[]) {
	return function() {
		for (let i in arr) {
			arr[i].apply(this, arguments);
		}
	} as (...args: any[]) => any;
}

init = applier(inits);
update = applier(updates);

export default {
	onInit(cb: () => any) {
		inits.push(cb);
	},

	onUpdate(cb: (time: number) => any) {
		updates.push(cb);
	},
};
