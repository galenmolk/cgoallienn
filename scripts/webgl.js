main();

function main() {
	const canvas = document.querySelector("#glCanvas");
	console.log(canvas);

	// Initialize the GL context.
	const gl = canvas.getContext("webgl");

	// Only continue if WebGL is supported by the browser.
	if (gl === null) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Vertex Shader
	const vsSource = `
		attribute vec4 aVertexPosition;

		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;

		void main() {
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		}
	`;

	// Fragment Shader
	// TODO: Pass the canvas size to the shader to avoid magic numbers.
	const fsSource = `
		void main() {
			gl_FragColor = vec4(((gl_FragCoord.x + gl_FragCoord.y) * 0.5) / 350.0, 1.0, 1.0, 1.0);
		}
	`;

	// Initialze a shader program.
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
	console.log(shaderProgram);

	// Collect all info needed to use the shader program and store in object.
	// Look up which attribute our shader program is using for aVertexPosition and look up uniform locations.
	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
		},
	};

	const buffers = initBuffers(gl);

	// Draw Scene.
	drawScene(gl, programInfo, buffers);
}

function initBuffers(gl) {
	// Create a buffer for the square's positions.
	const positionBuffer = gl.createBuffer();

	// Select the positionBuffer as the one to apply buffer operations to from here out.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Create an array of positions for each vertex of the square.
	const positions = [
		1.0,  1.0, // Top Right
   	   -1.0,  1.0, // Top Left
        1.0, -1.0, // Bottom Right
       -1.0, -1.0, // Bottom Left
   ];

   // Pass the position list to WebGL as a Float32Array to build the shape 
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

   return {
   	position: positionBuffer,
   };
}

function drawScene(gl, programInfo, buffers) {
	// Clear to opaque black.
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	// Clear everything.
	gl.clearDepth(1.0);

	// Enable depth testing.
	gl.enable(gl.DEPTH_TEST); 

	// Clear canvas before drawing anything.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Create a perspective matrix.
	// FOV in radians.
	const fieldOfView = 45 * Math.PI / 180; 
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();

	mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

	const modelViewMatrix = mat4.create();

	// Move drawing position to where we want to draw the square.
	// X, Y, Z.
	mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -3.0]);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  	{
  		const numComponents = 2; // pull out 2 values per iteration
  		const type = gl.FLOAT; // the data in the buffer is 32bit floats
  		const normalize = false; // don't normalize
  		const stride = 0; // 0 = use type and numComponents 
  		const offset = 0; // how many bytes inside the buffer to start from
  		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  		gl.vertexAttribPointer(
  			programInfo.attribLocations.vertexPosition,
  			numComponents,
  			type,
  			normalize,
  			stride,
  			offset);
  		gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
	}

	// Tell WebGL to use our program when drawing.
	gl.useProgram(programInfo.program);

	// Set shader uniforms.
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.projectionMatrix,
		false,
		projectionMatrix);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.modelViewMatrix,
		false,
		modelViewMatrix);

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}

function initShaderProgram(gl, vsSource, fsSource) {
	// Initialize a shader program so WebGL knows how to draw our data.
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program.
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// Display alert if shader program fails.

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}

// Create a shader of the given type, upload the source and compile it.
function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object.
	gl.shaderSource(shader, source);

	// Compile the shader.
	gl.compileShader(shader);

	// Verify that compilation was successful.
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("An error occured compiling the shaders: " + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}













