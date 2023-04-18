// Plate
pushMatrix();

// Plate Shadow
fill(135, 135);
noStroke();
arc(185, 192, 274, 274, 120, 300);

// Outer Plate
fill(237, 237, 237);
strokeWeight(1.0);
stroke(-16777216);
ellipse(200.0, 200.0, 274.3611, 274.3611);

// Inner Plate
fill(247, 247, 247);
strokeWeight(1.0);
stroke(-16777216);
ellipse(200.0, 200.0, 231.95906, 231.95906);

popMatrix();


// Pizza
pushMatrix();

// Cheese
fill(255, 197, 36);
noStroke();
triangle(97.94, 216.71, 267.54, 280.31, 229.25, 103.78);

// Crust (and part of the cheese)
fill(255, 197, 36);
stroke(166, 102, 13);
strokeWeight(15.0);
bezier(100.8, 214.6, 149.1, 263.5, 182.3, 278.8, 265.4, 277.0);

popMatrix();


// Toppings
// Pepperoni function
var createPepperoni = function(size, x, y) {
    pushMatrix();
    // Generate pepperoni colours (original #84300f)
    var r = random(130, 155);
    var g = random(40, 58);
    var b = random(6, 25);
    // Create pepperoni
    fill(r, g, b);
    noStroke();
    ellipse(x, y, size, size);

    // Give the pepperoni some texture
    var size1 = random(3, 5);
    fill(random(r - 50, r + 65), g, b);
    ellipse(x + random(-3, 3), y - random(2, 4), size1, size1);

    var size2 = random(3, 5);
    fill(random(r - 50, r + 50), g, b);
    ellipse(x + random(-2, 2), y + 5, size2, size2);
    popMatrix();
};

// Create pepperoni
createPepperoni(random(19, 22), 200, 200);
createPepperoni(random(19, 22), 174, 238);
createPepperoni(random(19, 22), 212, 150);
createPepperoni(random(19, 22), 145, 204);
createPepperoni(random(19, 22), 226, 221);
createPepperoni(random(19, 22), 174, 181);
createPepperoni(random(19, 22), 227, 250);
createPepperoni(random(19, 22), 225, 186);


// Drink
pushMatrix();

var cupColour = color(89, 43, 196);
var cupRimColour = color(140, 140, 140);
var cupTopColour = color(41, 41, 41);
var drinkColour = color(112, 86, 1);

// Cup Shadow
pushMatrix();

fill(135, 135);
noStroke();
rotate(45);
translate(167, 169);
rect(0, 0, 117, 89, 16);

popMatrix();


// Cup body
fill(cupColour);
stroke(cupColour);
strokeWeight(5.0);
ellipse(62, 360, 103, 71);

fill(cupColour);
noStroke();
rect(8, 261, 108, 103);

fill(cupTopColour);
stroke(cupRimColour);
strokeWeight(5.0);
ellipse(62, 257, 103, 71);

// Liquid
fill(drinkColour);
noStroke();
ellipse(62, 259, 84, 51);

popMatrix();