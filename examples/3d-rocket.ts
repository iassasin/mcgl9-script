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

let scene = new Scene();

let rocket = createMeshFromTemplate(rocketModel);
rocket.position = vec3(8, 8, 8);
scene.addElement(rocket);

mcgl9.onUpdate(time => {
	let rot = (time % 3600 / 3600) * 6.28;

	rocket.rotation.z = Math.sin(rot) * 30;

	scene.update();
});