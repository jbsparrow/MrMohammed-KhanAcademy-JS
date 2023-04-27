// https://www.khanacademy.org/computer-programming/paint-app/5833968965697536

var drawings = [];
var points = [];

var r = 0;
var g = 0;
var b = 0;
var a = 255;
var brushSize = 10;
var brushType = "round";

var shiftPressed = false;
var ctrlPressed = false;


var brushColor = color(r, g, b, a);


var enableRedSlider = false;
var enableGreenSlider = false;
var enableBlueSlider = false;
var enableAlphaSlider = false;


var redSliderX = 30;
var greenSliderX = 150;
var blueSliderX = 270;
var alphaSliderY = 360;



var Drawing = function(config) {
    this.x = config.x;
    this.y = config.y;
    this.fillColour = config.fillColour;
    this.strokeColour = config.strokeColour || color(0, 0, 0);
    this.size = config.size;
    this.type = config.type;
    this.points = config.points || [];
};

Drawing.prototype.draw = function() {
    if (this.type === 'square') {
        fill(this.fillColour);
        stroke(this.strokeColour);
        rect(this.x, this.y, this.size, this.size);
    } else if (this.type === 'circle') {
        fill(this.fillColour);
        stroke(this.strokeColour);
        ellipse(this.x, this.y, this.size, this.size);
    }
};

var Button = function(config) {
    this.x = config.x || 50;
    this.y = config.y || 50;
    this.width = config.width || 15;
    this.height = config.height || 15;
    this.fill = config.fill;
    this.stroke = config.stroke;
    this.shape = config.shape || 'square';
    this.fillColour = config.fillColour;
    this.strokeColour = config.strokeColour || color(0, 0, 0);
    this.strokeWeight = config.strokeWeight || 1.0;
    this.bevel = config.bevel || 0;
    this.onClick = config.onClick || function() {};
};

Button.prototype.draw = function() {
    if (this.fill === true) {
        fill(this.fillColour);
    } else if (this.fill === false) {
        noFill();
    }

    if (this.stroke === true) {
        stroke(this.strokeColour);
        strokeWeight(this.strokeWeight);
    } else if (this.stroke === false) {
        noStroke();
    }

    if (this.shape === 'square') {
        rect(this.x, this.y, this.width, this.height, this.bevel);
    } else if (this.shape === 'circle') {
        ellipse(this.x, this.y, this.width, this.height);
    }
    fill(0, 0, 0);
};

Button.prototype.isMouseInside = function() {
    return (mouseX >= this.x &&
        mouseX <= (this.x + this.width) &&
        mouseY >= this.y &&
        mouseY <= (this.y + this.height));
};

Button.prototype.handleMouseClick = function() {
    if (this.isMouseInside()) {
        this.onClick();
    }
};

var squareBrushData = {
    x: 366,
    y: 12,
    width: 15,
    height: 16,
    fill: true,
    stroke: false,
    shape: 'square',
    fillColour: ((brushType === "square") ? color(88, 88, 88, 100) : color(255, 255, 255, 0)),
    onClick: function() {
        brushType = "square";
    }
};
var squareBrushButton = new Button(squareBrushData);

var roundBrushData = {
    x: 347,
    y: 11,
    width: 16,
    height: 16,
    fill: true,
    stroke: false,
    shape: 'square',
    fillColour: ((brushType === "round") ? color(88, 88, 88, 100) : color(255, 255, 255, 0)),
    onClick: function() {
        brushType = "round";
    }
};
var roundBrushButton = new Button(roundBrushData);

var mouseInCanvas = function() {
    return (mouseX > 30 && mouseX < 390 && mouseY > 36 && mouseY < 358);
};


var draw = function() {
    strokeWeight(1.0);
    stroke(0, 0, 0);
    background(255, 255, 255);


    // Draw canvas
    noFill();
    strokeWeight(2.0);
    rect(30, 36, 360, 322);
    strokeWeight(1.0);

    // Draw cursor
    var mx = constrain(mouseX, 30, 390);
    var my = constrain(mouseY, 36, 358);
    fill(brushColor);
    if (brushType === "round") {
        ellipse(mx, my, brushSize, brushSize);
    } else if (brushType === "square") {
        rect(mx - brushSize / 2, my - brushSize / 2, brushSize, brushSize);
    }


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
    roundBrushButton.draw();
    squareBrushButton.draw();


    stroke(0, 0, 0);
    fill(brushColor);
    ellipse(355, 19, 12, 12);
    rect(367, 13, 12, 12);

    for (var i = 0; i < drawings.length; i++) {
        drawings[i].draw();
    }
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
    squareBrushButton.handleMouseClick();
    roundBrushButton.handleMouseClick();
    squareBrushData.fillColour = ((brushType === "square") ? color(88, 88, 88, 100) : color(255, 255, 255, 0));
    roundBrushData.fillColour = ((brushType === "round") ? color(88, 88, 88, 100) : color(255, 255, 255, 0));
    roundBrushButton = new Button(roundBrushData);
    squareBrushButton = new Button(squareBrushData);
    debug(mouseInCanvas());
    if (mouseInCanvas()) {
        if (brushType === "round") {
            var drawingData = {
                x: mouseX,
                y: mouseY,
                size: brushSize,
                fillColour: brushColor,
                type: brushType
            };
            drawings.push(new Drawing(drawingData));
        } else if (brushType === "square") {
            var drawingData = {
                x: mouseX - brushSize / 2,
                y: mouseY - brushSize / 2,
                size: brushSize,
                fillColour: brushColor,
                type: brushType
            };
            drawings.push(new Drawing(drawingData));
        }
        debug(drawings.length, drawings);
    }
};

keyPressed = function() {
    if (keyCode === SHIFT) {
        shiftPressed = true;
    } else if (keyCode === CONTROL) {
        ctrlPressed = true;
    }
};

keyReleased = function() {
    if (keyCode === SHIFT) {
        shiftPressed = false;
    } else if (keyCode === CONTROL) {
        ctrlPressed = false;
    }
};