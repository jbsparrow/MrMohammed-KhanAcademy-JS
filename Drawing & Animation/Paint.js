// https://www.khanacademy.org/computer-programming/paint-app/5833968965697536
frameRate(9e+18); // Set the framerate to a very high number to make drawing faster.
// The maximum framerate isn't listed but it is between 60-120 fps.


// Define start variables
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


// Define starting values for drawing related variables
var r = 0;
var g = 209;
var b = 207;
var a = 86.7;
var brushColor = color(r, g, b, a);
var brushSize = 10;
var brushType = "round";
var enableStroke = false;


var allowDrawing = false;
var shiftPressed = false;
var ctrlPressed = false;
var pointMode = false;
var help = false;
var hideCursor = false;


// Define slider variables
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


// Define mouse variables
var mx = 200;
var my = 200;
var cached_mx_value = 200;
var cached_my_value = 200;
var mx_cached = false;
var my_cached = false;


// Define the drawing class (Only used for square and circular brushes)
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

// Display the drawing
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


// Define the point class
var Point = function(config) {
    this.x = config.x;
    this.y = config.y;
    this.size = config.size;
};

// Draw the point
Point.prototype.draw = function() {
    fill(brushColor);
    stroke(brushColor);
    strokeWeight(brushSize);

    ellipse(this.x, this.y, brushSize, brushSize);
};


// Define the line class
var LineConstructor = function(config) {
    this.x1 = config.x1;
    this.y1 = config.y1;
    this.x2 = config.x2;
    this.y2 = config.y2;
    this.size = config.size || 1.0;
    this.colour = config.colour;
};

// Draw the line
LineConstructor.prototype.draw = function() {
    strokeWeight(this.size);
    stroke(this.colour);

    line(this.x1, this.y1, this.x2, this.y2);
};


// Define the custom shape class
var QuadConstructor = function(config) {
    this.points = config.points;
    this.fillColour = config.fillColour;
    this.stroke = config.stroke;
    this.strokeWeight = config.strokeWeight || 1.0;
};

// Draw the custom shape
QuadConstructor.prototype.draw = function() {
    if (this.stroke === true) {
        stroke(0, 0, 0);
    } else if (this.stroke === false) {
        noStroke();
        // If there are two or less points, temporarily force enable the stroke.
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


// Define the tooltip class
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
    this.monitorSlider = config.monitorSlider || "none"; // The slider value to appear in the tooltip
    this.textOffsetX = config.textOffsetX || 0;
    this.textOffsetY = config.textOffsetY || 0;
    this.backgroundColour = config.backgroundColour || color(88, 88, 88, 200);
    this.textColour = config.textColour || color(255, 255, 255);
    this.textSize = config.textSize || 12;
    this.textFont = config.textFont || createFont("sans-serif");
    this.outline = config.outline;
    this.outlineColour = config.outlineColour || color(0, 0, 0);
    this.outlineWeight = config.outlineWeight || 1.0;
    this.bevel = config.bevel || 6;
    this.onHover = config.onHover || function() {}; // function to run when hovering over the tooltip
    this.hoverTime = config.hoverTime || 550; // time in milliseconds before the tooltip appears
    this.hovering = false;
    this.hoverStart = 0; // millis() value when the mouse started hovering over the tooltip
};

Tooltip.prototype.isHovering = function() {
    // If the mouse is hovering over the tooltip, set the hover start time and return true.
    if (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height) {
        if (this.hovering === false) {
            this.hoverStart = millis();
            this.hovering = true;
        }
        return true;
    } else {
        // If the mouse is not hovering over the tooltip, reset the hover start time and return false.
        this.hovering = false;
        this.hoverStart = 0;
        return false;
    }
};

// Draw the tooltip
Tooltip.prototype.drawTooltip = function() {
    // Check if the mouse has been hovering for sufficient time
    if (millis() - this.hoverStart >= this.hoverTime && this.hoverStart !== 0) {
        // Draw the tooltip
        fill(this.backgroundColour);
        stroke(this.outlineColour);
        strokeWeight(this.outlineWeight);

        // Prevent the tooltip from going off the right side of the screen
        var constrainedX = mouseX;
        if (mouseX + this.boxOffsetX + this.textBoxWidth >= 400) {
            constrainedX = mouseX - ((mouseX + this.boxOffsetX + this.textBoxWidth) - (400 - this.outlineWeight));
        }
        // Draw the tooltip box
        rect(constrainedX + this.boxOffsetX, mouseY + this.boxOffsetY, this.textBoxWidth, this.textBoxHeight, this.bevel);
        fill(this.textColour);
        textFont(this.textFont);
        textSize(this.textSize);

        // Draw the tooltip text, including the slider value if applicable
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
};

// Create tooltips and add them to the tooltip array.
var redSliderTooltip = new Tooltip({
    x: 26,
    y: 365,
    width: 107,
    height: 20,
    text: "Red",
    monitorSlider: "red",
    hoverTime: 500,
    boxOffsetX: 0,
    boxOffsetY: -26,
    textBoxWidth: 59,
});
tooltips.push(redSliderTooltip);

var greenSliderTooltip = new Tooltip({
    x: 146,
    y: 365,
    width: 107,
    height: 20,
    text: "Green",
    monitorSlider: "green",
    hoverTime: 500,
    boxOffsetX: 0,
    boxOffsetY: -26,
    textBoxWidth: 71,
});
tooltips.push(greenSliderTooltip);

var blueSliderTooltip = new Tooltip({
    x: 267,
    y: 365,
    width: 107,
    height: 20,
    text: "Blue",
    monitorSlider: "blue",
    hoverTime: 500,
    boxOffsetX: 0,
    boxOffsetY: -26,
    textBoxWidth: 61,
});
tooltips.push(blueSliderTooltip);

var alphaSliderTooltip = new Tooltip({
    x: 2,
    y: 257,
    width: 20,
    height: 108,
    text: "Alpha",
    monitorSlider: "alpha",
    hoverTime: 500,
    boxOffsetX: 0,
    boxOffsetY: -26,
    textBoxWidth: 86,
    textBoxHeight: 20,
    textOffsetX: 0,
    textOffsetY: 0,
});
tooltips.push(alphaSliderTooltip);

var colourPickerPreviewTooltip = new Tooltip({
    x: 5,
    y: 367,
    width: 14,
    height: 14,
    text: "Colour selector preview",
    hoverTime: 500,
    boxOffsetX: 0,
    boxOffsetY: -26,
    textBoxWidth: 138,
    textBoxHeight: 16,
    textOffsetX: 0,
    textOffsetY: -2,
});
tooltips.push(colourPickerPreviewTooltip);

var brushSizeSliderTooltip = new Tooltip({
    x: 27,
    y: 8,
    width: 107,
    height: 20,
    text: "Brush Size",
    monitorSlider: "brushSize",
    hoverTime: 500,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 87,
});
tooltips.push(brushSizeSliderTooltip);

var strokeButtonTooltip = new Tooltip({
    x: 275,
    y: 11,
    width: 18,
    height: 16,
    text: "Outline",
    hoverTime: 500,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 47,
    textOffsetY: -2,
});
tooltips.push(strokeButtonTooltip);

var customShapeTooltip = new Tooltip({
    x: 301,
    y: 10,
    width: 25,
    height: 18,
    text: "Custom Shape",
    hoverTime: 500,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 88,
    textOffsetY: -1,
});
tooltips.push(customShapeTooltip);

var lineBrushTooltip = new Tooltip({
    x: 329,
    y: 10,
    width: 14,
    height: 17,
    text: "Line Tool",
    hoverTime: 500,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 57,
    textOffsetY: -2,
});
tooltips.push(lineBrushTooltip);

var ellipseBrushTooltip = new Tooltip({
    x: 346,
    y: 10,
    width: 17,
    height: 17,
    text: "Round brush",
    hoverTime: 500,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 78,
    textOffsetY: -2,
});
tooltips.push(ellipseBrushTooltip);

var squareBrushTooltip = new Tooltip({
    x: 365,
    y: 10,
    width: 17,
    height: 17,
    text: "Square brush",
    hoverTime: 500,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 82,
    textOffsetY: -2,
});
tooltips.push(squareBrushTooltip);

var helpButtonTooltip = new Tooltip({
    x: 5,
    y: 10,
    width: 16,
    height: 16,
    text: "Help",
    hoverTime: 500,
    boxOffsetX: 0,
    boxOffsetY: 16,
    textBoxWidth: 34,
    textOffsetY: -2,
    bevel: 5,
});
tooltips.push(helpButtonTooltip);
// End of tooltips


// Define button class
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
    this.updateFill = config.updateFill || function() {}; // updateFill is used to draw a background for the button, indicating that the button is active.
};

Button.prototype.draw = function() {
    // Draw button
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
    // Check if the mouse is inside the button
    return (mouseX >= this.x &&
        mouseX <= (this.x + this.width) &&
        mouseY >= this.y &&
        mouseY <= (this.y + this.height));
};

Button.prototype.handleMouseClick = function() {
    // Handle mouse click
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

// Define buttons and add them to the buttons array
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
// End of buttons


var mouseInCanvas = function() { // Check if mouse is in canvas
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
            // Iterate through drawings array and draw each item.
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
        // Use cached values if shift or ctrl is pressed to restrict mouse movement to only one axis
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

        if (hideCursor === false) { // hideCursor is only true if the program is in preview mode (Shift+M)
            if (pointMode === true) {
                if (brushType === "line") {
                    // Draw line preview from first point to mouse position
                    strokeWeight(brushSize);
                    stroke(brushColor);
                    fill(brushColor);
                    if (points.length === 0) { // If no points, draw a point at mouse position
                        line(mx, my, mx, my);
                    } else if (points.length === 1) {
                        line(points[0].x, points[0].y, mx, my);
                    }
                } else if (brushType === "quad") {
                    // Draw quad preview
                    if (points.length === 0) { // Draw a point at mouse position if no points exist
                        stroke(brushColor);
                        strokeWeight(brushSize);
                        point(mx, my);
                    } else {
                        // Create a temporary array to store the points array and add the mouse position to it
                        var tempPoints = [];
                        for (var i = 0; i < points.length; i++) {
                            tempPoints.push(points[i]);
                        }
                        tempPoints.push(new PVector(mx, my));
                        // Create a new QuadConstructor object and draw it
                        var quadData = {
                            points: tempPoints,
                            fillColour: brushColor,
                            // Temporarily enable stroke if there is two or less points so that the user can see what they are drawing.
                            stroke: ((enableStroke === true || tempPoints.length <= 2) ? true : false),
                            strokeWeight: (tempPoints.length <= 2 ? 3.0 : brushSize)
                        };
                        new QuadConstructor(quadData).draw();
                    }
                }
                strokeWeight(1.0);
                stroke(0, 0, 0);
            } else { // If pointMode is false, draw a simple shape preview for the brush.
                if (!enableStroke) {
                    noStroke();
                }
                fill(brushColor);
                // Draw the shape that corresponds to the selected brush type.
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
        text("+ / -: Increase/Decrease brush size", 40, 220);
    }


    // Draw outside of canvas to prevent drawings overlapping the UI
    noStroke();
    fill(237, 237, 237);
    rect(-1, -1, 401, 36);
    rect(-1, -1, 30, 401);
    rect(29, 359, 371, 48);
    rect(391, 35, 9, 401);
    stroke(0, 0, 0);
    strokeWeight(2.0);
    noFill();
    // Redraw canvas to clarify the border and prevent drawings from overlapping it.
    rect(30, 36, 360, 322);

    // Draw slider lines
    strokeWeight(1.0);
    stroke(0, 0, 0);
    fill(255, 255, 255);
    line(30, 375, 130, 375); // Red Slider Line
    line(150, 375, 250, 375); // Green Slider Line
    line(270, 375, 370, 375); // Blue Slider Line
    line(12, 360, 12, 260); // Alpha/Opacity Slider Line

    // Draw slider handles and fill them corresponding to the colour they control
    fill(255, 0, 0);
    ellipse(redSliderX, 375, 5, 5);
    fill(0, 255, 0);
    ellipse(greenSliderX, 375, 5, 5);
    fill(0, 0, 255);
    ellipse(blueSliderX, 375, 5, 5);
    fill(255, 255, 255);
    ellipse(12, alphaSliderY, 5, 5);

    // Draw brush colour preview
    fill(brushColor);
    rect(6, 368, 12, 12);

    // Brush size selector
    fill(255, 255, 255);
    line(30, 18, 130, 18);
    ellipse(brushSizeSliderX, 18, 5, 5);


    // Iterate through button list and draw all buttons.
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].updateFill();
        buttons[i].draw();
    }

    // Draw drawing mode buttons
    stroke(0, 0, 0);
    fill(brushColor);
    ellipse(355, 19, 12, 12); // Round brush drawing mode button
    rect(367, 13, 12, 12); // Square brush drawing mode button
    line(332, 24, 340, 13); // LineConstructor drawing mode button
    quad(304, 25, 309, 13, 319, 13, 324, 25); // Quadrilateral drawing mode button

    // Draw outline button
    fill(255, 255, 255);
    rect(278, 13, 12, 12);


    // Draw help button
    fill(0, 0, 0);
    if (help === false) { // If help is disabled, draw a question mark
        text("?", 10, 23);
    } else {
        text("X", 10, 23);
    }
    // Iterate through tooltips and draw them. Tooltips are drawn last so that they overlap all other elements.
    for (var i = 0; i < tooltips.length; i++) {
        tooltips[i].drawTooltip();
    }
};


mousePressed = function() {
    // Check if mouse is down on a slider handle, if it is, enable that slider.
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
        // If the mouse is originally pressed down inside the canvas, the allowDrawing variable is set to true.
        // This allows the user to drag the mouse outside of the canvas whilst still drawing inside of it.
        allowDrawing = true;
    }
};


mouseDragged = function() {
    // If the mouse is dragged on an enabled slider, update the slider position and corresponding value.
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
        // If the mouse is dragged inside the canvas, draw a new brush stroke.
        if (drawings[drawings.length - 1] === currentDrawing) {
            // If the current drawing is identical to the latest drawing in the drawings array, update it.
            drawings.pop();
        }
        // Create drawing object and add it to the current drawing array.
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

    // Update brush colour and size variables based on slider positions.
    r = round(map(redSliderX, 30, 130, 0, 255));
    g = round(map(greenSliderX, 150, 250, 0, 255));
    b = round(map(blueSliderX, 270, 370, 0, 255));
    a = round(map(alphaSliderY, 260, 360, 0, 255));
    brushSize = round(map(brushSizeSliderX, 30, 130, 1, 50));
    brushColor = color(r, g, b, a);
};


mouseReleased = function() {
    // When the mouse is released, disable all sliders, clear the currentDrawing array, and disable drawing.
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
    // Iterate through all buttons, calling their handleMouseClick function and updateFill function.
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].handleMouseClick();
    }
    // Iterate through updateFill function last so that the buttons are updated after all have had their clicks checked first.
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].updateFill();
    }

    // If the mouse is clicked inside the canvas, draw a new singular stroke.
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
            // If the brush type is line, create a new point object and add it to the points array.
            var pointData = {
                x: mx,
                y: my,
                size: brushSize,
            };
            points.push(new Point(pointData));
            if (points.length === 2) {
                // If the points array has two points in it, create a new line object and add it to the drawings array.
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
            // If the brush type is quad, create a new point object and add it to the points array.
            points.push(new PVector(mx, my));
        }
    }
};


keyPressed = function() {
    if (keyCode === SHIFT) {
        // If the shift key is pressed, enable the shiftPressed variable and cache the current mouse Y position.
        shiftPressed = true;
        if (my_cached === false && mouseInCanvas()) {
            cached_my_value = mouseY;
            my_cached = true;
        }
    } else if (keyCode === CONTROL) {
        // If the control key is pressed, enable the ctrlPressed variable and cache the current mouse X position.
        ctrlPressed = true;
        if (mx_cached === false && mouseInCanvas()) {
            cached_mx_value = mouseX;
            mx_cached = true;
        }
    }
};


keyReleased = function() {
    // When either the shift or control keys are released, reset the cached mouse X and Y positions and disable the shiftPressed and ctrlPressed variables.
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
        // Increase brush size when the +/= key is pressed.
        if (brushSize < 50) {
            brushSize += 1;
            // Update the brushSizeSliderX variable to match the new brush size.
            brushSizeSliderX = map(brushSize, 1, 50, 30, 130);
        }
    } else if (key.toString() === '-') {
        // Decrease brush size when the -/_ key is pressed.
        if (brushSize > 1) {
            brushSize -= 1;
            // Update the brushSizeSliderX variable to match the new brush size.
            brushSizeSliderX = map(brushSize, 1, 50, 30, 130);
        }
    } else if ((key.toString() === 'Z' || key.toString() === 'z') && help === false) {
        // Undo
        if (clearedCanvases.length > 0 && drawings.length === 0) {
            // If the clearedCanvases array has canvases in it, pop the last canvas and push it to the drawings array.
            drawings = clearedCanvases.pop();
        } else if (brushType === "quad") {
            // If the brush type is quad, undo the last point in the points array.
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
            // If the drawings array has drawings in it, pop the last drawing and push it to the undoneDrawings array.
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
            // If the brush type is quad, redo the last point in the undonePoints array.
            if (undonePoints.length > 0) {
                if (undoneDrawings[undoneDrawings.length - 1] instanceof QuadConstructor) {
                    // Redo last drawing
                    drawings.push(undoneDrawings.pop());
                } else {
                    // Redo last point
                    points.push(undonePoints.pop());
                }
            }
        } else if (undoneDrawings.length > 0) {
            // If the drawing is something other than a quad, redo the last drawing normally.
            drawings.push(undoneDrawings.pop());
        }
    } else if (key.code === 10 && help === false) {
        // If the enter key is pressed and the brush is set to quad, complete the quad drawing at the current mouse position.
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
        // Clear the canvas when the user presses Shift+C.
        // Add the current drawings to the clearedCanvases array and reset the drawings and points arrays.
        clearedCanvases.push(drawings);
        drawings = [];
        points = [];
        undoneDrawings = [];
        undonePoints = [];
    } else if ((key.toString() === 'M' || key.toString() === 'm') && shiftPressed === true && help === false) {
        // Enable preview mode when the user presses Shift+M.
        // This will clear all drawings and import a preset abstract drawing, then disable the cursor.
        // This is used to save time when creating the preview image for the project.
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
    // Every time the mouse is moved, iterate through all tooltips and check if the mouse is hovering over them.
    for (var i = 0; i < tooltips.length; i++) {
        tooltips[i].isHovering();
    }
};