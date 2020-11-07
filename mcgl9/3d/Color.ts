export interface ColorMask {
	r: number;
	g: number;
	b: number;
	a: number;
}

export function colorMask(r: number, g: number, b: number, a: number): ColorMask {
	return {r, g, b, a};
}