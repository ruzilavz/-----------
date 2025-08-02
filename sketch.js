// --- STATE & CONFIG ---
let state = 'waitingForMusic'; // 'waitingForMusic' -> 'playing'
let song;

// Графические переменные
let pg;
let neonBlue, neonPurple, darkBg;
let silhouettePoints = [];
let particles = [];
let codeStreams = [];

// --- PRELOAD: Загрузка ассетов перед стартом ---
function preload() {
  let songPath = "song.mp3";
  song = loadSound(songPath,
    () => console.log("Песня успешно загружена."),
    (err) => console.error("ОШИБКА: Не удалось загрузить песню. Убедитесь, что файл 'song.mp3' находится в папке проекта.", err)
  );
}

function setup() {
  // Вертикальный холст для TikTok (9:16)
  let h = windowHeight * 0.9;
  let w = h * (9 / 16);
  createCanvas(w, h);

  // Graphics setup
  pg = createGraphics(w, h);
  pg.colorMode(HSB, 360, 100, 100, 100);
  pg.textFont('monospace');

  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  // Palette
  neonBlue = color(220, 90, 100);
  neonPurple = color(280, 90, 100);
  darkBg = color(240, 30, 5);

  // Visual elements setup
  silhouettePoints = [
    { x: 0.55, y: 0.20 }, { x: 0.58, y: 0.22 }, { x: 0.60, y: 0.28 },
    { x: 0.62, y: 0.35 }, { x: 0.60, y: 0.40 }, { x: 0.65, y: 0.46 },
    { x: 0.63, y: 0.48 }, { x: 0.65, y: 0.50 }, { x: 0.62, y: 0.52 },
    { x: 0.60, y: 0.54 }, { x: 0.55, y: 0.58 }, { x: 0.52, y: 0.65 },
    { x: 0.50, y: 0.75 }, { x: 0.48, y: 0.85 }
  ];

  for (let i = 0; i < 20; i++) {
    codeStreams.push(new CodeStream(random(width)));
  }

  // Функция, которая остановит анимацию, когда песня закончится
  song.onended(() => {
    console.log("Песня закончилась. Анимация остановлена.");
    noLoop();
  });
}

function draw() {
  // Анимация отрисовывается всегда
  drawScene();

  // Если музыка еще не запущена, показываем подсказку
  if (state === 'waitingForMusic') {
    drawOverlayPrompt();
  }
}

function mousePressed() {
  // Клик запускает музыку, если она загружена и еще не играет
  if (state === 'waitingForMusic' && song.isLoaded()) {
    userStartAudio();
    song.play();
    state = 'playing'; // Меняем состояние, чтобы убрать подсказку
  }
}

// --- SCENE DRAWING & VISUALS ---
function drawScene() {
  pg.background(darkBg);
  pg.noStroke();
  for (let stream of codeStreams) { stream.update(); stream.display(pg); }
  drawGrid(pg);
  if (random(1) < 0.5) particles.push(new Particle());
  for (let i = particles.length - 1; i >= 0; i--) { particles[i].update(); particles[i].display(pg); if (particles[i].isDead()) particles.splice(i, 1); }
  drawUIFragments(pg);
  drawStatusIcons(pg);
  drawArtistName(pg);
  drawSilhouetteGlow(pg);
  drawSilhouette(pg);
  drawGlitch(pg, 3);
  drawTitle(pg);

  background(0);
  blendMode(ADD);
  let offset = sin(frameCount * 0.05) * 2;
  tint(255, 0, 0); image(pg, offset, 0);
  tint(0, 255, 0); image(pg, 0, offset);
  tint(0, 0, 255); image(pg, -offset, 0);
  blendMode(BLEND);
  noTint();
  
  // Вызов функции, которая раньше отсутствовала
  drawScanlines(this);
}

// Новая функция для подсказки поверх анимации
function drawOverlayPrompt() {
  fill(0, 50);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  let promptText = song.isLoaded() ? "[ CLICK TO START MUSIC ]" : "Loading Audio...";

  let pulse = 150 + sin(frameCount * 0.1) * 50;
  fill(neonBlue, pulse);
  textSize(18); textFont('monospace');
  text(promptText, width / 2, height / 2);
}

// --- ВОЗВРАЩЕННАЯ ФУНКЦИЯ ---
function drawScanlines(g) {
  g.stroke(0, 0, 0, 50);
  g.strokeWeight(1.5);
  for (let i = 0; i < g.height; i += 4) {
    g.line(0, i, g.width, i);
  }
  g.noStroke();
}

function drawArtistName(g) {
  g.push();
  g.textSize(g.height * 0.025);
  g.textAlign(LEFT, TOP);
  g.fill(neonPurple, 80);
  g.text("Ruz", g.width * 0.05, g.height * 0.03 + random(-0.5, 0.5));
  g.pop();
}

function drawTitle(g) {
  g.push();
  g.textAlign(CENTER, CENTER);
  g.textSize(g.height / 18);
  g.drawingContext.shadowBlur = 15;
  g.drawingContext.shadowColor = neonBlue;
  g.fill(neonBlue);
  g.text('Системная ошибка', g.width / 2, g.height * 0.85);
  g.drawingContext.shadowBlur = 0;
  g.fill(neonPurple, 50);
  g.text('Системная ошибка', g.width / 2 + random(-3, 3), g.height * 0.85 + random(-1, 1));
  g.pop();
}

// --- All other drawing and class functions ---
function drawSilhouette(g) { g.push(); g.noFill(); g.stroke(neonBlue); g.strokeWeight(2); g.beginShape(); g.curveVertex(g.width*silhouettePoints[0].x, g.height*silhouettePoints[0].y); for (let p of silhouettePoints) { g.curveVertex(g.width*p.x, g.height*p.y); } g.curveVertex(g.width*silhouettePoints[silhouettePoints.length-1].x, g.height*silhouettePoints[silhouettePoints.length-1].y); g.endShape(); g.pop(); }
function drawSilhouetteGlow(g) { g.push(); let pulse = 20 + sin(frameCount * 0.03) * 15; g.drawingContext.shadowBlur = pulse; g.drawingContext.shadowColor = color(200, 100, 100, 50); for(let i=0; i<4; i++){ drawSilhouette(g); } g.pop(); }
function drawGlitch(g, num) { if (frameCount % 10 > 2) return; for (let i = 0; i < num; i++) { let x = random(g.width), y = random(g.height), w = random(50, g.width * 0.4), h = random(2, 20); if (x > g.width * 0.4 && x < g.width * 0.7 && y > g.height * 0.2 && y < g.height * 0.8) continue; let shiftX = random(-10, 10); let region = g.get(x, y, w, h); g.image(region, x + shiftX, y); } }
function drawGrid(g) { g.stroke(neonBlue, 10); g.strokeWeight(0.5); for(let i=0; i<g.width; i+=40) { g.line(i, 0, i, g.height); g.line(0, i, g.width, i); } g.noStroke(); }
function drawUIFragments(g) { g.push(); let x = g.width * 0.2 + sin(frameCount * 0.02) * 20, y = g.height * 0.2, size = 100 + cos(frameCount * 0.02) * 20; g.strokeWeight(1.5); g.stroke(neonPurple, random(30, 80)); g.noFill(); g.arc(x, y, size, size, frameCount * 0.01, frameCount * 0.01 + PI); g.rect(x - size/2, y + size/2, size, 10); g.pop(); }
function drawStatusIcons(g) { g.push(); let battX = g.width * 0.85, battY = g.height * 0.05, battW = 30, battH = 15; g.fill(0,0,0,50); g.stroke(neonPurple); g.strokeWeight(1.5); g.rect(battX, battY, battW, battH, 2); g.rect(battX + battW, battY + battH/4, 3, battH/2); let charge = frameCount % 120 < 30 ? 0.2 : 0.25; g.fill(neonPurple); g.noStroke(); g.rect(battX + 3, battY + 3, battW * charge, battH - 6); g.pop(); g.push(); let connX = g.width * 0.1, connY = g.height * 0.95; g.stroke(neonBlue); g.strokeWeight(2); g.noFill(); for (let i = 0; i < 3; i++) { let d = 15 + i * 12; if (i === 0 && frameCount % 60 < 30) continue; g.arc(connX, connY, d, d, -PI * 0.75, -PI * 0.25); } g.pop(); }
class Particle { constructor() { this.pos = createVector(random(width), random(height)); this.vel = p5.Vector.random2D().mult(random(0.2, 0.8)); this.lifespan = 255; this.c = random(1) > 0.5 ? neonBlue : neonPurple; } isDead() { return this.lifespan < 0; } update() { this.pos.add(this.vel); this.lifespan -= 1.5; } display(g) { g.noStroke(); g.fill(hue(this.c), saturation(this.c), brightness(this.c), this.lifespan/3); g.ellipse(this.pos.x, this.pos.y, 3, 3); } }
class CodeStream { constructor(x) { this.x = x; this.y = random(-500, 0); this.speed = random(2, 6); this.chars = []; this.charCount = floor(random(10, 30)); this.fontSize = height * 0.015; for(let i = 0; i < this.charCount; i++) { this.chars.push(char(floor(random(48, 58)))); } } update() { this.y += this.speed; if(this.y > height + this.charCount * this.fontSize) { this.y = random(-500, 0); } if(frameCount % 5 === 0) { let i = floor(random(this.chars.length)); this.chars[i] = char(floor(random(48, 58))); } } display(g) { g.textSize(this.fontSize); for(let i=0; i < this.chars.length; i++) { const c = i === this.chars.length - 1 ? color(180, 50, 100) : color(220, 90, 100, 30); g.fill(c); g.text(this.chars[i], this.x, this.y - i * this.fontSize); } } }
function windowResized() { let h = windowHeight * 0.9; let w = h * (9 / 16); resizeCanvas(w, h); pg.resize(w,h); }
