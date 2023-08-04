
var moved = false;
var clickDownPos = [0, 0, 0];
window.addEventListener("mousemove", (mouse) => {
	var direction = [mouse.clientX, mouse.clientY, 0];
	glMatrix.vec3.subtract(direction, clickDownPos, direction);
	if (moved) {
		dragCamera(direction, clickDownPos);
	}
});

window.addEventListener("mousedown", (mouse) => {
	clickDownPos = [mouse.clientX, mouse.clientY, 0];
	moved = true;
});

window.addEventListener("mouseup", (mouse) => {
	moved = false;
});
/**
window.addEventListener("keyup", (keyboardInput) => {
	var keyName = keyboardInput.key;
	switch (keyName) {
		case "ArrowLeft":
			console.log(keyName + " was released");
			movingState = false;
			break;
		case "ArrowRight":
			console.log(keyName + " was released");
			movingState = false;
			break;
		case "ArrowDown":
			console.log(keyName + " was released");
			movingState = false;
			break;
		case "ArrowUp":
			console.log(keyName + " was released");
			movingState = false;
			break;

	}
})
*/
window.addEventListener("keydown", (keyboardInput) => {
	var keyName = keyboardInput.key;
	switch (keyName) {
		case "p":
			console.log(keyName + " was pressed");
			pause = !pause;
			console.log("Pause is " + pause);
			break;
		case "z":
			console.log(keyName + " was pressed");
			rotate(axes.ZLEFT);
			break;
		case "Z":
			console.log(keyName + " was pressed");
			rotate(axes.ZRIGHT);
			break;
		case "Y":
			console.log(keyName + " was pressed");
			rotate(axes.YRIGHT);
			break;
		case "y":
			console.log(keyName + " was pressed");
			rotate(axes.YLEFT);
			break;
		case "x":
			console.log(keyName + " was pressed");
			rotate(axes.XLEFT);
			break;
		case "X":
			console.log(keyName + " was pressed");
			rotate(axes.XRIGHT);
			break;
		case 'ArrowLeft':
			console.log(keyName + " was pressed");
			if (activeCamera == true)
				moveCamera(directions.LEFT);
			else {
				translate(directions.LEFT);
				movingState = true;
			}
			break;
		case 'ArrowRight':
			console.log(keyName + " was pressed");
			if (activeCamera == true)
				moveCamera(directions.RIGHT);
			else {
				translate(directions.RIGHT);
				movingState = true;
			}
			break;
		case 'ArrowUp':
			console.log(keyName + " was pressed");
			if (activeCamera == true)
				moveCamera(directions.UP);
			else {
				translate(directions.UP);
				movingState = true;
			}
			break;
		case 'ArrowDown':
			console.log(keyName + " was pressed");
			if (activeCamera == true)
				moveCamera(directions.DOWN);
			else {
				translate(directions.DOWN);
				movingState = true;
			}
			break;
		case ',':
			console.log(keyName + " was pressed");
			if (activeCamera == true)
				moveCamera(axes.ZLEFT);
			else { translate(axes.ZLEFT); }
			break;
		case '.':
			console.log(keyName + " was pressed");
			if (activeCamera == true)
				moveCamera(axes.ZRIGHT);
			else { translate(axes.ZRIGHT); }
			break;
		case 'c':
			console.log(keyName + " was pressed");
			/*for some reason this line of code only works after clicking twice on c.*/
			//activeCamera=!activeCamera;
			/*Guess I will use the old fashioned method*/
			if (activeCamera == true) {
				activeCamera = false;
			} else {
				activeCamera = true;
			}
			break;
		case 'g':
			console.log(keyName + " was pressed");
			shaderPrograms.gDiffuse.enable();
			render();
			break;
		case 'f':
			console.log(keyName + " was pressed");
			shaderPrograms.gSpecular.enable();
			render();
			break;
		case 'L':
			console.log(keyName + " was pressed");
			activeLightSource = !activeLightSource;
			break;
		case 'j':
			console.log(keyName + " was pressed");
			rotateCamera(axes.YLEFT);
			break;
		case 'l':
			console.log(keyName + " was pressed");
			rotateCamera(axes.YRIGHT);
			break;
		case 'i':
			console.log(keyName + " was pressed");
			rotateCamera(axes.XLEFT);
			break;
		case 'k':
			console.log(keyName + " was pressed");
			rotateCamera(axes.XRIGHT);
			break;
		case 'u':
			console.log(keyName + " was pressed");
			rotateCamera(axes.ZLEFT);
			break;
		case 'o':
			console.log(keyName + " was pressed");
			rotateCamera(axes.ZRIGHT);
			break;
		case '+':
			console.log(keyName + " was pressed");
			zoomCamera('+');
			break;
		case '-':
			console.log(keyName + " was pressed");
			zoomCamera('-');
			break;
		case ' '://spacebar
			console.log("Space" + " was pressed");
			jumpState = true;
			break;
		case 'v':
			console.log(keyName + " was pressed");
			shearView ? shearViewMatrix() : lookAtViewMatrix();
			shearView = !shearView;
			shaderPrograms.default.enable();
			break;
		default:
			return;
	}
}, false)

//private function for en/disabling shearview
function shearViewMatrix() {
	mat4.multiply(viewMatrix, viewMatrix, shearMatrix);
}
function lookAtViewMatrix() {
	mat4.lookAt(viewMatrix, [5, 21, 14], [5, 0, 5], [0, 1, 0]);
}

//private function for keydown 1-9:
function pressNumber(num) {
	if (focusOnSingleShape == true && shapes[num - 1].focus == true) {
		shapes[num - 1].focus = false;
		focusOnSingleShape = false;
		render();
		return;
	}
	focusOnSingleShape = true;
	focusOnAllShapes = false;
	shapes.forEach(shape => {
		shape.focus = false;
	})
	shapes[num - 1].focus = true;
	render();
}