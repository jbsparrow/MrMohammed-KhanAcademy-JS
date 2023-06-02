background(127);
noStroke();
frameRate(12);
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

var bookCoverTopLeftX = 100;
var bookCoverTopLeftY = 50;
var bookCoverTopRightX = 300;
var bookCoverTopRightY = 50;
var bookCoverBottomLeftX = 100;
var bookCoverBottomLeftY = 350;
var bookCoverBottomRightX = 300;
var bookCoverBottomRightY = 350;

var leftPage_topLeftX = 0;
var leftPage_topLeftY = 0;
var leftPage_topRightX = 0;
var leftPage_topRightY = 0;
var leftPage_bottomRightX = 0;
var leftPage_bottomRightY = 0;
var leftPage_bottomLeftX = 0;
var leftPage_bottomLeftY = 0;

var rightPage_topLeftX = 0;
var rightPage_topLeftY = 0;
var rightPage_topRightX = 0;
var rightPage_topRightY = 0;
var rightPage_bottomRightX = 0;
var rightPage_bottomRightY = 0;
var rightPage_bottomLeftX = 0;
var rightPage_bottomLeftY = 0;

var cnt = 50;
var cnt2 = 0;
var cnt3 = 0;

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
        fill(lastColour);
        rect(100, 50, 200, 300);
        fill(0, 0, 0);
        textSize(12);
        text("Book Opened", 158, 116);
    } else if (bookOpening) {
        // Morph the book cover into the left page over time using vertex().
        if (cnt2 < cnt) {
            leftPage_topLeftX = lerp(bookCoverTopLeftX, 0, cnt2 / cnt);
            leftPage_topLeftY = lerp(bookCoverTopLeftY, 0, cnt2 / cnt);
            leftPage_topRightX = lerp(bookCoverTopRightX, width / 2, cnt2 / cnt);
            leftPage_topRightY = lerp(bookCoverTopRightY, 20, cnt2 / cnt);
            leftPage_bottomRightX = lerp(bookCoverBottomRightX, width / 2, cnt2 / cnt);
            leftPage_bottomRightY = lerp(bookCoverBottomRightY, height - 20, cnt2 / cnt);
            leftPage_bottomLeftX = lerp(bookCoverBottomLeftX, 0, cnt2 / cnt);
            leftPage_bottomLeftY = lerp(bookCoverBottomLeftY, height, cnt2 / cnt);
            cnt2++;
        }

        if (cnt3 < cnt) {
            rightPage_topLeftX = lerp(bookCoverTopRightX, width / 2, cnt3 / cnt);
            rightPage_topLeftY = lerp(bookCoverTopRightY, 20, cnt3 / cnt);
            rightPage_bottomLeftX = lerp(bookCoverBottomRightX, width / 2, cnt3 / cnt);
            rightPage_bottomLeftY = lerp(bookCoverBottomRightY, height - 20, cnt3 / cnt);
            rightPage_bottomRightX = lerp(bookCoverBottomRightX, width, cnt3 / cnt);
            rightPage_bottomRightY = lerp(bookCoverBottomRightY, height, cnt3 / cnt);
            rightPage_topRightX = lerp(bookCoverTopRightX, width, cnt3 / cnt);
            rightPage_topRightY = lerp(bookCoverTopRightY, 0, cnt3 / cnt);
            cnt3++;
        }


        fill(lastColour);
        beginShape();
        vertex(leftPage_topLeftX, leftPage_topLeftY);
        vertex(leftPage_topRightX, leftPage_topRightY);
        vertex(leftPage_bottomRightX, leftPage_bottomRightY);
        vertex(leftPage_bottomLeftX, leftPage_bottomLeftY);
        endShape(CLOSE);
        fill(currentColour);
        beginShape();
        vertex(rightPage_topLeftX, rightPage_topLeftY);
        vertex(rightPage_topRightX, rightPage_topRightY);
        vertex(rightPage_bottomRightX, rightPage_bottomRightY);
        vertex(rightPage_bottomLeftX, rightPage_bottomLeftY);
        endShape(CLOSE);
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