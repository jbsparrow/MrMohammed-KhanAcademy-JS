// Width: 600
// Height: 600

imageMode(CENTER);
strokeCap(ROUND);
var buttons = [];


var mouseInShape = function(poly) {
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
        var vertex1_mouseSide = (vertex1_y > mouseY); // true if mouse is below vertex 1
        var vertex2_mouseSide = (vertex2_y > mouseY); // true if mouse is below vertex 2

        if (vertex1_mouseSide !== vertex2_mouseSide) { // if mouse is between vertexes
            var intersectX = (vertex2_x - vertex1_x) * (mouseY - vertex1_y) / (vertex2_y - vertex1_y) + vertex1_x; // (horizontal distance between vertices) * (vertical distance between vertex 1 and mouse) / (vertical distance between vertices) + (x position of vertex 1)
            if (mouseX < intersectX) { // if mouse is to the left of the intersection point
                mouseintersect = !mouseintersect;
                // This works by checking if the mouse has crossed the line between the two vertices an odd number of times. If it has, it is inside the shape.
            }
        }
    }
    return mouseintersect;
};

var Button = function(config) {
    this.translation = config.translation || new PVector(0, 0);
    this.scale = config.scale || 1;
    this.rotation = config.rotation || 0;
    this.vertexes = config.vertexes || [];
    // this.shape = config.shape || function() {};
    this.hidden = config.hidden || false;
    this.fill = config.fill || color(255, 255, 255, 0);
    this.stroke = config.stroke || color(0, 0, 0, 0);
    this.strokeWeight = config.strokeWeight || 1;
    this.onClick = config.onClick || function() {};
    this.onHover = config.onHover || function() { this.fill = color(87, 87, 87, 100); };
    this.onHoverEnd = config.onHoverEnd || function() { this.fill = color(255, 255, 255, 0); };
    this.vertexCoordinates = config.vertexCoordinates || [];

    this.debug = config.debug || false;
    this.debugVertices = config.debugVertices || [];
};

Button.prototype.draw = function() {
    pushMatrix();
    // this.shape();
    beginShape();
    fill(this.fill);
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
    for (var i = 0; i < this.vertexes.length; i++) {
        vertex(this.vertexes[i].x + this.translation.x, this.vertexes[i].y + this.translation.y);
    }
    endShape(CLOSE);
    translate(this.translation.x, this.translation.y);
    scale(this.scale);
    rotate(this.rotation);
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
                point(this.debugVertices[i].x, this.debugVertices[i].y);
                fill(60, 60, 60);
                text(this.debugVertices[i].x + ", " + this.debugVertices[i].y, this.debugVertices[i].x + 5, this.debugVertices[i].y - 5);
            }
        } else {
            for (var i = 0; i < this.vertexCoordinates.length; i++) {
                point(this.vertexCoordinates[i].x, this.vertexCoordinates[i].y);
                fill(60, 60, 60);
                text(this.vertexCoordinates[i].x + ", " + this.vertexCoordinates[i].y, this.vertexCoordinates[i].x + 5, this.vertexCoordinates[i].y - 5);
            }
        }
    }
};

var createCircleVertices = function(radius) {
    var circleVertices = [];
    var debugVertices = []; // (0deg, 45deg, 90deg, 135deg, 180deg, 225deg, 270deg, 315deg, 360deg)
    for (var i = 0; i < 360; i++) {
        var x = cos(i) * radius;
        var y = sin(i) * radius;
        circleVertices.push(new PVector(x, y));
        if (i % 45 === 0) {
            debugVertices.push(new PVector(x, y));
        }
    }
    return circleVertices, debugVertices;
};

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
    debug: true
});

buttons.push(b1);

var circularButton = new Button({
    translation: new PVector(300, 300),
    scale: 1,
    rotation: 0,
    // Circle centered at 300, 300 with a radius of 15
    vertexes: createCircleVertices(15)[0],
    debug: false,
    debugVertices: createCircleVertices(15)[1]
});

buttons.push(circularButton);



mouseMoved = function() {
    for (var i = 0; i < buttons.length; i++) {
        println(mouseInShape(buttons[i].vertexCoordinates));
        if (mouseInShape(buttons[i].vertexCoordinates)) {
            buttons[i].onHover();
        } else {
            buttons[i].onHoverEnd();
        }
    }
};

draw = function() {
    background(255, 255, 255);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].draw();
    }
};

mouseClicked = function() {
    debug(buttons[0].vertexCoordinates, buttons[0].vertexes);
};