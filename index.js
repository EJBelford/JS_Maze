//--*----1----*----2----*----3----*----4----*----5----*----6----*----7----*----8
//                        Classification: UNCLASSIFIED
//==============================================================================
//                Copyright, Belford DBA Consulting, LLC, 2022
//                      Unpublished, All Rights Reserved
//==============================================================================
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/
//
// Section 22: Section 22: Javascript with Canvas API
// Lesson: 119 & 302
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

const debug = 1;    // 0: Off   1: On

const { Engine, Render, Runner, World, Body, Bodies, Events } = Matter; 

//const cells      = 10;
const cellsHorizional = 5;
const cellsVertical   = 5;
const height     = window.innerHeight;
const wallWidth  = 5;

const width      = window.innerWidth;
const width_brdr = 2;

// const unitLength = height / cells;
const unitLengthX = width  / cellsHorizional;
const unitLengthY = height / cellsVertical;

const engine    = Engine.create();
engine.world.gravity.y = 0;
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

// 

const grid = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizional).fill(false));

if (debug > 0) {
    console.log(grid);
};

const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizional-1).fill(false));

if (debug > 0) {
    console.log(verticals); 
};

const horizontals = Array(cellsVertical-1)
    .fill(null)
    .map(() => Array(cellsHorizional).fill(false));

if (debug > 0) {
    console.log(horizontals); 
};

const startRow = Math.floor(Math.random() * cellsVertical);
const startCol = Math.floor(Math.random() * cellsHorizional);

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
        if (nextRow < 0 || 
            nextRow >= cellsVertical || 
            nextCol < 0 || 
            nextCol >= cellsHorizional
        ) {
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
            (columnIndex * unitLengthX) + unitLengthX / 2,
            (rowIndex * unitLengthY) + unitLengthY,
            unitLengthX,
            wallWidth, 
            {
                label:    'wall', 
                isStatic: true,
                render: {
                    fillStyle: 'red'
                }
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
            (columnIndex * unitLengthX) + unitLengthX,
            (rowIndex * unitLengthY) + unitLengthY / 2,
            wallWidth, 
            unitLengthY, 
            {
                label:    'wall', 
                isStatic: true,
                render: {
                    fillStyle: 'red'
                }
            }
        );
        World.add(world, wall);
    });
});

// Goal

const goal = Bodies.rectangle( 
    width - (unitLengthX / 2),
    height - (unitLengthY / 2),
    unitLengthX * .75, 
    unitLengthY * .75,
    {
        label:     'goal', 
        isStatic:  true,
        render: {
            fillStyle: 'green'
        }
    }
);
World.add(world, goal); 

// Ball

const ballRadius = Math.min(unitLengthX, unitLengthY) / 4 / .7;
const ball = Bodies.circle(
    unitLengthX / 2, 
    unitLengthY / 2,
    ballRadius, 
    {
        label: 'ball',
        render: {
            fillStyle: 'blue'
        }
    }
);
World.add(world, ball); 

// Ball Controls

document.addEventListener('keydown', event => { 
    const { x, y } = ball.velocity; 
    const eventKey = event.key.toLowerCase;
    // console.log(event.key)

    // w: up 87
    if (eventKey === 'w' || event.key === 'ArrowUp') {
        Body.setVelocity(ball, { x: x, y: y-5});
    };
    // d: right 68
    if (eventKey === 'd' || event.key === 'ArrowRight') {
        Body.setVelocity(ball, { x: x+5, y});
    };
    // s: down 83
    if (eventKey=== 's' || event.key === 'ArrowDown') {
        Body.setVelocity(ball, { x, y: y+5});
    };
    // a: left 65
    if (eventKey=== 'a' || event.key === 'ArrowLeft') {
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
            document.querySelector('.winner').classList.remove('hidden');
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false);
                }
            });
        }
    });
}); 

