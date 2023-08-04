class Food {
    constructor(color = [1.0, 1.0, 0.0, 1.0]) {
        this.shape = new Shape();
        this.color = color;
    }

    async createFood(pos = [0.0, 0.0, 0.0]) {
        var text = loadObj('http://localhost:8000/cube.obj');
        var object = parseOBJ2((await text).valueOf());
        var colors = [];
        object.normal.forEach(c => {
            colors.push(this.color)
        });
        this.shape.initData(object.position, object.normal, colors);
        this.shape.scale(0.2);// make it the correct size
        this.shape.translate(pos);
        this.shape.translate(axes.YLEFT, 0.5);// get it above groundlevel
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


    getCoordinates(){
        let coordinates = vec3.create();
        return vec3.add(coordinates, this.shape.getCoordinates(), vec3.fromValues(0.5,0,0.5));
    }

}

async function createFood(pos){
    let food = new Food();
    food.createFood(pos);
    food.translate([0.5,0,0.5]);
    edibleObjects.push(food);
    maxPoints++;
    return food;
}

async function generateFoodOnMap(){
    shapes.push(await createFood([1.0,0,1.0]));
    shapes.push(await createFood([2.0,0,1.0]));
    shapes.push(await createFood([3.0,0,1.0]));
    shapes.push(await createFood([4.0,0,1.0]));
    shapes.push(await createFood([6.0,0,1.0]));
    shapes.push(await createFood([7.0,0,1.0]));
    shapes.push(await createFood([8.0,0,1.0]));
    shapes.push(await createFood([9.0,0,1.0]));

    shapes.push(await createFood([1.0,0,3.0]));
    shapes.push(await createFood([3.0,0,3.0]));
    shapes.push(await createFood([4.0,0,3.0]));
    shapes.push(await createFood([5.0,0,3.0]));
    shapes.push(await createFood([6.0,0,3.0]));
    shapes.push(await createFood([7.0,0,3.0]));
    shapes.push(await createFood([9.0,0,3.0]));
}