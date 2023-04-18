var ttcPos1 = 400; // min: -261, max: 400
var ttcPos2 = -261;
var backgroundColour = 0;
var titleTextColour = 50;
var textColour = 150;
var textPos = 3;
colorMode(HSB);

var draw = function() {
    background(backgroundColour, 255, 255);
    fill(titleTextColour, 255, 255);
    textSize(30);
    text("😊TTC Client😊", 100, 30);

    fill(textColour, 255, 255);
    textSize(12);
    text("TTC Client is the world's best Minecraft hacked client!", 10, 50);
    textSize(12);
    text("TTC Client is endorsed by world famous rapper Pitbull!", 10, 70);
    textSize(18);
    text("TTC Client is confirmed to NOT be a virus!!", 10, 100);
    textSize(24);
    text("This means it is safe to install\non a corporate device!", 10, 150);
    if (ttcPos1 >= 138) {
        ttcPos2 = -261 + (ttcPos1 - 138);
    }
    if (ttcPos1 < 400) {
        ttcPos1 += 1;
    } else if (ttcPos1 >= 400) {
        ttcPos1 = ttcPos2;
        ttcPos2 = -261;
    }
    backgroundColour += 1;
    textColour += 1;
    titleTextColour += 1;
    if (backgroundColour > 255) {
        backgroundColour = 0;
    }
    if (textColour > 255) {
        textColour = 0;
    }
    if (titleTextColour > 255) {
        titleTextColour = 0;
    }
    text("https://script-ware.net/ttc", ttcPos1, 300);
    text("https://script-ware.net/ttc", ttcPos2, 300);
    text("😍😎🤑😱😈😏👹😺😼😟😫😺", textPos, 250);
};