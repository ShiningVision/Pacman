class Groundfloor {

    constructor(color = [0.0, 1.0, 0.0, 1.0]) {
        this.floor = this.createFloor(color);
        this.transformationMatrix = mat4.create();// for the transformation-operations
        this.normalMatrix = mat3.create();
        this.rotationMatrix = mat4.create();
        this.translationMatrix = mat4.create();
    }

    createFloor(color) {//set private

        const p1 = vec4.fromValues(11, 0, 11, 1.0);
        const p2 = vec4.fromValues(0, 0, 11.0, 1.0);
        const p3 = vec4.fromValues(11, 0, 0.0, 1.0);
        const p4 = vec4.fromValues(0, 0, 0.0, 1.0);

        const face = [
            p1,
            p3,
            p2,
            p3,
            p4,
            p2];// the face


        const colors = [];

        const normalData = [
            // X, Y, Z
            [0, 0, 1],  // 
        ]
        const normals = [];

        let vertices = [];
        vertices.push(face);

        for (let i = 0; i < vertices.length; i++) {
            for (let j = 0; j < 6; j++) {
                colors.push(color);
            }
        }

        normals.push(normalData[0]);

        const allNormals = [];
        normals.forEach((n) => {
            for (let i = 0; i < 6; i++) {
                allNormals.push(n);
            }
        })

        var object = new Shape();
        object.initData(vertices.flat(), allNormals, colors);
        return object

    }

    draw() {
        this.floor.draw();
    }

    saveTranslation(axe) {//private method
        var v = new Float32Array(axe);
        var moveDistance = new Float32Array([1.0, 1.0, 1.0]);
        vec3.multiply(v, v, moveDistance);
        mat4.translate(this.translationMatrix, this.translationMatrix, v);
    }

    collide() {
        return this.floor.collide();
    }

    centerGravityTranslate(direction) {
        this.saveTranslation(direction);
        this.floor.optionalTranslate(this.translationMatrix);
    }


    translate(axe) {
        this.floor.translate(axe);
    }

    rotate(angle, axe) {

        this.floor.rotate(angle, axe);

    }

    getCoordinates() {
        return this.floor.getCoordinates();
    }

}

class Wall {
    constructor(color = [0.0, 1.0, 0.0, 1.0]) {
        this.shape = new Shape();
        this.color = color;
        this.transformationMatrix = mat4.create();// for the transformation-operations
        this.normalMatrix = mat3.create();
        this.rotationMatrix = mat4.create();
        this.translationMatrix = mat4.create();
    }

    async createWall(pos = [0.0, 0.0, 0.0]) {
        var text = loadObj('http://localhost:8000/cube.obj');
        var object = parseOBJ2((await text).valueOf());
        var colors = [];
        object.normal.forEach(c => {
            //colors.push(this.color)
        });
        for (let i = 0; i < 36; i++) {
            if (i < 6) { colors.push([0.0, 1.0, 0.0, 1.0]) }
            if (i >= 6 & i < 12) { colors.push([1.0, 0.0, 0.0, 1.0]) }
            if (i >= 12 & i < 18) { colors.push([1.0, 0.0, 0.0, 1.0]) }
            if (i >= 18 & i < 24) { colors.push([1.0, 0.0, 0.0, 1.0]) }
            if (i >= 24 & i < 30) { colors.push([1.0, 0.0, 0.0, 1.0]) }
            if (i >= 30) { colors.push([0.0, 1.0, 0.0, 1.0]) }
        }
        this.shape.initData(object.position, object.normal, colors);
        this.shape.scale(0.5);
        this.shape.translate(pos);
        this.shape.translate(axes.YLEFT, 0.5);
    }

    draw() {
        this.shape.draw();
    }

    translate(coord) {
        this.shape.translate(coord)
    }

    rotate(angle, axe) {
        this.shape.rotate(angle, axe)
    }

    saveTranslation(axe) {//private method
        var v = new Float32Array(axe);
        var moveDistance = new Float32Array([1.0, 1.0, 1.0]);
        vec3.multiply(v, v, moveDistance);
        mat4.translate(this.translationMatrix, this.translationMatrix, v);
    }

    getCoordinates(){
        let coordinates = vec3.create();
        return vec3.add(coordinates, this.shape.getCoordinates(), vec3.fromValues(0.5,0,0.5));
    }
    attachToBiggerWall(pos) {
        this.saveTranslation(pos);
        this.shape.optionalTranslate(this.translationMatrix);
    }

}

class LongWall {
    constructor() {
        this.walls = [];
    }

    initData(walls) {
        walls.forEach((wall) => {
            this.walls.push(wall);
        })
    }

    draw() {
        this.walls.forEach(c => {
            c.draw();
        })
    }

    translate(coord) {
        this.walls.forEach((c) => {
            c.translate(coord);
        })
    }

    rotate() {
        this.walls.forEach(c => {
            c.rotate(pi / 4, [0, 1, 0])
        })
    }

    getCoordinates(){
        return this.walls[0].getCoordinates();
    }
}

async function create3WallsH(pos = [0.0, 0.0, 0.0]) {
    var w1 = new Wall();
    w1.createWall();
    collidableObjects.push(w1);
    var w2 = new Wall();
    w2.createWall();
    collidableObjects.push(w2);
    var w3 = new Wall();
    w3.createWall();
    collidableObjects.push(w3);

    w1.attachToBiggerWall([-1, 0.0, 0.0]);
    w2.attachToBiggerWall([1, 0.0, 0.0]);

    var longWall = new LongWall();
    longWall.initData([w1, w2, w3]);
    longWall.translate([0.5, 0, 0.5]);
    longWall.translate(pos);
    return longWall;
}

async function create3WallsV(pos = [0.0, 0.0, 0.0]) {
    var w1 = new Wall();
    w1.createWall();
    collidableObjects.push(w1);
    var w2 = new Wall();
    w2.createWall();
    collidableObjects.push(w2);
    var w3 = new Wall();
    w3.createWall();
    collidableObjects.push(w3);

    w1.attachToBiggerWall([0, 0.0, -1.0]);
    w2.attachToBiggerWall([0, 0.0, 1.0]);

    var longWall = new LongWall();
    longWall.initData([w1, w2, w3]);
    longWall.translate([0.5, 0, 0.5]);
    longWall.translate(pos);
    return longWall;
}

async function createWallAt(pos = [0.0,0.0,0.0]){
    var wall = new Wall();
    wall.createWall(pos);
    wall.translate([0.5,0,0.5]);
    collidableObjects.push(wall);
    return wall;
}

async function generateWalls() {
    var walls =[];

    /**outer walls */
    walls.push(await create3WallsH([2.0, 0.0, 0.0]));
    walls.push(await create3WallsH([5.0, 0.0, 0.0]));
    walls.push(await create3WallsH([8.0, 0.0, 0.0]));

    walls.push(await create3WallsV([0.0, 0.0, 2.0]));
    walls.push(await create3WallsV([0.0, 0.0, 5.0]));
    walls.push(await create3WallsV([0.0, 0.0, 8.0]));

    walls.push(await create3WallsH([2.0, 0.0, 10.0]));
    walls.push(await create3WallsH([5.0, 0.0, 10.0]));
    walls.push(await create3WallsH([8.0, 0.0, 10.0]));

    walls.push(await create3WallsV([10.0, 0.0, 2.0]));
    walls.push(await create3WallsV([10.0, 0.0, 5.0]));
    walls.push(await create3WallsV([10.0, 0.0, 8.0]));

    /**inner walls */
    walls.push(await create3WallsV([5.0, 0.0, 1.0]));
    walls.push(await create3WallsV([5.0, 0.0, 9.0]));
    walls.push(await create3WallsV([2.0, 0.0, 3.0]));
    walls.push(await create3WallsV([2.0, 0.0, 7.0]));
    walls.push(await create3WallsV([8.0, 0.0, 3.0]));
    walls.push(await create3WallsV([8.0, 0.0, 7.0]));
    walls.push(await create3WallsH([5.0, 0.0, 4.0]));
    walls.push(await create3WallsH([5.0, 0.0, 6.0]));
    walls.push(await createWallAt([3.0, 0.0, 2.0]));
    walls.push(await createWallAt([3.0, 0.0, 8.0]));
    walls.push(await createWallAt([7.0, 0.0, 2.0]));
    walls.push(await createWallAt([7.0, 0.0, 8.0]));

    /**the edges to make it look nicer */
    walls.push(await createWallAt([0.0, 0.0, 0.0]));
    walls.push(await createWallAt([10.0, 0.0, 0.0]));
    walls.push(await createWallAt([0.0, 0.0, 10.0]));
    walls.push(await createWallAt([10.0, 0.0, 10.0]));
   
    walls.forEach(wall => { shapes.push(wall); })

    return walls;
}