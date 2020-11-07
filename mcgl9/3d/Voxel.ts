import { Transform } from './Transform';
import { TransformMatrix } from './TransformMatrix';
import { Vector3, vec3 } from './Vector';

interface VoxelProps {
	position?: Vector3;
	color?: number;
	size?: number;
}

export class Voxel extends Transform {
	position: Vector3;
	color: number;
	size: number;

	private voxel: Operation;

	constructor(props?: VoxelProps) {
		super();

		let rprops = {position: vec3(0, 0, 0), color: color.rgbf(1, 1, 1), size: 1};
		if (props) {
			for (let k in props) {
				rprops[k] = props[k];
			}
		}

		this.position = rprops.position;
		this.color = rprops.color;
		this.size = rprops.size;

		this.voxel = display.voxel(rprops.position.x, rprops.position.y, rprops.position.z, this.color);
	}

	update(matrix: TransformMatrix) {
		let pos = matrix.apply(this.position);

		this.voxel.color = matrix.applyColor(this.color);
		this.voxel.scale = this.size;
		this.voxel.cursorX = pos.x;
		this.voxel.cursorY = pos.y;
		this.voxel.cursorZ = pos.z;
	}

	destroy() {
		this.voxel.remove();
	}
}