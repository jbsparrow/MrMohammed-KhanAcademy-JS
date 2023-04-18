background(89, 216, 255);
colorMode(HSB);

var bubbleCount = random(10, 15);
var fishCount = random(8, 12);


var fish = [];
var bubbles = [];


for (var i = 0; i < bubbleCount; i++) {
    // [x, y, diameter, speed]
    bubbles.push([random(0, 400), random(300, 400), random(10, 30), random(0.8, 2.3)]);
}

for (var i = 0; i < fishCount; i++) {
    // [x, y, length, height, bodyColour, eyeColour, speed]
    fish.push([random(0, 400), random(0, 400), random(100, 200), random(1.5, 3.5), color(random(0, 360), 100, 100), color(random(0, 360), 100, 100), random(0.8, 2.3)]);
}



var drawFish = function(centerX, centerY, bodyLength, bodyHeightDivisor, bodyColour, eyeColour) {
    noStroke();
    fill(bodyColour);
    // body
    var bodyHeight = bodyLength / bodyHeightDivisor;
    ellipse(centerX, centerY, bodyLength, bodyHeight);
    // tail
    var tailWidth = bodyLength / 4;
    var tailHeight = bodyHeight / 2;
    triangle(centerX - bodyLength / 2, centerY, centerX - bodyLength / 2 - tailWidth, centerY - tailHeight, centerX - bodyLength / 2 - tailWidth, centerY + tailHeight);
    // eye
    stroke(255, 0, 0, 35);
    fill(eyeColour);
    ellipse(centerX + bodyLength / 4, centerY, bodyHeight / 5, bodyHeight / 5);
    noStroke();
};

var drawBubble = function(x, y, diameter) {
    stroke(255, 0, 0, 35);
    fill(158, 255, 255, 100);
    ellipse(x, y, diameter, diameter);
};


draw = function() {
    colorMode(RGB);
    background(89, 216, 255);
    colorMode(HSB);
    for (var i = 0; i < fish.length; i++) {
        drawFish(fish[i][0], fish[i][1], fish[i][2], fish[i][3], fish[i][4], fish[i][5]);
        // move fish
        fish[i][0] += fish[i][6];
        // if fish reaches right of screen (accounting for fish size including fish tail)
        if (fish[i][0] > 400 + fish[i][2] / 2 + fish[i][2] / 4 + random(0, 20)) {
            // reset fish
            fish[i][0] = -fish[i][2] / 2;
            fish[i][1] = random(0, 400);
            fish[i][2] = random(100, 200);
            fish[i][3] = random(1.5, 3.5);
            fish[i][4] = color(random(0, 360), 100, 100);
            fish[i][5] = color(random(0, 360), 100, 100);
            fish[i][6] = random(0.8, 2.3);
        }

    }
    // loop through bubbles
    for (var i = 0; i < bubbles.length; i++) {
        // draw bubble
        drawBubble(bubbles[i][0], bubbles[i][1], bubbles[i][2]);
        // move bubble
        bubbles[i][1] -= bubbles[i][3];
        // if bubble reaches top of screen
        if (bubbles[i][1] < 0) {
            // reset bubble
            bubbles[i][0] = random(0, 400);
            bubbles[i][1] = random(300, 400);
            bubbles[i][2] = random(10, 30);
            bubbles[i][3] = random(0.8, 2.3);
        }
    }
};