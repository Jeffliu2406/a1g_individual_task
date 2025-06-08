
let stripes = [];
let currentStripe = 0;
let rangeX;
let rangeY;
let rangeLength;
let mode = 1;
let buttonW = 200;
let buttonH = 48;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(240, 240, 225);
  rangeX = windowWidth * 0.3;
  rangeY = windowHeight * 0.3;
  rangeLength = windowWidth * 0.5;

  let baseAngles = mode === 0 ? [0, 90, -90] : [0];
  for (let i = 0; i < 100; i++) {
    stripes.push(new LineStripe(
      random(-rangeX, rangeX),
      random(-rangeY, rangeY),
      random(20, rangeLength),
      random(0.1, 8),
      floor(random(6, 50)),
      random(baseAngles),
      random(0.1, 1)
    ));
  }
}

function draw() {
  translate(width / 2, height / 2);
  if (currentStripe < stripes.length) {
    stripes[currentStripe].displayStep();
    if (stripes[currentStripe].done) currentStripe++;
  }

  for (let stripe of stripes) {
    stripe.update();
    stripe.display();
  }

  drawModeButton();
}

function drawModeButton() {
  push();
  resetMatrix();
  let x = 20;
  let y = height - buttonH - 20;
  fill(255, 230, 180, 220);
  stroke(120);
  strokeWeight(2);
  rect(x, y, buttonW, buttonH, 12);
  fill(60);
  noStroke();
  textSize(20);
  textAlign(CENTER, CENTER);
  text(mode === 1 ? "Switch to cross" : "Switch to parallel", x + buttonW / 2, y + buttonH / 2);
  pop();
}

function mousePressed() {
  let x = 20;
  let y = height - buttonH - 20;
  if (mouseX >= x && mouseX <= x + buttonW && mouseY >= y && mouseY <= y + buttonH) {
    mode = mode === 1 ? 0 : 1;
    stripes = [];
    currentStripe = 0;
    loop();
    setup();
  }
}

function keyPressed() {
  if (key === ' ') {
    for (let s of stripes) s.explode();
  }
}

function mouseMoved() {
  for (let s of stripes) {
    let d = dist(mouseX - width / 2, mouseY - height / 2, s.x, s.y);
    if (d < 80) {
      let angle = atan2(s.y - (mouseY - height / 2), s.x - (mouseX - width / 2));
      s.vx += cos(angle) * 2;
      s.vy += sin(angle) * 2;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class LineStripe {
  constructor(x, y, len, spacing, count, angle, baseWeight) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.len = len;
    this.spacing = spacing;
    this.count = count;
    this.angle = angle;
    this.baseWeight = baseWeight;
    this.lines = [];
    this.index = 0;
    this.done = false;
    this.currentLen = 0;
    this.gray = random(10, 200);
    this.vx = 0;
    this.vy = 0;

    for (let i = 0; i < this.count; i++) {
      let offsetY = i * this.spacing;
      let opacity = random(2, 100);
      let weight = this.baseWeight + random(-0.1, 0.5);
      let m = round(random(3));
      this.lines.push({ offsetY, opacity, weight, m });
    }
  }

  displayStep() {
    push();
    translate(this.x, this.y);
    rotate(-this.angle);
    for (let i = 0; i < this.lines.length; i++) {
      let l = this.lines[i];
      stroke(this.gray, l.opacity);
      strokeWeight(l.weight);
      if (l.m === 0) {
        line(0 + l.offsetY, l.offsetY, this.currentLen + l.offsetY, l.offsetY);
      } else {
        line(this.len + l.offsetY, l.offsetY, this.len - this.currentLen + l.offsetY, l.offsetY);
      }
    }
    if (this.currentLen < this.len) {
      this.currentLen += 10;
    } else {
      this.done = true;
    }
    pop();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -width / 2 || this.x > width / 2) this.vx *= -0.85;
    if (this.y < -height / 2 || this.y > height / 2) this.vy *= -0.85;

    this.vx *= 0.98;
    this.vy *= 0.98;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(-this.angle);
    for (let i = 0; i < this.lines.length; i++) {
      let l = this.lines[i];
      stroke(this.gray, l.opacity);
      strokeWeight(l.weight);
      line(0 + l.offsetY, l.offsetY, this.len + l.offsetY, l.offsetY);
    }
    pop();
  }

  explode() {
    let angle = random(TWO_PI);
    this.vx = cos(angle) * random(8, 14);
    this.vy = sin(angle) * random(2, 6);
  }
}