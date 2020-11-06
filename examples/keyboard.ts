import mcgl9 from '../mcgl9';
import keyboard from '../mcgl9/keyboard';

let lines: Operation[] = [null, null, null];

display.size(1, 1);
display.color(color.rgbf(1, 1, 1));

for (let i = 0; i < 3; ++i) {
	display.cursor(0, 2 * i);
	lines[i] = display.print('');
}

let ctr = [0, 0, 0];

keyboard.onKeyDown(KeyCode.F, () => {
	++ctr[0];
	lines[0].text = `down ${ctr[0]}`;
});

keyboard.onKeyUp(KeyCode.F, () => {
	++ctr[1];
	lines[1].text = `up ${ctr[1]}`;
});

keyboard.onKeyHold(KeyCode.F, () => {
	++ctr[2];
	lines[2].text = `hold ${ctr[2]}`;
});