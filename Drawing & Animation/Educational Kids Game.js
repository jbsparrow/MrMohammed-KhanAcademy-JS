// Width: 600
// Height: 600

imageMode(CENTER);
strokeCap(ROUND);
var buttons = [];


var mouseInShape = function(poly) {
    var mouseintersect = false;

    for (var i = 1, j = 0; i < poly.length; i++, j++) {
        var vertex1_x = poly[i].x;
        var vertex1_y = poly[i].y;
        var vertex2_x = poly[j].x;
        var vertex2_y = poly[j].y;
        var vertex1_mouseSide = (vertex1_y > mouseY); // true if mouse is below vertex 1
        var vertex2_mouseSide = (vertex2_y > mouseY); // true if mouse is below vertex 2

        if (vertex1_mouseSide !== vertex2_mouseSide) { // if mouse is between vertexes
            var intersectX = (vertex2_x - vertex1_x) * (mouseY - vertex1_y) / (vertex2_y - vertex1_y) + vertex1_x; // (horizontal distance between vertices) * (vertical distance between vertex 1 and mouse) / (vertical distance between vertices) + (x position of vertex 1)
            if (mouseX < intersectX) { // if mouse is to the left of the intersection point
                mouseintersect = !mouseintersect;
                // This works by checking if the mouse has crossed the line between the two vertices an odd number of times. If it has, it is inside the shape.
            }
        }
        return mouseintersect;
    }
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
    this.onHover = config.onHover || function() {};
    this.onHoverEnd = config.onHoverEnd || function() {};
    this.vertexCoordinates = config.vertexCoordinates || [];

    this.debug = config.debug || false;
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
    var that = this;
    this.vertexes.map(function(vertex) {
        var newVector = new PVector(vertex.x + that.translation.x, vertex.y + that.translation.y);
        that.vertexCoordinates.push(newVector);
    });
};

var b1 = new Button({
    translation: new PVector(0, 0),
    scale: 1,
    rotation: 0,
    vertexes: [
        new PVector(290, 300),
        new PVector(290, 400),
        new PVector(310, 400),
        new PVector(310, 300)
    ],
});

b1.draw();

debug(mouseInShape(b1.vertexCoordinates));