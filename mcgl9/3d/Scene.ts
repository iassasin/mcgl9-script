import { Mesh } from './Mesh';
import { TransformMatrix } from './TransformMatrix';

export class Scene extends Mesh {
	update(matrix?: TransformMatrix) {
		super.update(matrix || new TransformMatrix());
	}
}