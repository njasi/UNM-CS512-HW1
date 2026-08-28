/**
 * helper file to simulate shattering of 'glass'
 * 
 * instead of using a accurate algorithm I think we will do the following
 * - choose a starting 2d range (consider this our initial 'glass' panel)
 * - choose N random points in the range
 * - connect these points randomly
 * - draw lines from the random connections to divide the plane
 * - calculate all the shapes created from these intersections
 *      - iterate through all created lines & check against all the other lines
 *      - need to remember the edges of the bounds count as lines as well
 *      - also only calculate shapes in the range
 * 
 * There isn't any guarantee of regularity if we use 
 * this setup but it should look broken enough lol
 */


const TOLERANCE = 0.0001

class Shard {
    constructor(points, speed) {
        // float32 arrays for points & colors
        this.points = points;
        this.colors = [] // TODO choose random colors 

        // float32 2vec for speed [x,y]
        this.speed = speed;

        // TODO random rotation speed
        // might be easier to store this as rotation matrix
        this.rotation = 0.0
    }

    /**
     * Update the position based on its existing speed vector
     * 
     * move all the points, and update the speed vec
     */
    update(timestep) {

        // TODO: update position (add speed vec)

        // TODO: update rotation (apply rot matrix)

        // update the speed, ie pull it down via gravity
        this.speed[1] -= 9.81 * timestep
    }
}

/**
 * Find the intersection point of two lines
 * 
 * @param {[(float32, float32), (float32, float32)]} line1 
 * @param {[(float32, float32), (float32, float32)]} line2 
 * 
 * @returns {(float32, float32)}
 */
function lineIntersection(line1, line2, tolerance = TOLERANCE) {
    let [[x1, y1], [x2, y2]] = line1;
    let [[x3, y3], [x4, y4]] = line2;

    const D = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    // stop near dividing by 0
    if (Math.abs(D) < tolerance) {
        return null;
    }

    const x = ((x1 * y2 - y2 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / D;
    const y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / D;
    return [x, y];
}

/**
 * Bound a line inside the rectangle we define
 * 
 * @param {[(float32, float32), (float32, float32)]} line   The line    
 * @param {float32} x_lim                                   The x limit of the rect
 * @param {float32} y_lim                                   The y lmit of the rect
 * 
 * @returns {[(float32, float32), (float32, float32)]}      The clipped line
 */
function clipLineToRectangle(line, x_lim, y_lim, tolerance = TOLERANCE) {
    let [[x1, y1], [x2, y2]] = line;

    const dx = x1 - x2;
    const dy = y1 - y2;

    const possible = [];

    // again stop dividing by near 0
    if (Math.abs(dx) > tolerance) {
        // the left wall & right wall
        possible.push([0, y1 + (-x1 / dx) * dy]);
        possible.push([x_lim, y1 + ((x_lim - x1) / dx) * dy]);
    }
    if (Math.abs(dy) > tolerance) {
        // the top wall & the bottom wall
        possible.push([x1 + (-y1 / dy) * dx, 0])
        possible.push([x1 + ((y_lim - y1 / dy)), y_lim])
    }

    // only keep the points that are still in the filter
    const valid = possible.filter((pt, i) => {
        const [x, y] = pt;
        return x >= -tolerance &&
            x <= x_lim + tolerance &&
            y >= -tolerance &&
            y <= y_lim + tolerance;
    })

    // ensure we dont get duplicates from hitting corners
    const unique = [];
    for (let i = 0; i < valid.length; i++) {
        const point = valid[i];

        const isDuplicate = unique.some(other =>
            Math.hypot(point[0] - other[0], point[1] - other[1]) <= tolerance
        );

        if (!isDuplicate) {
            unique.push(point);
        }
    }

    return unique >= 2 ? [unique[0], unique[1]] : null;
}

/**
 * Find the faces contained within the lines
 * 
 * @param {[[float32]]} lines   The calculated shatter lines
 * @param {*} x_lim              The x limit of the rect
 * @param {*} y_lim              The y lmit of the rect
 * 
 * @returns {[[(float32, float32)]]}  A list of the faces found, ie ragged list of list of points
 */
function findFaces(lines, x_lim, y_lim) {
    // TODO 
    // not sure how to do this one...
    // might just brute force it, should be doable?
    // - if brute force is slow we can precalculate this 
    //   before the button is even clicked lol
    // - if brute forcing do i need a margin of error to bake in?
    //   this is fine since its supposed to look broken anyway
    // 
    // or can probably turn this into a normal graph 
    // problem and use a real algrithm?
    // 
    // - build intersections into adjacency list
    // - .....
    // - find faces
    // 
    // theres def an existing algorithm for this look it up later
    // - these should be guaranteed to be planar graphs since we construct from a 
    //   plane in the first place...

}


/**
 * Create a list of Shards given an area and a shatter origin point
 * 
 * @param {float32} x_lim                   The positive X limit of the rectangle
 * @param {float32} y_lim                   The positive Y limit of the rectangle
 * @param {(float32,float32)} shatter_pt    The origin point of the shatter (shards fall away from this)
 * @param {int} n_pts                       The number of points to generate
 * @param {int} connections                 The number of connections per point to make
 * 
 * @returns {[Shard]}                       List of shard objects
 */
function shatter(x_lim, y_lim, shatter_pt, n_pts = 20, connections = 1) {
    // TODO:

    // Ensure that connections < n_pts

    // Generate list of random points in the range ie 0,x_lim ; 0, y_lim
    const points = [...Array(n_pts)].map((_) => [Math.random() * x_lim, Math.random() * y_lim])

    // connect the points randomly, create <connections> line per point
    const shatter_lines = [];
    for (let i = 0; i < n_pts; i++) {
        let seen = []
        for (let c = 0; c < connections; c++) {
            let j = Math.floor(Math.random() * n_pts);
            if (j === i) {
                j = (j + 1) % n_pts;

                // hmm might get stucj in infinite loop if connections >= n_pts, so
                // let us ensure it remains less than
                if (seen.includes(j)) {
                    c--;
                    continue;
                }
                seen.push(j);
            }
            shatter_lines.push([points[i], points[j]]);
        }
    }

    // calculate all intersections between the lines and the limits
    // NOTE: will all clipped lines still be within the rectangle?
    shatter_lines = shatter_lines.map((line) => clipLineToRectangle(line, x_lim, y_lim))

    // return the shapes created by the line divisions
    faces = findFaces(shatter_lines, x_lim, y_lim)

    // unsure at this point but maybe we use the above class for updating
    // will have to look at how the rest of the webgl js setup works in HW 1.html
    // if we use, then initialize the shards with random speed which faces away from shatter_pt

    // TODO: anyway we then map the faces to Shards & return them if we use this
    return faces.map((face) => {
        // TODO map to shards
        return Shard()
    })
}



