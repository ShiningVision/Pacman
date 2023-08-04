class Pacman {

    constructor(color = [0.0, 1.0, 0.0, 1.0]) {
        this.pacman = [];
        this.transformationMatrix = mat4.create();// for the transformation-operations
        this.normalMatrix = mat3.create();
        this.rotationMatrixTop = mat4.create();
        this.rotationMatrixBottom = mat4.create();
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
            this.pacman.push(object);
        })
    }


    draw() {
        this.pacman.forEach(c => {
            c.draw();
        })
    }

    saveRotation(angle, axe) {//private method
        mat4.rotate(this.rotationMatrixTop, this.rotationMatrixTop, angle, axe);
    }

    animate(delta) {
        let angle = delta * 3;
        let axe = [0.0, 0.0, 1.0];//this is the direction the obj was born with
        let axe2 = vec3.create();
        vec3.negate(axe2, axe);
        if (pacmanAnimationCycle == 0) {
            pacmanAnimationProgress += angle;
            if (pacmanAnimationProgress >= pi / 2) {
                pacmanAnimationCycle = 1;
            }
            this.saveRotation(angle, axe);
        }
        if (pacmanAnimationCycle == 1) {
            pacmanAnimationProgress -= angle;
            if (pacmanAnimationProgress <= 0) {
                pacmanAnimationCycle = 0;
            }
            this.saveRotation(angle, axe2);
        }
        this.pacman[0].optionalRotate(this.rotationMatrixTop);

        if (movingState == true) {
            this.move(this.faceDirection, 0.01);
        }
        if (jumpState == true) {
            this.jump(jumpStartTime += delta);
        }

        this.getEaten();
    }

    jump(time) {
        let num = (time / 0.5) * (2 * pi)
        this.translate([0.0, 0.1, 0.0], Math.sin(num));
        if (time >= 0.5) { jumpState = false; jumpStartTime = 0; }
    }

    translate(axe, distance) {
        this.pacman.forEach(c => {
            c.translate(axe, distance);
        })
    }

    move(axe, distance) {
        let newCoords = vec3.clone(axe);
        vec3.scale(newCoords, newCoords, distance);
        vec3.add(newCoords, this.getCoordinates(), newCoords);

        if (this.getCollision(newCoords) == false) {// do not move when collision
            this.pacman.forEach(c => {
                c.translate(axe, distance);
            })

            let moveVector = vec3.create();
            vec3.negate(moveVector, axe);
            vec3.scale(moveVector, moveVector, distance);
            moveCamera(moveVector);
        } else { movingState = false; }

        let foodCoord = this.getNutrition(newCoords);
        if (vec3.distance(foodCoord, placeHolderVector) != 0) {// make food disapear when eaten
            pointScore++;
            
            console.log("points: " + pointScore);
            d3.select("#pointScore").html("Points: "+pointScore);

            //find and delete the food from edibleObjects and shapes.
            let index = edibleObjects.findIndex((c) => { return vec3.distance(foodCoord, c.getCoordinates()) == 0 });

            edibleObjects.splice(index, 1);

            index = shapes.findIndex((c) => { return vec3.distance(foodCoord, c.getCoordinates()) == 0 });
            shapes.splice(index, 1);

            if(pointScore >=maxPoints){
                alert("You win!");
                reset();
            }
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
                //console.log("new Pacman coords: "+coords);
                //console.log("Pacman coords: "+ this.getCoordinates());
            }
        });

        return collision;
    }

    getNutrition(coords = this.getCoordinates()) {
        var meal = placeHolderVector; // there is no food at that coodinate.
        let eatDistance = 0.5;
        edibleObjects.forEach(c => {
            if (Math.abs(c.getCoordinates()[0] - coords[0]) < eatDistance &&
                Math.abs(c.getCoordinates()[2] - coords[2]) < eatDistance) {
                meal = c.getCoordinates();
                //console.log(c.getCoordinates());
                //console.log("new Pacman coords: "+coords);
                //console.log("Pacman coords: "+ this.getCoordinates());
            }
        });
        return meal;
    }

    //alerts GameOver if eaten
    getEaten(coords = this.getCoordinates()){
        let dead = new Boolean(false);
        let killDistance = 0.5;
        predatorObjects.forEach(c=>{
            if (Math.abs(c.getCoordinates()[0] - coords[0]) < killDistance &&
                Math.abs(c.getCoordinates()[2] - coords[2]) < killDistance) {
                dead = true;
                //console.log(c.getCoordinates());
                //console.log("new Pacman coords: "+coords);
                //console.log("Pacman coords: "+ this.getCoordinates());
            }
        })
        if(dead == true)alert("GameOver");
        reset();
    }

    scale(size) {
        this.pacman.forEach(c => {
            c.scale(size)
        })
    }

    rotate(angle, axe) {

        this.pacman.forEach(c => {
            c.rotate(angle, axe);
        })

    }

    getCoordinates() {
        let coordinates = vec3.create();
        vec3.add(coordinates, this.pacman[1].getCoordinates(), vec3.fromValues(0.2, 0, 0.2));
        return coordinates;
    }

    turn(direction) {
        //reset rotation and direction
        this.rotationMatrixTop = mat4.create();
        this.rotationMatrixBottom = mat4.create();

        pacmanAnimationCycle = 0;
        pacmanAnimationProgress = 0;
        this.faceDirection = direction;
        switch (direction) {
            case directions.UP:
                mat4.rotateY(this.rotationMatrixTop, this.rotationMatrixTop, pi / 2);
                mat4.rotateY(this.rotationMatrixBottom, this.rotationMatrixBottom, pi / 2);
                break;
            case directions.DOWN:
                mat4.rotateY(this.rotationMatrixTop, this.rotationMatrixTop, -pi / 2);
                mat4.rotateY(this.rotationMatrixBottom, this.rotationMatrixBottom, -pi / 2);
                break;
            case directions.LEFT:
                mat4.rotateY(this.rotationMatrixTop, this.rotationMatrixTop, pi);
                mat4.rotateY(this.rotationMatrixBottom, this.rotationMatrixBottom, pi);
                break;
            case directions.RIGHT:
                break;
            default:
                return;
        }
    }

}

async function createPacman() {//set private

    var text1 = loadObj('http://localhost:8000/top.obj');
    var pac1 = parseOBJ2((await text1).valueOf());
    var top = new Shape();
    var colors1 = [];
    pac1.normal.forEach(c => {
        colors1.push([1.0, 1.0, 0, 1.0])
    })
    top.initData(pac1.position, pac1.normal, colors1);

    var text2 = loadObj('http://localhost:8000/bottom.obj');
    var pac2 = parseOBJ2((await text2).valueOf());
    var bottom = new Shape();
    var colors2 = [];
    pac2.normal.forEach(c => {
        colors2.push([1.0, 0.0, 0, 1.0])
    })
    bottom.initData(pac2.position, pac2.normal, colors2);

    var pacman = new Pacman();
    pacman.initData([top, bottom]);
    pacman.scale(0.3);
    pacman.translate(axes.YLEFT, 0.5);
    return pacman;

}