// Think about your house, apartment, school, or office building. There's a lot of repeating elements - especially on the outside. In this project, you'll use loops to add repeating elements to this house. Suggested steps:

//     Draw a window, then use a for loop to draw a row of windows (or, use nested for loops to make multiple rows of windows).
//     Draw a row of grass in front. And maybe some bushes or flowers?
//     The house is a plain color now. Use loops to make it a brick house or a house with "siding" or a log cabin. Check the images library for ways to make that more realistic.
//     Bonus: Use a conditional inside a for loop to make more interesting grass or walls, using a different color for every other iteration of the loop (hint: use the % operator).

// Keep going! What else could you draw with loops?

background(219, 255, 255);

// Roof
fill(89, 89, 89);
triangle(200, 28, 350, 150, 50, 150);
var roofMode = round(random(0, 5));

// House walls
fill(255, 255, 255);
rect(60, 150, 280, 207);

// Fill the walls with tiny little red bricks
for (var i = 0; i < 280; i += 10) {
    for (var j = 0; j < 207; j += 10) {
        fill(random(200, 255), random(0, 25), random(0, 25));
        rect(60 + i, 150 + j, 10, 10);
    }
}


// Horizontal lines
for (var i = 0; i < 21; i += 1) {
    line(60, 155 + i * 10, 340, 155 + i * 10);
}

// Door
fill(120, 80, 19);
noStroke();
rect(181, 284, 39, 77);
arc(200, 285, 39, 20, 180, 360);
stroke(0, 0, 0);
fill(120, 222, 220);
// Door window
ellipse(201, 301, 20, 20);
line(201, 291, 201, 310);
line(190, 301, 210, 301);
// Door knob
fill(79, 52, 12);
strokeWeight(0.6);
ellipse(213, 326, 5, 5);


// Shingles
if (roofMode === 0) {
    noStroke();
    fill(89, 89, 89);
    triangle(68, 136, 74, 150, 50, 150);
    triangle(332, 136, 326, 150, 350, 150);


    // Tile roof using quads that slightly overlap eachother. The slope of the roof (10.57352deg) is used to calculate the positions of the quads.
    var darkness = 89;
    for (var i = 0; i < 14; i += 1) {
        fill(darkness, darkness, darkness, random(200, 255));
        var x1 = 74 + i * 9.51428;
        var y1 = 131 - i * 7.65928;
        var x2 = 66 + i * 9.51428;
        var y2 = 137 - i * 7.65928;
        var x3 = 72 + i * 10;
        var y3 = 150;
        var x4 = 91 + i * 10;
        var y4 = 150;
        quad(x1, y1, x2, y2, x3, y3, x4, y4);
        darkness -= 1;
    }

    darkness = 89;
    for (var i = 0; i < 14; i += 1) {
        fill(darkness, darkness, darkness, random(200, 255));
        var x1 = 326 - i * 9.51428;
        var y1 = 131 - i * 7.65928;
        var x2 = 334 - i * 9.51428;
        var y2 = 137 - i * 7.65928;
        var x3 = 328 - i * 10;
        var y3 = 150;
        var x4 = 309 - i * 10;
        var y4 = 150;
        quad(x1, y1, x2, y2, x3, y3, x4, y4);
        darkness -= 1;
    }
} else {
    colorMode(HSB);
    var thcx = 0;
    var inc = 360 / 300;
    var iinc = 0.709; // @ 25fps
    // Formula for framerate is approximately iinc * -14.084 + 35.013
    frameRate(-14.084 * iinc + 35.013);
    var dir = "up";

    draw = function() {
        // Trace the triangle, shooting a line into the center of the triangle every .5 pixels.
        for (var i = 0; i < 300; i += iinc) {
            var x = lerp(200, 50, i / 300);
            var y = lerp(28, 150, i / 300);
            stroke(thcx, 255, 255);
            line(x, y, 200, 100);
            if (thcx >= 255 || dir === "down") {
                dir = "down";
                thcx -= inc;
                if (thcx <= 0) {
                    dir = "up";
                    thcx += inc;
                }
            } else if (dir === "up") {
                thcx += inc;
            }
        }

        // Trace another side of the triangle
        for (var i = 0; i < 300; i += iinc) {
            var x = lerp(350, 200, i / 300);
            var y = lerp(150, 28, i / 300);
            stroke(thcx, 255, 255);
            line(x, y, 200, 100);
            if (thcx >= 255 || dir === "down") {
                dir = "down";
                thcx -= inc;
                if (thcx <= 0) {
                    dir = "up";
                    thcx += inc;
                }
            } else if (dir === "up") {
                thcx += inc;
            }
        }

        // Trace the last side of the triangle
        for (var i = 0; i < 300; i += iinc) {
            var x = lerp(50, 350, i / 300);
            var y = lerp(150, 150, i / 300);
            stroke(thcx, 255, 255);
            line(x, y, 200, 100);
            if (thcx >= 255 || dir === "down") {
                dir = "down";
                thcx -= inc;
                if (thcx <= 0) {
                    dir = "up";
                    thcx += inc;
                }
            } else if (dir === "up") {
                thcx += inc;
            }
        }
    };
}