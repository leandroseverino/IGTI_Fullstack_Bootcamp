window.addEventListener("load", init);

let redColor = null,
  greenColor = null,
  blueColor = null;

let square = document.querySelector("#square");

function init() {
  let redRangeSelector = document.querySelector("#redRangeSelector");
  redRangeSelector.addEventListener("input", changeRedColor);

  let greenRangeSelector = document.querySelector("#greenRangeSelector");
  greenRangeSelector.addEventListener("input", changeGreenColor);

  let blueRangeSelector = document.querySelector("#blueRangeSelector");
  blueRangeSelector.addEventListener("input", changeBlueColor);

  document.querySelector("#redOutputValue").value = redColor =
    redRangeSelector.value;

  document.querySelector("#greenOutputValue").value = greenColor =
    greenRangeSelector.value;

  document.querySelector("#blueOutputValue").value = blueColor =
    blueRangeSelector.value;

  applyColorToSquare(redColor, greenColor, blueColor);
}

function changeRedColor(event) {
  redColor = event.target.value;
  applyColorToSquare(redColor, greenColor, blueColor);
  document.querySelector("#redOutputValue").value = redColor;
}

function changeGreenColor(event) {
  greenColor = event.target.value;
  applyColorToSquare(redColor, greenColor, blueColor);
  document.querySelector("#greenOutputValue").value = greenColor;
}

function changeBlueColor(event) {
  blueColor = event.target.value;
  applyColorToSquare(redColor, greenColor, blueColor);
  document.querySelector("#blueOutputValue").value = blueColor;
}

function applyColorToSquare(redColor, greenColor, blueColor) {
  square.style.backgroundColor =
    "rgb(" + redColor + "," + greenColor + "," + blueColor + ")";
}
