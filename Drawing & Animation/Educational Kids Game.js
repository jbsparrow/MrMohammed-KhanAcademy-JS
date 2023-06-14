// Width: 600
// Height: 600

imageMode(CENTER);
strokeCap(ROUND);
var buttons = [];
var targetShapes = [];


var mouseInShape = function(poly, mouse_X, mouse_Y) {
    var mouseintersect = false;

    for (var i = 0; i < poly.length; i++) {
        var vertex1_y;
        var vertex1_x;
        var vertex2_x;
        var vertex2_y;
        if (i < poly.length - 1) {
            var vertex1_y = poly[i + 1].y;
            var vertex1_x = poly[i + 1].x;
            var vertex2_x = poly[i].x;
            var vertex2_y = poly[i].y;
        } else {
            var vertex1_y = poly[0].y;
            var vertex1_x = poly[0].x;
            var vertex2_x = poly[poly.length - 1].x;
            var vertex2_y = poly[poly.length - 1].y;
        }
        var vertex1_mouseSide = (vertex1_y > mouse_Y); // true if mouse is below vertex 1
        var vertex2_mouseSide = (vertex2_y > mouse_Y); // true if mouse is below vertex 2

        if (vertex1_mouseSide !== vertex2_mouseSide) { // if mouse is between vertexes
            var intersectX = (vertex2_x - vertex1_x) * (mouse_Y - vertex1_y) / (vertex2_y - vertex1_y) + vertex1_x; // (horizontal distance between vertices) * (vertical distance between vertex 1 and mouse) / (vertical distance between vertices) + (x position of vertex 1)
            if (mouse_X < intersectX) { // if mouse is to the left of the intersection point
                mouseintersect = !mouseintersect;
                // This works by checking if the mouse has crossed the line between the two vertices an odd number of times. If it has, it is inside the shape.
            }
        }
    }
    return mouseintersect;
};

var createCircleVertices = function(radius) {
    var circleVertices = [];
    var debugVertices = []; // (0deg, 45deg, 90deg, 135deg, 180deg, 225deg, 270deg, 315deg, 360deg)
    for (var i = 0; i < 360; i++) {
        var x = cos(i) * radius;
        var y = sin(i) * radius;
        circleVertices.push({ x: x, y: y });
        if (i % 45 === 0) {
            debugVertices.push({ x: x, y: y });
        }
    }
    return { cVertices: circleVertices, cdVertices: debugVertices };
};

var Button = function(config) {
    this.translation = config.translation || new PVector(0, 0);

    this.scale = config.scale || 1;
    this.rotation = config.rotation || 0;
    this.vertexes = config.vertexes || [];
    this.hidden = config.hidden || false;
    this.fill = config.fill || { r: 255, g: 255, b: 255, a: 255 };
    this.stroke = config.stroke || color(0, 0, 0, 0);
    this.strokeWeight = config.strokeWeight || 1;

    this.target = config.target || false;
    this.relatedShape = config.relatedShape;
    this.shapeComplete = config.shapeComplete || false;

    this.onClick = config.onClick || function() {};
    this.hovering = false;
    this.onHover = config.onHover || function() {
        if (!this.target) {
            this.fill = color(this.fill.r, this.fill.g, this.fill.b, this.fill.a);
        }
    };
    this.onHoverEnd = config.onHoverEnd || function() {
        if (this.target) {
            var overlap = 0;
            for (var i = 0; i < this.vertexCoordinates.length; i++) {
                if (mouseInShape(targetShapes[this.relatedShape].vertexCoordinates, this.vertexCoordinates[i].x, this.vertexCoordinates[i].y)) {
                    overlap++;
                }
            }
            if (overlap / this.vertexCoordinates.length >= 0.3) {
                this.fill = { r: 87, g: 87, b: 87, a: 100 };
            } else {
                this.fill = { r: 255, g: 255, b: 255, a: 0 };
            }
        } else {
            this.fill = { r: 255, g: 0, b: 0, a: 255 };
        }
    };
    this.vertexCoordinates = config.vertexCoordinates || [];

    this.debug = config.debug || false;
    this.debugVertices = config.debugVertices || [];
    this.draggable = config.draggable || false;
};

Button.prototype.draw = function() {
    pushMatrix();
    scale(this.scale);
    rotate(this.rotation);
    beginShape();
    fill(this.fill.r, this.fill.g, this.fill.b, this.fill.a);
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
    for (var i = 0; i < this.vertexes.length; i++) {
        vertex(this.vertexes[i].x + this.translation.x, this.vertexes[i].y + this.translation.y);
    }
    endShape(CLOSE);
    translate(this.translation.x, this.translation.y);
    popMatrix();
    if (this.vertexCoordinates.length === 0) {
        var that = this;
        this.vertexes.map(function(vertex) {
            var newVector = new PVector(vertex.x + that.translation.x, vertex.y + that.translation.y);
            that.vertexCoordinates.push(newVector);
        });
    }
    if (this.debug) {
        strokeWeight(5.0);
        stroke(0, 0, 0);
        if (this.debugVertices.length > 0) {
            for (var i = 0; i < this.debugVertices.length; i++) {
                point(this.debugVertices[i].x + this.translation.x, this.debugVertices[i].y + this.translation.y);
                fill(60, 60, 60);
                text(round(this.debugVertices[i].x * 10) / 10 + ", " + round(this.debugVertices[i].y * 10) / 10, this.debugVertices[i].x + 5 + this.translation.x, this.debugVertices[i].y - 5 + this.translation.y);
            }
        } else {
            for (var i = 0; i < this.vertexCoordinates.length; i++) {
                point(this.vertexCoordinates[i].x, this.vertexCoordinates[i].y);
                fill(60, 60, 60);
                text(round(this.vertexCoordinates[i].x * 10) / 10 + ", " + round(this.vertexCoordinates[i].y * 10) / 10, this.vertexCoordinates[i].x + 5, this.vertexCoordinates[i].y - 5);
            }
        }
    }
};

Button.prototype.updateVertices = function() {
    this.vertexCoordinates = [];
    this.vertexes.map(function(vertex) {
        var newVector = new PVector(vertex.x + this.translation.x, vertex.y + this.translation.y);
        this.vertexCoordinates.push(newVector);
    });
};

var Target = function(config) {
    this.translation = config.translation || new PVector(0, 0);

    this.scale = config.scale || 1;
    this.rotation = config.rotation || 0;
    this.vertexes = config.vertexes || [];
    this.hidden = config.hidden || false;
    this.fill = config.fill || { r: 255, g: 255, b: 255, a: 255 };
    this.stroke = config.stroke || color(0, 0, 0, 0);
    this.strokeWeight = config.strokeWeight || 1;

    this.target = config.target || false;
    this.relatedShape = config.relatedShape;
    this.shapeComplete = config.shapeComplete || false;

    this.onClick = config.onClick || function() {};
    this.hovering = false;
    this.onHover = config.onHover || function() {
        this.fill = color(this.fill.r, this.fill.g, this.fill.b, this.fill.a);
    };
    this.onHoverEnd = config.onHoverEnd || function() {
        var overlap = 0;
        for (var i = 0; i < this.vertexCoordinates.length; i++) {
            if (mouseInShape(buttons[this.relatedShape].vertexCoordinates, this.vertexCoordinates[i].x, this.vertexCoordinates[i].y)) {
                overlap++;
            }
        }
        if (overlap / this.vertexCoordinates.length >= 0.3) {
            this.fill = { r: 87, g: 87, b: 87, a: 100 };
        } else {
            this.fill = { r: 255, g: 255, b: 255, a: 0 };
        }
    };
    this.vertexCoordinates = config.vertexCoordinates || [];

    this.debug = config.debug || false;
    this.debugVertices = config.debugVertices || [];
}

var b1 = new Button({
    translation: new PVector(0, 0),
    scale: 1,
    rotation: 0,
    // Hexagon centered at (300, 300)
    vertexes: [
        new PVector(300, 300 - 100),
        new PVector(300 + 86.6, 300 - 50),
        new PVector(300 + 86.6, 300 + 50),
        new PVector(300, 300 + 100),
        new PVector(300 - 86.6, 300 + 50),
        new PVector(300 - 86.6, 300 - 50)
    ],
    debug: false,
    fill: { r: 255, g: 0, b: 0, a: 255 },
    draggable: true,
    relatedShape: 0
});

buttons.push(b1);

var b1_target = new Button({
    translation: new PVector(0, 0),
    scale: 1,
    rotation: 0,
    // Hexagon centered at (300, 300)
    vertexes: [
        new PVector(300, 300 - 100),
        new PVector(300 + 86.6, 300 - 50),
        new PVector(300 + 86.6, 300 + 50),
        new PVector(300, 300 + 100),
        new PVector(300 - 86.6, 300 + 50),
        new PVector(300 - 86.6, 300 - 50)
    ],
    debug: false,
    draggable: false,
    target: true,
    relatedShape: 0
});

targetShapes.push(b1_target);

// var vces = createCircleVertices(180);
// var circularButton = new Button({
//     translation: new PVector(300, 300),
//     scale: 1,
//     rotation: 0,
//     // Circle centered at 300, 300 with a radius of 180
//     vertexes: vces.cVertices,
//     debug: true,
//     debugVertices: vces.cdVertices,
//     draggable: true
// });

// buttons.push(circularButton);

var checkHover = function() {
    for (var i = 0; i < buttons.length; i++) {
        if (mouseInShape(buttons[i].vertexCoordinates, mouseX, mouseY)) {
            buttons[i].onHover();
        } else {
            buttons[i].onHoverEnd();
        }
    }
};



mouseMoved = function() {
    checkHover();
};

mouseReleased = function() {
    checkHover();
};


draw = function() {
    background(255, 255, 255);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].draw();
    }
};

mouseClicked = function() {
    checkHover();
};

mouseDragged = function() {
    for (var i = 0; i < buttons.length; i++) {
        if (mouseInShape(buttons[i].vertexCoordinates, mouseX, mouseY) && buttons[i].draggable) {
            // Make the shape draggable and center the drag on where the mouse was when the drag started
            buttons[i].translation = new PVector(mouseX - pmouseX + buttons[i].translation.x, mouseY - pmouseY + buttons[i].translation.y);
            buttons[i].updateVertices();
        }
    }
};