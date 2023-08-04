function checkWebGLSupport(gl){
    if(!gl){
		console.log("WebGL is not supported. Switching to alternative experimental-webgl");
		gl=canvas.getContext('experimental-webgl');
	}
	
	if(!gl){
		alert('Your browser does not support WebGL');
	}
}

//a private function:
function loadShader(gl, shaderType,shaderText){
    const shader=gl.createShader(shaderType);
    gl.shaderSource(shader,shaderText);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
		console.error('ERROR compiling shader!',gl.getShaderInfoLog(shader));
		return null;
	}
    return shader;
}

function createShaderProgram(gl,vShaderText,fShaderText){
    const vertexShader=loadShader(gl,gl.VERTEX_SHADER,vShaderText);
    const fragmentShader=loadShader(gl,gl.FRAGMENT_SHADER,fShaderText);
	
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('ERROR linking program!',gl.getProgramInfoLog(program));
		return;
	}

	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){	
		console.error('ERROR validating program!',gl.getProgramInfoLog(program));
		return;
	}

    return program;
}