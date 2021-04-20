# mcgl9-script

Шаблон для написания своих скриптов в модульном стиле для [mcgl9](https://forum.minecraft-galaxy.ru/wiki/1141)

## Фичи

- 3d движок, позволяющий выводить простые объекты!
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

display.size(1, 1);

setInterval(() => display.print('hello'), 1000);
```

Получить готовый скрипт можно следующим образом:

1. Написать скрипт в script.ts
2. Выполнить `npm run build-mini` (или `npm run build` для не-минифицированного варианта)
3. Забрать готовый скрипт из `dist/script.js`
4. Вставить содержимое файла `dist/script.js` в блокнот в игре, блокнот в mcgl9 и в проектор.

>  Если у вас очень большой скрипт, можно воспользоваться командой `npm run build-compressed`, это добавляет к сборке lz-сжатие кода.
>
> Но пользоваться сжатием для небольших скриптов не имеет смысла, т.к. дополнительный код для разжатия на лету может оказаться больше, чем простой минифицированный вариант.

При разработке также может быть удобно, чтобы скрипт пересобирался автоматически. Для этого вместо второго шага можно выполнить:
```
npm run watch
```
Тогда при любом изменении в `dist/` будет всегда актуальный скрипт.

# Доступные модули

## './mcgl9'

Базовый модуль, обеспечивающий работу других модулей, а также предоставляющий стандартные для mcgl9 функции:

```ts
import mcgl9 from './mcgl9';

// инициализация (аналог функции init() из документации MCGL)

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

Предоставляет простую реализацию промисов для mcgl9 с поддержкой методов `Promise.resolve`, `Promise.reject` и `Promise.all`

Пример:
```ts
import './mcgl9/promise';
import console from './mcgl9/console';

Promise.resolve('Hello')
	.then(hello => `${hello}, world!`)
	.then(console.log); // Hello, world!
```

## './mcgl9/keyboard'

Упрощение работы с клавиатурными нажатиями.

Пример:
```ts
import keyboard from './mcgl9/keyboard';

keyboard.onKeyDown(KeyCode.G, (code: KeyCode) => {
	// Вызывается один раз при нажатии на клавишу G
});

keyboard.onKeyUp(KeyCode.G, (code: KeyCode) => {
	// Вызывается один раз при отпускании клавиши G
});

keyboard.onKeyHold(KeyCode.G, (code: KeyCode) => {
	// Вызывается каждый тик onUpdate, пока клавиша G нажата
});
```

## './mcgl9/3d'

Реализация простейшего 3d движка, работающего на базе `display.voxel`. Примеры использований можно найти в папке `examples`.

### Основы

Все объекты создаются из шаблонов модели и размещаются на некоторой сцене. Лучше всего это увидеть на примере:
файл `examples/3d-rocket.ts` снабжен комментариями, поясняющими основной функционал движка.

## API 3d движка

### Базовые единицы

Минимальной единицей вывода на экран является `Voxel`. Это обертка над `display.voxel` для работы в движке.

```ts
import {Voxel, vec3} from './mcgl9/3d';

let voxel = new Voxel();

voxel.position = vec3(x, y, z); // смещение по x, y, z от центра родительского объекта
voxel.color = color.rgb(r, g, b); // цвет вокселя
voxel.scale = 1; // Представляет собой размер вокселя. Менять с осторожностью, т.к. это может сломать модели.
```

При созданию вокселю можно передать необязательные аргументы:
```ts
new Voxel({
	position: vec3(1, 2, 3),
	color: color.rgb(255, 0, 0), // красный
	size: 2,
});
```

Как вы могли заметить, используется функция `vec3` - она создает простой объект-вектор, содержащий в себе три компоненты:
```ts
let vec = vec3(1, 2, 3);
vec.x // 1
vec.y // 2
vec.z // 3
```

### Работа с моделями

Модели представлены объектами Mesh, который состоит из вокселей и имеет следующие свойства:
```ts
import {Mesh, vec3, colorMask} from './mcgl9/3d';

let mesh = new Mesh();

mesh.position = vec3(x, y, z); // смещение по x, y, z от центра родительского объекта
mesh.scale = vec3(x, y, z); // масштаб по каждой оси. Например, увеличить объект в 3 раза - vec3(3, 3, 3),
// отразить объект по вертикали (верх станет низом) - vec3(1, -1, 1).
mesh.rotation = vec3(x, y, z); // Углы поворотов вдоль каждой отдельной оси. Поворот происходит относительно своего центра (pivot)
mesh.pivot = vec3(x, y, z); // Устанавливает точку поворота, т.е. центр объекта. Обычно его не нужно задавать самостоятельно, он берется из шаблона
mesh.color = colorMask(r, g, b, a); // Устанавливает маску цвета, применяемого к подобъектам. Например, при маске (1,0,0,1) белый цвет станет красным.
```

Удобно создавать модель с помощью функции `createMeshFromTemplate`:

```ts
import {createMeshFromTemplate} from './mcgl9/3d';

let model = `
 + 
+++
 + 
`;

let mesh = createMeshFromTemplate(model); // создался экземпляр модели.
```

Особое назначение имеет символ `p` внутри шаблона. По нему можно указать точку поворота, т.е. центр модели.

Кроме того, функция `createMeshFromTemplate` умеет принимать вторым аргументом другую функцию, в которой можно переопределить создаваемые воксели.
Например:

```ts
import {createMeshFromTemplate, Voxel} from './mcgl9/3d';

let model = `
 + 
+p+
 + 
`;

let mesh = createMeshFromTemplate(model, point => {
	// point - это текущий обрабатываемый воксель из шаблона.
	// В данном случае он может принимать значения ' ', 'p' и '+'
	switch (point) {
		case ' ': return; // пустота, не должно быть вокселя
		case 'p': // для центра также возвращать воксель
		case '+': return new Voxel(); // часть модели, создаем воксель
	}
});
```

### Другие функции

Движок также позволяет создавать кастомные объекты на основе базового класса `Transform` или переопределять трансформации
над группами объектов с помощью фунции `createCustomTransform`. Это требует знаний работы с матрицами трансформации
из линейной алгебры.

Также есть функции для работы с векторами: `vec3`, `vecInvert`, `vecAddVec`, `vecNormalize`, `vecMultVal`.

Предлагаю ознакомиться с дополнительными возможностями самостоятельно из исходников движка (они небольшие): `mcgl9/3d/*`.