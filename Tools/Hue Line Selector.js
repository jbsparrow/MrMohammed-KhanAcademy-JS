colorMode(HSB);

var draw = function() {
    colorMode(RGB);
    background(255, 255, 255);
    colorMode(HSB);
    var mx = constrain(mouseX, 100, 355);
    var my = constrain(mouseY, 200, 200);
    strokeWeight(2.0);
    for (var i = 0; i < 255; i++) {
        stroke(i, 255, 255);
        point(i + 100, 200);
    }
    strokeWeight(5.0);
    stroke(0, 0, 0);
    point(mx, my);
    fill(255, 0, 0);
    text("Hue: " + (mx - 100), 20, 20);
    noStroke();
    var e = 255;
    var f = 149;
    fill(mx - 100, e, f);
    rect(30, 30, 337, 142);
};