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

const { Engine, Render, Runner, World, Bodies } = Matter; 

const height     = 600;
const width      = 600;
const width_brdr = 40;

const engine    = Engine.create();
const { world } = engine;
const render    = Render.create({
    element: document.body,
    engine:  engine,
    options: {
        wireframes: true, 
        width,
        height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine); 

// Walls
const walls = [
    Bodies.rectangle(width/2, 0,        width,      width_brdr, { isStatic: true }),
    Bodies.rectangle(width/2, height,   width,      width_brdr, { isStatic: true }),
    Bodies.rectangle(      0, height/2, width_brdr, width, { isStatic: true }),
    Bodies.rectangle( width,  height/2, width_brdr, width, { isStatic: true })
];
World.add(world, walls);


