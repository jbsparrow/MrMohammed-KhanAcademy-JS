// Width: 600
// Height: 600

imageMode(CENTER);
strokeCap(ROUND);
var buttons = [];
var targetShapes = [];
var shapeBeingDragged;
var shapeDragged = false;
var gameState = 0;

var backgroundColor = color(255, 255, 255);
var nodeColor = color(40, 168, 107);
var edgeColor = color(34, 68, 204);
var nodeSize = 8;

var createCuboid = function(x, y, z, w, h, d) {
    var nodes = [
        [x, y, z],
        [x, y, z + d],
        [x, y + h, z],
        [x, y + h, z + d],
        [x + w, y, z],
        [x + w, y, z + d],
        [x + w, y + h, z],
        [x + w, y + h, z + d]
    ];
    var edges = [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0],
        [4, 5],
        [5, 7],
        [7, 6],
        [6, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7]
    ];
    return { 'nodes': nodes, 'edges': edges };
};

var shape1 = createCuboid(-120, -20, -20, 240, 40, 40);
var shape2 = createCuboid(-120, -50, -30, -20, 100, 60);
var shape3 = createCuboid(120, -50, -30, 20, 100, 60);
var shapes = [shape1, shape2, shape3];

// Rotate shape around the z-axis
var rotateZ3D = function(theta, nodes) {
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);

    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var y = node[1];
        node[0] = x * cosTheta - y * sinTheta;
        node[1] = y * cosTheta + x * sinTheta;
    }
};

var rotateX3D = function(theta, nodes) {
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);

    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var y = node[1];
        var z = node[2];
        node[1] = y * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + y * sinTheta;
    }
};

var rotateY3D = function(theta, nodes) {
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);

    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var z = node[2];
        node[0] = x * cosTheta + z * sinTheta;
        node[2] = z * cosTheta - x * sinTheta;
    }
};



var mouseInShape = function(poly, mouse_X, mouse_Y) {
    var mouseintersect = false;
    var mouse_X = mouse_X || mouseX;
    var mouse_Y = mouse_Y || mouseY;

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

var startScreen = function() {
    background(255, 255, 255);
    fill(0, 0, 0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Educational Kids Game", 300, 200);
    textSize(20);
    text("Click to start", 300, 300);
    noFill();
    stroke(0, 0, 0);
    strokeWeight(5);
    rect(150, 350, 300, 100, 10);
};

var distanceFromShapeCenters = function(shape1, shape2, threshold) {
    var threshold = threshold || undefined;
    var distance = sqrt(pow(shape1.translation.x - shape2.translation.x, 2) + pow(shape1.translation.y - shape2.translation.y, 2));
    if (threshold === undefined) {
        return distance;
    }
    return (distance < threshold);
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
    this.fill = config.fill || color(255, 255, 255, 255);
    this.currentFill = config.currentFill || config.fill;
    this.stroke = config.stroke || color(0, 0, 0, 0);
    this.strokeWeight = config.strokeWeight || 1;

    this.target = config.target || false;
    this.relatedShape = config.relatedShape;
    this.snapDistance = config.hoverDistance || 50;
    this.shapeComplete = config.shapeComplete || false;

    this.onClick = config.onClick || function() {};
    this.hovering = false;
    this.onHover = config.onHover || function() {
        // debug('hover');
        this.currentFill = lerpColor(this.fill, color(255, 255, 255, 0), 0.1);
        return distanceFromShapeCenters(this, targetShapes[this.relatedShape]);
    };
    this.onHoverEnd = config.onHoverEnd || function() {
        // debug("hover end"); // Gets called while the user is still dragging the shape.
        this.currentFill = this.fill;
        return distanceFromShapeCenters(this, targetShapes[this.relatedShape]);
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
    fill(this.currentFill);
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
    var self = this;
    this.vertexes.map(function(vertex) {
        var newVector = new PVector(vertex.x + self.translation.x, vertex.y + self.translation.y);
        self.vertexCoordinates.push(newVector);
    });
    if (self.translation === targetShapes[this.relatedShape].translation) {
        self.shapeComplete = true;
    } else {
        self.shapeComplete = false;
    }
};


var Target = function(config) {
    this.translation = config.translation || new PVector(0, 0);

    this.scale = config.scale || 1;
    this.rotation = config.rotation || 0;
    this.vertexes = config.vertexes || [];
    this.hidden = config.hidden || false;
    this.fill = config.fill || color(255, 255, 255, 255);
    this.currentFill = config.currentFill || color(255, 255, 255, 255);
    this.stroke = config.stroke || color(0, 0, 0, 0);
    this.strokeWeight = config.strokeWeight || 1;

    this.target = config.target || false;
    this.relatedShape = config.relatedShape;
    this.shapeComplete = config.shapeComplete || false;

    this.onClick = config.onClick || function() {};
    this.hovering = false;
    this.onHover = config.onHover || function() {
        var connectedButton = buttons[this.relatedShape];
        if (distanceFromShapeCenters(connectedButton, this, connectedButton.snapDistance)) {
            this.currentFill = color(87, 87, 87, 100);
        } else {
            this.currentFill = this.fill;
        }
        return distanceFromShapeCenters(buttons[this.relatedShape], this);
    };
    this.onHoverEnd = config.onHoverEnd || function() {
        var connectedButton = buttons[this.relatedShape];
        if (distanceFromShapeCenters(connectedButton, this, connectedButton.snapDistance)) {
            this.currentFill = color(87, 87, 87, 100);
        } else {
            this.currentFill = this.fill;
        }
        return distanceFromShapeCenters(buttons[this.relatedShape], this);
    };
    this.vertexCoordinates = config.vertexCoordinates || [];

    this.debug = config.debug || false;
    this.debugVertices = config.debugVertices || [];
};

Target.prototype.draw = Button.prototype.draw;


var b1 = new Button({
    translation: new PVector(250, 112),
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
    fill: color(255, 0, 0, 255),
    draggable: true,
    relatedShape: 0
});

buttons.push(b1);

var b1_target = new Target({
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

var b2 = new Button({
    translation: new PVector(250, 212),
    scale: 1,
    rotation: 0,
    vertexes: [
        new PVector(300 - 50, 300 - 50),
        new PVector(300 + 50, 300 - 50),
        new PVector(300 + 50, 300 + 50),
        new PVector(300 - 50, 300 + 50)
    ],
    debug: false,
    fill: color(0, 255, 0, 255),
    draggable: true,
    relatedShape: 1
});

buttons.push(b2);

var b2_target = new Target({
    translation: new PVector(0, 0),
    scale: 1,
    rotation: 0,
    vertexes: [
        new PVector(300 - 50, 300 - 50),
        new PVector(300 + 50, 300 - 50),
        new PVector(300 + 50, 300 + 50),
        new PVector(300 - 50, 300 + 50)
    ],
    fill: color(255, 255, 255, 255),
    relatedShape: 1,
});

targetShapes.push(b2_target);

var b3 = new Button({
    translation: new PVector(500, 212),
    scale: 1,
    rotation: 0,
    fill: color(121, 37, 199, 255),
    // Circle centered at 300, 300 with a radius of 180
    vertexes: createCircleVertices(115).cVertices,
    draggable: true,
    relatedShape: 2
});

buttons.push(b3);

var b3_target = new Target({
    translation: new PVector(0, 0),
    scale: 1,
    rotation: 0,
    fill: color(255, 255, 255, 255),
    vertexes: createCircleVertices(115).cVertices,
    draggable: false,
    target: true,
    relatedShape: 2
});


targetShapes.push(b3_target);

var b4 = new Button({
    translation: new PVector(100, 125),
    scale: 1,
    rotation: 0,
    vertexes: [
        new PVector(300, 300 - 86.602540378443864676372317075),
        new PVector(300 - 50, 300 + 86.602540378443864676372317075),
        new PVector(300 + 50, 300 + 86.602540378443864676372317075)
    ],
    debug: false,
    fill: color(0, 0, 255, 255),
    draggable: true,
    relatedShape: 3
});

buttons.push(b4);

var b4_target = new Target({
    translation: new PVector(0, 0),
    scale: 1,
    rotation: 0,
    vertexes: [
        new PVector(300, 300 - 86.602540378443864676372317075),
        new PVector(300 - 50, 300 + 86.602540378443864676372317075),
        new PVector(300 + 50, 300 + 86.602540378443864676372317075)
    ],
    fill: color(255, 255, 255, 255),
    relatedShape: 3
});

targetShapes.push(b4_target);

var checkHover = function() {
    for (var i = 0; i < buttons.length; i++) {
        if (mouseInShape(buttons[i].vertexCoordinates, pmouseX, pmouseY)) {
            targetShapes[i].onHover();
            buttons[i].onHover();
        } else {
            targetShapes[i].onHoverEnd();
            buttons[i].onHoverEnd();
        }
    }
};


mouseMoved = function() {
    checkHover();
    var dx = mouseX - pmouseX;
    var dy = mouseY - pmouseY;

    for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
        var nodes = shapes[shapeNum].nodes;
        rotateY3D(dx, nodes);
        rotateX3D(dy, nodes);
    }
};

mouseReleased = function() {
    checkHover();
    var i = 0;
    for (var i = 0; i < buttons.length; i++) {
        if (distanceFromShapeCenters(buttons[i], targetShapes[i], buttons[i].snapDistance) && buttons[i].shapeComplete === false) {
            playSound(getSound("rpg/metal-clink"));
            buttons[i].translation = new PVector(targetShapes[i].translation.x, targetShapes[i].translation.y);
            buttons[i].updateVertices();
            buttons[i].shapeComplete = true;
        }
    }
    shapeDragged = false;
};


draw = function() {
    background(255, 255, 255);
    if (gameState === 0) {
        pushMatrix();
        translate(200, 200);

        var nodes, edges;

        // Draw edges
        stroke(edgeColor);

        for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
            nodes = shapes[shapeNum].nodes;
            edges = shapes[shapeNum].edges;

            for (var e = 0; e < edges.length; e++) {
                var n0 = edges[e][0];
                var n1 = edges[e][1];
                var node0 = nodes[n0];
                var node1 = nodes[n1];
                line(node0[0], node0[1], node1[0], node1[1]);
            }
        }

        // Draw nodes
        fill(nodeColor);
        noStroke();
        for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
            nodes = shapes[shapeNum].nodes;

            for (var n = 0; n < nodes.length; n++) {
                var node = nodes[n];
                ellipse(node[0], node[1], nodeSize, nodeSize);
            }
        }

        popMatrix();
    } else if (gameState === 1) {
        for (var i = 0; i < buttons.length; i++) {
            targetShapes[i].draw();
            buttons[i].draw();
        }
    }
};

mouseClicked = function() {
    checkHover();
};

mouseDragged = function() {
    for (var i = 0; i < buttons.length; i++) {
        if (mouseInShape(buttons[i].vertexCoordinates, mouseX, mouseY) && buttons[i].draggable && (shapeBeingDragged === buttons[i] || shapeDragged === false)) {
            shapeDragged = true;
            shapeBeingDragged = buttons[i];
            // Make the shape draggable and center the drag on where the mouse was when the drag started
            buttons[i].translation = new PVector(mouseX - pmouseX + buttons[i].translation.x, mouseY - pmouseY + buttons[i].translation.y);
            buttons[i].updateVertices();
        }
    }
    checkHover();
};

debug(Button, Target);