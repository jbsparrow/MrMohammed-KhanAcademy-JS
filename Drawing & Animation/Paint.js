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
var brushSizeX = 0;



var draw = function() {
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