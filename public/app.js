const socket = io.connect();
socket.emit("hello", "harshit");
let tVal = 0.2;
let myhue;
let hueSlider;
let tSlider;
function setup() {
  myhue = Math.random() * 255;

  hueSlider = select("#hue").elt;

  hueSlider.value = 1 - myhue;

  hueSlider.addEventListener("input", () => {
    myhue = +hueSlider.value;
  });
  tSlider = select("#smooth").elt;
  tSlider.value = tVal;
  tSlider.addEventListener("input", () => {
    tVal = 1 - tSlider.value;
    console.log("changing tval", tVal);
  });

  const cnv = createCanvas(300, 400);
  cnv.parent("#app");
  background(11);

  strokeCap("ROUND");
  strokeWeight(6);
  colorMode(HSB, 255, 255, 255);
  noStroke();
  fill(myhue);

  socket.on("draw", (data) => {
    stroke(data.hue, 150, 240);

    line(data.x, data.y, data.px, data.py);
  });
}

let px;
let py;

function draw() {
  if (!mouseIsPressed) {
    px = py = false;
  } else {
    if (!px || !py) {
      (px = mouseX), (py = mouseY);
    }
    const x = px + (mouseX - px) * tVal;
    const y = py + (mouseY - py) * tVal;

    const coords = { x, y, px, py, hue: myhue };
    socket.emit("draw", coords);
    // line(mouseX, mouseY, pmouseX, pmouseY);
    px = x;
    py = y;
  }
}
