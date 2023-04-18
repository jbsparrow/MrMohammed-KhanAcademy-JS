// Decide what side of the canvas you want the star to start from, the top, bottom, left or right, and position your star there.
// Decide what direction you want the star to move in. Change the variables inside draw so that the star moves the way you wanted.
// Add another star or other shape, and animate it going in a different direction.
// Bonus: Change the star into a different shape, or have it shoot out of a cannon.
// Bonus: Add a backdrop, like a starry night or skyscrapers.

var xPos = -20;
var yPos = -20;
var i = 0;
var i_increment = random(0.1, 0.4);
var k = 0;
var k_increment = random(0.03, 0.12);
var end = 0;
var characters = ["avatars/mr-pink-green", "avatars/mr-pink", "avatars/mr-pink-orange"];
var character = characters[Math.floor(Math.random() * characters.length)];

var drawStar = function(xPos, yPos, scaleFactor) {
    pushMatrix();
    // Move the star to xPos and yPos
    translate(xPos, yPos);
    scale(scaleFactor);

    // Draw the star
    strokeWeight(5.0);
    beginShape();
    vertex(200, 100); // Top
    vertex(250, 200); // Top right
    vertex(350, 200); // Bottom right
    vertex(275, 275); // Center right
    vertex(300, 375); // Bottom center
    vertex(200, 325); // Bottom left
    vertex(100, 375); // Bottom center
    vertex(125, 275); // Center left
    vertex(50, 200); // Bottom left
    vertex(150, 200); // Top left
    endShape(CLOSE);

    popMatrix();
};

// Make Buildings
var drawBuilding = function(xPos, yPos, sfx, sfy) {
    pushMatrix();
    translate(xPos, yPos);
    scale(sfx, sfy);
    strokeWeight(1.5);
    fill(150, 150, 150);
    rect(100, 200, 100, 200);
    // Windows

    fill(255, 204, 0);
    rect(105, 205, 20, 20);
    fill(255, 204, 0);
    rect(140, 205, 20, 20);
    fill(255, 204, 0);
    rect(175, 205, 20, 20);

    fill(255, 204, 0);
    rect(105, 235, 20, 20);
    fill(255, 204, 0);
    rect(140, 235, 20, 20);
    fill(255, 204, 0);
    rect(175, 235, 20, 20);

    fill(255, 204, 0);
    rect(105, 265, 20, 20);
    fill(255, 204, 0);
    rect(140, 265, 20, 20);
    fill(255, 204, 0);
    rect(175, 265, 20, 20);

    fill(255, 204, 0);
    rect(105, 295, 20, 20);
    fill(255, 204, 0);
    rect(140, 295, 20, 20);
    fill(255, 204, 0);
    rect(175, 295, 20, 20);

    fill(255, 204, 0);
    rect(105, 325, 20, 20);
    fill(255, 204, 0);
    rect(140, 325, 20, 20);
    fill(255, 204, 0);
    rect(175, 325, 20, 20);

    fill(66, 66, 66);
    rect(143, 375, 15, 25);
    popMatrix();
};


draw = function() {
    if (end === 0) {
        // Draw the star flying in an arc across the screen using a parabola
        background(29, 40, 115);
        drawBuilding(0, 0, 1, 1);
        drawBuilding(-100, -40, 1, 1.1);
        drawBuilding(160, -80, 1.2, 1.2);
        drawBuilding(120, 80, 0.8, 0.8);
        fill(255, 242, 0);
        drawStar(xPos, yPos, 0.1);
        xPos = Math.pow(i, 2);
        yPos = Math.pow(k, 2);
        i += i_increment;
        k += k_increment;
        if (xPos >= 400) {
            i = 0;
            k = 0;
            k_increment = random(0.03, 0.12);
            i_increment = random(0.1, 0.4);
            end = 1;
            xPos = 345;
            yPos = 5;
        }
        if (yPos >= 400) {
            i = 0;
            k = 0;
            k_increment = random(0.03, 0.12);
            i_increment = random(0.1, 0.4);
            end = 1;
            xPos = 345;
            yPos = 5;
        }
    } else if (end === 1) {
        background(29, 40, 115);
        drawBuilding(0, 0, 1, 1);
        drawBuilding(-100, -40, 1, 1.1);
        drawBuilding(160, -80, 1.2, 1.2);
        drawBuilding(120, 80, 0.8, 0.8);
        image(getImage(character), xPos, yPos, 50, 50);
        xPos -= 1;
        yPos += 4;
        if (xPos <= 0) {
            playSound(getSound("rpg/hit-splat"));
            end = 2;
        }
        if (yPos >= 370) {
            playSound(getSound("rpg/hit-splat"));
            end = 2;
        }
    } else if (end === 2) {
        background(29, 40, 115);
        drawBuilding(0, 0, 1, 1);
        drawBuilding(-100, -40, 1, 1.1);
        drawBuilding(160, -80, 1.2, 1.2);
        drawBuilding(120, 80, 0.8, 0.8);
        image(getImage(character), xPos, yPos, 50, 50);
    }
};