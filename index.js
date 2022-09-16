//--*----1----*----2----*----3----*----4----*----5----*----6----*----7----*----8
//                        Classification: UNCLASSIFIED
//==============================================================================
//                Copyright, Belford DBA Consulting, LLC, 2022
//                      Unpublished, All Rights Reserved
//==============================================================================
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/
//
// Section 22: Section 22: Javascript with Canvas API
// Lesson: 268
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

const engine    = Engine.create();
const { world } = engine;
const render    = Render.create({
    element: document.body,
    engine:  engine,
    options: {
        width:  800,
        height: 600
    }
});

Render.run(render);
Render.run(Runner.create(), engine); 

const shape = Bodies.rectangle(200, 200, 50, 50, {
    isStatic: true
}); 
World.add(world, shape);

