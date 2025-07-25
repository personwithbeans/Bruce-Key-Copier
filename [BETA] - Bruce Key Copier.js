//Author: github.com/personwithbeans
//Lisence: AGPL-3.0 license

//listen, I know this is probably an orginizational nightmare but it works
//default variables set for kwikset keys
//also currenlty only make to work on lilygo t-embed series of devices or at least ones with 4 differnt input methods

//bring modules in
const display = require("display");
const dialog = require("dialog");
const storage = require("storage");

var BGColour = BRUCE_BGCOLOR;       // Currrent BG colour set by bruce
var PriColour = BRUCE_PRICOLOR;     // Currrent Pri colour set by bruce
var screenWidth = width();
var screenHeight = height();        //who knows if this is even usefull
var leftBorder = 20;                // Left border for the drawing area in pixels
var rightBorder = 40;               // Right border for the drawing area in pixels
var topBorder = 50;                 // as to be expected its the border for the top
var horizontalTextAllignment = 1;   // 0 | 1 | 2 || left | center | right
var verticalTextAllignment = 0;     // 0 | 1 | 2 || top | middle | bottom
var textSize = 2;//DEAR GOD I TRIED 10, ITS WAY TO BIG. 2 seemes to be the default. 1 is barely visible is there no middle ground!!!?!???!?!?!
var rootDirContents = [storage.readdir({ fs: "sd", path: "/" })];//used to check if the BruceKeys folder exists
var depthWidth = 3;//total width gets double this value


var keychoice = "kwikset_kw1";//default
var notches = [0, 0, 0, 0, 0]; // Array to hold key depths
var currentNotch = 1; // Current notch selected of the key | starting at 1 = firstposition from left, Key pointing right
var amountOfNotches = 5; // Number of notches
var maxNotchDepth = 70; // Maximum depth of the notches | also can be the distance between the segments
var maxNotchDepthPositions = 10; // Maximum depth of the notches |
var amountOfDepths = 10; // 10 for kwikset
var currentNotchDepth = 0; // Current height of the key
var depthPerSegment = (maxNotchDepth / maxNotchDepthPositions)

var cordinates = [//holds the cordinate positions for the line points
    [0, 50],// first two and last two points arnt notches
    [20, 50],// screen size - ~20 seems to be just at the edge for x axis
    [90, 60],// X value from left side of screen | Y value from top of screen (for some reason its that way)
    [110, 40],
    [130, 70],
    [150, 60],
    [170, 60],
    [200, 90],
    [190, 90]//does not draw a line after this
    //final line end point [2 extra for the end lines]
];

//most of of the following is probably stupid and hosnesty the fact that it works in magic

function calculateLineSegments() {//calculate individual spacing between each notch and sets
    var spaceToUtilize = screenWidth - (leftBorder + rightBorder)
    var pixelsPerDivision = spaceToUtilize / cordinates.length
    maxNotchDepth = pixelsPerDivision
    for (var i = 0; i < notches.length; i++) {
        cordinates[i + 2][0] = (pixelsPerDivision * (i + 1)) + leftBorder
    }
}

function resetDepths() {//whoa who could have guessed it resets the height. NOT LIKE ITS IN THE FREEKIN NAME.
    for (var i = 0; i < notches.length; i++) {
        cordinates[i + 2][1] = topBorder//starting depth from top of screen
    }
    for (var i = 0; i < notches.length; i++) {
        notches[i] = 0
    }
    currentNotchDepth = 0
}

function drawDepthValues() {//display the depth values above
    for (var i = 0; i < notches.length; i++) {
        display.drawString(notches[i], cordinates[i + 2][0], topBorder / 2)
    }//maybe add lines that extend down from these
}

function drawLines() {//WHOOOAAA, you can draw lines????? crazy
    drawString(keychoice, screenWidth - 80, 5);//display type of key selected
    for (var i = 0; i < cordinates.length - 2; i++) {//go though each point and render
        var x1 = cordinates[i][0] + depthWidth;//add space for little platau
        var y1 = cordinates[i][1];
        var x2 = cordinates[i + 1][0] - depthWidth;//add space for little platau
        var y2 = cordinates[i + 1][1];

        display.drawLine(
            x1, y1, x2, y2, PriColour
        );
    }

    display.drawCircle(cordinates[7][0], cordinates[7][1], 2, PriColour)

    for (var i = 0; i < notches.length + 1; i++) {
        var x01 = cordinates[i + 1][0] + depthWidth;//add space for little platau
        var y01 = cordinates[i + 1][1];
        var x02 = cordinates[i + 2][0] - depthWidth;//add space for little platau
        var y02 = cordinates[i + 2][1];

        display.drawCircle(//temp, just to draw the points      x | y | rad | colour
            (-(x01 - x02) / 2) + x01, ((y01 + y02) / 2) - ((x02 - x01) / 2), 3, PriColour
        );
    }

    for (var i = 0; i < notches.length; i++) {//add little line in between sloaped lines "\_/""
        var x1 = cordinates[i + 2][0] - depthWidth;//add space for little platau
        var y1 = cordinates[i + 2][1];
        var x2 = cordinates[i + 2][0] + depthWidth;
        var y2 = cordinates[i + 2][1];
        display.drawLine(
            x1, y1, x2, y2, PriColour
        );
    }
    display.drawLine(cordinates[7][0], cordinates[7][1], cordinates[7][0], cordinates[7][1] + 10, PriColour)// + 10 need to be writable variable for multiple keys
    display.drawLine(cordinates[7][0], cordinates[7][1] + 10, cordinates[7][0] - 15, cordinates[7][1] + 30, PriColour)//need to change to varaible controlled for multiple keys
    display.drawLine(cordinates[7][0] - 15, cordinates[7][1] + 30, 0, cordinates[7][1] + 30,PriColour)
}

function refreshScreen() {//refreshes screen/updates any information
    textSetup()
    display.fill(BGColour);
    drawHighighter();
    drawLines();
    drawDepthValues()
}

function mainMenu() {
    var choice = dialogChoice([//how the fuck does this function work
        "[WIP] Change Key Type", "keyChange",
        "Save key", "saveKey",
        "Load key", "loadKey",
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
        saveKey()
        return;
    }
    if (choice == "loadKey") {
        loadKey()
        return;
    }
    if (choice == "newKey") {
        resetDepths()
        refreshScreen()
        return;
    }
    if (choice == "keyChange") {
        var keychoice = dialogChoice([//default key whould be kwikset [ONLY GONNA BE WORKED ON AFTER I GET SOMTHING IN PLACE TO DEAL WITH THE FUCKY FUCKY VARIABLES], also how the fuck does this work?
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

function drawHighighter() {//highlights the notch currently sellected to be changed
    var currentNotchX = cordinates[currentNotch + 1][0]// +1 to start on the right point in the array
    var currentNotchY = cordinates[currentNotch + 1][1]
    display.drawCircle(currentNotchX, currentNotchY, 5, PriColour)//x | y | Radius | Colour
}

function updatecurrentNotchHeight() {//updates notch height after value ajusted, no idea if this is even needed
    cordinates[currentNotch + 1][1] = (currentNotchDepth * (maxNotchDepth / amountOfDepths)) + topBorder;//-1 accounts for array// +1 accounts for the end points current notch starts at 1
    notches[currentNotch - 1] = currentNotchDepth
    refreshScreen()
}

function textSetup() {
    display.setTextAlign(horizontalTextAllignment, verticalTextAllignment)
    display.setTextSize(textSize)
    display.setTextColor(display.color(225, 225, 225))
}

function collectKeyData() {//putts all the data into a large array
    var keyData = [keychoice, notches];
    return keyData;
}

function fileCheck() {// Return the first available number
    var DirContents = storage.readdir({ fs: "sd", path: "/BruceKeys" });
    for (var i = 0; i < 100; i++) {
        var filename = "KeyCopy_" + i + ".txt";
        if (DirContents.indexOf(filename) === -1) {
            return i;
        }
    }
    return null; // All slots taken, currently hardcapped to max of 100 to prevents some sort of infinite loop, if you need over 100 saved keys you have an issue
}

function fileDataWrite(filenameEndValue) {//writes the data for a file, don't know if it can create a file though

    if (storage.write({ fs: "sd", path: "/BruceKeys/KeyCopy_" + filenameEndValue + ".txt" }, collectKeyData(), "write")) {
        dialog.success("Key saved successfully.");
    }
}

function dirCheck() {//checks in the BruceKeys folder exists in the sd directory [in future maybe if no sd then divert to small file system, check at start]
    for (var i = 0; i < rootDirContents.length; i++) {//for to loop search trough the array untill it goes through te whole thing for finds the target string
        if (rootDirContents[i] == "BruceKeys") {
            var keysFolderExists = true;
        } else {
            var keysFolderExists = false;
        }
    }
    return keysFolderExists;
}

function saveKey() {//main function to save file
    if (dirCheck() == true) {//checks in the BruceKeys folder exists in the sd directory [in future maybe if no sd then divert to small file system, check at start]
        fileDataWrite(fileCheck())//checks what end number it needs to use for the file name to not overwrite another file
    } else {
        storage.mkdir({ fs: "sd", path: "/BruceKeys" });//creates folder if no detected on sd card
        if (dirCheck() == true) { //checks if successfully created
            dialog.success("BruceKeys folder created successfully.");
            delay(200);
        }
        fileDataWrite(fileCheck())//checks what end number it needs to use for the file name to not overwrite another file
    }
    return;
}

function loadKey() {//selve explanitory function name
    var chosenFile = dialog.pickFile("/BruceKeys", "txt");//haveu ser select file
    if (!chosenFile) {//if operaiton is canceled display error message
        dialog.error("No file selected.");
    }
    // Read the file contents
    var fileString = storage.read({ fs: "sd", path: chosenFile });
    var fileData = fileString.split(",");//split into array


    keychoice = fileData[0]
    for (i = 0; i < fileData.length - 1; i++) {//update notch numbers
        notches[i] = Number(fileData[i + 1])
    }
    for (i = 0; i < fileData.length - 1; i++) {//update line endpoint cordinates
        cordinates[i + 2][1] = ((depthPerSegment * Number(fileData[i + 1])) + topBorder)
    }
    dialog.success("Key loaded");
    refreshScreen();
    return;
}


//screen size (320x170) 
// 1.9 inch ST7789V IPS color TFT LCD

//innitial setup
textSetup()
display.fill(BGColour);
resetDepths()
calculateLineSegments()
drawLines()
drawHighighter()
drawDepthValues()


//main loop
while (true) {
    if (getEscPress()) {
        choice = mainMenu()
        textSetup()
        if (choice === "exit") {
            break;
        }
    }
    if (getSelPress()) {
        display.fill(BGColour);
        changeSelectedNotch()
        drawHighighter()
        drawLines()
        drawDepthValues()
    }
    if (getNextPress() && currentNotchDepth < maxNotchDepthPositions) {
        currentNotchDepth += 1;
        updatecurrentNotchHeight()
        drawLines()
        drawDepthValues()
        delay(20);
    }
    if (getPrevPress() && currentNotchDepth > 0) {
        currentNotchDepth -= 1;
        updatecurrentNotchHeight()
        drawLines()
        drawDepthValues()
        delay(20);
    }
}
