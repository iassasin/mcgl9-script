import mcgl9, {applier} from '.';

interface Keys {
	[k: number]: KeyState;
}

interface KeyState {
	press: boolean;
	down: KeyHandler[];
	up: KeyHandler[];
	hold: KeyHandler[];
}

type KeyHandler = (k: KeyCode) => any;

let keys: Keys = {};

mcgl9.onUpdate(() => {
	for (let k in keys) {
		let state = keys[k];
		let newPressed = key.press(k as unknown as KeyCode);

		if (state.press !== newPressed) {
			if (state.press) {
				applier(state.up)(k);
			} else {
				applier(state.down)(k);
			}

			state.press = newPressed;
		}

		if (state.press) {
			applier(state.hold)(k);
		}
	}
});

function createKeyStateIfNeed(k: KeyCode) {
	if (!keys[k]) {
		keys[k] = {
			press: key.press(k),
			down: [],
			up: [],
			hold: [],
		};
	}
}

export default {
	onKeyDown(k: KeyCode, cb: KeyHandler) {
		createKeyStateIfNeed(k);
		keys[k].down.push(cb);
	},

	onKeyUp(k: KeyCode, cb: KeyHandler) {
		createKeyStateIfNeed(k);
		keys[k].up.push(cb);
	},

	/**
	 * Событие вызывается каждый тик onUpdate проектора, если указанная клавиша нажата
	 */
	onKeyHold(k: KeyCode, cb: KeyHandler) {
		createKeyStateIfNeed(k);
		keys[k].hold.push(cb);
	},
};