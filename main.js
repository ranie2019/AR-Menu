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

function loadModel(name) {
  const container = document.querySelector("#modelContainer");
  const loadingIndicator = document.querySelector("#loadingIndicator");

  // Remove qualquer modelo anterior
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Atualiza posição, rotação e escala
  container.setAttribute("position", "0 -0.5 -3");
  container.setAttribute("rotation", "0 180 0");
  container.setAttribute("scale", "1 1 1");

  // Cria nova entidade do modelo
  const newModel = document.createElement("a-entity");
  newModel.setAttribute("gltf-model", `url(./3d/${name}.glb)`);

  // Mostra indicador de carregamento
  loadingIndicator.innerText = "Carregando...";
  loadingIndicator.style.display = "block";

  // Quando modelo carregar, oculta o indicador
  newModel.addEventListener("model-loaded", () => {
    loadingIndicator.style.display = "none";
  });

  // Se ocorrer erro no carregamento
  newModel.addEventListener("model-error", () => {
    loadingIndicator.innerText = "Erro ao carregar";
  });

  // Adiciona novo modelo ao container
  container.appendChild(newModel);
}

function changeModel(direction) {
  currentIndex = (currentIndex + direction + models.length) % models.length;
  loadModel(models[currentIndex]);
}

// Carrega primeiro modelo
loadModel(models[currentIndex]);

// Rotação automática
setInterval(() => {
  const container = document.querySelector("#modelContainer");
  const rotation = container.getAttribute("rotation");
  rotation.y += 0.5;
  container.setAttribute("rotation", rotation);
}, 30);

// Zoom com dois dedos
let initialDistance = null;
let initialScale = 1;

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
    const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.1), 10);
    const container = document.querySelector("#modelContainer");
    container.setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
  }
});

window.addEventListener("touchend", () => {
  initialDistance = null;
});

// Rotação vertical com 1 dedo
let startY = null;
let initialRotationX = 0;

window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    startY = e.touches[0].clientY;
    const container = document.querySelector("#modelContainer");
    initialRotationX = container.getAttribute("rotation").x;
  }
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1 && startY !== null) {
    const deltaY = e.touches[0].clientY - startY;
    const container = document.querySelector("#modelContainer");
    const rotation = container.getAttribute("rotation");
    const newX = Math.min(Math.max(initialRotationX - deltaY * 0.2, -90), 90);
    container.setAttribute("rotation", `${newX} ${rotation.y} ${rotation.z}`);
  }
});

window.addEventListener("touchend", () => {
  startY = null;
});
