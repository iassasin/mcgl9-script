let inits = [];
let updates = [];

init = function() {
	for (let i in inits) {
		inits[i].apply(this, arguments);
	}
};

update = function (time) {
	for (let i in updates) {
		updates[i].apply(this, arguments);
	}
};

mcgl9 = {
	onInit(cb) {
		inits.push(cb);
	},

	onUpdate(cb) {
		updates.push(cb);
	},
};
