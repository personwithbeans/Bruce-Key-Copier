//default variables set for shlage keys
const display = require("display");
const dialog = require("dialog");
var BGColour = BRUCE_BGCOLOR; // Black background
var PriColour = BRUCE_PRICOLOR; // White lines 
var screenWidth = width();
var screenHeight = height();
var leftBorder = 20; // Left border for the drawing area in pixels
var RightBorder = 50; // Right border for the drawing area in pixels

// 1.9 inch ST7789V IPS color TFT LCD
var keychoice = "schlage_sc4";
const notches = [0, 0, 0, 0, 0]; // Array to hold key depths
var currentNotch = 1; // Current height of the key | starting at 1 = firstposition from left, Key pointing right
var amountOfNotches = 6; // Number of notches
var maxNotchDepth = 10; // Maximum height of the notches | 10 for Shlage notches
var currentNotchDepth = 0; // Current height of the key

var cordinates = [//might not be good in the future
    [50, 50],// X value from left side of screen | Y value from top of screen (for some reason)
    [70, 50],// screen size - ~20 seems to be just at the edge
    [90, 60],
    [110, 40],
    [130, 70],
    [150, 60],//final line end point
];
function calculateLineSegments() {//finds the individual spacing betwee each notch
    var spaceToUtilize = screenWidth - (leftBorder + RightBorder)
    var pixelsPerDivision = spaceToUtilize / amountOfNotches
    for (var i = 0; i < cordinates.length; i++) {
        cordinates[i][0] = pixelsPerDivision * (i + 1)
    }
}

function mainMenu() {
    var choice = dialogChoice([
        "Change Key Type", "keyChange",//change later
        "Save key", "saveKey",
        "New Key", "newKey",
        "Exit", "exit"
    ]) || "";
    if (choice == "exit") {
        return choice// returns and main loop checks for exit
    }
    if (choice == "cancel") {
        return;
    }
    if (choice == "saveKey") {
        dialog.message("not yet implemented"); // Just displays the message
    }
    if (choice == "newKey") {
        dialog.message("not yet implemented"); // Just displays the message
    }
    if (choice == "keyChange") {
        var keychoice = dialogChoice([//default key whould be shlage
            "Kwikset KW1", "kwikset_kw1",
            "Schlage SC4", "schlage_sc4",
            "Arrow AR4", "arrow_ar4",
            "Master Lock M1", "masterlock_m1",
            "American AM7", "american_am7",
            "Back", "back"
        ]) || "";

        if (keychoice === "back") {
            display.fill(BGColour);
            mainMenu();
        } else {
            display.fill(BGColour);
            return;
        }
    }
}


function changeSelectedNotch() {
    if (currentNotch < amountOfNotches) {
        currentNotch += 1;
    } else if (currentNotch >= amountOfNotches) {
        currentNotch = 1; // Reset to first notch
    }
}

function drawHighighter() {
    var currentNotchX = cordinates[currentNotch - 1][0]// -1 due to currentNotch starting at 1, array's start at 0
    var currentNotchY = cordinates[currentNotch - 1][1]
    display.drawCircle(currentNotchX, currentNotchY, 5, BRUCE_PRICOLOR)//x | y | Radius | Colour
}

//screen size (320x170) 
display.fill(BGColour);
calculateLineSegments()
while (true) {
    drawString(keychoice, screenWidth - 150, 5);//display type of key selected
    for (var i = 0; i < cordinates.length - 1; i++) {
        var x1 = cordinates[i][0];
        var y1 = cordinates[i][1];
        var x2 = cordinates[i + 1][0];
        var y2 = cordinates[i + 1][1];
        display.drawLine(
            x1, y1, x2, y2, PriColour
        );
    }

    if (getEscPress()) {
        choice = mainMenu()
        if (choice === "exit") {
            break;
        }
    }
    if (getSelPress()) {
        display.fill(BGColour);
        changeSelectedNotch()
        drawHighighter()
    }
}

//Random old tidbits of code

// while (true) {

//     if (getNextPress() && currentNotchDepth < maxNotchDepth - 1) {
//         currentNotchDepth += 1;
//         delay(20);
//     }
//     if (getPrevPress() && currentNotchDepth > 0) {
//         currentNotchDepth -= 1;
//         delay(20);
//     }
//     function updatecurrentNotchHeight(depth) {
//         currentNotchDepth = currentNotch * (maxNotchDepth / amountOfNotches);
//
//
// }
