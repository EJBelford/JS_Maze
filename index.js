//--*----1----*----2----*----3----*----4----*----5----*----6----*----7----*----8
//                        Classification: UNCLASSIFIED
//==============================================================================
//                Copyright, Belford DBA Consulting, LLC, 2022
//                      Unpublished, All Rights Reserved
//==============================================================================
//--*----|----*----|----*----|----*----|----*----|----*----|----*----|----*----/
//
// Section 22: Section 22: Javascript with Canvas API
// Lesson: 287
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

const debug = 1;

const { Engine, Render, Runner, World, Bodies } = Matter; 

const cells      = 3;
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

