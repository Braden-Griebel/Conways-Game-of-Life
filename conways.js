//Some Helpful functions
function createZeroArray(rows, cols=rows){
    let arr = [];
    for(var i=0; i<rows; i++){
        for (var j=0;j<cols; j++){
            arr[i] = new Array(cols).fill(0);
        }
    }
    return arr;
}

function emptyNode(node){
    while(node.firstChild){
        node.removeChild(node.lastChild)
    }
}

// Conways Game Functions
// Neighbor functions
function rotateVecRight(arr){
    let retArr = [...arr];
    let lastElem = retArr.pop();
    retArr.unshift(lastElem);
    return retArr;
}


function rotateVecLeft(arr){
    retArr = [...arr];
    let firstElem = retArr.shift();
    retArr[retArr.length] = firstElem;
    return retArr;
}

function rotateMatUp(arr){
    return rotateVecLeft(arr);
}

function rotateMatDown(arr){
    return rotateVecRight(arr);
}

function rotateMatLeft(arr){
    return arr.map((row)=>{return rotateVecLeft(row);})
}

function rotateMatRight(arr){
    return arr.map((row)=>{return rotateVecRight(row);})
}

// calculate the wrapped neighbors
function getNeighbors(boardState){
    // Get all the rotations
    let rotUp = rotateMatUp(boardState);
    let rotDown = rotateMatDown(boardState);
    let rotLeft = rotateMatLeft(boardState);
    let rotRight = rotateMatRight(boardState);
    let rotUpLeft = rotateMatUp(rotLeft);
    let rotUpRight = rotateMatUp(rotRight);
    let rotDownLeft = rotateMatDown(rotLeft);
    let rotDownRight = rotateMatDown(rotRight);
    let resArr = [];
    // Sum up neighbors for each cell
    for(var i=0;i<boardState.length;i++){
        resArr[i]=[];
        for(var j=0; j<boardState[i].length; j++){
            resArr[i][j] = (rotUp[i][j] + 
                rotDown[i][j] + 
                rotLeft[i][j] + 
                rotRight[i][j] + 
                rotUpLeft[i][j] +
                rotUpRight[i][j] +
                rotDownLeft[i][j] + 
                rotDownRight[i][j]
            );
        }
    }
    return resArr;
}

// update the board state
// 1. Any live cell with fewer than two neighbors dies
// 2. Any live cell with two or three live neighbors lives on
// 3. Any live cell with more than three neighbors dies
// 4. Any dead cell with exactly three live neighbors becomes a live cell
function updateBoardState(boardState){
    let updatedState = [];
    let numNeighbors = getNeighbors(boardState);
    for(var i=0; i< boardState.length;i++){
        updatedState[i]=[];
        for(var j=0; j < boardState[i].length;j++){
            cellState = boardState[i][j];
            cellNeighbors = numNeighbors[i][j];
            // Cell is alive (rules 1-3)
            if(cellState === 1){
                // rule 1
                if(cellNeighbors < 2){
                    updatedState[i][j] = 0;
                // rule 2
                } else if ((cellNeighbors===2)||(cellNeighbors===3)){
                    updatedState[i][j] = 1;
                // rule 3
                } else if(cellNeighbors>3){
                    updatedState[i][j]= 0;
                } else {
                    console.error("Impossible Number of Neighbors");
                }
            // Cell is dead (rule 4)
            } else if (cellState === 0){
                if(cellNeighbors === 3){
                    updatedState[i][j] = 1;
                } else {
                    updatedState[i][j]=0;
                }
            }
        }
    }
    return updatedState;
}


// Function to run simulation
function nextFrame(){
    // Clear the board
    boardContext.clearRect(0,0,boardCanvas.width, boardCanvas.height);
    // Update the board state
    boardState = updateBoardState(boardState);
    // Draw the new state
    drawBoard(canvas=boardCanvas, context=boardContext, boardState=boardState);
}




// Initialise variables
let size = 10;
let delay = 5;
let boardState = [];
let intervalId;
const boardCanvas = document.getElementById("board");
const boardContext = boardCanvas.getContext("2d");
boardCanvas.width = 500;
boardCanvas.height = 500;


// Board functions
function inialiseBoard(canvas, context, size){
    //clear the board
    context.clearRect(0,0,canvas.width, canvas.height);
    // initialize the board state array
    boardState = createZeroArray(rows=size);
}

function drawBoard(canvas, context, boardState){
    // clear canvas
    context.clearRect(0,0, canvas.width, canvas.height);
    // Find the side length of the rectangles
    sideLength = canvas.width / size;
    // iterate through the board state and draw a black rectangle for active cells
    for(var i=0;i<boardState.length;i++){
        for(var j=0; j<boardState[i].length;j++){
            if(boardState[i][j]===1){
                context.fillRect(j*sideLength, i*sideLength, sideLength, sideLength);
            }
        }
    }

}

inialiseBoard(boardCanvas, boardContext, size);

// Form
// get submit button element
submitButton = document.getElementById("submit-button")
// submitted event listener
submitButton.addEventListener("click", ()=>{
    const sizeSlider = document.getElementById("size-slider");
    const timeSlider = document.getElementById("time-slider");
    size = parseInt(sizeSlider.value);
    delay = parseInt(timeSlider.value);
    inialiseBoard(boardCanvas, boardContext, size);
})

//display values for the sliders
const sizeSlider = document.getElementById("size-slider");
const timeSlider = document.getElementById("time-slider");

sizeSlider.addEventListener("input", function(){
    document.getElementById("size-slider-value").innerHTML = `Size of Field in Cells: ${this.value}`;
})

timeSlider.addEventListener("input", function(){
    document.getElementById("time-slider-value").innerHTML = `Time Delay Between Steps: ${this.value}00ms`;
})


// register clicks on the board
boardCanvas.addEventListener("click", function(event){
    // calculate offset or cell size in pixels
    const offset = Math.floor(500/size);
    const xCoord = event.offsetX;
    const yCoord = event.offsetY;
    // find which cell was clicked
    const iClicked = Math.floor(yCoord/offset);
    const jClicked = Math.floor(xCoord/offset);
    // update the board state
    boardState[iClicked][jClicked]=1^boardState[iClicked][jClicked];
    // draw the board
    drawBoard(boardCanvas, boardContext, boardState);
})


// Register the start and stop simulation buttons
const startButton = document.getElementById("start-button");
startButton.addEventListener("click", function(){
    intervalId = setInterval(nextFrame, delay*100);
})

const stopBUtton = document.getElementById("stop-button");
stopBUtton.addEventListener("click", function(){
    clearInterval(intervalId);
})