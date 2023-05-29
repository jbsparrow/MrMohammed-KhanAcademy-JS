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
    vertex(0, 0);
    vertex(0, height);
    vertex(width / 2, height - 20);
    vertex(width / 2, 20);
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
        // Morph the book cover into the left page over time using quad().
        fill(lastColour);
        quad(bookCoverX, bookCoverY, bookCoverX, bookCoverY + bookCoverHeight, bookCoverX + bookCoverWidth, bookCoverY + bookCoverHeight, bookCoverX + bookCoverWidth, bookCoverY);
        bookCoverX -= 20 / 10;
        bookCoverY -= 10 / 10;
        bookCoverWidth += 40 / 10;
        bookCoverHeight += 20 / 10;
        if (bookCoverX < 0) {
            bookCoverX = 0;
        }
        if (bookCoverY < 0) {
            bookCoverY = 0;
        }
        if (bookCoverWidth > width / 2) {
            bookCoverWidth = width / 2;
        }
        if (bookCoverHeight > height) {
            bookCoverHeight = height;
        }
        if (bookCoverX === 0 && bookCoverY === 0 && bookCoverWidth === width / 2 && bookCoverHeight === height) {
            bookOpened = true;
            bookOpening = false;
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