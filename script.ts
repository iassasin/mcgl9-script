import mcgl9 from './mcgl9';

// TODO: заменить на любой нужный вам код:

let text: Operation;

mcgl9.onInit(() => {
	display.size(1, 1);
	text = display.print('');
});

mcgl9.onUpdate(() => {
	if (key.press(KeyCode.F)) {
		text.text = 'Respects paid';
	}
});