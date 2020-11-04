import {Vector3, vecNormalize} from './Vector';

function matrixToString(m: number[]) {
	return `[${m[0]}\t${m[1]}\t${m[2]}\t${m[3]}]
[${m[4]}\t${m[5]}\t${m[6]}\t${m[7]}]
[${m[8]}\t${m[9]}\t${m[10]}\t${m[11]}]
[${m[12]}\t${m[13]}\t${m[14]}\t${m[15]}]`;
}

export function degToRad(deg: number) {
	return deg / 180 * Math.PI;
}

function multMatrixes(s: number[], m: number[]): number[] {
	return [
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

export class TransformMatrix {
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

	stack = [] as number[][];

	copy() {
		let mat = new TransformMatrix();
		mat.matrix = this.matrix.map(x => x);
		return mat;
	}

	push() {
		this.stack.push(this.matrix.map(x => x));
		return this;
	}

	pop() {
		if (this.stack.length > 0) {
			this.matrix = this.stack.pop();
		} else {
			throw new Error('Matrix stack is empty');
		}

		return this;
	}

	apply(v: Vector3): Vector3 {
		const m = this.matrix;

		return {
			x: v.x * m[0] + v.y * m[4] + v.z * m[8] + m[12],
			y: v.x * m[1] + v.y * m[5] + v.z * m[9] + m[13],
			z: v.x * m[2] + v.y * m[6] + v.z * m[10] + m[14],
		};
	}

	multiply(m: number[]) {
		this.matrix = multMatrixes(m, this.matrix);
		return this;
	}

	translate(vec: Vector3) {
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
		this.multiply([
			vec.x, 0, 0, 0,
			0, vec.y, 0, 0,
			0, 0, vec.z, 0,
			0, 0, 0, 1,
		]);

		return this;
	}

	rotate(vec: Vector3, angle: number) {
		angle = degToRad(angle);
		const cosA = Math.cos(angle);
		const sinA = Math.sin(angle);
		const iCosA = 1 - cosA;

		vec = vecNormalize(vec);

		this.multiply([
			cosA + vec.x * vec.x * iCosA,
			vec.y * vec.x * iCosA + vec.z * sinA,
			vec.z * vec.x * iCosA - vec.y * sinA,
			0,

			vec.x * vec.y * iCosA - vec.z * sinA,
			cosA + vec.y * vec.y * iCosA,
			vec.z * vec.y * iCosA + vec.x * sinA,
			0,

			vec.x * vec.z * iCosA + vec.y * sinA,
			vec.y * vec.z * iCosA - vec.x * sinA,
			cosA + vec.z * vec.z * iCosA,
			0,

			0, 0, 0, 1,
		]);

		return this;
	}

	rotate3(angles: Vector3) {
		const ax = degToRad(angles.x);
		const ay = degToRad(angles.y);
		const az = degToRad(angles.z);

		const sinY = Math.sin(ay);
		const cosY = Math.cos(ay);
		const sinX = Math.sin(ax);
		const cosX = Math.cos(ax);
		const sinZ = Math.sin(az);
		const cosZ = Math.cos(az);

		this.multiply([
			cosZ * cosY,
			sinZ * cosY,
			-sinY,
			0,

			cosZ * sinY * sinX - sinZ * cosX,
			sinZ * sinY * sinX + cosZ * cosX,
			cosY * sinX,
			0,

			cosZ * sinY * cosX + sinZ * sinX,
			sinZ * sinY * cosX - cosZ * sinX,
			cosY * cosX,
			0,

			0, 0, 0, 1,
		]);

		return this;
	}
}
