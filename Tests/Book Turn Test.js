background(127);
noStroke();
var pval = 0;
var moveVal = false;
var currentColour = color(0, 255, 0);
var lastColour = color(255, 255, 255);
var backColour = color(255, 0, 0);
var bookOpened = false;
var bookOpening = false;

var drawLeftPage = function(colour) {
    fill(colour);
    beginShape();
    vertex(0, 0); // Top left corner
    vertex(0, height); // Bottom left corner
    vertex(width / 2, height - 20); // Bottom right corner
    vertex(width / 2, 20); // Top right corner
    endShape(CLOSE);
};

var drawRightPage = function(pageTurnVal, colour) {
    fill(colour);
    beginShape();
    vertex(width / 2, 20); // Top left corner
    vertex(width / 2, height - 20); // Bottom left corner
    vertex(width + pageTurnVal, height); // Bottom right corner
    vertex(width + pageTurnVal, 0); // Top right corner
    endShape(CLOSE);
};

// var bookCoverX = 100;
// var bookCoverY = 50;
// var bookCoverWidth = 200;
// var bookCoverHeight = 300;

var bookCoverTopLeftX = 100;
var bookCoverTopLeftY = 50;
var bookCoverTopRightX = 300;
var bookCoverTopRightY = 50;
var bookCoverBottomLeftX = 100;
var bookCoverBottomLeftY = 350;
var bookCoverBottomRightX = 300;
var bookCoverBottomRightY = 350;

var topLeftX = 0;
var topLeftY = 0;
var topRightX = 0;
var topRightY = 0;
var bottomRightX = 0;
var bottomRightY = 0;
var bottomLeftX = 0;
var bottomLeftY = 0;

var cnt = 50;
var cnt2 = 0;

var draw = function() {
    background(127);
    noStroke();
    if (bookOpened) {
        if (moveVal && pval > -400) {
            pval -= 25; // Page turn speed
        } else if (pval <= -400) {
            moveVal = false;
            lastColour = currentColour;
            currentColour = backColour;
            backColour = color(random(255), random(255), random(255));
            pval = 0;
        }

        drawLeftPage(lastColour);
        drawRightPage(0, backColour);
        drawRightPage(pval, currentColour);
    }
    // Draw the book cover
    else if (!bookOpening) {
        fill(255, 0, 0);
        rect(100, 50, 200, 300);
        fill(0, 0, 0);
        textSize(12);
        text("Book Opened", 158, 116);
    } else if (bookOpening) {
        // Morph the book cover into the left page over time using vertex().
        if (cnt2 < cnt) {
            topLeftX = lerp(bookCoverTopLeftX, 0, cnt2 / cnt);
            topLeftY = lerp(bookCoverTopLeftY, 0, cnt2 / cnt);
            topRightX = lerp(bookCoverTopRightX, width / 2, cnt2 / cnt);
            topRightY = lerp(bookCoverTopRightY, 20, cnt2 / cnt);
            bottomRightX = lerp(bookCoverBottomRightX, width / 2, cnt2 / cnt);
            bottomRightY = lerp(bookCoverBottomRightY, height - 20, cnt2 / cnt);
            bottomLeftX = lerp(bookCoverBottomLeftX, 0, cnt2 / cnt);
            bottomLeftY = lerp(bookCoverBottomLeftY, height, cnt2 / cnt);
            cnt2++;
        }
        fill(lastColour);
        beginShape();
        vertex(topLeftX, topLeftY);
        vertex(topRightX, topRightY);
        vertex(bottomRightX, bottomRightY);
        vertex(bottomLeftX, bottomLeftY);
        endShape(CLOSE);
        fill(currentColour);
        if (cnt2 === cnt) {
            bookOpened = true;
        }
    }
};


mouseClicked = function() {
    if (!bookOpened) {
        bookOpening = true;
    } else {
        moveVal = !moveVal;
    }
};