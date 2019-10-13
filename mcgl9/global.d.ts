declare var init: () => any;
declare var update: (time: number) => any;
declare var mcgl9: {
	onInit(cb: (...args: any[]) => any);
	onUpdate(cb: (...args: any[]) => any);
};

declare var display: DisplayService;
declare var key: KeyService;
declare var sound: SoundService;
declare var color: ColorService;
declare var user: UserService;

interface DisplayService {
	/**
	 * определяет размер виртуального экрана, могут принимать значения от 1 до 3 блоков.
	 * Текст и иконки, которые выходят за пределы экрана будут обрезаны.
	 */
	size(width: 1|2|3, height: 1|2|3);

	/**
	 * ориентация текстовых элементов (см. Orientation)
	 */
	orientation(mode: Orientation);

	/**
	 * позиция по z координате от 0 до 16 (нужно выставлять, если перед проектором стоят блоки)
	 */
	depth(value: 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16);

	/**
	 * очистка всего вывода
	 */
	clear();

	/**
	 * печать текста с текущим цветом, масштабом и координатами, смещает текущую координату курсора X на длину текста
	 */
	print(text: string): Operation;

	/**
	 * передвинуть текущие координаты курсора (0-15 - текущий блок, 16-31 следующий и т.д.)
	 */
	cursor(x: number, y: number);

	/**
	 * тоже самое что и cursor только добавляет к уже установленной позиции курсора новые значения
	 */
	offset(x: number, y: number);

	/**
	 * цвет текста
	 */
	color(value: number);

	/**
	 * вывод текста в консоль (использовать для отладки)
	 */
	log(text: string);

	/**
	 * тип шрифта
	 */
	font(type: FontType);

	/**
	 * отображает иконку предмета из слота с индексом slot из контейнера, который стоит над проектором
	 * (работать будет только с контейнерами, чье содержимое грузится на клиент, например, проектор)
	 */
	icon(slot: number): Operation;

	/**
	 * отображает воксель заданного цвета в указанных координатах
	 */
	voxel(x, y, z, color): Operation;
}

declare const enum Orientation {
	/**
	 * Направление в сторону установки проектора
	 */
	TO_PROJECTOR = 0,

	/**
	 * Всегда направлены на игрока.
	 * Виртуальный экран меняется с плоскости заданного размера на куб
	 * со сторонами в 5 блоков и центом в точке установки проектора.
	 */
	TO_PLAYER = 1,
}

declare const enum FontType {
	BIG = 0,
	SMALL = 1,
	NORMAL = 2,
	TERMINAL = 3,
}

interface Operation {
	/** координата X на экране */
	cursorX: number;

	/** координата Y на экране */
	cursorY: number;

	/** координата Z на экране (глубина) */
	cursorZ: number;

	/** масштаб */
	scale: number;

	/** цвет */
	color: number;

	/** текст надписи */
	text: string;

	/** устанавливает значения всех трех координат cursorXXX */
	move(x: number, y: number, z: number);

	/** смещает значения всех трех координат cursorXXX */
	offset(x: number, y: number, z: number);

	/** удаляет текущий элемент (удаление происходит не сразу, а после завершения текущего цикла отрисовки элементов) */
	remove();
}

interface KeyService {
	/** возвращает true, если нажата клавиша с кодом code и false в противном случае  */
	press(key: KeyCode): boolean;
}

interface SoundService {
	/** воспроизводит стандартный звук, например mob.cow (соответствует имени пути в папке resources/newsound) */
	play(soundName: string);
}

interface ColorService {
	/**
	 * возвращает код цвета по трем компонентам и с alpha = 0xff
	 * компоненты должны иметь значения от 0 до 255 (0 - 0xff)
	 */
	rgb(r: number, g: number, b: number): number;

	/** возвращает код цвета по всем 4м компонентам (аналогично rgb) */
	rgba (r: number, g: number, b: number, a: number): number;

	/**
	 * возвращает код цвета по трем компонентам и с alpha = 1.0
	 * компоненты должны иметь значения от 0.0 до 1.0
	 */
	rgbf(r: number, g: number, b: number): number;

	/**
	 * возвращает код цвета по четырем компонентам
	 * компоненты должны иметь значения от 0.0 до 1.0
	 */
	rgbaf(r: number, g: number, b: number, a: number): number;
}

interface UserService {
	/** Ник игрока */
	name(): string;

	/**
	 * позиция X относительно проектора, в котором выполняется программа
	 * (нулевая точка это центр проектора)
	 */
	x(): number;

	/**
	 * позиция Y относительно проектора, в котором выполняется программа
	 * (нулевая точка это центр проектора)
	 */
	y(): number;

	/**
	 * позиция Y относительно проектора, в котором выполняется программа
	 * (нулевая точка это центр проектора)
	 */
	z(): number;
}

declare const enum KeyCode {
	ESCAPE = 1,
	NUM1 = 2,
	NUM2 = 3,
	NUM3 = 4,
	NUM4 = 5,
	NUM5 = 6,
	NUM6 = 7,
	NUM7 = 8,
	NUM8 = 9,
	NUM9 = 10,
	NUM0 = 11,
	MINUS = 12,
	EQUALS = 13,
	BACK = 14,
	TAB = 15,
	Q = 16,
	W = 17,
	E = 18,
	R = 19,
	T = 20,
	Y = 21,
	U = 22,
	I = 23,
	O = 24,
	P = 25,
	LBRACKET = 26,
	RBRACKET = 27,
	RETURN = 28,
	LCONTROL = 29,
	A = 30,
	S = 31,
	D = 32,
	F = 33,
	G = 34,
	H = 35,
	J = 36,
	K = 37,
	L = 38,
	SEMICOLON = 39,
	APOSTROPHE = 40,
	GRAVE = 41,
	LSHIFT = 42,
	BACKSLASH = 43,
	Z = 44,
	X = 45,
	C = 46,
	V = 47,
	B = 48,
	N = 49,
	M = 50,
	COMMA = 51,
	PERIOD = 52,
	SLASH = 53,
	RSHIFT = 54,
	MULTIPLY = 55,
	LMENU = 56,
	SPACE = 57,
	CAPITAL = 58,
	F1 = 59,
	F2 = 60,
	F3 = 61,
	F4 = 62,
	F5 = 63,
	F6 = 64,
	F7 = 65,
	F8 = 66,
	F9 = 67,
	F10 = 68,
	NUMLOCK = 69,
	SCROLL = 70,
	NUMPAD7 = 71,
	NUMPAD8 = 72,
	NUMPAD9 = 73,
	SUBTRACT = 74,
	NUMPAD4 = 75,
	NUMPAD5 = 76,
	NUMPAD6 = 77,
	ADD = 78,
	NUMPAD1 = 79,
	NUMPAD2 = 80,
	NUMPAD3 = 81,
	NUMPAD0 = 82,
	DECIMAL = 83,
	F11 = 87,
	F12 = 88,
	F13 = 100,
	F14 = 101,
	F15 = 102,
	F16 = 103,
	F17 = 104,
	F18 = 105,
	KANA = 112,
	F19 = 113,
	CONVERT = 121,
	NOCONVERT = 123,
	YEN = 125,
	NUMPADEQUALS = 141,
	CIRCUMFLEX = 144,
	AT = 145,
	COLON = 146,
	UNDERLINE = 147,
	KANJI = 148,
	STOP = 149,
	AX = 150,
	UNLABELED = 151,
	NUMPADENTER = 156,
	RCONTROL = 157,
	SECTION = 167,
	NUMPADCOMMA = 179,
	DIVIDE = 181,
	SYSRQ = 183,
	RMENU = 184,
	FUNCTION = 196,
	PAUSE = 197,
	HOME = 199,
	UP = 200,
	PRIOR = 201,
	LEFT = 203,
	RIGHT = 205,
	END = 207,
	DOWN = 208,
	NEXT = 209,
	INSERT = 210,
	DELETE = 211,
	CLEAR = 218,
	LMETA = 219,
}