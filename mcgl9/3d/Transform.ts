import {TransformMatrix} from './TransformMatrix';

export type TransformerFunction = (matrix: TransformMatrix) => void;

export function createCustomTransform(update: TransformerFunction) {
	return new class extends Transform {
		update(matrix: TransformMatrix) {
			matrix.push();
			update(matrix);
			super.update(matrix);
			matrix.pop();
		}
	}
}

export class Transform {
	elements = [] as Transform[];

	update(matrix: TransformMatrix) {
		for (let el of this.elements) {
			el.update(matrix);
		}
	}

	addElement(el: Transform) {
		this.elements.push(el);
	}

	destroy() {
		for (let el of this.elements) {
			el.destroy();
		}
	}
}