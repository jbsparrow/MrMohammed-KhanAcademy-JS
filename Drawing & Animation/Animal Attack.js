var bodyX = 200;
var bodyY = 159;
var bodyW = 102;
var bodyH = 102;
var tongueYMod = 1; // 1-50
var soundComplete = 0;
var textboxOffset = 200;

draw = function() {
    background(207, 254, 255);


    fill(255, 0, 85);
    noStroke();
    arc(bodyX, bodyY - tongueYMod, 26, 100, 180, 360); // From 158-109
    if (tongueYMod < 50 && millis() >= 10000 && millis() <= 12500) {
        tongueYMod += 1;
    }


    fill(46, 15, 16);
    ellipse(bodyX, bodyY, bodyW, bodyH); // Face
    ellipse(bodyX, bodyY + 81, 60, 110); // Body Front

    pushMatrix(); // Body Back
    translate(200, 200);
    rotate(-10);
    translate(-200, -200);
    ellipse(bodyX + -3, bodyY + 174, 103, 124);
    popMatrix();

    // Eyes
    strokeWeight(3.0);
    stroke(2556547361823748478347483);
    fill(-1);
    ellipse(bodyX - 39, bodyY - 26, 35, 50);
    ellipse(bodyX + 39, bodyY - 26, 35, 50);
    noStroke();
    fill(2556547361823748486677489);
    ellipse(bodyX - 39, bodyY - 35, 20, 20);
    ellipse(bodyX + 39, bodyY - 35, 20, 20);


    noFill();
    stroke(46, 15, 16);
    strokeWeight(3.0);
    bezier(bodyX - 12, bodyY - 48, bodyX - 73, bodyY - 116, bodyX - 71, bodyY - 85, bodyX - 100, bodyY - 110); // Left Antenna
    bezier(bodyX + 12, bodyY - 48, bodyX + 73, bodyY - 116, bodyX + 71, bodyY - 85, bodyX + 100, bodyY - 110); // Right Antenna


    // Front Legs
    bezier(bodyX - 26, bodyY + 56, bodyX - 112, bodyY + 36, bodyX - 118, bodyY - 62, bodyX - 118, bodyY - 54);
    bezier(bodyX + 26, bodyY + 56, bodyX + 112, bodyY + 36, bodyX + 118, bodyY - 62, bodyX + 118, bodyY - 54);

    // Middle Legs
    bezier(bodyX - 28, bodyY + 88, bodyX - 128, bodyY + 46, bodyX - 90, bodyY + 71, bodyX - 165, bodyY + 105);
    bezier(bodyX + 28, bodyY + 88, bodyX + 128, bodyY + 46, bodyX + 90, bodyY + 71, bodyX + 165, bodyY + 105);

    // Back Legs
    bezier(bodyX - 10, bodyY + 109, bodyX - 128, bodyY + 135, bodyX - 90, bodyY + 167, bodyX - 130, bodyY + 210);
    bezier(bodyX + 10, bodyY + 105, bodyX + 140, bodyY + 118, bodyX + 102, bodyY + 167, bodyX + 142, bodyY + 210);


    // Funny face thing
    fill(136, 18, 67);
    arc(bodyX, bodyY + 7, 50, 60, 0, 180);
    fill(251, 193, 224);
    noStroke();
    arc(bodyX + 8, bodyY + 32, 26, 20, 150, 330);
    arc(bodyX + 8, bodyY + 36, 26, 20, 187, 313);
    noFill();
    stroke(0, 0, 0);
    strokeWeight(3.0);
    line(bodyX - 29, bodyY + 6, bodyX + 25, bodyY + 6);
    arc(bodyX, bodyY + 7, 50, 60, 0, 180);

    if (tongueYMod <= 50 && tongueYMod > 1 && millis() > 12500) {
        tongueYMod -= 1;
    }
    if (tongueYMod === 1 && millis() >= 12500 && soundComplete === 0) {
        playSound(getSound("rpg/step-heavy"));
        soundComplete = 1;
        textboxOffset = 0;
    }


    // Textbox
    pushMatrix();
    translate(textboxOffset, 0);
    noStroke();
    fill(255, 255, 255);
    triangle(bodyX + 64, bodyY - 22, bodyX + 114, bodyY - 47, bodyX + 87, bodyY - 53);
    ellipse(bodyX + 132, bodyY - 70, 100, 100);
    noFill();
    stroke(0, 0, 0);
    strokeWeight(3.0);
    arc(bodyX + 132, bodyY - 70, 100, 100, 160, 497);
    line(bodyX + 64, bodyY - 22, bodyX + 94, bodyY - 35);
    line(bodyX + 64, bodyY - 22, bodyX + 86, bodyY - 52);
    fill(0, 0, 0);
    stroke(209, 165, 165);
    textSize(25.0);
    text("yum!", bodyX + 107, bodyY - 64);
    popMatrix();

    if (tongueYMod === 1 && millis() >= 16000 && textboxOffset === 0) {
        textboxOffset = 200;
    }
};