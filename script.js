let canvas = document.querySelector(".canvas");
let btnClear = document.querySelector(".btn-clear");
let btnUndo = document.querySelector(".btn-undo");
let defaultColors = document.querySelectorAll(".color");
let colorPicker = document.querySelector(".color-picker");
let penSize = document.querySelector(".pen-size");

canvas.width = window.innerWidth - 40;
canvas.height = 700;

let context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

let drawColor = "black";
let drawSize = "2";
let isDraw = false;
let undo_array = [];
let index = -1;

canvas.addEventListener("touchstart", startDrawing, false);
canvas.addEventListener("touchmove", drawing, false);
canvas.addEventListener("mousedown", startDrawing, false);
canvas.addEventListener("mousemove", drawing, false);

canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseleave", stop, false);
canvas.addEventListener("touchend", stop, false);

colorPicker.onchange = function() {
    drawColor = this.value;
}

penSize.onchange = function() {
    drawSize = this.value;
}

function startDrawing(event) {
    isDraw = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    event.preventDefault();
}

function drawing(event) {
    if(isDraw) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.strokeStyle = drawColor;
        context.lineWidth = drawSize;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }
    event.preventDefault();
}

function stop(event) {
    if(isDraw) {
        context.stroke();
        context.closePath();
        isDraw = false;
    }
    
    event.preventDefault();
    if(event.type != "mouseout") {
        undo_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
} 

defaultColors[0].addEventListener("click", defColor);
defaultColors[1].addEventListener("click", defColor);
defaultColors[2].addEventListener("click", defColor);

function defColor(e) {
    if(e.target.className == "color red") {
        drawColor = "red";
    } else if(e.target.className == "color green") {
        drawColor = "green";
    } else {
        drawColor = "blue";
    }
}

btnClear.addEventListener("click", clear);

function clear() {
    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    undo_array = [];
    index = -1;
}

btnUndo.onclick = function() {
    if(index <= 0) {
        clear();
    } else {
        index -= 1;
        undo_array.pop();
        context.putImageData(undo_array[index], 0, 0);
    }
}

