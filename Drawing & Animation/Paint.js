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



var Button = function(config) {
    this.x = config.x || 50;
    this.y = config.y || 50;
    this.width = config.width || 15;
    this.height = config.height || 15;
    this.colour = config.colour || color(88, 88, 88, 100);
    this.stroke = config.stroke || color(0, 0, 0);
    this.strokeWeight = config.strokeWeight || 1.0;
    this.shape = config.shape || 'square';
    this.bevel = config.bevel || 0;
    this.hidden = config.hidden || false;
    this.onClick = config.onClick || function() {};
};

Button.prototype.draw = function() {
    fill(this.colour);
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
    if (this.hidden) {
        noStroke();
        fill(255, 255, 255, 0);
    }
    if (this.shape === 'square') {
        rect(this.x, this.y, this.width, this.height, this.bevel);
    } else if (this.shape === 'circle') {
        ellipse(this.x, this.y, this.width, this.height);
    }
    fill(0, 0, 0);
};

Button.prototype.isMouseInside = function() {
    return mouseX > this.x &&
        mouseX < (this.x + this.width) &&
        mouseY > this.y &&
        mouseY < (this.y + this.height);
};

Button.prototype.handleMouseClick = function() {
    if (this.isMouseInside()) {
        this.onClick();
    }
};

var btn1 = new Button({
    x: 100,
    y: 100,
    onClick: function() {
        text("You made the right choice!", this.x, this.y + this.height);
    }
});
btn1.draw();


var btn2 = new Button({
    x: 100,
    y: 213,
    onClick: function() {
        text("Yay, you picked me!", this.x, this.y + this.height);
    }
});
btn2.draw();


mouseClicked = function() {
    btn1.handleMouseClick();
    btn2.handleMouseClick();
};


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
    if (mouseX < 362 && mouseX > 347 && mouseY < 27 && mouseY > 11) {
        brushType = "round";
    }
};