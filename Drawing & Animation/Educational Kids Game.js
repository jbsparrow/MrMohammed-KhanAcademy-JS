// Width: 600
// Height: 600

imageMode(CENTER);
strokeCap(ROUND);
var buttons = [];
var targetShapes = [];
var shapeBeingDragged;
var shapeDragged = false;
var gameState = 0;

var nodeColor;
var edgeColor;

colorMode(HSB);
edgeColor = color(random(0, 255), random(100, 255), 255);
nodeColor = color(0, 0, 0);
colorMode(RGB);

var nodeSize = 0;
var startTime;
var endTime;

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

var createTriangularPrism = function(x, y, z, w, h, d) {
    var nodes = [
        [x, y, z],
        [x, y + h, z],
        [x + w, y + h, z],
        [x, y, z + d],
        [x, y + h, z + d],
        [x + w, y + h, z + d]
    ];
    var edges = [
        [0, 1],
        [1, 2],
        [2, 0],
        [3, 4],
        [4, 5],
        [5, 3],
        [0, 3],
        [1, 4],
        [2, 5]
    ];
    return { 'nodes': nodes, 'edges': edges };
};

var createPyramid = function(x, y, z, w, h, d) {
    var nodes = [
        [x, y, z],
        [x + w, y, z],
        [x + w / 2, y + h, z],
        [x + w / 2, y, z + d]
    ];
    var edges = [
        [0, 1],
        [1, 2],
        [2, 0],
        [3, 0],
        [3, 1],
        [3, 2]
    ];
    return { 'nodes': nodes, 'edges': edges };
};


var shapes = [];
var gridSize = 30; // Define the size of the grid cells

// Iterate over a grid on the canvas
for (var x = 0; x < 600; x += gridSize) {
    for (var y = 0; y < 600; y += gridSize) {
        // Randomly choose between creating a cuboid, a triangular prism, or a pyramid
        var rand = floor(random(0, 3));
        if (rand === 0) {
            shapes.push([createCuboid(x, y, 0, gridSize, gridSize, gridSize)]);
            shapes.push([createCuboid(-x, -y, 0, gridSize, gridSize, gridSize)]);
            shapes.push([createCuboid(x, -y, 0, gridSize, gridSize, gridSize)]);
            shapes.push([createCuboid(-x, y, 0, gridSize, gridSize, gridSize)]);
        } else if (rand === 1) {
            shapes.push([createTriangularPrism(x, y, 0, gridSize, gridSize, gridSize)]);
            shapes.push([createTriangularPrism(-x, -y, 0, gridSize, gridSize, gridSize)]);
            shapes.push([createTriangularPrism(x, -y, 0, gridSize, gridSize, gridSize)]);
            shapes.push([createTriangularPrism(-x, y, 0, gridSize, gridSize, gridSize)]);
        } else if (rand === 2) {
            shapes.push([createPyramid(x, y, 0, gridSize, gridSize, gridSize)]);
            shapes.push([createPyramid(-x, -y, 0, gridSize, gridSize, gridSize)]);
            shapes.push([createPyramid(x, -y, 0, gridSize, gridSize, gridSize)]);
            shapes.push([createPyramid(-x, y, 0, gridSize, gridSize, gridSize)]);
        }
    }
}


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
            var intersectX = (vertex2_x - vertex1_x) * (mouse_Y - vertex1_y) / (vertex2_y - vertex1_y) + vertex1_x;
            if (mouse_X < intersectX) { // if mouse is to the left of the intersection point
                mouseintersect = !mouseintersect;
                // This works by checking if the mouse has crossed the line between the two vertices an odd number of times. If it has, it is inside the shape.
            }
        }
    }
    return mouseintersect;
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
    this.fill = config.fill || color(255, 255, 255, 255);
    this.currentFill = config.currentFill || config.fill;
    this.stroke = config.stroke || color(0, 0, 0, 0);
    this.strokeWeight = config.strokeWeight || 1;

    this.relatedShape = config.relatedShape;
    this.snapDistance = config.hoverDistance || 50;
    this.shapeComplete = config.shapeComplete || false;

    this.onClick = config.onClick || function() {};
    this.onHover = config.onHover || function() {
        // debug('hover');
        this.currentFill = lerpColor(this.fill, color(255, 255, 255, 0), 0.1);
        return distanceFromShapeCenters(this, targetShapes[this.relatedShape]);
    };
    this.onHoverEnd = config.onHoverEnd || function() {
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
    this.fill = config.fill || color(255, 255, 255, 255);
    this.currentFill = config.currentFill || color(255, 255, 255, 255);
    this.stroke = config.stroke || color(0, 0, 0, 0);
    this.strokeWeight = config.strokeWeight || 1;

    this.relatedShape = config.relatedShape;
    this.shapeComplete = config.shapeComplete || false;

    this.onClick = config.onClick || function() {};
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
    translation: new PVector(-100, 182),
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
    translation: new PVector(-76, -233),
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
    translation: new PVector(489, 212),
    scale: 1,
    rotation: 0,
    fill: color(121, 37, 199, 255),
    // Circle centered at 300, 300 with a radius of 180
    vertexes: createCircleVertices(70).cVertices,
    draggable: true,
    relatedShape: 2
});

buttons.push(b3);

var b3_target = new Target({
    translation: new PVector(83, 76),
    scale: 1,
    rotation: 0,
    fill: color(255, 255, 255, 255),
    vertexes: createCircleVertices(70).cVertices,
    draggable: false,
    target: true,
    relatedShape: 2
});


targetShapes.push(b3_target);

var b4 = new Button({
    translation: new PVector(143, 125),
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
    translation: new PVector(-237, 198),
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
    if (gameState === 0 || gameState === 2) {
        for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
            var dx = (mouseX - pmouseX) / 50;
            var dy = (mouseY - pmouseY) / 50;
            var tx = shapeNum;
            for (var i = 0; i < shapes[tx].length; i++) {
                var nodes = shapes[tx][i].nodes;
                rotateY3D(dx, nodes);
                rotateX3D(dy, nodes);
            }
        }
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
    if (gameState === 1) {
        var completeCount = 0;
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].shapeComplete) {
                completeCount++;
            }
        }
        if (completeCount === buttons.length) {
            gameState = 2;
            colorMode(HSB);
            edgeColor = color(random(0, 255), random(100, 255), 255);
            nodeColor = color(0, 0, 0);
            colorMode(RGB);
            endTime = millis();
        }
    }
};


var startScreen = function() {
    pushMatrix();
    translate(300, 300);
    strokeWeight(1.0);

    var nodes, edges;

    // Draw edges
    stroke(edgeColor);

    for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
        var tx = shapeNum;
        for (var i = 0; i < shapes[tx].length; i++) {
            nodes = shapes[tx][i].nodes;
            edges = shapes[tx][i].edges;

            for (var e = 0; e < edges.length; e++) {
                var n0 = edges[e][0];
                var n1 = edges[e][1];
                var node0 = nodes[n0];
                var node1 = nodes[n1];
                line(node0[0], node0[1], node1[0], node1[1]);
            }
        }
    }

    // Draw nodes
    fill(nodeColor);
    noStroke();
    for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
        var tx = shapeNum;
        for (var i = 0; i < shapes[tx].length; i++) {
            nodes = shapes[tx][i].nodes;

            for (var n = 0; n < nodes.length; n++) {
                var node = nodes[n];
                stroke(nodeColor);
                strokeWeight(nodeSize);
                point(node[0], node[1]);
            }
        }
    }
    strokeWeight(1.0);
    popMatrix();
    textSize(45);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    stroke(0, 0, 0);
    fill(87, 87, 87, 100);
    rect(300, 100, 575, 50, 10);
    fill(235, 235, 235);
    text("Educational Matching Game", 300 + 2.5, 100 + 2);
    fill(0, 0, 0);
    text("Educational Matching Game", 300, 100);
    textSize(35);
    fill(87, 87, 87, 100);
    rect(300, 450, 200, 50, 10);
    fill(235, 235, 235);
    text("Start Game", 300 + 2.5, 450 + 2);
    fill(0, 0, 0);
    text("Start Game", 300, 450);
};


var endScreen = function() {
    pushMatrix();
    translate(300, 300);
    strokeWeight(1.0);

    var nodes, edges;

    // Draw edges
    stroke(edgeColor);

    for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
        var tx = shapeNum;
        for (var i = 0; i < shapes[tx].length; i++) {
            nodes = shapes[tx][i].nodes;
            edges = shapes[tx][i].edges;

            for (var e = 0; e < edges.length; e++) {
                var n0 = edges[e][0];
                var n1 = edges[e][1];
                var node0 = nodes[n0];
                var node1 = nodes[n1];
                line(node0[0], node0[1], node1[0], node1[1]);
            }
        }
    }

    // Draw nodes
    fill(nodeColor);
    noStroke();
    for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
        var tx = shapeNum;
        for (var i = 0; i < shapes[tx].length; i++) {
            nodes = shapes[tx][i].nodes;

            for (var n = 0; n < nodes.length; n++) {
                var node = nodes[n];
                stroke(nodeColor);
                strokeWeight(nodeSize);
                point(node[0], node[1]);
            }
        }
    }
    strokeWeight(1.0);
    popMatrix();
    textSize(45);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    var time = (endTime - startTime) / 1000;
    time = round(time * 100) / 100;
    stroke(0, 0, 0);
    fill(87, 87, 87, 100);
    rect(300, 100, 460, 50, 10);
    fill(235, 235, 235);
    text("Completed in " + time + "s", 300 + 2.5, 100 + 2);
    fill(0, 0, 0);
    text("Completed in " + time + "s", 300, 100);
    textSize(35);
    fill(87, 87, 87, 100);
    rect(300, 450, 158, 50, 10);
    fill(235, 235, 235);
    text("Restart", 300 + 2.5, 450 + 2);
    fill(0, 0, 0);
    text("Restart", 300, 450);
};


draw = function() {
    background(255, 255, 255);
    if (gameState === 0) {
        startScreen();
    } else if (gameState === 1) {
        for (var i = 0; i < buttons.length; i++) {
            targetShapes[i].draw();
            buttons[i].draw();
        }
    } else if (gameState === 2) {
        endScreen();
    }
};

mouseClicked = function() {
    if (gameState === 0) {
        if (mouseInShape([new PVector(300 - 100, 450 - 25), new PVector(300 + 100, 450 - 25), new PVector(300 + 100, 450 + 25), new PVector(300 - 100, 450 + 25)])) {
            gameState = 1;
            startTime = millis();
        }
    } else if (gameState === 2) {
        if (mouseInShape([new PVector(300 - 79, 450 - 25), new PVector(300 + 79, 450 - 25), new PVector(300 + 79, 450 + 25), new PVector(300 - 79, 450 + 25)])) {
            Program.restart();
        }
    }
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