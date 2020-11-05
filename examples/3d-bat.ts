import mcgl9 from '../mcgl9';
import {createMeshFromTemplate, Mesh, Scene, vec3, Voxel} from '../mcgl9/3d';

let batBody = `
..o...o..
.ooo.ooo.
.oeoooeo.
.ooooooo.
looooooor
.ooooooo.
.ooopooo.
.ooooooo.
.ooooooo.
..ooooo..
...ooo...
...ooo...
....o....
`;

let batWing = `
.o....................
oooo............o.....
.ooooooo.......oo.....
..oooooooo...ooooo...o
...ooooooooooooooooooo
....oooooooooooooooooo
....o.ooooooooooooooop
.......ooooooooooooooo
.........o....oooooo.o
.........o.....o..o...
`;

const cBatBody = color.rgb(19, 8, 28);
const cBatEye = color.rgb(255, 133, 0);

let lWing: Mesh, rWing: Mesh;

let bat = createMeshFromTemplate(batBody, point => {
	switch (point) {
		case 'p':
		case 'o': return new Voxel({color: cBatBody});
		case 'e': return new Voxel({color: cBatEye});

		case 'r':
		case 'l':
			let wing = createMeshFromTemplate(batWing, point => {
				switch (point) {
					case 'p':
					case 'o': return new Voxel({color: cBatBody});
				}
			});

			if (point === 'r') {
				wing.scale = vec3(-1, 1, 1);
				rWing = wing;
			} else {
				lWing = wing;
			}

			return wing;
	}
});

bat.position = vec3(18, 16, 0);
bat.rotation = vec3(15, 0, 20);

let scene = new Scene();
scene.addElement(bat);
scene.position = vec3(8, 0, 8);

mcgl9.onUpdate(time => {
	let rot = (time % 1800 / 1800) * 6.28;

	scene.rotation.y = -(time / 25) % 360;

	lWing.rotation = vec3(50, 0, -Math.sin(rot) * 20);
	rWing.rotation = vec3(50, 0, Math.sin(rot) * 20);

	scene.update();
});