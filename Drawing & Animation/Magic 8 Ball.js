var answer = floor(random(1, 6));
var prompt = 1;
var triangleHue = 0;

var draw = function() {
    colorMode(RGB);
    textSize(12);
    background(255, 255, 255);
    fill(0, 0, 0);
    ellipse(200, 200, 375, 375);
    colorMode(HSB);
    fill(triangleHue, 100, 150);
    triangle(200, 104, 280, 280, 120, 280);
    colorMode(RGB);
    fill(255, 255, 255);


    if (answer === 1) {
        text("Yes.", 188, 218);
    } else if (answer === 2) {
        text("Don't count on it.", 150, 238);
    } else if (answer === 3) {
        text("It is certain.", 166, 221);
    } else if (answer === 4) {
        text("Ask again later...", 153, 227);
    } else {
        text("Without a doubt.", 154, 235);
    }
    if (prompt === 1) {
        fill(255, 255, 255);
        textSize(18);
        text("Press any key to ask a question.", 60, 90);
    }
    if (triangleHue < 360) {
        triangleHue += 1;
    } else {
        triangleHue = 0;
    }
};

mouseClicked = function() {
    answer = floor(random(1, 6));
    prompt = 0;
};

keyPressed = function() {
    answer = floor(random(1, 6));
    prompt = 0;
};