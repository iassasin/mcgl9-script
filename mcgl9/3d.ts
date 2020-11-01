export function vec3(x: number, y: number, z: number) {
	return {x, y, z};
}

export function vecMultVec(v1: Vector3, v2: Vector3) {
	return {
		x: v1.x * v2.x,
		y: v1.y * v2.y,
		z: v1.z * v2.z
	};
}

export function vecAddVec(v1: Vector3, v2: Vector3) {
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y,
		z: v1.z + v2.z
	};
}

export interface Vector3 {
	x: number;
	y: number;
	z: number;
}

class Transform {
	position: Vector3;
	rotation: Vector3;
	size: number;
}

class TransformMatrix {
	/**
	 * indexes:
	 * 0  1  2  3
	 * 4  5  6  7
	 * 8  9  10 11
	 * 12 13 14 15
	 */
	matrix = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	];

	getOffsetFromOrigin(): Vector3 {
		return vec3(this.matrix[12], this.matrix[13], this.matrix[14]);
	}

	copy() {
		let mat = new TransformMatrix();
		mat.matrix = this.matrix.map(x => x);
		return mat;
	}

	apply(v: Vector3): Vector3 {
		const m = this.matrix;

		return {
			x: v.x * m[0] + v.y * m[4] + v.z * m[8] + m[12],
			y: v.x * m[1] + v.y * m[5] + v.z * m[9] + m[13],
			z: v.x * m[2] + v.y * m[6] + v.z * m[10] + m[14],
		};
	}

	applyExceptTranslation(v: Vector3): Vector3 {
		const m = this.matrix;

		return {
			x: v.x * m[0] + v.y * m[4] + v.z * m[8],
			y: v.x * m[1] + v.y * m[5] + v.z * m[9],
			z: v.x * m[2] + v.y * m[6] + v.z * m[10],
		};
	}

	multiply(m: number[]) {
		const s = this.matrix;

		this.matrix = [
			s[0] * m[0] + s[1] * m[4] + s[2] * m[8] +  s[3] * m[12],
			s[0] * m[1] + s[1] * m[5] + s[2] * m[9] +  s[3] * m[13],
			s[0] * m[2] + s[1] * m[6] + s[2] * m[10] + s[3] * m[14],
			s[0] * m[3] + s[1] * m[7] + s[2] * m[11] + s[3] * m[15],

			s[4] * m[0] + s[5] * m[4] + s[6] * m[8] +  s[7] * m[12],
			s[4] * m[1] + s[5] * m[5] + s[6] * m[9] +  s[7] * m[13],
			s[4] * m[2] + s[5] * m[6] + s[6] * m[10] + s[7] * m[14],
			s[4] * m[3] + s[5] * m[7] + s[6] * m[11] + s[7] * m[15],

			s[8] * m[0] + s[9] * m[4] + s[10] * m[8] +  s[11] * m[12],
			s[8] * m[1] + s[9] * m[5] + s[10] * m[9] +  s[11] * m[13],
			s[8] * m[2] + s[9] * m[6] + s[10] * m[10] + s[11] * m[14],
			s[8] * m[3] + s[9] * m[7] + s[10] * m[11] + s[11] * m[15],

			s[12] * m[0] + s[13] * m[4] + s[14] * m[8] +  s[15] * m[12],
			s[12] * m[1] + s[13] * m[5] + s[14] * m[9] +  s[15] * m[13],
			s[12] * m[2] + s[13] * m[6] + s[14] * m[10] + s[15] * m[14],
			s[12] * m[3] + s[13] * m[7] + s[14] * m[11] + s[15] * m[15],
		];
	}

	translate(vec: Vector3) {
		vec = this.applyExceptTranslation(vec);

		// https://medium.com/swlh/understanding-3d-matrix-transforms-with-pixijs-c76da3f8bd8
		// https://en.wikipedia.org/wiki/Affine_transformation
		this.multiply([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			vec.x, vec.y, vec.z, 1,
		]);

		return this;
	}

	scale(vec: Vector3) {
		let originOffset = this.getOffsetFromOrigin();

		vec = this.applyExceptTranslation(vec);

		this.multiply([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			-originOffset.x, -originOffset.y, -originOffset.z, 1,
		]);

		this.multiply([
			vec.x, 0, 0, 0,
			0, vec.y, 0, 0,
			0, 0, vec.z, 0,
			0, 0, 0, 1,
		]);

		this.multiply([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			originOffset.x, originOffset.y, originOffset.z, 1,
		]);

		return this;
	}

	rotate(vec: Vector3, angle: number) {
		angle = angle / 360 * 6.283;
		const cosA = Math.cos(angle);
		const sinA = Math.sin(angle);

		vec = this.applyExceptTranslation(vec);

		let originOffset = this.getOffsetFromOrigin();

		this.multiply([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			-originOffset.x, -originOffset.y, -originOffset.z, 1,
		]);

		// https://en.wikipedia.org/wiki/Rotation_matrix
		this.multiply([
			cosA + vec.x * vec.x * (1 - cosA),
			vec.x * vec.y * (1 - cosA) - vec.z * sinA,
			vec.x * vec.z * (1 - cosA) + vec.y * sinA,
			0,

			vec.y * vec.x * (1 - cosA) + vec.z * sinA,
			cosA + vec.y * vec.y * (1 - cosA),
			vec.y * vec.z * (1 - cosA) - vec.x * sinA,
			0,

			vec.z * vec.x * (1 - cosA) - vec.y * sinA,
			vec.z * vec.y * (1 - cosA) + vec.x * sinA,
			cosA + vec.z * vec.z * (1 - cosA),
			0,

			0, 0, 0, 1,
		]);

		this.multiply([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			originOffset.x, originOffset.y, originOffset.z, 1,
		]);

		return this;
	}
}

interface VoxelProps {
	color?: number;
	size?: number;
}

export class Voxel {
	position: Vector3;
	color: number;
	size: number;
	parent: Mesh;

	private voxel: Operation;

	constructor(x: number, y: number, z: number, props?: VoxelProps) {
		let rprops = {color: color.rgb(255, 0, 0), size: 1};
		if (props) {
			for (let k in props) {
				rprops[k] = props[k];
			}
		}

		this.position = {x, y, z};
		this.color = rprops.color;
		this.size = rprops.size;

		this.voxel = display.voxel(x, y, z, this.color);
	}

	update() {
		let pos = this.position;

		if (this.parent) {
			pos = this.parent.transformMatrix.apply(pos);
		}

		this.voxel.color = this.color;
		this.voxel.scale = this.size;
		this.voxel.cursorX = pos.x;
		this.voxel.cursorY = pos.y;
		this.voxel.cursorZ = pos.z;
	}

	destroy() {
		this.voxel.remove();
	}
}

export class Mesh {
	static fromTemplate(template: string) {
		let mesh = new Mesh();

		let lines = template.split('\n');

		for (let y = 0; y < lines.length; ++y) {
			let line = lines[y];

			for (let x = 0; x < line.length; ++x) {
				let point = line[x];

				switch (point) {
					case '.':
					case ' ': break;
					case 'p': mesh.pivot = vec3(x, lines.length - y, 0); break;

					default:
						mesh.addElement(new Voxel(x, lines.length - y, 0));
				}
			}
		}

		return mesh;
	}

	elements: (Voxel | Mesh)[];
	position: Vector3;
	pivot: Vector3;
	rotation: Vector3;
	scale: Vector3;
	parent: Mesh;
	transformMatrix: TransformMatrix;

	constructor(parent?: Mesh) {
		this.elements = [];
		this.parent = parent;
		this.position = vec3(0, 0, 0);
		this.pivot = vec3(0, 0, 0);
		this.rotation = vec3(0, 0, 0);
		this.scale = vec3(1, 1, 1);
		this.transformMatrix = new TransformMatrix();
	}

	addElement(el: Voxel | Mesh) {
		el.parent = this;
		this.elements.push(el);
	}

	update() {
		let matr: TransformMatrix;

		if (this.parent) {
			matr = this.parent.transformMatrix.copy();
		} else {
			matr = new TransformMatrix();
		}

		this.transformMatrix = matr;

		matr
			.translate(this.position)
			.scale(this.scale)
			.rotate(vec3(1, 0, 0), this.rotation.x)
			.rotate(vec3(0, 1, 0), this.rotation.y)
			.rotate(vec3(0, 0, 1), this.rotation.z)
			.translate(vecMultVec(this.pivot, vec3(-1, -1, -1)));

		for (let el of this.elements) {
			el.update();
		}
	}
}