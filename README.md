# mcgl9-script

Шаблон для написания своих скриптов в модульном стиле для [mcgl9](https://forum.minecraft-galaxy.ru/wiki/1141)

## Фичи

- Автодополнение для всех объектов из документации (display, key, user, sound, ...)
- Более удобная работа с клавишами и другими перечислимыми типами (например, вместо числовых кодов клавиш можно писать `KeyCode.F`)
- Добавлена поддержка базовых отсутствующих функций (например, setTimeout, setInterval)
- Получаемый результат практически не содержит оверхеда (благодаря использованию сборщика rollup)
- Поддержка typescript

# Использование

Скрипт пишется в файле script.ts с использованием любых нужных вам импортов. Вы вольны разбивать свой код на модули как угодно. Типичный скрипт выглядит следующим образом:

```ts
import './mcgl9'; // обязательный импорт
import {setInterval} from './mcgl9/timers'; // используемые модули

// пользовательский код:
setInterval(() => display.log('hello'), 1000);
```

Получить готовый скрипт можно следующим образом:

1. Написать скрипт в script.ts
2. Выполнить `npm run build` (или `npm run build-mini` для минифицированного варианта)
3. Забрать готовый скрипт из `dist/script.js`
4. Вставить содержимое файла `dist/script.js` в блокнот в игре, блокнот в mcgl9 и в проектор.

# Доступные модули

## './mcgl9'

Базовый модуль, обеспечивающий работу всех остальных модулей, а также предоставляющий стандартные для mcgl9 функции:

```ts
import './mcgl9';

mcgl9.onInit(() => {
	// аналог функции init() из документации MCGL
});

mcgl9.onUpdate((time) => {
	// аналог функции update(time) из документации MCGL
});
```

## './mcgl9/timers'

Модуль, предоставляющий функции работы с таймерами, аналогичными стандартным в javascript. У них есть только одно отличие: коллбекам таймера нельзя передавать аргументы, как в стандартных для js функциях.

Пример:
```ts
import './mcgl9';
import {setTimeout, setInterval, clearTimeout, clearInterval} from './mcgl9/timers';

let to = setTimeout(() => display.log('timeout'), 100);
clearTimeout(to); // отменить таймаут

let iv = setInterval(() => display.log('interval'), 1000);
clearInterval(iv); // отменить интервал
```