let colorPalettes = [
  { name: "Vibrance", colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF'] },
  { name: "Pastel", colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'] },
  { name: "Mono", colors: ['#000000', '#333333', '#666666', '#999999', '#FFFFFF'] },
  { name: "Neon", colors: ['#FF00FF', '#00FFFF', '#FF00AA', '#AA00FF', '#00FF00'] },
  { name: "Dirt", colors: ['#5D4037', '#795548', '#A1887F', '#BCAAA4', '#D7CCC8'] },
  { name: "Autumn", colors: ['#8B4513', '#CD853F', '#DEB887', '#D2691E', '#FFDAB9'] },
  { name: "Retro Pop", colors: ['#FF69B4', '#FF6347', '#FFD700', '#00CED1', '#9370DB'] },
  { name: "Muted", colors: ['#2F4F4F', '#708090', '#778899', '#B0C4DE', '#F0F8FF'] },
  { name: "Tropical ", colors: ['#00A86B', '#FDBE02', '#FF4F58', '#0089A7', '#F7EF81'] },
  { name: "Metro", colors: ['#2C3E50', '#E74C3C', '#ECF0F1'] },
  {name: 'Youth', colors: ['#045f9f','#dd1812','#ecd559','#433c41']},
  {name: 'Drab', colors: ['#6598B0','#4F745F','#C8BF96']},
  {name: 'Sunrise', colors: ['#FFEB3B', '#FDD835', '#FBC02D', '#F9A825', '#F57F17', '#F57C00', '#F4511E', '#E64A19']},
  {name: 'Home', colors: ['#14279B', '#3D56B2', '#5C7AEA', '#E6E6E6', '#476072', '#5C6E91', '#1089FF', '#BBCFFF']},
  {name: 'Grass', colors: ['#DCE775', '#D4E157', '#CDDC39', '#C5D627', '#AFB42B', '#9E9D24', '#827717', '#5A4C00']},
  ];
let bgColors = [
  {name: 'Pale Pink', bg: ['#FADADD']},
  {name: 'Cream', bg: ['#FEFBEA']},
  {name: 'Black', bg: ['#000000']},
  {name: 'White', bg: ['#FFFFFF']},
];

let selectedPalette;
let selectedBackground;
let minDiameterRatio = 0.0001;
let maxDiameterRatio = 0.01;
let canvas;
let amplitudeRatio;
let frequencyRatio;
let renderProgress = 0;
let glitchElements = [];
let noiseIntensity = 1;
let glitches;

function setup() {
  let container = select('#canvas-container');
  let size = min(container.width, container.height * 0.8);
  canvas = createCanvas(size, size * 5/4);
  canvas.parent(container);
  pixelDensity(5);
  amplitudeRatio = hl.randomElement([0.002, 0.005, 0.01, 0.1, 0.5, 1]);
  frequencyRatio = hl.randomElement([100, 150, 200, 300, 500]);

  selectedPalette = hl.randomElement(colorPalettes);
  selectedBackground = hl.randomElement(bgColors);

  background(selectedBackground.bg);
  addFinalNoise();
  noStroke();

  prepareGlitchElements();
  
  setTraits();
  
  loop();
}

function draw() {
  if (renderProgress < height) {
    drawAnimatedArtwork();
  } else if (glitchElements.length > 0) {
    drawGlitchElements();
  } else {
    addFinalNoise();
    noLoop();
  }
}

function drawAnimatedArtwork() {
  let minDiameter = width * minDiameterRatio;
  let maxDiameter = width * maxDiameterRatio;
  
  let y = renderProgress;
  let lineColor = color(hl.randomElement(selectedPalette.colors));
  fill(lineColor);
  
  let x = 0;
  let amplitude = width * amplitudeRatio;
  let frequency = frequencyRatio / width;
  
  while (x < width) {
    let lineLength = hl.random(width * 0.1, width * 0.5);
    let endX = min(x + lineLength, width);
    
    for (let dotX = x; dotX < endX; dotX += maxDiameter * 0.8) {
      let oscillation = sin(dotX * frequency) * amplitude;
      let yPos = y + oscillation;
      let diameter = hl.random(minDiameter, maxDiameter);
      circle(dotX, yPos, diameter);
    }
    
    x = endX;
  }
  
  renderProgress += maxDiameter * 0.8;
}

function prepareGlitchElements() {
  glitches = hl.randomElement([50, 150, 200, 400]);
  for (let i = 0; i < glitches; i++) {
    glitchElements.push({
      x: hl.random(width),
      y: hl.random(height),
      w: hl.random(width * 0.03, width * 0.2),
      h: hl.random(height * 0.02, height * 0.1),
      color: color(hl.randomElement(selectedPalette.colors)),
      alpha: hl.randomElement([50, 100, 250, 500])
    });
  }
}

function drawGlitchElements() {
  let minDiameter = width * minDiameterRatio;
  let maxDiameter = width * maxDiameterRatio;
  
  let glitch = glitchElements.pop();
  let glitchColor = glitch.color;
  glitchColor.setAlpha(glitch.alpha);
  fill(glitchColor);
  
  for (let dotX = glitch.x; dotX < glitch.x + glitch.w; dotX += maxDiameter * 0.6) {
    for (let dotY = glitch.y; dotY < glitch.y + glitch.h; dotY += maxDiameter * 0.6) {
      let diameter = hl.random(minDiameter, maxDiameter);
      circle(dotX, dotY, diameter);
    }
  }
}

function addFinalNoise() {
  loadPixels();
  let d = pixelDensity();
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let index = 4 * (y * width * sq(d) + x * d);
      
      pixels[index] = constrain(pixels[index] + random(-noiseIntensity * 255, noiseIntensity * 255), 0, 255);
      pixels[index + 1] = constrain(pixels[index + 1] + random(-noiseIntensity * 255, noiseIntensity * 255), 0, 255);
      pixels[index + 2] = constrain(pixels[index + 2] + random(-noiseIntensity * 255, noiseIntensity * 255), 0, 255);
    }
  }
  
  updatePixels();
}

function windowResized() {
  pixelDensity(5);
  let container = select('#canvas-container');
  let size = min(container.width, container.height * 0.8);
  resizeCanvas(size, size * 5/4);
  background(selectedBackground.bg);
  renderProgress = 0;
  prepareGlitchElements();
  loop();
}

function setTraits() {
  const traits = {
    Palette: selectedPalette.name,
    Background: selectedBackground.name,
    Amplitude: amplitudeRatio <= 0.01 ? "Controlled" :
               amplitudeRatio <= 0.5 ? "Messy" : "Splatter",
    Glitch: glitches === 50 ? "Sparse" :
            glitches === 150 ? "Normal" :
            glitches === 200 ? "Dense" : "Crowded",
    Frequency: frequencyRatio <= 100 ? "Low" :
               frequencyRatio <= 200 ? "Medium" : "High",
  };

  hl.token.setTraits(traits);
      
  hl.token.setName(`Colonies #${hl.tx.tokenId}`);
  hl.token.setDescription(
    `Colonies #${hl.tx.tokenId} Minted by ${hl.tx.walletAddress}. Pastelle, 2024`
  );
}

function capturePreview() {
  let canvasElement = document.querySelector('#canvas-container canvas');
  
  if (canvasElement) {
    let dataURL = canvasElement.toDataURL();
    let event = new CustomEvent('CAPTURE_PREVIEW', { detail: dataURL });
    window.dispatchEvent(event);
  }
}