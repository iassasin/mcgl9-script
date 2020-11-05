import mcgl9 from '../mcgl9';
import {createMeshFromTemplate, Scene, vec3} from '../mcgl9/3d';

let rocketModel = `
.......oo.......
.....oooooo.....
....ooo..ooo....
....oo....oo....
....oo....oo....
....ooo..ooo....
....oooooooo....
....oooooooo....
....oooooooo....
..oooooooooooo..
.oooooop.oooooo.
oooooooooooooooo
ooo.oooooooo.ooo
oo..oooooooo..oo
oo..oooooooo..oo
o..............o
`;
// символ 'p' в середине ракеты имеет особое значение: это pivot, т.е. точка поворота или центр объекта

// создаем сцену, на которой будем размещать объекты
let scene = new Scene();
// Передвинем центр сцены в центр блока над проектором
scene.position = vec3(8, 0, 8);

// создаем экземпляр ракеты по шаблону
let rocket = createMeshFromTemplate(rocketModel);
// подвинем ракету в середину текущего блока
// работает относительно центра родительского объекта, в данном случае сцены
rocket.position = vec3(0, 8, 0);
// добавляем ракету на сцену
scene.addElement(rocket);

mcgl9.onUpdate(time => {
	let rot = (time % 3600 / 3600) * 6.28;

	rocket.rotation.z = Math.sin(rot) * 30;

	// Важно: всегда должен идти в конце onUpdate. Пересчитывает все объекты и обновляет воксели
	scene.update();
});