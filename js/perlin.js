let yoff = 0.2;
let yoff2 = 0.5;
let yoff3 = 0.8;
var shape, shape2, shape3;

var screenW = window.innerWidth;
var screenH = window.innerHeight + 500;

function setup() {
  var canvas = createCanvas(screenW, screenH);
  canvas.parent('home');
  shape = createGraphics(screenW, screenH);
  shape2 = createGraphics(screenW, screenH);
  shape3 = createGraphics(screenW, screenH);
}

function windowResized() {
  screenW = window.innerWidth;
  screenH = window.innerHeight + 500;

  resizeCanvas(screenW, screenH);
  $('.scroll-snap').css({
    width: '100%',
    height: '100%'
  });

  shape.clear();
  shape2.clear();
  shape3.clear();

  shape = createGraphics(screenW, screenH);
  shape2 = createGraphics(screenW, screenH);
  shape3 = createGraphics(screenW, screenH);

  draw();
  resizeProjects();
}

function draw() {
  shape.clear();
  background(33, 32, 50);
  shape.stroke(108, 83, 203);
  shape.fill(108, 83, 203, 30);
  shape.beginShape();

  let xoff = 0;
  for (let x = 0; x <= width; x += 7) {
    let y = map(noise(xoff, yoff), 0, 1, 800, 400);
    shape.vertex(x, y);
    xoff += 0.008;
  }

  yoff += 0.001;
  shape.vertex(width, height - 150);
  shape.vertex(0, height - 150);
  shape.endShape(CLOSE);

  image(shape, 0, 0, screenW, screenH);


  //------------------------------------------------

  shape2.clear();
  shape2.stroke(57, 88, 170);
  shape2.fill(57, 88, 170, 30);
  shape2.beginShape();

  let xoff2 = 0;
  for (let x2 = 0; x2 <= width; x2 += 7) {
    let y2 = map(noise(xoff2, yoff2), 0, 1, 900, 500);
    shape2.vertex(x2, y2);
    xoff2 += 0.008;
  }

  yoff2 += 0.001;
  shape2.vertex(width, height - 150);
  shape2.vertex(0, height - 150);
  shape2.endShape(CLOSE);

  image(shape2, 0, 0, screenW, screenH);


  //------------------------------------------------

  shape3.clear();
  shape3.stroke(97, 97, 163);
  shape3.fill(255, 255, 255, 10);
  shape3.beginShape();

  let xoff3 = 0;
  for (let x3 = 0; x3 <= width; x3 += 7) {
    let y3 = map(noise(xoff3, yoff3), 0, 1, 1000, 600);
    shape3.vertex(x3, y3);
    xoff3 += 0.008;
  }

  yoff3 += 0.001;
  shape3.vertex(width, height - 150);
  shape3.vertex(0, height - 150);
  shape3.endShape(CLOSE);

  image(shape3, 0, 0, screenW, screenH);
}

//33, 32, 50

//rgb(55, 87, 162)

//rgb(108, 83, 203)