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


class Shard{
    constructor(points, speed){
        // float32 arrays for points & colors
        this.points = points;
        this.colors = [] // TODO choose random colors 

        // float32 2vec for speed [x,y]
        this.speed = speed;

        // TODO random rotation speed
        this.rotation = 0.0
    }

    /**
     * Update the position based on its existing speed vector
     * 
     * move all the points, and update the speed vec
     */
    update(timestep){

        this

        // update the speed, ie pull it down via gravity
        this.speed[1] -= 9.81 * timestep
    }
}

function shatter(x_lim, y_lim, shatter_pt, connections=1){
    // TODO:

    // Generate list of random points in the range ie 0,xlim ; 0, ylim

    // connect the points randomly create <connections> line per point

    // calculate all intersections between the lines and the limits

    // return the shapes created by the line divisions

    // unsure at this point but maybe we use the above class for updating
    // will have to look at how the rest of the webgl js setup works in HW 1.html
    // if we use, then initialize the shards with random speed which faces away from shatter_pt
}



