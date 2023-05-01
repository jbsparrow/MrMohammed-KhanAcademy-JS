// https://www.khanacademy.org/computer-programming/paint-app/5833968965697536
frameRate(9e+18);


var drawings = [];
var clearedCanvases = [];
var undoneDrawings = [];
var currentDrawing = [];
var currentTempDrawing = [];
var points = [];
var undonePoints = [];
var temporaryPoints = [];
var buttons = [];
var tooltips = [];

var r = 0;
var g = 209;
var b = 207;
var a = 86.7;
var brushSize = 10;
var brushType = "round";
var enableStroke = false;

var allowDrawing = false;
var shiftPressed = false;
var ctrlPressed = false;
var pointMode = false;
var help = false;
var hideCursor = false;


var brushColor = color(r, g, b, a);


var enableRedSlider = false;
var enableGreenSlider = false;
var enableBlueSlider = false;
var enableAlphaSlider = false;
var enableBrushSizeSlider = false;


var redSliderX = round(map(r, 0, 255, 30, 130)); // min 30 max 130
var greenSliderX = round(map(g, 0, 255, 150, 250)); // min 150 max 250
var blueSliderX = round(map(b, 0, 255, 270, 370)); // min 270 max 370
var alphaSliderY = round(map(a, 0, 255, 260, 360)); // min 260 max 360
var brushSizeSliderX = round(map(brushSize, 1, 50, 30, 130)); // min 30 max 130

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
    this.boxOffsetX = config.boxOffsetX || 0;
    this.boxOffsetY = config.boxOffsetY || 0;
    this.textBoxWidth = config.textBoxWidth || config.width;
    this.textBoxHeight = config.textBoxHeight || config.height;
    this.text = config.text;
    this.monitorSlider = config.monitorSlider || "none";
    this.textOffsetX = config.textOffsetX || 0;
    this.textOffsetY = config.textOffsetY || 0;
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
    this.preview = config.preview || false;
    this.drawOverHelp = config.drawOverHelp || false;
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
        this.hoverStart = 0;
        return false;
    }
};


Tooltip.prototype.drawTooltip = function() {
    if (millis() - this.hoverStart >= this.hoverTime && this.hoverStart !== 0) {
        fill(this.backgroundColour);
        stroke(this.outlineColour);
        strokeWeight(this.outlineWeight);
        // rect(this.x + this.boxOffsetX, this.y + this.boxOffsetY, this.textBoxWidth, this.textBoxHeight, this.bevel);
        var constrainedX = mouseX;
        if (mouseX + this.boxOffsetX + this.textBoxWidth >= 400) {
            constrainedX = mouseX - ((mouseX + this.boxOffsetX + this.textBoxWidth) - (400 - this.outlineWeight));
        }
        rect(constrainedX + this.boxOffsetX, mouseY + this.boxOffsetY, this.textBoxWidth, this.textBoxHeight, this.bevel);
        fill(this.textColour);
        textFont(this.textFont);
        textSize(this.textSize);
        // text(this.text, this.x + this.boxOffsetX + 5 + this.textOffsetX, this.y + this.boxOffsetY + 15 + this.textOffsetY);
        if (this.monitorSlider === "none") {
            text(this.text, constrainedX + 5 + this.textOffsetX + this.boxOffsetX, mouseY + 15 + this.textOffsetY + this.boxOffsetY);
        } else if (this.monitorSlider === "red") {
            var tooltipText = "Red: " + r.toString();
            text(tooltipText, constrainedX + 5 + this.textOffsetX + this.boxOffsetX, mouseY + 15 + this.textOffsetY + this.boxOffsetY);
        } else if (this.monitorSlider === "green") {
            var tooltipText = "Green: " + g.toString();
            text(tooltipText, constrainedX + 5 + this.textOffsetX + this.boxOffsetX, mouseY + 15 + this.textOffsetY + this.boxOffsetY);
        } else if (this.monitorSlider === "blue") {
            var tooltipText = "Blue: " + b.toString();
            text(tooltipText, constrainedX + 5 + this.textOffsetX + this.boxOffsetX, mouseY + 15 + this.textOffsetY + this.boxOffsetY);
        } else if (this.monitorSlider === "alpha") {
            var mappedAlpha = map(a, 0, 255, 0, 100);
            var tooltipText = "Opacity: " + round(mappedAlpha).toString() + "%";
            text(tooltipText, constrainedX + 5 + this.textOffsetX + this.boxOffsetX, mouseY + 15 + this.textOffsetY + this.boxOffsetY);
        } else if (this.monitorSlider === "brushSize") {
            var tooltipText = "Brush Size: " + brushSize.toString();
            text(tooltipText, constrainedX + 5 + this.textOffsetX + this.boxOffsetX, mouseY + 15 + this.textOffsetY + this.boxOffsetY);
        }
    }
    if (this.preview === true) {
        var constrainedX1 = mouseX;
        if (mouseX + this.boxOffsetX + this.textBoxWidth >= 400) {
            constrainedX1 = mouseX - ((mouseX + this.boxOffsetX + this.textBoxWidth) - (400 - this.outlineWeight));
        }
        var constrainedX = constrain(constrainedX1, 55, 365);
        var constrainedY = constrain(mouseY, 61, 333);
        fill(this.backgroundColour);
        stroke(this.outlineColour);
        strokeWeight(this.outlineWeight);
        // rect(this.x + this.boxOffsetX, this.y + this.boxOffsetY, this.textBoxWidth, this.textBoxHeight, this.bevel);
        rect(constrainedX + this.boxOffsetX, constrainedY + this.boxOffsetY, this.textBoxWidth, this.textBoxHeight, this.bevel);
        fill(this.textColour);
        textFont(this.textFont);
        textSize(this.textSize);
        // text(this.text, this.x + this.boxOffsetX + 5 + this.textOffsetX, this.y + this.boxOffsetY + 15 + this.textOffsetY);
        if (this.monitorSlider === "none") {
            text(this.text, constrainedX + 5 + this.textOffsetX + this.boxOffsetX, constrainedY + 15 + this.textOffsetY + this.boxOffsetY);
        } else if (this.monitorSlider === "red") {
            var tooltipText = "Red: " + r.toString();
            text(tooltipText, constrainedX + 5 + this.textOffsetX + this.boxOffsetX, constrainedY + 15 + this.textOffsetY + this.boxOffsetY);
        } else if (this.monitorSlider === "green") {
            var tooltipText = "Green: " + g.toString();
            text(tooltipText, constrainedX + 5 + this.textOffsetX + this.boxOffsetX, constrainedY + 15 + this.textOffsetY + this.boxOffsetY);
        } else if (this.monitorSlider === "blue") {
            var tooltipText = "Blue: " + b.toString();
            text(tooltipText, constrainedX + 5 + this.textOffsetX + this.boxOffsetX, constrainedY + 15 + this.textOffsetY + this.boxOffsetY);
        } else if (this.monitorSlider === "alpha") {
            var mappedAlpha = map(a, 0, 255, 0, 100);
            var tooltipText = "Opacity: " + round(mappedAlpha).toString() + "%";
            text(tooltipText, constrainedX + 5 + this.textOffsetX + this.boxOffsetX, constrainedY + 15 + this.textOffsetY + this.boxOffsetY);
        } else if (this.monitorSlider === "brushSize") {
            var tooltipText = "Brush Size: " + brushSize.toString();
            text(tooltipText, constrainedX + 5 + this.textOffsetX + this.boxOffsetX, constrainedY + 15 + this.textOffsetY + this.boxOffsetY);
        }

        fill(88, 0, 0, 200);
        rect(this.x, this.y, this.width, this.height);
    }
};

var redSliderTooltip = new Tooltip({
    x: 26,
    y: 365,
    width: 107,
    height: 20,
    text: "Red",
    monitorSlider: "red",
    hoverTime: 1250,
    boxOffsetX: 0,
    boxOffsetY: -26,
    textBoxWidth: 59,
    preview: false,
});
tooltips.push(redSliderTooltip);

var greenSliderTooltip = new Tooltip({
    x: 146,
    y: 365,
    width: 107,
    height: 20,
    text: "Green",
    monitorSlider: "green",
    hoverTime: 1250,
    boxOffsetX: 0,
    boxOffsetY: -26,
    textBoxWidth: 71,
    preview: false,
});
tooltips.push(greenSliderTooltip);

var blueSliderTooltip = new Tooltip({
    x: 267,
    y: 365,
    width: 107,
    height: 20,
    text: "Blue",
    monitorSlider: "blue",
    hoverTime: 1250,
    boxOffsetX: 0,
    boxOffsetY: -26,
    textBoxWidth: 61,
    preview: false,
});
tooltips.push(blueSliderTooltip);

var alphaSliderTooltip = new Tooltip({
    x: 2,
    y: 257,
    width: 20,
    height: 108,
    text: "Alpha",
    monitorSlider: "alpha",
    hoverTime: 1250,
    boxOffsetX: 0,
    boxOffsetY: -26,
    textBoxWidth: 86,
    textBoxHeight: 20,
    textOffsetX: 0,
    textOffsetY: 0,
    preview: false,
});
tooltips.push(alphaSliderTooltip);

var colourPickerPreviewTooltip = new Tooltip({
    x: 5,
    y: 367,
    width: 14,
    height: 14,
    text: "Colour selector preview",
    hoverTime: 1250,
    boxOffsetX: 0,
    boxOffsetY: -26,
    textBoxWidth: 134,
    textBoxHeight: 16,
    textOffsetX: 0,
    textOffsetY: -2,
    preview: false,
});
tooltips.push(colourPickerPreviewTooltip);

var brushSizeSliderTooltip = new Tooltip({
    x: 27,
    y: 8,
    width: 107,
    height: 20,
    text: "Brush Size",
    monitorSlider: "brushSize",
    hoverTime: 1250,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 87,
    preview: false,
});
tooltips.push(brushSizeSliderTooltip);

var strokeButtonTooltip = new Tooltip({
    x: 275,
    y: 11,
    width: 18,
    height: 16,
    text: "Outline",
    hoverTime: 1250,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 47,
    textOffsetY: -2,
    preview: false,
});
tooltips.push(strokeButtonTooltip);

var customShapeTooltip = new Tooltip({
    x: 301,
    y: 10,
    width: 25,
    height: 18,
    text: "Custom Shape",
    hoverTime: 1250,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 88,
    textOffsetY: -1,
    preview: false,
});
tooltips.push(customShapeTooltip);

var lineBrushTooltip = new Tooltip({
    x: 329,
    y: 10,
    width: 14,
    height: 17,
    text: "Line Tool",
    hoverTime: 1250,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 57,
    textOffsetY: -2,
    preview: false,
});
tooltips.push(lineBrushTooltip);

var ellipseBrushTooltip = new Tooltip({
    x: 346,
    y: 10,
    width: 17,
    height: 17,
    text: "Round brush",
    hoverTime: 1250,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 78,
    textOffsetY: -2,
    preview: false,
});
tooltips.push(ellipseBrushTooltip);

var squareBrushTooltip = new Tooltip({
    x: 365,
    y: 10,
    width: 17,
    height: 17,
    text: "Square brush",
    hoverTime: 1250,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 82,
    textOffsetY: -2,
    preview: false,
});
tooltips.push(squareBrushTooltip);

var helpButtonTooltip = new Tooltip({
    x: 5,
    y: 10,
    width: 16,
    height: 16,
    text: "Help",
    hoverTime: 1250,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 34,
    textOffsetY: -2,
    preview: false,
});
tooltips.push(helpButtonTooltip);


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

var helpButtonData = {
    x: 5,
    y: 10,
    width: 16,
    height: 16,
    fill: false,
    stroke: true,
    shape: 'square',
    bevel: 5,
    strokeColour: color(0, 0, 0),
    onClick: function() {
        help = !help;
    }
};
buttons.push(new Button(helpButtonData));


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


    if (help === false) {
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

        if (hideCursor === false) {
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
                        strokeWeight(brushSize);
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
        }
    } else {
        fill(0, 0, 0);
        text("Hover over buttons to see what they do", 40, 55);

        text("Keyboard Shortcuts:", 40, 80);
        text("Z: Undo", 40, 100);
        text("X: Redo", 40, 120);
        text("Enter: Finish custom shape", 40, 140);
        text("Shift: Horizontal line", 40, 160);
        text("Ctrl: Vertical line", 40, 180);
        text("Shift + C: Clear canvas", 40, 200);
    }

    strokeWeight(1.0);
    stroke(0, 0, 0);
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

    // Help Button
    fill(0, 0, 0);
    if (help === false) {
        text("?", 10, 23);
    } else {
        text("X", 10, 23);
    }
    for (var i = 0; i < tooltips.length; i++) {
        tooltips[i].drawTooltip();
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
    } else if ((mouseInCanvas() || allowDrawing) && help === false) {
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


    r = round(map(redSliderX, 30, 130, 0, 255));
    g = round(map(greenSliderX, 150, 250, 0, 255));
    b = round(map(blueSliderX, 270, 370, 0, 255));
    a = round(map(alphaSliderY, 260, 360, 0, 255));
    brushSize = round(map(brushSizeSliderX, 30, 130, 1, 50));
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


    if (mouseInCanvas() && help === false) {
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
    } else if ((key.toString() === 'Z' || key.toString() === 'z') && help === false) {
        // Undo
        if (clearedCanvases.length > 0 && drawings.length === 0) {
            drawings = clearedCanvases.pop();
        } else if (brushType === "quad") {
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
    } else if ((key.toString === 'X' || key.toString() === 'x') && help === false) {
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
    } else if (key.code === 10 && help === false) {
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
    } else if ((key.toString() === 'C' || key.toString() === 'c') && shiftPressed === true && help === false) {
        // Clear Canvas
        clearedCanvases.push(drawings);
        drawings = [];
        points = [];
        undoneDrawings = [];
        undonePoints = [];
    } else if ((key.toString() === 'M' || key.toString() === 'm') && shiftPressed === true && help === false) {
        drawings = [];
        points = [];
        undoneDrawings = [];
        undonePoints = [];
        drawings.push(new QuadConstructor({
            points: [new PVector(271, 98), new PVector(320, 238), new PVector(117, 254)],
            fillColour: -6893213,
            stroke: false,
            strokeWeight: 10
        }));
        drawings.push(new QuadConstructor({
            points: [new PVector(66, 321), new PVector(219, 321), new PVector(139, 154)],
            fillColour: 1888932195,
            stroke: false,
            strokeWeight: 10
        }));
        drawings.push(new QuadConstructor({
            points: [new PVector(357, 284), new PVector(266, 326), new PVector(168, 96)],
            fillColour: 1879048291,
            stroke: false,
            strokeWeight: 10
        }));
        drawings.push(new QuadConstructor({
            points: [new PVector(68, 166), new PVector(74, 329), new PVector(361, 170)],
            fillColour: 1895759971,
            stroke: false,
            strokeWeight: 10
        }));
        drawings.push(new QuadConstructor({
            points: [new PVector(130, 73), new PVector(309, 73), new PVector(204, 337)],
            fillColour: 1895807587,
            stroke: false,
            strokeWeight: 10
        }));
        hideCursor = true;
    }
};

mouseMoved = function() {
    for (var i = 0; i < tooltips.length; i++) {
        tooltips[i].isHovering();
    }
};