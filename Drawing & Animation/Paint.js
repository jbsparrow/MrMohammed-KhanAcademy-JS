// https://www.khanacademy.org/computer-programming/paint-app/5833968965697536

var r = 0;
var g = 0;
var b = 0;
var a = 255;
var brushSize = 10;
var brushType = "round";


var brushColor = color(r, g, b, a);


var enableRedSlider = false;
var enableGreenSlider = false;
var enableBlueSlider = false;
var enableAlphaSlider = false;


var redSliderX = 30;
var greenSliderX = 150;
var blueSliderX = 270;
var alphaSliderY = 360;



var draw = function() {
    strokeWeight(1.0);
    stroke(0, 0, 0);
    background(255, 255, 255);
    fill(255, 255, 255);
    // Colour selector
    line(30, 375, 130, 375);
    line(150, 375, 250, 375);
    line(270, 375, 370, 375);
    line(12, 360, 12, 260);

    ellipse(redSliderX, 375, 5, 5);
    ellipse(greenSliderX, 375, 5, 5);
    ellipse(blueSliderX, 375, 5, 5);
    ellipse(12, alphaSliderY, 5, 5);

    fill(brushColor);
    rect(6, 368, 12, 12);



    // Brush selector
    if (brushType === "round") {
        // Selection shadow
        noStroke();
        fill(88, 88, 88, 100);
        rect(347, 11, 16, 16);
        fill(brushColor);
        stroke(0, 0, 0);
    }
    ellipse(355, 19, 12, 12);
    if (brushType === "square") {
        // Selection shadow
        noStroke();
        fill(88, 88, 88, 100);
        rect(366, 12, 15, 16);
        fill(brushColor);
        stroke(0, 0, 0);
    }
    rect(367, 13, 12, 12);


};


mousePressed = function() {
    if (mouseX < redSliderX + 5 && mouseX > redSliderX - 5 && mouseY < 380 && mouseY > 370) {
        enableRedSlider = true;
    } else if (mouseX < greenSliderX + 5 && mouseX > greenSliderX - 5 && mouseY < 380 && mouseY > 370) {
        enableGreenSlider = true;
    } else if (mouseX < blueSliderX + 5 && mouseX > blueSliderX - 5 && mouseY < 380 && mouseY > 370) {
        enableBlueSlider = true;
    } else if (mouseY < alphaSliderY + 5 && mouseY > alphaSliderY - 5 && mouseX < 22 && mouseX > 2) {
        enableAlphaSlider = true;
    }
};

mouseDragged = function() {
    if (enableRedSlider) {
        redSliderX = constrain(mouseX, 30, 130);
    } else if (enableGreenSlider) {
        greenSliderX = constrain(mouseX, 150, 250);
    } else if (enableBlueSlider) {
        blueSliderX = constrain(mouseX, 270, 370);
    } else if (enableAlphaSlider) {
        alphaSliderY = constrain(mouseY, 260, 360);
    }

    r = constrain(round((redSliderX - 30) * 2.55), 0, 255);
    g = constrain(round((greenSliderX - 150) * 2.55), 0, 255);
    b = constrain(round((blueSliderX - 270) * 2.55), 0, 255);
    a = constrain(round((alphaSliderY - 260) * 2.55), 0, 255);
    brushColor = color(r, g, b, a);
    debug(r, g, b, a);
};

mouseReleased = function() {
    enableRedSlider = false;
    enableGreenSlider = false;
    enableBlueSlider = false;
    enableAlphaSlider = false;
};


mouseClicked = function() {
    // If clicked in square selection box
    if (mouseX < 381 && mouseX > 366 && mouseY < 26 && mouseY > 12) {
        brushType = "square";
    }
    // If clicked in circle selection box
    if (mouseX < 355 + 6 && mouseX > 355 - 6 && mouseY < 19 + 6 && mouseY > 19 - 6) {
        brushType = "round";
    }
};