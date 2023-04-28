// https://www.khanacademy.org/computer-programming/paint-app/5833968965697536
frameRate(9e+18);


var drawings = [];
var undoneDrawings = [];
var currentDrawing = [];
var currentTempDrawing = [];
var points = [];
var undonePoints = [];
var temporaryPoints = [];
var buttons = [];
var tooltips = [];

var r = 150;
var g = 209;
var b = 99;
var a = 255;
var brushSize = 10;
var brushType = "round";
var enableStroke = false;

var allowDrawing = false;
var shiftPressed = false;
var ctrlPressed = false;
var pointMode = false;


var brushColor = color(r, g, b, a);


var enableRedSlider = false;
var enableGreenSlider = false;
var enableBlueSlider = false;
var enableAlphaSlider = false;
var enableBrushSizeSlider = false;


var redSliderX = (r / 255) * 100 + 30; // min 30 max 130
var greenSliderX = (g / 255) * 100 + 150; // min 150 max 250
var blueSliderX = (b / 255) * 100 + 270; // min 270 max 370
var alphaSliderY = (a / 255) * 100 + 260; // min 260 max 360
var brushSizeSliderX = (brushSize * 2) + 30;

var mx = 200;
var my = 200;
var cached_mx_value = 200;
var cached_my_value = 200;
var mx_cached = false;
var my_cached = false;



var Drawing = function(config) {
    this.x = config.x;
    this.y = config.y;
    this.fillColour = config.fillColour;
    this.stroke = config.stroke;
    this.strokeColour = config.strokeColour || color(0, 0, 0);
    this.size = config.size;
    this.type = config.type;
    this.points = config.points || [];
};

Drawing.prototype.draw = function() {
    if (this.stroke === true) {
        stroke(this.strokeColour);
    } else if (this.stroke === false) {
        noStroke();
    }
    fill(this.fillColour);
    if (this.type === 'square') {
        rect(this.x, this.y, this.size, this.size);
    } else if (this.type === 'round') {
        ellipse(this.x, this.y, this.size, this.size);
    }
};

var Point = function(config) {
    this.x = config.x;
    this.y = config.y;
    this.size = config.size;
};

Point.prototype.draw = function() {
    fill(brushColor);
    stroke(brushColor);
    strokeWeight(brushSize);

    ellipse(this.x, this.y, brushSize, brushSize);
};

var LineConstructor = function(config) {
    this.x1 = config.x1;
    this.y1 = config.y1;
    this.x2 = config.x2;
    this.y2 = config.y2;
    this.size = config.size || 1.0;
    this.colour = config.colour;
};

LineConstructor.prototype.draw = function() {
    strokeWeight(this.size);
    stroke(this.colour);

    line(this.x1, this.y1, this.x2, this.y2);
};


var QuadConstructor = function(config) {
    this.points = config.points;
    this.fillColour = config.fillColour;
    this.stroke = config.stroke;
    this.strokeWeight = config.strokeWeight || 1.0;
};

QuadConstructor.prototype.draw = function() {
    if (this.stroke === true) {
        stroke(0, 0, 0);
    } else if (this.stroke === false) {
        noStroke();
        if (this.points.length <= 2) {
            stroke(this.fillColour);
        }
    }
    strokeWeight(this.strokeWeight);
    fill(this.fillColour);
    beginShape();
    for (var i = 0; i < this.points.length; i++) {
        vertex(this.points[i].x, this.points[i].y);
    }
    endShape(CLOSE);
};


var Tooltip = function(config) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.text = config.text;
    this.backgroundColour = config.backgroundColour || color(88, 88, 88, 200);
    this.textColour = config.textColour || color(255, 255, 255);
    this.textSize = config.textSize || 12;
    this.textFont = config.textFont || createFont("sans-serif");
    this.outline = config.outline;
    this.outlineColour = config.outlineColour || color(0, 0, 0);
    this.outlineWeight = config.outlineWeight || 1.0;
    this.bevel = config.bevel || 0;
    this.onHover = config.onHover || function() {};
    this.hoverTime = config.hoverTime || 1000;
    this.hovering = false;
    this.hoverStart = 0;
};

Tooltip.prototype.isHovering = function() {
    if (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height) {
        if (this.hovering === false) {
            this.hoverStart = millis();
            this.hovering = true;
        }
        return true;
    } else {
        this.hovering = false;
        return false;
    }
};


Tooltip.prototype.hoverTime = function() {
    if (this.isHovering()) {
        if (millis() - this.hoverStart >= this.hoverTime) {
            return true;
        } else {
            return false;
        }
    }
};


Tooltip.prototype.drawTooltip = function() {
    if (this.hoverTime()) {
        fill(this.backgroundColour);
        stroke(this.outlineColour);
        strokeWeight(this.outlineWeight);
        rect(this.x, this.y, this.width, this.height, this.bevel);
        fill(this.textColour);
        textFont(this.textFont);
        textSize(this.textSize);
        text(this.text, this.x + 5, this.y + 15);
    }
    fill(88, 88, 88, 150);
    rect(this.x, this.y, this.width, this.height, this.bevel);
};

var redSliderTooltip = new Tooltip({
    x: 10,
    y: 10,
    width: 100,
    height: 20,
    text: "Red",
    hoverTime: 1250
});
tooltips.push(redSliderTooltip);





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
    this.updateFill = config.updateFill || function() {};
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
        this.updateFill();
    } else {
        this.updateFill();
    }
};

Button.prototype.updateFill = function() {
    this.updateFill();
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
        pointMode = false;
        this.fillColour = ((brushType === "square") ? color(88, 88, 88, 100) : color(255, 255, 255, 0));
    },
    updateFill: function() {
        this.fillColour = ((brushType === "square") ? color(88, 88, 88, 100) : color(255, 255, 255, 0));
    }
};
buttons.push(new Button(squareBrushData));

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
        pointMode = false;
        this.fillColour = ((brushType === "round") ? color(88, 88, 88, 100) : color(255, 255, 255, 0));
    },
    updateFill: function() {
        this.fillColour = ((brushType === "round") ? color(88, 88, 88, 100) : color(255, 255, 255, 0));
    }
};
buttons.push(new Button(roundBrushData));

var strokeButtonData = {
    x: 276,
    y: 11,
    width: 17,
    height: 17,
    fill: true,
    stroke: false,
    shape: 'square',
    fillColour: ((enableStroke === true) ? color(88, 88, 88, 100) : color(255, 255, 255, 0)),
    strokeColour: color(0, 0, 0),
    onClick: function() {
        enableStroke = !enableStroke;
        this.fillColour = ((enableStroke === true) ? color(88, 88, 88, 100) : color(255, 255, 255, 0));
    },
    updateFill: function() {
        this.fillColour = ((enableStroke === true) ? color(88, 88, 88, 100) : color(255, 255, 255, 0));
    }
};
buttons.push(new Button(strokeButtonData));

var lineButtonData = {
    x: 327,
    y: 10,
    width: 17,
    height: 17,
    fill: true,
    stroke: false,
    shape: 'square',
    fillColour: ((brushType === "line") ? color(88, 88, 88, 100) : color(255, 255, 255, 0)),
    strokeColour: color(0, 0, 0),
    onClick: function() {
        brushType = "line";
        pointMode = true;
        points = [];
        this.fillColour = ((brushType === "line") ? color(88, 88, 88, 100) : color(255, 255, 255, 0));
    },
    updateFill: function() {
        this.fillColour = ((brushType === "line") ? color(88, 88, 88, 100) : color(255, 255, 255, 0));
    }
};
buttons.push(new Button(lineButtonData));

var quadButtonData = {
    x: 301,
    y: 10,
    width: 26,
    height: 19,
    fill: true,
    stroke: false,
    shape: 'square',
    fillColour: ((brushType === "quad") ? color(88, 88, 88, 100) : color(255, 255, 255, 0)),
    strokeColour: color(0, 0, 0),
    onClick: function() {
        brushType = "quad";
        pointMode = true;
        points = [];
        this.fillColour = ((brushType === "quad") ? color(88, 88, 88, 100) : color(255, 255, 255, 0));
    },
    updateFill: function() {
        this.fillColour = ((brushType === "quad") ? color(88, 88, 88, 100) : color(255, 255, 255, 0));
    }
};
buttons.push(new Button(quadButtonData));


var mouseInCanvas = function() {
    return (mouseX > 30 && mouseX < 390 && mouseY > 36 && mouseY < 358);
};


var draw = function() {
    strokeWeight(1.0);
    stroke(0, 0, 0);
    background(237, 237, 237);


    // Draw canvas
    noFill();
    strokeWeight(2.0);
    fill(255, 255, 255);
    rect(30, 36, 360, 322);
    strokeWeight(1.0);

    for (var i = 0; i < drawings.length; i++) {
        // Check if drawing is of type Drawing or Array
        if (drawings[i] instanceof Drawing) {
            drawings[i].draw();
        } else if (drawings[i] instanceof LineConstructor || drawings[i] instanceof QuadConstructor) {
            drawings[i].draw();
        } else if (drawings[i] instanceof Array) {
            for (var j = 0; j < drawings[i].length; j++) {
                drawings[i][j].draw();
            }
        }
    }

    // Draw cursor
    if (shiftPressed === true) {
        mx = constrain(mouseX, 30, 390);
        my = cached_my_value;
    } else if (ctrlPressed === true) {
        mx = cached_mx_value;
        my = constrain(mouseY, 36, 358);
    } else {
        mx = constrain(mouseX, 30, 390);
        my = constrain(mouseY, 36, 358);
    }

    if (pointMode === true) {
        if (brushType === "line") {
            strokeWeight(brushSize);
            stroke(brushColor);
            fill(brushColor);
            if (points.length === 0) {
                line(mx, my, mx, my);
            } else if (points.length === 1) {
                line(points[0].x, points[0].y, mx, my);
            }
        } else if (brushType === "quad") {
            // Fill extra points with mouse position
            if (points.length === 0) {
                stroke(brushColor);
                strokeWeight((enableStroke === true ? brushSize : 1.0));
                point(mx, my);
            } else {
                var tempPoints = [];
                for (var i = 0; i < points.length; i++) {
                    tempPoints.push(points[i]);
                }
                tempPoints.push(new PVector(mx, my));
                var quadData = {
                    points: tempPoints,
                    fillColour: brushColor,
                    stroke: ((enableStroke === true || tempPoints.length <= 2) ? true : false),
                    strokeWeight: (tempPoints.length <= 2 ? 1.0 : brushSize)
                };
                new QuadConstructor(quadData).draw();
            }
        }
        strokeWeight(1.0);
        stroke(0, 0, 0);
    } else {
        if (!enableStroke) {
            noStroke();
        }
        fill(brushColor);
        if (brushType === "round") {
            ellipse(mx, my, brushSize, brushSize);
        } else if (brushType === "square") {
            rect(mx - brushSize / 2, my - brushSize / 2, brushSize, brushSize);
        }
        stroke(0, 0, 0);
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

    // Brush size selector
    fill(255, 255, 255);
    line(30, 18, 130, 18);
    ellipse(brushSizeSliderX, 18, 5, 5);



    // Brush selector
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].updateFill();
        buttons[i].draw();
    }


    stroke(0, 0, 0);
    fill(brushColor);
    ellipse(355, 19, 12, 12);
    rect(367, 13, 12, 12);
    line(332, 24, 340, 13); // LineConstructor drawing mode button
    quad(304, 25, 309, 13, 319, 13, 324, 25); // Quadrilateral drawing mode button
    fill(255, 255, 255);
    rect(278, 13, 12, 12);
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
    } else if (mouseX < brushSizeSliderX + 5 && mouseX > brushSizeSliderX - 5 && mouseY < 23 && mouseY > 13) {
        enableBrushSizeSlider = true;
    } else if (mouseInCanvas()) {
        allowDrawing = true;
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
    } else if (enableBrushSizeSlider) {
        brushSizeSliderX = constrain(mouseX, 30, 130);
    } else if (mouseInCanvas() || allowDrawing) {
        if (drawings[drawings.length - 1] === currentDrawing) {
            drawings.pop();
        }
        if (brushType === "round") {
            var drawingData = {
                x: mx,
                y: my,
                size: brushSize,
                stroke: enableStroke,
                fillColour: brushColor,
                type: brushType
            };
            currentDrawing.push(new Drawing(drawingData));
        } else if (brushType === "square") {
            var drawingData = {
                x: mx - brushSize / 2,
                y: my - brushSize / 2,
                size: brushSize,
                stroke: enableStroke,
                fillColour: brushColor,
                type: brushType
            };
            currentDrawing.push(new Drawing(drawingData));
        }
        drawings.push(currentDrawing);
    }


    r = constrain(round((redSliderX - 30) * 2.55), 0, 255);
    g = constrain(round((greenSliderX - 150) * 2.55), 0, 255);
    b = constrain(round((blueSliderX - 270) * 2.55), 0, 255);
    a = constrain(round((alphaSliderY - 260) * 2.55), 0, 255);
    brushSize = constrain(round((brushSizeSliderX - 30) * 0.5), 1, 50);
    brushColor = color(r, g, b, a);
};

mouseReleased = function() {
    enableRedSlider = false;
    enableGreenSlider = false;
    enableBlueSlider = false;
    enableAlphaSlider = false;
    enableBrushSizeSlider = false;
    if (currentDrawing.length > 0) {
        currentDrawing = [];
    }
    allowDrawing = false;
};


mouseClicked = function() {
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].handleMouseClick();
    }
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].updateFill();
    }


    if (mouseInCanvas()) {
        if (brushType === "round") {
            var drawingData = {
                x: mx,
                y: my,
                size: brushSize,
                stroke: enableStroke,
                fillColour: brushColor,
                type: brushType
            };
            drawings.push(new Drawing(drawingData));
        } else if (brushType === "square") {
            var drawingData = {
                x: mx - brushSize / 2,
                y: my - brushSize / 2,
                size: brushSize,
                stroke: enableStroke,
                fillColour: brushColor,
                type: brushType
            };
            drawings.push(new Drawing(drawingData));
        } else if (brushType === "line") {
            var pointData = {
                x: mx,
                y: my,
                size: brushSize,
            };
            points.push(new Point(pointData));
            if (points.length === 2) {
                var lineData = {
                    x1: points[0].x,
                    y1: points[0].y,
                    x2: points[1].x,
                    y2: points[1].y,
                    size: brushSize,
                    colour: brushColor
                };
                drawings.push(new LineConstructor(lineData));
                points = [];
            }
        } else if (brushType === "quad") {
            points.push(new PVector(mx, my));
        }
    }
};

keyPressed = function() {
    if (keyCode === SHIFT) {
        shiftPressed = true;
        if (my_cached === false && mouseInCanvas()) {
            cached_my_value = mouseY;
            my_cached = true;
        }
    } else if (keyCode === CONTROL) {
        ctrlPressed = true;
        if (mx_cached === false && mouseInCanvas()) {
            cached_mx_value = mouseX;
            mx_cached = true;
        }
    }
};

keyReleased = function() {
    if (keyCode === SHIFT) {
        shiftPressed = false;
        my_cached = false;
    } else if (keyCode === CONTROL) {
        ctrlPressed = false;
        mx_cached = false;
    }
};

keyTyped = function() {
    if (key.toString() === '=') {
        // Increase brush size
        if (brushSize < 50) {
            brushSize += 1;
            brushSizeSliderX = (brushSize * 2) + 30;
        }
    } else if (key.toString() === '-') {
        // Reduce brush size
        if (brushSize > 1) {
            brushSize -= 1;
            brushSizeSliderX = (brushSize * 2) + 30;
        }
    } else if (key.toString() === 'Z' || key.toString() === 'z') {
        // Undo
        if (brushType === "quad") {
            if (points.length > 0) {
                undonePoints.push(points.pop());
            } else if (drawings.length > 0 && drawings[drawings.length - 1] instanceof QuadConstructor) {
                // Undo last point
                var poppedDrawing = drawings.pop();
                var tempPoints = poppedDrawing.points;
                var undonePoint = tempPoints.pop();
                points = tempPoints;
                undonePoints.push(undonePoint);
                undoneDrawings.push(poppedDrawing);
            }
        } else if (drawings.length > 0) {
            if (drawings.length > 0 && drawings[drawings.length - 1] instanceof QuadConstructor) {
                // Undo last point
                var poppedDrawing = drawings.pop();
                var tempPoints = poppedDrawing.points;
                var undonePoint = tempPoints.pop();
                points = tempPoints;
                undonePoints.push(undonePoint);
                undoneDrawings.push(poppedDrawing);
                brushType = "quad";
                pointMode = true;
            } else {
                undoneDrawings.push(drawings.pop());
            }
        }
    } else if (key.toString === 'X' || key.toString() === 'x') {
        // Redo
        if (brushType === "quad") {
            if (undonePoints.length > 0) {
                if (undoneDrawings[undoneDrawings.length - 1] instanceof QuadConstructor) {
                    // Redo last point
                    drawings.push(undoneDrawings.pop());
                } else {
                    points.push(undonePoints.pop());
                }
            }
        } else if (undoneDrawings.length > 0) {
            drawings.push(undoneDrawings.pop());
        }
    } else if (key.code === 10) {
        if (brushType === "quad") {
            points.push(new PVector(mx, my));
            var quadData = {
                points: points,
                fillColour: brushColor,
                stroke: ((enableStroke === true || points.length <= 2) ? true : false),
                strokeWeight: (points.length <= 2 ? 1.0 : brushSize)
            };
            drawings.push(new QuadConstructor(quadData));
            points = [];
        }
    }
};

mouseMoved = function() {
    for (var i = 0; i < tooltips.length; i++) {
        tooltips[i].drawTooltip();
    }
};