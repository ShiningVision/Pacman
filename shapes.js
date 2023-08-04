class ShapeFactory {
    constructor() { }

    createCube() {

        /* --------- define vertex positions & colors --------- */
        /* -------------- 3 vertices per triangle ------------- */

        const vertices = [

            0.5, 0.5, 0.5, 1,
            -0.5, 0.5, 0.5, 1,
            0.5, -0.5, 0.5, 1,

            -0.5, 0.5, 0.5, 1,
            -0.5, -0.5, 0.5, 1,
            0.5, -0.5, 0.5, 1, // front face end

            -0.5, -0.5, -0.5, 1,
            -0.5, -0.5, 0.5, 1,
            -0.5, 0.5, 0.5, 1,

            -0.5, -0.5, -0.5, 1,
            -0.5, 0.5, 0.5, 1,
            -0.5, 0.5, -0.5, 1, // left face end

            0.5, 0.5, -0.5, 1,
            -0.5, -0.5, -0.5, 1,
            -0.5, 0.5, -0.5, 1,

            0.5, 0.5, -0.5, 1,
            0.5, -0.5, -0.5, 1,
            -0.5, -0.5, -0.5, 1, // back face end

            0.5, -0.5, 0.5, 1,
            -0.5, -0.5, -0.5, 1,
            0.5, -0.5, -0.5, 1,

            0.5, -0.5, 0.5, 1,
            -0.5, -0.5, 0.5, 1,
            -0.5, -0.5, -0.5, 1, // bottom face end

            0.5, 0.5, 0.5, 1,
            0.5, -0.5, -0.5, 1,
            0.5, 0.5, -0.5, 1,

            0.5, -0.5, -0.5, 1,
            0.5, 0.5, 0.5, 1,
            0.5, -0.5, 0.5, 1, // right face end

            0.5, 0.5, 0.5, 1,
            0.5, 0.5, -0.5, 1,
            -0.5, 0.5, -0.5, 1,

            0.5, 0.5, 0.5, 1,
            -0.5, 0.5, -0.5, 1,
            -0.5, 0.5, 0.5, 1, // Top face end

        ];

        const colorData = [
            // R, G, B, Alpha
            [0.0, 0.0, 0.0, 1.0],    // Front face: black
            [1.0, 0.0, 0.0, 1.0],    // left face: red
            [0.0, 1.0, 0.0, 1.0],    // back face: green
            [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [1.0, 0.0, 1.0, 1.0],	 // top face: purple
        ];
        const colors = [];

        const normalData = [
            // X, Y, Z
            [0, 0, 1],  // front
            [-1, 0, 0], // left
            [0, 0, -1], // back
            [0, -1, 0], // bottom
            [1, 0, 0],  // right
            [0, 1, 0],  // top
        ]
        const normals = [];


        for (let i = 0; i < 6; i++) {

            for (let j = 0; j < 6; ++j) {

                colors.push(colorData[i]);
                normals.push(normalData[i]);

            }

        }

        const cube = new Shape();
        cube.initData(vertices, normals, colors);

        return cube;

    }

    createPyramid() {


        var pyramidVertices = [
            0.0, 0.5, 0, 1,
            -0.5, -0.5, -0.5, 1,
            0.5, -0.5, -0.5, 1,

            0.0, 0.5, 0, 1,
            -0.5, -0.5, -0.5, 1,
            0.5, -0.5, -0.5, 1,//back face

            0.0, 0.5, 0, 1,
            -0.5, -0.5, -0.5, 1,
            -0.5, -0.5, 0.5, 1,

            0.0, 0.5, 0, 1,
            -0.5, -0.5, -0.5, 1,
            -0.5, -0.5, 0.5, 1,//left face

            0.0, 0.5, 0, 1,
            0.5, -0.5, -0.5, 1,
            0.5, -0.5, 0.5, 1,

            0.0, 0.5, 0, 1,
            0.5, -0.5, -0.5, 1,
            0.5, -0.5, 0.5, 1,//right face

            0.0, 0.5, 0, 1,
            -0.5, -0.5, 0.5, 1,
            0.5, -0.5, 0.5, 1,

            0.0, 0.5, 0, 1,
            -0.5, -0.5, 0.5, 1,
            0.5, -0.5, 0.5, 1,//front face

            -0.5, -0.5, 0.5, 1,
            0.5, -0.5, -0.5, 1,
            0.5, -0.5, 0.5, 1,

            -0.5, -0.5, 0.5, 1,
            0.5, -0.5, -0.5, 1,
            -0.5, -0.5, -0.5, 1,//bottom square
        ]

        const colorData = [
            // R, G, B, Alpha
            [1.0, 0.0, 0.0, 1.0],    // left face: red
            [0.0, 1.0, 0.0, 1.0],    // back face: green
            [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [1.0, 0.0, 1.0, 1.0],    // top face: purple
            [1.0, 0.0, 1.0, 1.0],    // top face: purple

        ];
        const colors = [];

        colorData.forEach(color => {

            for (let i = 0; i < 6; ++i) {

                colors.push(color);

            }

        });

        const normals = [];
        for (let i = 0; i < pyramidVertices.length; i += 12) {

            let normal = vec3.create();
            const p1 = vec3.fromValues(pyramidVertices[i], pyramidVertices[i + 1], pyramidVertices[i + 2]);
            const p2 = vec3.fromValues(pyramidVertices[i + 4], pyramidVertices[i + 5], pyramidVertices[i + 6]);
            const p3 = vec3.fromValues(pyramidVertices[i + 8], pyramidVertices[i + 9], pyramidVertices[i + 10]);
            let v1 = vec3.create();
            let v2 = vec3.create();
            vec3.subtract(v1, p3, p2);
            vec3.subtract(v2, p3, p1);
            vec3.cross(normal, v1, v2);//The direction could be wrong
            vec3.normalize(normal, normal);
            for (let j = 0; j < 3; j++) {
                normals.push(normal);
            }
        }


        //manually correcting the direction
        for (let i = 6; i < 12; i++) {
            normals[i][0] *= -1;
            normals[i][1] *= -1;
            normals[i][2] *= -1;
        }
        for (let i = 18; i < 27; i++) {
            normals[i][0] *= -1;
            normals[i][1] *= -1;
            normals[i][2] *= -1;
        }

        const triangle = new Shape();
        triangle.initData(pyramidVertices, normals, colors)
        return triangle;

    }



    createTetra1() {

        const p1 = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
        const p2 = vec4.fromValues(1.0, 0.0, 0.0, 1.0);
        const p3 = vec4.fromValues(1.0, 0.0, 1.0, 1.0);
        const p4 = vec4.fromValues(0.0, 0.0, 1.0, 1.0);
        const p5 = vec4.fromValues(0.0, 1.0, 0.0, 1.0);
        const p6 = vec4.fromValues(1.0, 1.0, 0.0, 1.0);
        const p7 = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
        const p8 = vec4.fromValues(0.0, 1.0, 1.0, 1.0);
        /* --------- define vertex positions & colors --------- */
        /* -------------- 3 vertices per triangle ------------- */
        const front = [
            p1,
            p2,
            p6,
            p1,
            p5,
            p6];// front face end
        const left = [
            p1,
            p4,
            p5,
            p4,
            p5,
            p8]; // left face end
        const back = [
            p3,
            p4,
            p7,
            p4,
            p7,
            p8];// back face end
        const bottom = [
            p1,
            p2,
            p3,
            p1,
            p3,
            p4];// bottom face end
        const right = [
            p2,
            p3,
            p6,
            p3,
            p6,
            p7];// right face end
        const top = [
            p5,
            p6,
            p7,
            p5,
            p7,
            p8];// Top face end



        const colorData = [
            // R, G, B, Alpha
            [0.0, 0.0, 0.0, 1.0],    // Front face: black
            [1.0, 0.0, 0.0, 1.0],    // left face: red
            [0.0, 1.0, 0.0, 1.0],    // back face: green
            [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [1.0, 0.0, 1.0, 1.0],	 // top face: purple
        ];
        const colors = [];

        const normalData = [
            // X, Y, Z
            [0, 0, 1],  // front 0
            [-1, 0, 0], // left 1
            [0, 0, -1], // back 2
            [0, -1, 0], // bottom 3
            [1, 0, 0],  // right 4
            [0, 1, 0],  // top 5
        ]
        const normals = [];

        let vertices = [];
        vertices.push(bottom);
        vertices.push(front);
        vertices.push(back);
        vertices.push(left);
        vertices.push(right);
        vertices.push(this.translateUp(front));
        vertices.push(this.translateUp(back));
        vertices.push(this.translateUp(left));
        vertices.push(this.translateUp(right));
        
        vertices.push(this.translateUp(this.translateUp(front)));
        vertices.push(this.translateUp(this.translateUp(back)));
        vertices.push(this.translateUp(this.translateUp(left)));
        vertices.push(this.translateUp(this.translateUp(right)));
        
        vertices.push(this.translateUp(this.translateUp(this.translateUp(front))));
        vertices.push(this.translateUp(this.translateUp(this.translateUp(back))));
        vertices.push(this.translateUp(this.translateUp(this.translateUp(left))));
        vertices.push(this.translateUp(this.translateUp(this.translateUp(right))));
        vertices.push(this.translateUp(this.translateUp(this.translateUp(top))));


        for (let i = 0; i < vertices.length; i ++) {
            for(let j=0;j<6;j++){
            colors.push(colorData[2]);
            }
        }

        normals.push(normalData[3]);

        normals.push(normalData[0]);

        normals.push(normalData[2]);
 
        normals.push(normalData[1]);

        normals.push(normalData[4]);

        normals.push(normalData[0]);
 
        normals.push(normalData[2]);

        normals.push(normalData[1]);

        normals.push(normalData[4]);

        normals.push(normalData[0]);
    
        normals.push(normalData[2]);
    
        normals.push(normalData[1]);
    
        normals.push(normalData[4]);
   
        normals.push(normalData[0]);
 
        normals.push(normalData[2]);
  
        normals.push(normalData[1]);
   
        normals.push(normalData[4]);

        normals.push(normalData[5]);

        const allNormals=[];
        normals.forEach((n)=>{
            for(let i = 0;i<6;i++){
                allNormals.push(n);
            }
        })
        const cube = new Shape();
        cube.initData(vertices.flat(), allNormals, colors);

        return cube;


    }

    translateUp(ver){
        let vertices = [];
        ver.forEach((v)=>{
            vertices.push([...v]);
        })
        vertices.forEach((v)=>{v[1]+=1});
        return vertices;
    }
    translateDown(ver){
        let vertices = [];
        ver.forEach((v)=>{
            vertices.push([...v]);
        })
        vertices.forEach((v)=>{v[1]-=1});
        return vertices;
    }
    translateLeft(ver){
        let vertices = [];
        ver.forEach((v)=>{
            vertices.push([...v]);
        })
        vertices.forEach((v)=>{v[0]-=1});
        return vertices;
    }
    translateRight(ver){
        let vertices = [];
        ver.forEach((v)=>{
            vertices.push([...v]);
        })
        vertices.forEach((v)=>{v[0]+=1});
        return vertices;
    }
    translateForth(ver){
        let vertices = [];
        ver.forEach((v)=>{
            vertices.push([...v]);
        })
        vertices.forEach((v)=>{v[2]-=1});
        return vertices;
    }
    translateBack(ver){
        let vertices = [];
        ver.forEach((v)=>{
            vertices.push([...v]);
        })
        vertices.forEach((v)=>{v[2]+=1});
        return vertices;
    }
}