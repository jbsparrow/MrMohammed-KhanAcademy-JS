background(127);
noStroke();
var pval = 0;
var moveVal = false;
var currentColour = color(0, 255, 0);
var lastColour = color(255, 255, 255);
var backColour = color(255, 0, 0);

var drawLeftPage = function(colour) {
    fill(colour);
    beginShape();
    vertex(0, 0);
    vertex(0, height);
    vertex(width / 2, height - 20);
    vertex(width / 2, 20);
    endShape(CLOSE);
};

var drawRightPage = function(pageTurnVal, colour) {
    fill(colour);
    beginShape();
    vertex(width / 2, 20); // Top left corner
    vertex(width / 2, height - 20); // Bottom left corner
    vertex(width + pageTurnVal, height); // Bottom right corner
    vertex(width + pageTurnVal, 0); // Top right corner
    endShape(CLOSE);
};


var draw = function() {
    background(127);
    noStroke();
    if (moveVal && pval > -400) {
        pval -= 25; // Page turn speed
    } else if (pval <= -400) {
        moveVal = false;
        lastColour = currentColour;
        currentColour = backColour;
        backColour = color(random(255), random(255), random(255));
        pval = 0;
    }

    drawLeftPage(lastColour);
    drawRightPage(0, backColour);
    drawRightPage(pval, currentColour);
};

mouseClicked = function() {
    moveVal = !moveVal;
};