import '../mcgl9'; // обязательный импорт
import '../mcgl9/promise'; // чтобы не ругался typescript, делаем импорт без указания класса
import console from '../mcgl9/console';

function wait<T>(n: number, v?: T) {
	return new Promise<T>(res => setTimeout(() => res(v), n));
}

(async () => {
	console.log('test');
	await wait(500);
	console.log('data');
	await wait(500);
	console.log('end');
})();