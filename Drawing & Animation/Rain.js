var generator = new Random(mouseX + second() + mouseY + frameCount + millis() * random(0.4, 3.9) - minute());
var generator2 = new Random((mouseY / ((mouseX === 0) ? random(1, 400) : mouseX)) + hour() + frameCount + millis() * random(0.19, 8.27) - day());
var raindrops = [];
frameRate(9e+18);
var lowestHue = 118;
var highestHue = 188;


var raindrop = function(config) {
    this.x = config.x;
    this.y = config.y;
    this.fillColour = config.fillColour;
    this.speed = config.speed;
    this.lateralSpeed = config.lateralSpeed || random(-0.3, 0.3);
    this.size = config.size;
};

raindrops.push(new raindrop({ x: 100, y: 100, fillColour: color(0, 217, 255), speed: 5, size: 10 }));


raindrop.prototype.draw = function() {
    beginShape();
    noStroke();
    fill(this.fillColour);
    vertex(this.x, this.y);
    bezierVertex(this.x - this.size / 2, this.y + this.size / 2, this.x + this.size / 2, this.y + this.size / 2, this.x, this.y);
    endShape(CLOSE);
    this.x += this.lateralSpeed;
    this.y += this.speed;
};

var generateRaindrop = function() {
    var drop = {};
    drop.x = generator.nextGaussian() * 100 + (width / 2);
    drop.y = generator2.nextGaussian() * 100;
    drop.fillColour = color(random(118, 158), random(235, 255), random(200, 255));
    drop.speed = random(2, 5);
    drop.size = random(5, 10);
    drop.lateralSpeed = random(-0.3, 0.3);
    raindrops.push(new raindrop(drop));
};

for (var i = 0; i < 9; i++) {
    generateRaindrop();
}


draw = function() {
    colorMode(RGB);
    background(204, 247, 255);
    colorMode(HSB);


    for (var i = 0; i < raindrops.length; i++) {
        if (raindrops[i].y > 400) {
            // remove raindrop
            raindrops.splice(i, 1);
            // generate new raindrop
            generateRaindrop();
        }
        raindrops[i].draw();
    }

};