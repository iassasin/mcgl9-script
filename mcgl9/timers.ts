import mcgl9 from '.';

interface Timer {
	interval: null | number;
	callback: Function;
	deadline: number;
}

let timerId = 0;
let timers: { [k: number]: Timer } = {};
let microtasks: Function[] = [];

function processTasks() {
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

	while (microtasks.length) {
		microtasks.shift()();
	}
}

mcgl9.onUpdate(processTasks);

export function setTimeout(cb: Function, timeMs: number) {
	var id = ++timerId;

	timers[id] = {
		interval: null,
		callback: cb,
		deadline: Date.now() + timeMs,
	};

	return id;
};

export function clearTimeout(id: number) {
	delete timers[id];
};

export function setInterval(cb: Function, timeMs: number) {
	var id = setTimeout(cb, timeMs);
	timers[id].interval = timeMs;
	return id;
};

export let clearInterval = clearTimeout;

export let queueMicrotask: (cb: Function) => any = microtasks.push.bind(microtasks);