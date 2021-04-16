const lz = require('lz-string');
const path = require('path');
const fs = require('fs').promises;
const uglifyjs = require('uglify-js');

const altAlpha = ':;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz';

(async () => {
	let sourceScript = process.argv[2];
	let targetScript = process.argv[3];

	console.log(sourceScript, '=>', targetScript);

	let origScript = (await fs.readFile(sourceScript)).toString();
	let decompressFunc = (await fs.readFile(path.join(__dirname, 'lz-decompress.js'))).toString();

	let compressedOrig = lz._compress(origScript, 6 /* bits */, a => altAlpha.charAt(a));

	let newScript = `eval(${decompressFunc}('${compressedOrig}'))`;
	let result = uglifyjs.minify(newScript, {
		compress: {
			passes: 3,
			unsafe: true,
		},
	});

	if (result.error) {
		throw result.error;
	}

	let compressedScript = result.code;

	console.log(`Write ${compressedScript.length}, original = ${origScript.length} (${Math.floor(compressedScript.length / origScript.length * 100)}%)`);

	await fs.writeFile(targetScript, compressedScript);
})();