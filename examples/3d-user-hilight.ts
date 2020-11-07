import mcgl9 from '../mcgl9';
import {ColorMask, colorMask, Mesh, Scene, TransformMatrix, vec3, vecAddVec, vecInvert, vecMultVal, Voxel} from '../mcgl9/3d';

const defColor = colorMask(0.1, 0.1, 0.1, 1);
const hiColor = colorMask(1, 1, 1, 1);
const fadeSpeed = 0.5; // in sec

function lerp(from: number, to: number, speed: number, deltaTimeSec: number): number {
	let diff = to - from;
	if (diff < 0.001 && diff > -0.001) {
		return to;
	}

	let result = from + speed * deltaTimeSec * (diff < 0 ? -1 : 1);

	if (diff < 0 && result < to || diff > 0 && result > to) {
		return to;
	}

	return result;
}

class HilightVoxel extends Voxel {
	lastTime = Date.now();
	currentColor = colorMask(defColor.r, defColor.g, defColor.b, defColor.a);

	update(matrix: TransformMatrix) {
		let userPos = vec3(-user.z() + 0.5, (user.y() - 2), user.x() + 0.5);
		userPos = vecMultVal(userPos, 16);
		let appliedPos = matrix.apply(this.position);
		let rpos = vecAddVec(userPos, vecInvert(appliedPos));

		let currentColor = this.currentColor;
		let targetColor: ColorMask;
		if (rpos.x * rpos.x + rpos.y * rpos.y + rpos.z * rpos.z <= 10*10) {
			targetColor = hiColor;
			currentColor.r = hiColor.r;
			currentColor.g = hiColor.g;
			currentColor.b = hiColor.b;
			currentColor.a = hiColor.a;
		} else {
			targetColor = defColor;
		}

		let deltaTime = Date.now() - this.lastTime;
		this.lastTime += deltaTime;
		deltaTime /= 1000;

		currentColor.r = lerp(currentColor.r, targetColor.r, fadeSpeed, deltaTime);
		currentColor.g = lerp(currentColor.g, targetColor.g, fadeSpeed, deltaTime);
		currentColor.b = lerp(currentColor.b, targetColor.b, fadeSpeed, deltaTime);
		currentColor.a = lerp(currentColor.a, targetColor.a, fadeSpeed, deltaTime);

		matrix.color(currentColor);

		super.update(matrix);
	}
}

let scene = new Scene();
scene.position = vec3(8, 0, 8);

let ground = new Mesh();
for (let x = -32; x <= 32; ++x) {
	for (let z = -32; z <= 32; ++z) {
		const cr = (x + 32) / 64;
		const cz = (z + 32) / 64;
		ground.addElement(new HilightVoxel({position: vec3(x, 0, z), color: color.rgbf(cr, cr * cz, cz)}));
	}
}
scene.addElement(ground);

mcgl9.onUpdate(time => {
	scene.update();
});