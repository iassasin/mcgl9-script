import { Transform } from './Transform';
import { TransformMatrix } from './TransformMatrix';
import { Vector3, vec3, vecInvert } from './Vector';
import { Voxel } from './Voxel';

export class Mesh extends Transform {
	position: Vector3;
	pivot: Vector3;
	rotation: Vector3;
	scale: Vector3;

	constructor() {
		super();

		this.position = vec3(0, 0, 0);
		this.pivot = vec3(0, 0, 0);
		this.rotation = vec3(0, 0, 0);
		this.scale = vec3(1, 1, 1);
	}

	update(matrix: TransformMatrix) {
		matrix
			.push()
			.translate(this.position)
			.rotate3(this.rotation)
			.scale(this.scale)
			.translate(vecInvert(this.pivot))
			;

		for (let el of this.elements) {
			el.update(matrix);
		}

		matrix.pop();
	}
}

export function createMeshFromTemplate(template: string, objectFabric?: (point: string, x: number, y: number, mesh: Mesh) => Transform) {
	if (!(objectFabric && objectFabric instanceof Function)) {
		objectFabric = point => {
			switch (point) {
				case '.':
				case ' ': return null;

				default:
					return new Voxel();
			}
		}
	}

	let mesh = new Mesh();

	let lines = template.split('\n');

	for (let y = 0; y < lines.length; ++y) {
		let line = lines[y];

		for (let x = 0; x < line.length; ++x) {
			let point = line[x];
			let realY = lines.length - y;

			let obj = objectFabric(point, x, realY, mesh) as Transform & {position: Vector3};
			if (obj) {
				if (obj.position) {
					obj.position = vec3(x, realY, obj.position.z);
				}
				mesh.addElement(obj);
			}

			if (point === 'p') {
				mesh.pivot = vec3(x, realY, obj && obj.position && obj.position.z || 0);
			}
		}
	}

	return mesh;
}