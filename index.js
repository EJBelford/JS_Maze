//--*----1----*----2----*----3----*----4----*----5----*----6----*----7----*----8
//                        Classification: UNCLASSIFIED
//==============================================================================
//                Copyright, Belford DBA Consulting, LLC, 2022
//                      Unpublished, All Rights Reserved
//==============================================================================
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/
//
// Section 22: Section 22: Javascript with Canvas API
// Lesson: 274
//
//--*----1----*----2----*----3----*----4----*----5----*----6----*----7----*----8
// NOTES: 
//------------------------------------------------------------------------------
// 
// brm.io/matter-js/docs/
// https://cdnjs.com/libraries/matter-js 
//
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/

// console.log('Hi there!');

const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter; 

const width =  800;
const height = 600;

const engine    = Engine.create();
const { world } = engine;
const render    = Render.create({
    element: document.body,
    engine:  engine,
    options: {
        wireframes: false, 
        width,
        height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine); 

World.add(world, 
    MouseConstraint.create(engine, {
        mouse: Mouse.create(render.canvas)
    })
);

// Walls
const walls = [
    Bodies.rectangle(400,   0, 800,  40, { isStatic: true }),
    Bodies.rectangle(400, 600, 800,  40, { isStatic: true }),
    Bodies.rectangle(  0, 300,  40, 600, { isStatic: true }),
    Bodies.rectangle(800, 300,  40, 600, { isStatic: true })
];
World.add(world, walls);

/* const shape = Bodies.rectangle(200, 200, 50, 50, {
    isStatic: true
}); 
World.add(world, shape); */

// Random Shapes

for (let i = 0; i < 40; i++) {
    if (Math.random() > .5) {
        World.add(world, 
            Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
        );
    } else {
        World.add(world, 
            Bodies.circle(
                Math.random() * width,
                Math.random() * height, 
                35, 
                {
                    render: {
                        fillStyle: 'red'
                  }
                }
            )
        );
    }

};


