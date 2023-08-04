
let colorCycle = 0;

class Shape {
	//hint: create Shape with empty constructor: new Shape(). Then use the initData(...,...) method.
	constructor() {
		this.vertices = [];
		this.colors = [];
		this.normals = [];
		this.texcoord = [];
		this.buffers = {
			vertexBuffer: gl.createBuffer(),
			colorBuffer: gl.createBuffer(),
			normalBuffer: gl.createBuffer(),
			//texcoordBuffer: gl.createBuffer(),
		}
		this.transformationMatrix = mat4.create();// for the transformation-operations
		this.normalMatrix = mat3.create();
		this.rotationMatrix = mat4.create();
		this.translationMatrix = mat4.create();
		this.scaleMatrix = mat4.create();
		this.optionalTransformationMatrix = mat4.create();

	}

	parseFloat32Array(arr) {
		if (arr[0] instanceof Float32Array)
			return new Float32Array(arr.map(a => Array.from(a)).flat());
		return new Float32Array(arr.flat());
	}

	initData(vertices, normals, colors = [], textureCoords = []) {
		this.vertices = this.parseFloat32Array(vertices);
		const vertexeCount = this.vertices.length / 4;

		//Fill in default texture
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture)
		// Fill the texture with a 1x1 blue pixel.
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

		//Fill in default colors
		if (colors.length == 0) {
			for (let i = 0; i < vertexeCount; i++) {
				colors.push(defaultColors[2]);// change to colorCycle if different colors are wished.
				colorCycle++;
				if (colorCycle > 5) colorCycle = 0;
			}
		}

		//Fill in default normals
		if (normals.length == 0) {
			for (let i = 0; i < vertexeCount; i++) {
				normals.push([0.0, 0.0, 0.0]);
			}
		}

		//Fill in default CUSTOME PROVIDED texture
		//if (textureCoords.length != 0) {}


		this.colors = this.parseFloat32Array(colors);
		this.normals = this.parseFloat32Array(normals);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

		//gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.texcoordBuffer);
		//gl.bufferData(gl.ARRAY_BUFFER, this.texcoord, gl.STATIC_DRAW);

	}

	draw() {
		Shape.setUpAttribute(this.buffers.vertexBuffer, currentProgram.attributes.vertexLocation);
		Shape.setUpAttribute(this.buffers.colorBuffer, currentProgram.attributes.colorLocation);
		Shape.setUpAttribute(this.buffers.normalBuffer, currentProgram.attributes.normalLocation, true);
		//Shape.setUpAttribute(this.buffers.texcoordBuffer, currentProgram.attributes.texcoordLocation, false, true);

		//scale, rotate, optional other stuff and lastly translation. 
		this.transformationMatrix = mat4.create();//reset the transformationmatrix first
		mat4.multiply(this.transformationMatrix, this.scaleMatrix, this.transformationMatrix);
		mat4.multiply(this.transformationMatrix, this.rotationMatrix, this.transformationMatrix);
		mat4.multiply(this.transformationMatrix, this.optionalTransformationMatrix, this.transformationMatrix);
		mat4.multiply(this.transformationMatrix, this.translationMatrix, this.transformationMatrix);

		gl.uniformMatrix4fv(currentProgram.uniforms.transformationMatrix, gl.FALSE, this.transformationMatrix);
		mat3.normalFromMat4(this.normalMatrix, this.transformationMatrix);
		gl.uniformMatrix3fv(currentProgram.uniforms.normalMatrix, gl.FALSE, this.normalMatrix);

		gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);

	}

	//I know this sounds crazy, but I am too indifferent/lazy to create 2 matrices for translation and rotation
	optionalTranslate(matrix) {
		mat4.copy(this.optionalTransformationMatrix, matrix);
	}

	optionalRotate(matrix) {
		mat4.copy(this.optionalTransformationMatrix, matrix);
	}

	collide() {
		let flag = false;
		let coord = this.getCoordinates();

		collisionCoordinates.forEach((c) => {
			if (c[0] == coord[0] && c[1] == coord[1] - 1 && c[2] == coord[2]) {
				flag = true;
			}
		});

		/*
		for(let i=0;i<this.vertices.length;i+=4){
			const newVertice =vec4.fromValues(this.vertices[i],this.vertices[i+1],this.vertices[i+2],this.vertices[i+3]);
			vec4.transformMat4(newVertice,newVertice,this.transformationMatrix);


			//get the space that it will collide into
			let blockUnder=[parseInt(newVertice[0]),parseInt(newVertice[1])-1,parseInt(newVertice[2])];

			console.log(blockUnder);
			
			//check if there is a block there to collide into:
			collisionCoordinates.forEach((c)=>{
				if(c[0]==blockUnder[0]&&c[1]==blockUnder[1]&&c[2]==blockUnder[2]){
					flag=true;
					
				}
			});
		}
*/
		console.log(collisionCoordinates);
		console.log("no collisions");
		return flag;
	}

	getCoordinates() {
		let infinity = 100;
		let x = infinity;
		let y = infinity;
		let z = infinity;

		for (let i = 0; i < this.vertices.length; i += 4) {
			const data = vec4.fromValues(this.vertices[i], this.vertices[i + 1], this.vertices[i + 2], this.vertices[i + 3]);
			vec4.transformMat4(data, data, this.transformationMatrix);
			if (data[0] < x) x = data[0];
			if (data[1] < y) y = data[1];
			if (data[2] < z) z = data[2];
		}
		return [x, y, z];
	}

	rotate(angle, axe) {
		mat4.rotate(this.rotationMatrix, this.rotationMatrix, toRad(angle), axe);
	}

	translate(axe, d = 1) {
		var v = new Float32Array(axe);
		var moveDistance = new Float32Array([d, d, d]);
		vec3.multiply(v, v, moveDistance);
		mat4.translate(this.translationMatrix, this.translationMatrix, v);
	}

	scale(degree, axis = "default") {
		switch (axis) {
			case 'x':
				var v = new Float32Array([degree, 1, 1]);
				mat4.scale(this.scaleMatrix, this.scaleMatrix, v)
				break;
			case 'y':
				var v = new Float32Array([1, degree, 1]);
				mat4.scale(this.scaleMatrix, this.scaleMatrix, v)
				break;
			case 'z':
				var v = new Float32Array([1, 1, degree]);
				mat4.scale(this.scaleMatrix, this.scaleMatrix, v)
				break;
			default:
				var v = new Float32Array([degree, degree, degree]);
				mat4.scale(this.scaleMatrix, this.scaleMatrix, v)
				break;
		}
	}

	//private function for scale:


	static setUpAttribute(buffer, attribLocation, isNormal = false, isTexcoord = false) {

		if (attribLocation === -1) return;

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

		isTexcoord ? gl.vertexAttribPointer(attribLocation, 2, gl.FLOAT, false, 0, 0) :
			gl.vertexAttribPointer(
				attribLocation,//Attribute location
				isNormal ? 3 : 4,//Number of elements per attribute
				gl.FLOAT,//Type of elements
				gl.FALSE,
				(isNormal ? 3 : 4) * Float32Array.BYTES_PER_ELEMENT,//Size of an individual vertex
				0//Offset from the beginning of a single vertex to this attribute
			);

		gl.enableVertexAttribArray(attribLocation);
	}
}