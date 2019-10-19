import mcgl9 from '.';

interface Timer {
	interval: null | number;
	callback: Function;
	deadline: number;
}

var timerId = 0;
var timers: { [k: number]: Timer } = {};

function processTimers() {
	for (let id in timers) {
		let timer = timers[id];
		if (Date.now() >= timer.deadline) {
			if (timer.interval !== null) {
				timer.deadline += timer.interval;
			} else {
				delete timers[id];
			}

			timer.callback();
		}
	}
}

mcgl9.onUpdate(processTimers);

export function setTimeout(cb, timeMs) {
	var id = ++timerId;

	timers[id] = {
		interval: null,
		callback: cb,
		deadline: Date.now() + timeMs,
	};

	return id;
};

export function clearTimeout(id) {
	delete timers[id];
};

export function setInterval(cb, timeMs) {
	var id = setTimeout(cb, timeMs);
	timers[id].interval = timeMs;
	return id;
};

export var clearInterval = clearTimeout;