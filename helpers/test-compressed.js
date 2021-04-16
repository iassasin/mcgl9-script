const lz = require('lz-string');
const path = require('path');
const fs = require('fs').promises;

const altAlpha = ':;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz';

(async () => {
	let sourceScript = 'dist/3d.js';

	let origScript = (await fs.readFile(sourceScript)).toString();
	let decompressFunc = (await fs.readFile(path.join(__dirname, 'lz-decompress.js'))).toString();
	decompressFunc = eval(`(${decompressFunc})`);

	let compressedOrig = lz._compress(origScript, 6 /* bits */, a => altAlpha.charAt(a));

	let decompressedScript = decompressFunc(compressedOrig);

	console.log(origScript == decompressedScript);
})();