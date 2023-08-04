/**
 * this code is mostly from the tutorial
 */
class ShaderProgram {
	constructor(vertex, fragment, shaderInfo) {

		this.program = createShaderProgram(gl, vertex, fragment);
		gl.useProgram(this.program);

		this.attributes = {}
		this.uniforms = {}

		/*------- settup AttributeLocations --------*/
		Object.entries(shaderInfo.attributes).forEach(([key, value]) => {
			this.attributes[key] = gl.getAttribLocation(this.program, value);
		})

		/*------- settup UniformLocations --------*/
		Object.entries(shaderInfo.uniforms).forEach(([key, value]) => {
			this.uniforms[key] = gl.getUniformLocation(this.program, value);
		});

	}

	enable() {

		currentProgram = this;
		gl.useProgram(this.program);
		gl.uniformMatrix4fv(currentProgram.uniforms.projectionMatrix, gl.FALSE, projectionMatrix);
		gl.uniformMatrix4fv(currentProgram.uniforms.viewMatrix, gl.FALSE, viewMatrix);

		gl.uniform4fv(currentProgram.uniforms.lightLocation, lightLocation);

		gl.uniform1f(currentProgram.uniforms.ambient, ambient);
		gl.uniform1f(currentProgram.uniforms.shininess, shininess);
	}
}

var diffuseVertexText = [//make sure these attributes and uniforms match the shaderInfo in globals.js
	`precision mediump float;

	attribute vec4 vertPosition;
	attribute vec4 vertColor;
	attribute vec3 vertNormal;

	uniform mat4 transformationMatrix;
	uniform mat4 projectionMatrix;
	uniform mat4 viewMatrix;
	uniform mat3 normalMatrix;

	uniform float ambient;
	uniform float shininess;
	uniform vec4 lightLocation;
	varying vec4 fragColor;
	varying vec3 nVector;
	varying vec3 lVector;
	varying vec3 eVector;

	void main()
	{

		vec4 diffuseProduct = vec4(1.0,1.0,1.0,1.0);//materials diffuse reflection coefficient
		vec4 specularProduct = vec4(1.0,1.0,1.0,1.0);//materials specular reflection coefficient


		vec4 viewPosition = viewMatrix * transformationMatrix * vertPosition;
		vec4 lightPosition = viewMatrix * lightLocation;
		vec3 lightVector = normalize(lightPosition - viewPosition).xyz;
		vec3 eyeVector = normalize(-viewPosition).xyz;
		vec3 halfVector = normalize( lightVector + eyeVector);
		
		vec3 normalVector = normalize(normalMatrix * vertNormal);

		nVector=normalVector;
		lVector=lightVector;
		eVector=eyeVector;

		float dLightIntensity = max(dot(lightVector,normalVector), 0.0);
		vec4 diffuse = dLightIntensity * diffuseProduct;

		float sLightIntensity = pow(max(dot(normalVector,halfVector),0.0),shininess);
		vec4 specular =sLightIntensity * specularProduct;

		if(dot(lightVector,normalVector)<0.0){
			specular = vec4(0.0,0.0,0.0,1.0);
		}

		fragColor = (diffuse + ambient) * vertColor;
		fragColor.a = 1.0;

		gl_Position = projectionMatrix * viewPosition;
	}`
].join('\n');

var specularVertexText = [//make sure these attributes and uniforms match the shaderInfo in globals.js
	'precision mediump float;',

	'attribute vec4 vertPosition;',
	'attribute vec4 vertColor;',
	'attribute vec3 vertNormal;',

	'uniform mat4 transformationMatrix;',
	'uniform mat4 projectionMatrix;',
	'uniform mat4 viewMatrix;',
	'uniform mat3 normalMatrix;',

	'uniform float ambient;',
	'uniform float shininess;',
	'uniform vec4 lightLocation;',
	'varying vec4 fragColor;',
	'varying vec3 nVector;',
	'varying vec3 lVector;',
	'varying vec3 eVector;',

	'void main()',
	'{',

	'	vec4 diffuseProduct = vec4(1.0,1.0,1.0,1.0);//materials diffuse reflection coefficient',
	'	vec4 specularProduct = vec4(1.0,1.0,1.0,1.0);//materials specular reflection coefficient',
	'	vec4 lightColor = vec4(1.0,1.0,1.0,1.0);',


	'	vec4 viewPosition = viewMatrix * transformationMatrix * vertPosition;',
	'	vec4 lightPosition = viewMatrix * lightLocation;',
	'	vec3 lightVector = normalize(lightPosition - viewPosition).xyz;',
	'	vec3 eyeVector = normalize(-viewPosition).xyz;',
	'	vec3 halfVector = normalize( lightVector + eyeVector);',

	'	vec3 normalVector = normalize(normalMatrix * vertNormal);',

	'	nVector=normalVector;',
	'	lVector=lightVector;',
	'	eVector=eyeVector;',

	'	float dLightIntensity = max(dot(lightVector,normalVector), 0.0);',
	'	vec4 diffuse = dLightIntensity * diffuseProduct;',

	'	float sLightIntensity = pow(max(dot(normalVector,halfVector),0.0),shininess);',
	'	vec4 specular =sLightIntensity * specularProduct;',

	'	if(dot(lightVector,normalVector)<0.0){',
	'		specular = vec4(0.0,0.0,0.0,1.0);',
	'	}',

	'	fragColor = (specular + ambient) *lightColor* vertColor;',
	'	fragColor.a = 1.0;',

	'	gl_Position = projectionMatrix * viewPosition;',
	'}'
].join('\n');

var vertexShaderText = [//make sure these attributes and uniforms match the shaderInfo in globals.js
	'precision mediump float;',

	'attribute vec4 vertPosition;',
	'attribute vec4 vertColor;',
	'attribute vec3 vertNormal;',
	//'attribute vec2 a_texcoord;',

	'uniform mat4 transformationMatrix;',
	'uniform mat4 projectionMatrix;',
	'uniform mat4 viewMatrix;',
	'uniform mat3 normalMatrix;',

	'uniform float ambient;',
	'uniform float shininess;',
	'uniform vec4 lightLocation;',
	'varying vec4 fragColor;',
	'varying vec3 nVector;',
	'varying vec3 lVector;',
	'varying vec3 eVector;',
	//'varying vec2 v_texcoord;',

	'void main()',
	'{',

	'	vec4 diffuseProduct = vec4(1.0,1.0,1.0,1.0);//materials diffuse reflection coefficient',
	'	vec4 specularProduct = vec4(1.0,1.0,1.0,1.0);//materials specular reflection coefficient',

	'	vec4 viewPosition = viewMatrix * transformationMatrix * vertPosition;',
	'	vec4 lightPosition = viewMatrix * lightLocation;',
	'	vec3 lightVector = normalize(lightPosition - viewPosition).xyz;',
	'	vec3 eyeVector = normalize(-viewPosition).xyz;',
	'	vec3 halfVector = normalize( lightVector + eyeVector);',

	'	vec3 normalVector = normalize(normalMatrix * vertNormal);',

	'	nVector=normalVector;',
	'	lVector=lightVector;',
	'	eVector=eyeVector;',
	//'	v_texcoord = a_texcoord;',


	'	float dLightIntensity = max(dot(lightVector,normalVector), 0.0);',
	'	vec4 diffuse = dLightIntensity * diffuseProduct;',

	'	float sLightIntensity = pow(max(dot(normalVector,halfVector),0.0),shininess);',
	'	vec4 specular =sLightIntensity * specularProduct;',

	'	if(dot(lightVector,normalVector)<0.0){',
	'		specular = vec4(0.0,0.0,0.0,1.0);',
	'	}',


	'	fragColor = ambient * vertColor  + diffuse * vertColor ;',


	'	fragColor.a = 1.0;',
	'	gl_Position = projectionMatrix * viewPosition;',
	'}'
].join('\n');

var fragmentShaderText = [
	'precision mediump float;',
	'uniform sampler2D u_texture;',
	'uniform float ambient;',
	'uniform float shininess;',
	'varying vec4 fragColor;',
	'varying vec2 v_texcoord;',

	
	'varying vec3 nVector, lVector, eVector;',
	'void main()',
	'{',
	' float normz = dot(nVector,eVector);',
	' gl_FragColor=fragColor;',
	//' gl_FragColor= texture2D(u_texture,v_texcoord);',
	' if(normz < 0.0){',
	'	//discard;',
	' }',

	'}'
].join('\n')

var diffuseFragmentText = [
	'precision mediump float;',
	'',
	'uniform float ambient;',
	'uniform float shininess;',
	'varying vec4 fragColor;',
	'varying vec3 nVector, lVector, eVector;',
	'void main()',
	'{',
	'	vec4 diffuseProduct = vec4(1.0,1.0,1.0,1.0);//materials diffuse reflection coefficient',
	'	vec4 specularProduct = vec4(1.0,1.0,1.0,1.0);//materials specular reflection coefficient',

	'	vec3 halfVector = normalize(lVector + eVector);',

	'	float dLightIntensity = max(dot(lVector,nVector),0.0);',
	'	vec4 diffuse = dLightIntensity * diffuseProduct;',

	'	float sLightIntensity = pow(max(dot(nVector,halfVector),0.0),shininess);',
	'	vec4 specular = sLightIntensity * specularProduct;',

	'	if(dot(lVector,nVector)<0.0){',
	'		specular = vec4(0.0,0.0,0.0,1.0);',
	'	}',

	'	gl_FragColor=fragColor*(diffuse + ambient);',
	'	gl_FragColor.a=1.0;',
	'}'
].join('\n')

var specularFragmentText = [
	'precision mediump float;',
	'',
	'uniform float ambient;',
	'uniform float shininess;',
	'varying vec4 fragColor;',
	'varying vec3 nVector, lVector, eVector;',
	'void main()',
	'{',
	'	vec4 diffuseProduct = vec4(1.0,1.0,1.0,1.0);//materials diffuse reflection coefficient',
	'	vec4 specularProduct = vec4(1.0,1.0,1.0,1.0);//materials specular reflection coefficient',

	'	vec3 halfVector = normalize(lVector + eVector);',

	'	float dLightIntensity = max(dot(lVector,nVector),0.0);',
	'	vec4 diffuse = dLightIntensity * diffuseProduct;',

	'	float sLightIntensity = pow(max(dot(nVector,halfVector),0.0),shininess);',
	'	vec4 specular = sLightIntensity * specularProduct;',

	'	if(dot(lVector,nVector)<0.0){',
	'		specular = vec4(0.0,0.0,0.0,1.0);',
	'	}',

	'	gl_FragColor=fragColor*(ambient+specular);',
	'	gl_FragColor.a=1.0;',
	'}'
].join('\n')