class Enemy {

    constructor(color = [0.0, 1.0, 0.0, 1.0]) {
        this.shape = [];
        this.transformationMatrix = mat4.create();// for the transformation-operations
        this.normalMatrix = mat3.create();
        this.rotationMatrix = mat4.create();
        this.translationMatrix = mat4.create();
        this.faceDirection = [0.0, 0.0, 1.0];

        this.colorData = [
            // R, G, B, Alpha
            [0.0, 0.0, 0.0, 1.0],    // Front face: black
            [1.0, 0.0, 0.0, 1.0],    // left face: red
            [0.0, 1.0, 0.0, 1.0],    // back face: green
            [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [1.0, 0.0, 1.0, 1.0],	 // top face: purple
        ];
    }
    getFaceDirection() {
        return this.faceDirection;
    }
    initData(objects) {
        objects.forEach((object) => {
            this.shape.push(object);
        })
    }


    draw() {
        this.shape.forEach(c => {
            c.draw();
        })
    }

    saveRotation(angle, axe) {//private method
        mat4.rotate(this.rotationMatrix, this.rotationMatrix, angle, axe);
    }

    animate(delta) {

        this.move(moveDistance);
    }


    translate(axe, distance) {
        this.shape.forEach(c => {
            c.translate(axe, distance);
        })
    }

    move(distance) {
        let newCoords = vec3.clone(this.faceDirection);
        vec3.scale(newCoords, newCoords, distance);
        vec3.add(newCoords, this.getCoordinates(), newCoords);

        if (this.getCollision(newCoords) == true) {// turn when collision
            this.turn();
        } else {
            this.shape.forEach(c => {
                c.translate(this.faceDirection, distance);
            })
        }

    }

    getCollision(coords = this.getCoordinates()) {
        var collision = new Boolean(false);
        let collisionDistance = 0.85;
        collidableObjects.forEach(c => {
            if (Math.abs(c.getCoordinates()[0] - coords[0]) < collisionDistance &&
                Math.abs(c.getCoordinates()[2] - coords[2]) < collisionDistance) {
                collision = true;
                //console.log(c.getCoordinates());
                //console.log("new shape coords: "+coords);
                //console.log("shape coords: "+ this.getCoordinates());
            }
        });

        return collision;
    }


    scale(size) {
        this.shape.forEach(c => {
            c.scale(size)
        })
    }

    rotate(angle, axe) {

        this.shape.forEach(c => {
            c.rotate(angle, axe);
        })

    }

    getCoordinates() {
        let coordinates = vec3.create();
        vec3.add(coordinates, this.shape[0].getCoordinates(), vec3.fromValues(0.2, 0, 0.2));
        return coordinates;
    }

    turn() {
        //reset rotation
        this.rotationMatrix = mat4.create();

        //turn right
        vec3.rotateY(this.faceDirection, this.faceDirection, [0.0, 0.0, 0.0], pi / 2);
        smoothDigits(this.faceDirection);//pi is not accurate. Need whole numbers
        mat4.rotateY(this.rotationMatrix, this.rotationMatrix, pi / 2);
        //if right is deadlock, turn left instead
        let newCoords = vec3.clone(this.faceDirection);
        vec3.scale(newCoords, newCoords, moveDistance);
        vec3.add(newCoords, this.getCoordinates(), newCoords);
        if (this.getCollision(newCoords) == true) {
            vec3.rotateY(this.faceDirection, this.faceDirection, [0.0, 0.0, 0.0], pi);
            smoothDigits(this.faceDirection);//pi is not accurate. Need whole numbers
            mat4.rotateY(this.rotationMatrix, this.rotationMatrix, pi);
        }

        this.move(moveDistance);// after turning move. Is optional though.
    }
}

function smoothDigits(vector) {
    vector[0] = Math.round(vector[0])
    vector[1] = Math.round(vector[1])
    vector[2] = Math.round(vector[2])
    return vector;
}

async function createEnemy(pos = [1.0,0.0,1.0]) {//set private

    var text = loadObj('http://localhost:8000/cube.obj');
    var data = parseOBJ2((await text).valueOf());
    var shape = new Shape();
    var colors = [];
    data.normal.forEach(c => {
        colors.push([0.0, 0.0, 1.0, 1.0])
    })
    shape.initData(data.position, data.normal, colors);
    shape.scale(0.3);
    shape.translate(axes.YLEFT, 0.5);
    shape.translate(pos);
    var enemy = new Enemy();
    enemy.initData([shape]);
    predatorObjects.push(enemy);
    return shape;
}