// CAMERA
const cam = document.getElementById("cam");
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => cam.srcObject = stream)
  .catch(err => console.error("Camera error:", err));

// HUD
const hud = document.getElementById("hud");
const ctx = hud.getContext("2d");

function fit() {
  hud.width = window.innerWidth;
  hud.height = window.innerHeight;
}
fit();
setTimeout(fit, 100); // mobile fix
window.addEventListener("resize", fit);

// FIELD
let field3D = [];

// TAP TO ADD NODE
hud.addEventListener("click", e => {
  const rect = hud.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  field3D.push({ x, y });
});

// SIMPLE DRIFT MEMORY FOR MAP
let driftMemory = [];
function updateDriftMemory() {
  driftMemory.push({ x: 0, y: 0 });
  if (driftMemory.length > 50) driftMemory.shift();
}

// MAP
const omegaMap = document.getElementById("omegaMap");
const mapCtx = omegaMap.getContext("2d");

function fitMap() {
  omegaMap.width = 160;
  omegaMap.height = 160;
}
fitMap();

// DRAW MAP
function drawOmegaMap() {
  mapCtx.clearRect(0, 0, omegaMap.width, omegaMap.height);

  const cx = omegaMap.width / 2;
  const cy = omegaMap.height / 2;

  // Draw nodes
  field3D.forEach(n => {
    const mx = cx + (n.x - hud.width/2) / 20;
    const my = cy + (n.y - hud.height/2) / 20;

    mapCtx.fillStyle = "rgba(255,215,0,0.9)";
    mapCtx.beginPath();
    mapCtx.arc(mx, my, 4, 0, Math.PI*2);
    mapCtx.fill();
  });

  // Drift trail
  mapCtx.strokeStyle = "rgba(0,255,0,0.5)";
  mapCtx.lineWidth = 2;
  mapCtx.beginPath();

  driftMemory.forEach((p, i) => {
    const mx = cx + p.x / 20;
    const my = cy + p.y / 20;
    if (i === 0) mapCtx.moveTo(mx, my);
    else mapCtx.lineTo(mx, my);
  });

  mapCtx.stroke();
}

// MAIN LOOP
function loop() {
  ctx.clearRect(0, 0, hud.width, hud.height);

  // HUD background
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, hud.width, hud.height);

  // HUD test text
  ctx.fillStyle = "yellow";
  ctx.font = "24px sans-serif";
  ctx.fillText("HUD ACTIVE", 20, 40);

  // Draw nodes
  field3D.forEach(n => {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(n.x, n.y, 20, 0, Math.PI*2);
    ctx.fill();
  });

  updateDriftMemory();
  drawOmegaMap();

  requestAnimationFrame(loop);
}

loop();
