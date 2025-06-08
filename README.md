# A1G Individual Task – README.md

## 🖱️ Interaction Instructions  
Move the mouse slowly across the screen to interact with the animated lines.  
- **Hover:** Lines near the cursor will split and move aside, simulating avoidance.
- **Click:** Clicking resets line opacity and shadow effects.
- **Press and hold:** Lines will slowly move toward the cursor (simulated gravitational pull).
- **Press spacebar:** All lines will explode outward with slight gravity, bounce off canvas edges, and slow down gradually.

Open `index.html` in a browser to run the sketch.

---

## 🎨 Individual Code Overview  
**Method chosen:** User Input  
This project extends the group’s generative line drawing by introducing multiple interactive behaviors based on mouse and keyboard input.

**Animated properties:**  
- Line positions are dynamic and affected by mouse distance, simulating “smart” avoidance or attraction.  
- Opacity and bounce behaviors provide visual feedback and responsiveness.  
- Shadows and stroke properties are manipulated to differentiate user interactions from the base generative design.

**Inspiration references:**  
The work is inspired by Nasreen Mohamedi’s subtle geometric minimalism. Her orderly yet expressive linear structures inspired us to experiment with interactive, dynamic line movement. The lines avoid or react to user presence, representing controlled chaos and viewer presence as part of the composition.

---

## 🛠️ Technical Highlights  
- `mousePressed()` triggers opacity reset and toggles mode button.
- `mouseMoved()` checks cursor proximity and applies repulsion.
- `keyPressed()` spacebar triggers random directional explosions.
- `update()` handles boundary bounce physics.
- `avoidMouse()` and `pullToMouse()` implement avoidance and attraction logic.
- All interactivity is layered on top of the group’s existing `LineStripe` class.

---

## 🔗 Author  
Jeffliu2406  
University of Sydney – IDEA9103  