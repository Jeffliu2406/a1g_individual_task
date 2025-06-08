let stripes = [];
let currentStripe = 0;

function setup() {
  createCanvas(1440, 800);
  background(240, 240, 225);
  angleMode(DEGREES);

  let baseAngles = [0, 90, -90]; //Angle settings

  for (let i = 0; i < 100; i++) {
    stripes.push(new LineStripe(
      random(-800, 500),        // x
      random(-500, 500),        // y
      random(100, 2000),        // length
      random(0.1, 5),           // spacing
      floor(random(6, 50)),     // number of lines
      random(baseAngles),       // angle
      random(0.3, 3)            // base weight
    ));
  }

  
}

function draw() {
  translate(width / 2, height / 2);  
  
  //Generate line groups through loop
  if (currentStripe < stripes.length) {
    stripes[currentStripe].displayStep();
    if (stripes[currentStripe].done) {
      currentStripe++;
    }
  } else {
    noLoop(); //Stop looping
  }
}


//Line group class
class LineStripe {
  constructor(x, y, len, spacing, count, angle, baseWeight) {
    this.x = x;
    this.y = y;
    this.len = len;
    this.spacing = spacing;
    this.count = count;
    this.angle = angle;
    this.baseWeight = baseWeight;
    this.lines = [];
    this.index = 0;
    this.done = false;

    for (let i = 0; i < this.count; i++) {
      let offsetY = i * this.spacing;
      let opacity = random(2, 100);
      let weight = this.baseWeight + random(-0.1, 0.5);
      this.lines.push({ offsetY, opacity, weight });
    }
  }
  
  //Draw line group function
  displayStep() {
    push();
    translate(this.x, this.y);
    rotate(-this.angle);

    if (this.index < this.lines.length) {
      let l = this.lines[this.index];
      let gray = random(2, 180); // Grayscale color
      stroke(gray, l.opacity); // Color opacity change
      strokeWeight(l.weight); // Line thickness change
      line(0+l.offsetY, l.offsetY, this.len+l.offsetY, l.offsetY); //生成线段
      this.index++; // Increase number of lines
    } else {
      this.done = true;
    }

    pop();
  }
}