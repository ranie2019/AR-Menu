const models = [
  "champagne",
  "heineken",
  "redbull",
  "fizzydrink",
  "cubo",
  "sundae",
  "pizza",
];

let currentIndex = 0;

// Função para carregar o modelo local
function loadModel(name) {
  const container = document.querySelector("#modelContainer");
  const loadingIndicator = document.querySelector("#loadingIndicator");

  loadingIndicator.style.display = "block";

  const path = `3d/${name}.glb`;

  container.setAttribute("gltf-model", path);

  container.addEventListener("model-loaded", () => {
    loadingIndicator.style.display = "none";
  }, { once: true });

  container.addEventListener("model-error", (e) => {
    console.error("Erro ao carregar o modelo:", e.detail);
    loadingIndicator.innerText = "Erro ao carregar o modelo";
  }, { once: true });
}

// Troca de modelo
function changeModel(direction) {
  currentIndex = (currentIndex + direction + models.length) % models.length;
  loadModel(models[currentIndex]);
}

// Inicializa o primeiro modelo
loadModel(models[currentIndex]);

// Rotação automática
setInterval(() => {
  const model = document.querySelector("#modelContainer");
  const rotation = model.getAttribute("rotation");
  rotation.y += 0.5;
  model.setAttribute("rotation", rotation);
}, 30);

// Zoom com gesto de pinça
let initialDistance = null;
let initialScale = 1;

function updateScale(scaleFactor) {
  const model = document.querySelector("#modelContainer");
  const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.1), 10);
  model.setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
}

window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    initialDistance = Math.sqrt(dx * dx + dy * dy);
    const scale = document.querySelector("#modelContainer").getAttribute("scale");
    initialScale = scale.x;
  }
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2 && initialDistance) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);
    const scaleFactor = currentDistance / initialDistance;
    updateScale(scaleFactor);
  }
});

window.addEventListener("touchend", () => {
  initialDistance = null;
});
