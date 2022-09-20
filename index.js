//--*----1----*----2----*----3----*----4----*----5----*----6----*----7----*----8
//                        Classification: UNCLASSIFIED
//==============================================================================
//                Copyright, Belford DBA Consulting, LLC, 2022
//                      Unpublished, All Rights Reserved
//==============================================================================
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/
//
// Section 22: Section 22: Javascript with Canvas API
// Lesson: 297
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

const debug = 0;    // 0: Off   1: On

const { Engine, Render, Runner, World, Body, Bodies, Events } = Matter; 

const cells      = 5;
const height     = 600;
const unitLength = height / cells;
const wallWidth  = 5;

const width      = 600;
const width_brdr = 2;

const engine    = Engine.create();
engine.world.gravity.y = 0;
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

// Maze generation 

const shuffle = (arr) => {
    let counter = arr.length; 

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);

        counter--;

        const temp   = arr[counter];
        arr[counter] = arr[index];
        arr[index]   = temp;
    };

    return arr;
};

const grid = Array(cells)
    .fill(null)
    .map(() => Array(cells).fill(false));

if (debug > 0) {
    console.log(grid);
};

const verticals = Array(cells)
    .fill(null)
    .map(() => Array(cells-1).fill(false));

if (debug > 0) {
    console.log(verticals); 
};

const horizontals = Array(cells-1)
    .fill(null)
    .map(() => Array(cells).fill(false));

if (debug > 0) {
    console.log(horizontals); 
};

const startRow = Math.floor(Math.random() * cells);
const startCol = Math.floor(Math.random() * cells);

const stepThroughCell = (row, col) => {
    if (debug > 0) {
        console.log(row, col); 
    };
    
    // If I have visted the cell at [row, col], then return
    if (grid[row][col]) {
        return;
    };

    // Mark this cell as being visited 
    grid[row][col] = true;

    // Aassemble ramdonly-ordered list of neighbors 
    const neighbors = shuffle([
        [row-1, col,   'up'], 
        [row,   col+1, 'right'],
        [row+1, col,   'down'], 
        [row,   col-1, 'left']
    ]);

    if (debug > 0) {
        console.log(neighbors); 
    };
    
    // For each neighbor...
    for (let neighbor of neighbors) {
        const [nextRow, nextCol, direction] = neighbor;  
        // See if that neighbor is out of bounds
        if (nextRow < 0 || nextRow >= cells || nextCol < 0 || nextCol >= cells) {
            continue;
        };

        // If we have visted that neighbor, continue to next neighbor
        if (grid[nextRow][nextCol]) {
            continue;
        };

        // Remove a wall from either horizontals or verticals
        if (direction === 'left') {
            verticals[row][col-1] = true;
        } else if (direction === 'right') {
            verticals[row][col] = true;
        } else if (direction === 'up') {
            horizontals[row-1][col] = true;
        } else if (direction === 'down') {
            horizontals[row][col] = true;
        };

        stepThroughCell(nextRow, nextCol);
    };

    // visit that next cell
    
};

stepThroughCell(startRow, startCol);
if (debug > 0) {
    console.log(grid); 
};

// Horizontal Walla

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) { 
            return; 
        };

        const wall = Bodies.rectangle(
            (columnIndex * unitLength) + unitLength / 2,
            (rowIndex * unitLength) + unitLength,
            unitLength,
            wallWidth, 
            {
                label:    'wall', 
                isStatic: true
            }
        );
        World.add(world, wall);
    });
});

// Vertical Walls

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }; 

        const wall = Bodies.rectangle(
            (columnIndex * unitLength) + unitLength,
            (rowIndex * unitLength) + unitLength / 2,
            wallWidth, 
            unitLength, 
            {
                label:    'wall', 
                isStatic: true
            }
        );
        World.add(world, wall);
    });
});

// Goal

const goal = Bodies.rectangle( 
    width - ( unitLength / 2),
    height - (unitLength / 2),
    unitLength * .75, 
    unitLength * .75,
    {
        label:    'goal', 
        isStatic: true
    }
);
World.add(world, goal); 

// Ball

const ball = Bodies.circle(
    unitLength / 2, 
    unitLength / 2,
    unitLength / 2 * .7, 
    {
        label: 'ball'
    }
);
World.add(world, ball); 

// Ball Controls

document.addEventListener('keydown', event => { 
    const { x, y } = ball.velocity; 

    // w: up 87
    if (event.key === 'w') {
        Body.setVelocity(ball, { x: x, y: y-5});
    };
    // d: right 68
    if (event.key === 'd') {
        Body.setVelocity(ball, { x: x+5, y});
    };
    // s: down 83
    if (event.key === 's') {
        Body.setVelocity(ball, { x, y: y+5});
    };
    // a: left 65
    if (event.key === 'a') {
        Body.setVelocity(ball, { x: x-5, y});
    };
});

// Win Condition

Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(collision => {
        const labels = ['ball', 'goal'];
        if (
            labels.includes(collision.bodyA.label) && 
            labels.includes(collision.bodyB.label)
        ) {
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false);
                }
            });
        }
    });
}); 

