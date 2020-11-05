export interface Vector3 {
	x: number;
	y: number;
	z: number;
}

export function vec3(x: number, y: number, z: number): Vector3 {
	return {x, y, z};
}

export function vecMultVal(v: Vector3, val: number): Vector3 {
	return {
		x: v.x * val,
		y: v.y * val,
		z: v.z * val,
	};
}

export function vecAddVec(v1: Vector3, v2: Vector3): Vector3 {
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y,
		z: v1.z + v2.z,
	};
}

export function vecNormalize(v: Vector3): Vector3 {
	let len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
	return {
		x: v.x / len,
		y: v.y / len,
		z: v.z / len,
	};
}

export function vecInvert(v: Vector3): Vector3 {
	return vecMultVal(v, -1);
}