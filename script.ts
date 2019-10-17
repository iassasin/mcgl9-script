import './mcgl9'; // обязательный импорт
import console from './mcgl9/console';

// TODO: заменить на любой нужный вам код:

let text: Operation;

mcgl9.onInit(() => {
	console.log('Initialized');
	display.size(1, 1);
	text = display.print('');
});

mcgl9.onUpdate(() => {
	if (key.press(KeyCode.F)) {
		text.text = 'Respects paid';
	}
});