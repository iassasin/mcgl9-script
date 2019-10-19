# mcgl9-script

Шаблон для написания своих скриптов в модульном стиле для [mcgl9](https://forum.minecraft-galaxy.ru/wiki/1141)

## Фичи

- Автодополнение для всех объектов из документации (display, key, user, sound, ...) благодаря использованию typescript
- Более удобная работа с клавишами и другими перечислимыми типами (например, вместо числовых кодов клавиш можно писать `KeyCode.F`)
- Добавлена поддержка базовых отсутствующих функций (например, setTimeout, setInterval)
- Поддержка Promise и async/await (см. примеры)
- Получаемый результат практически не содержит оверхеда по размеру кода (благодаря использованию сборщика rollup и минималистичной библиотеке модулей)
- Множество модулей, упрощающих работу с mcgl9. В конечный скрипт попадут только те, что действительно используются!

# Использование

Подготовка шаблона (требует предустановленных nodejs и npm):

1. Склонировать себе репозиторий в любую папку `git clone https://github.com/iassasin/mcgl9-script`
2. Перейти в папку: `cd mcgl9-script`
3. Установить зависимости для сборки `npm install`
4. Теперь можно писать и собирать скрипты

Скрипт пишется в файле `script.ts` с использованием любых нужных вам импортов. Вы вольны разбивать свой код на модули как угодно. Типичный скрипт выглядит следующим образом:

```ts
import mcgl9 from './mcgl9';
import {setInterval} from './mcgl9/timers'; // используемые модули

mcgl9.onInit(() => {
	display.size(1, 1);
});

setInterval(() => display.print('hello'), 1000);
```

Получить готовый скрипт можно следующим образом:

1. Написать скрипт в script.ts
2. Выполнить `npm run build` (или `npm run build-mini` для минифицированного варианта)
3. Забрать готовый скрипт из `dist/script.js`
4. Вставить содержимое файла `dist/script.js` в блокнот в игре, блокнот в mcgl9 и в проектор.

# Доступные модули

## './mcgl9'

Базовый модуль, обеспечивающий работу других модулей, а также предоставляющий стандартные для mcgl9 функции:

```ts
import mcgl9 from './mcgl9';

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
import {setTimeout, setInterval, clearTimeout, clearInterval} from './mcgl9/timers';

let to = setTimeout(() => display.log('timeout'), 100);
clearTimeout(to); // отменить таймаут

let iv = setInterval(() => display.log('interval'), 1000);
clearInterval(iv); // отменить интервал
```

## './mcgl9/console'

Предоставляет более привычные методы `console.log`, `console.warn`, `console.error`, `console.info`, принимающие несколько аргументов (в отличие от `display.log`)

Пример:
```ts
import console from './mcgl9/console';

console.log(1, 2, 3); // => 1,2,3
console.info(1, 2, 3); // => [INFO] 1,2,3
console.warn(1, 2, 3); // => [WARN] 1,2,3
console.error(1, 2, 3); // => [ERROR] 1,2,3
```

## './mcgl9/promise'

Предоставляет простую реализацию промисов для mcgl9, пока без поддержки `Promise.all` и других стандартных методов,
только `Promise.resolve` и `Promise.reject`

Пример:
```ts
import './mcgl9/promise';
import console from './mcgl9/console';

Promise.resolve('Hello')
	.then(hello => `${hello}, world!`)
	.then(console.log); // Hello, world!
```