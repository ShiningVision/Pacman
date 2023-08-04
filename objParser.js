/**
 * deprecated.
 * @param {*} text 
 * @returns 
 */
function parseOBJ1(text) {
	const lines = text.split('\n');
	const keywords = ['v ', 'f ', 'vn'];
	const points = [];
	const planes = [];
	for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
		const line = lines[lineNo].trim();
		if (line === '' || line.startsWith('#')) {
			continue;
		}
		if (line.startsWith(keywords[0])) {
			fields = line.split(' ');
			points.push([parseFloat(fields[1]), parseFloat(fields[2]), parseFloat(fields[3]), parseFloat(1)]);
		}
		else if (line.startsWith(keywords[1])) {
			fields = line.split(' ');
			planes.push([fields[1], fields[2], fields[3]]);
		}

		else {
			console.warn('unhandled keyword:', line[0], line[1], 'at line', lineNo + 1);
			continue;
		}
	}
	const vertices = [];
	for (let planeNo = 0; planeNo < planes.length; ++planeNo) {
		vertices.push([points[planes[planeNo][0] - 1], points[planes[planeNo][1] - 1], points[planes[planeNo][2] - 1]]);
	}
	const colors = [];
	for (let vNo = 0; vNo < vertices.length; vNo++) {
		colors.push([1.0, 0, 0, 1]);
		colors.push([0, 1.0, 0, 1]);
		colors.push([0, 0, 1.0, 1]);
	}

	var shape = new Shape();
	shape.initData(vertices.flat(), colors, []);
	return shape;
}


/**
 * copied from https://webglfundamentals.org/webgl/lessons/webgl-load-obj.html
 * @param {*} text 
 * @returns 
 */
function parseOBJ2(text) {

	// because indices are base 1 let's just fill in the 0th data
	const objPositions = [[0, 0, 0, 1.0]];
	const objTexcoords = [[0, 0]];
	const objNormals = [[0, 0, 0]];

	// same order as `f` indices
	const objVertexData = [
		objPositions,
		objTexcoords,
		objNormals,
	];

	// same order as `f` indices
	let webglVertexData = [
		[],   // positions
		[],   // texcoords
		[],   // normals
	];


	function addVertex(vert) {
		const ptn = vert.split('/');
		ptn.forEach((objIndexStr, i) => {
			if (!objIndexStr) {
				return;
			}
			const objIndex = parseInt(objIndexStr);
			const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
			webglVertexData[i].push(...objVertexData[i][index]);
		});
	}

	const keywords = {
		v(parts) {
			let arr = parts.map(parseFloat);
			arr.push(1.0);
			objPositions.push(arr);
		},
		vn(parts) {
			objNormals.push(parts.map(parseFloat));
		},
		vt(parts) {
			// should check for missing v and extra w?
			objTexcoords.push(parts.map(parseFloat));
		},
		f(parts) {
			const numTriangles = parts.length - 2;
			for (let tri = 0; tri < numTriangles; ++tri) {
				addVertex(parts[0]);
				addVertex(parts[tri + 1]);
				addVertex(parts[tri + 2]);
			}
		},
	};

	const keywordRE = /(\w*)(?: )*(.*)/;
	const lines = text.split('\n');
	for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
		const line = lines[lineNo].trim();
		if (line === '' || line.startsWith('#')) {
			continue;
		}
		const m = keywordRE.exec(line);
		if (!m) {
			continue;
		}
		const [, keyword, unparsedArgs] = m;
		const parts = line.split(/\s+/).slice(1);
		const handler = keywords[keyword];
		if (!handler) {
			console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
			continue;
		}
		handler(parts, unparsedArgs);
	}

	return {
		position: webglVertexData[0],
		texcoord: webglVertexData[1],
		normal: webglVertexData[2],
	};
}


