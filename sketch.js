let cols, rows;
let scl = 30;  // Scale of grid
let w, h;
let terrain = [];
let t = 0;
let seaLevel = -50;  // Define the "sea" height

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  w = windowWidth * 2;  // Extend terrain width to hide edges
  h = windowHeight * 2; // Extend terrain height to hide edges
  cols = floor(w / scl);
  rows = floor(h / scl);

  for (let y = 0; y < rows; y++) {
    terrain[y] = [];
    for (let x = 0; x < cols; x++) {
      terrain[y][x] = 0;
    }
  }
}

function draw() {
  background(255, 165, 200);  // Red background

  rotateX(PI / 3);  // Tilt the view
  translate(-w / 2, -h / 2);

  t += 0.01;  // Move noise over time

  let yOffset = t;
  for (let y = 0; y < rows; y++) {
    let xOffset = 0;
    for (let x = 0; x < cols; x++) {
      let heightValue = map(noise(xOffset, yOffset), 0, 1, -100, 100);
      terrain[y][x] = heightValue;
      xOffset += 0.1;
    }
    yOffset += 0.1;
  }

  // Render the glowing landscape with hidden edges
  for (let y = 1; y < rows - 2; y++) {  // Ignore first & last rows to fade edges
    beginShape(TRIANGLE_STRIP);
    for (let x = 1; x < cols - 2; x++) { // Ignore first & last cols to fade edges
      let h = terrain[y][x];

      // Fade edges with transparency
      let edgeFade = map(dist(x, y, cols / 2, rows / 2), 0, cols / 2, 255, 0); 

      // Generate dynamic glow effect
      let glowIntensity = map(sin(t + x * 0.1 + y * 0.1), -1, 1, 100, 255);

      if (h < seaLevel) {
        // Water glow effect (brighter center, fading edges)
        stroke(255,0,255, glowIntensity, glowIntensity, edgeFade);
        fill(255,50,70, glowIntensity, glowIntensity, edgeFade);
        h = seaLevel - (h - seaLevel); // Mirror terrain for reflection
      } else {
        // Terrain glow effect (fades near edges)
        stroke(0,3,255, glowIntensity, glowIntensity, edgeFade);
        fill(255,3,50, glowIntensity, glowIntensity, edgeFade / 1.5);
      }

      vertex(x * scl, y * scl, h);
      vertex(x * scl, (y + 1) * scl, terrain[y + 1][x]);
    }
    endShape();
  }
}

