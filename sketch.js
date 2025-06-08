// Declare core variables for stripe system and layout control
let stripes = [];
let currentStripe = 0;
let rangeX, rangeY, rangeLength;
let mode = 1; // Display mode: 0 = cross, 1 = parallel
let buttonW = 200;
let buttonH = 48;
let avoidRadius = 80; // Radius for mouse avoidance
let avoidForce = 2;   // Strength of avoidance force

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(240, 240, 225);

  // Define initial stripe generation bounds
  rangeX = windowWidth * 0.3;
  rangeY = windowHeight * 0.3;
  rangeLength = windowWidth * 0.5;

  // Angle options based on mode
  let baseAngles = mode === 0 ? [0, 90, -90] : [0];

  // Generate 100 randomized stripe groups
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

  // Build each stripe one by one
  if (currentStripe < stripes.length) {
    stripes[currentStripe].displayStep();
    if (stripes[currentStripe].done) currentStripe++;
  }

  // Update and display all stripes
  for (let stripe of stripes) {
    stripe.avoidMouse(mouseX - width / 2, mouseY - height / 2); // Trigger avoidance behavior
    stripe.update();  // Apply velocity and bounce logic
    stripe.display(); // Render stripe lines
  }

  drawModeButton(); // Draw interactive mode toggle button
}

// UI: Mode switch button
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

// Handle mouse clicks
function mousePressed() {
  let x = 20;
  let y = height - buttonH - 20;

  // If button clicked, toggle mode and regenerate
  if (mouseX >= x && mouseX <= x + buttonW && mouseY >= y && mouseY <= y + buttonH) {
    mode = mode === 1 ? 0 : 1;
    stripes = [];
    currentStripe = 0;
    loop();
    setup();
  } else {
    // Elsewhere click: make all stripes fully opaque (remove shadow effect)
    for (let s of stripes) {
      s.clearOpacity();
    }
  }
}

// Spacebar triggers explosion of all stripes
function keyPressed() {
  if (key === ' ') {
    for (let s of stripes) s.explode();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Stripe generator class (group of lines)
class LineStripe {
  constructor(x, y, len, spacing, count, angle, baseWeight) {
    this.x = x;
    this.y = y;
    this.len = len;
    this.spacing = spacing;
    this.count = count;
    this.angle = angle;
    this.baseWeight = baseWeight;
    this.lines = [];   // Array of individual lines
    this.index = 0;
    this.done = false;
    this.currentLen = 0;
    this.gray = random(10, 200);
    this.vx = 0; // velocity x
    this.vy = 0; // velocity y

    // Populate line info
    for (let i = 0; i < this.count; i++) {
      let offsetY = i * this.spacing;
      let opacity = random(2, 100);
      let weight = this.baseWeight + random(-0.1, 0.5);
      let m = round(random(3)); // line drawing direction variant
      this.lines.push({ offsetY, opacity, weight, m });
    }
  }

  // Stepwise build animation
  displayStep() {
    push();
    translate(this.x, this.y);
    rotate(-this.angle);
    for (let l of this.lines) {
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

  // Move logic: includes bounce and friction
  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off canvas edge
    if (this.x < -width / 2 || this.x > width / 2) this.vx *= -0.85;
    if (this.y < -height / 2 || this.y > height / 2) this.vy *= -0.85;

    // Friction slows motion gradually
    this.vx *= 0.98;
    this.vy *= 0.98;
  }

  // Draw complete stripe
  display() {
    push();
    translate(this.x, this.y);
    rotate(-this.angle);
    for (let l of this.lines) {
      stroke(this.gray, l.opacity);
      strokeWeight(l.weight);
      line(0 + l.offsetY, l.offsetY, this.len + l.offsetY, l.offsetY);
    }
    pop();
  }

  // Apply randomized "burst" motion
  explode() {
    let angle = random(TWO_PI);
    this.vx = cos(angle) * random(12, 20);
    this.vy = sin(angle) * random(5, 10);
  }

  // Stripe avoids mouse when nearby
  avoidMouse(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    if (d < avoidRadius) {
      let angle = atan2(this.y - my, this.x - mx);
      this.vx += cos(angle) * avoidForce;
      this.vy += sin(angle) * avoidForce;
    }
  }

  // Restore line opacity to solid (remove fade)
  clearOpacity() {
    for (let l of this.lines) {
      l.opacity = 255;
    }
  }
}