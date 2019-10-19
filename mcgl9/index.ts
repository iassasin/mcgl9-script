let inits = [] as Function[];
let updates = [] as Function[];

function applier<T extends Function>(arr: T[]) {
	return function() {
		for (let i in arr) {
			arr[i].apply(this, arguments);
		}
	};
}

init = applier(inits);
update = applier(updates);

mcgl9 = {
	onInit: inits.push.bind(inits),
	onUpdate: updates.push.bind(updates),
};
