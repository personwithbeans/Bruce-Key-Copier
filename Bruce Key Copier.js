//default variables set for shlage keys
const display = require("display");
const dialog = require("dialog");
var BGColour = BRUCE_BGCOLOR; // Black background
var PriColour = BRUCE_PRICOLOR; // White lines 
var screenWidth = width();
var screenHeight = height();
var leftBorder = 20; // Left border for the drawing area in pixels
var RightBorder = 70; // Right border for the drawing area in pixels

// 1.9 inch ST7789V IPS color TFT LCD
var keychoice = "schlage_sc4";
const notches = [0, 0, 0, 0, 0, 0]; // Array to hold key depths
var currentNotch = 1; // Current notch selected of the key | starting at 1 = firstposition from left, Key pointing right
var amountOfNotches = 6; // Number of notches
var maxNotchDepth = 70; // Maximum depth of the notches |
var amountOfDepths = 10; // 10 for shlage
var currentNotchDepth = 0; // Current height of the key

var cordinates = [//holds the cordinate positions for the line points
    [50, 50],// first two and last two points arnt notches
    [70, 50],// screen size - ~20 seems to be just at the edge for x axis
    [90, 60],// X value from left side of screen | Y value from top of screen (for some reason its that way)
    [110, 40],
    [130, 70],
    [150, 60],
    [170, 60],
    [190, 40],
    [210, 50],
    [230, 50]//final line end point [2 extra for the end lines]
];
function calculateLineSegments() {//finds the individual spacing betwee each notch
    var spaceToUtilize = screenWidth - (leftBorder + RightBorder)
    var pixelsPerDivision = spaceToUtilize / cordinates.length
}

function resetDepths() {
    for (var i = 0; i < cordinates.length; i++) {
        cordinates[i][1] = 30
    }
}

function drawLines() {
    drawString(keychoice, screenWidth - 150, 5);//display type of key selected
    for (var i = 0; i < cordinates.length - 1; i++) {//go though each point and render
        var x1 = cordinates[i][0];
        var y1 = cordinates[i][1];
        var x2 = cordinates[i + 1][0];
        var y2 = cordinates[i + 1][1];
        display.drawLine(
            x1, y1, x2, y2, PriColour
        );
    }
}

function refreshScreen() {
    display.fill(BGColour);
    drawHighighter();
    drawLines();
}

function mainMenu() {
    var choice = dialogChoice([
        "[WIP] Change Key Type", "keyChange",//change later
        "[WIP] Save key", "saveKey",
        "[WIP] New Key", "newKey",
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
        var keychoice = dialogChoice([//default key whould be shlage [ONLY GONNA BE WORKED ON AFTER I GET SOMTHING IN PLACE TO DEAL WITH THE FUCKY FUCKY VARIABLES needed]
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
    refreshScreen()//update/refresh the screen on exit of main menu using cancel button
}

function changeSelectedNotch() {
    if (currentNotch < amountOfNotches) {
        currentNotch += 1;
    } else if (currentNotch >= amountOfNotches) {
        currentNotch = 1; // Reset to first notch
    }
    currentNotchDepth = notches[currentNotch - 1]
}

function drawHighighter() {
    var currentNotchX = cordinates[currentNotch + 1][0]// +1 to start on the right point in the array
    var currentNotchY = cordinates[currentNotch + 1][1]
    display.drawCircle(currentNotchX, currentNotchY, 5, BRUCE_PRICOLOR)//x | y | Radius | Colour
}

function updatecurrentNotchHeight() {
    cordinates[currentNotch + 1][1]= (currentNotchDepth * (maxNotchDepth / amountOfDepths)) + 30;//-1 accounts for array// +1 accounts for the end points current notch starts at 1
    refreshScreen()
}

//screen size (320x170) 

//innitial setup
display.fill(BGColour);
resetDepths()
calculateLineSegments()
drawLines()
drawHighighter()


//main loop
while (true) {
    drawString(currentNotchDepth, screenWidth - 180, 5);//display type of key selected
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
        drawLines()
    }
    if (getNextPress() && currentNotchDepth < maxNotchDepth) {
        currentNotchDepth += 1;
        updatecurrentNotchHeight()
        drawLines()
        delay(20);
    }
    if (getPrevPress() && currentNotchDepth > 0) {
        currentNotchDepth -= 1;
        updatecurrentNotchHeight()
        drawLines()
        delay(20);
    }
}

//Random tidbits of code to be later introduced

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
