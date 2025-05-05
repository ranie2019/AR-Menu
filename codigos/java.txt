// Lista de modelos disponíveis
const models = [
  "champagne",
  "heineken",
  "redbull",
  "fizzydrink",
  "cubo",
  "sundae",
  "pizza",
  "Chocolate_Quente",
  "absolut_vodka_1l",
  "JACK_DANIELS",
  "champagne_Lorem",
];

let currentIndex = 0; // Índice atual do modelo
const modelCache = {}; // Cache para armazenar modelos já carregados

// Carrega um modelo 3D e exibe na cena
function loadModel(name) {
  const container = document.querySelector("#modelContainer");
  const loadingIndicator = document.querySelector("#loadingIndicator");

  // Mostra a mensagem de carregamento
  loadingIndicator.style.display = "block";
  loadingIndicator.innerText = "Carregando...";

  // Remove modelo atual antes de carregar o novo
  container.removeAttribute("gltf-model");

  // Redefine posição, rotação e escala do modelo
  container.setAttribute("position", "0 -0.5 -3");
  container.setAttribute("rotation", "0 180 0");
  container.setAttribute("scale", "1 1 1");

  // Se o modelo já estiver no cache
  if (modelCache[name]) {
    container.setAttribute("gltf-model", modelCache[name]);
    loadingIndicator.style.display = "none";
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `./3d/${name}.glb`, true);
    xhr.responseType = "blob";

    // Quando terminar de carregar
    xhr.onload = () => {
      const blob = xhr.response;
      const url = URL.createObjectURL(blob);
      modelCache[name] = url;
      container.setAttribute("gltf-model", url);
      loadingIndicator.style.display = "none";
    };

    // Se der erro
    xhr.onerror = () => {
      console.error("Erro ao carregar o modelo.");
      loadingIndicator.innerText = "Erro ao carregar o modelo";
    };

    xhr.send();
  }
}

// Muda o modelo com base na direção (-1 para anterior, +1 para próximo)
function changeModel(direction) {
  currentIndex = (currentIndex + direction + models.length) % models.length;
  loadModel(models[currentIndex]);
}

// Carrega o primeiro modelo ao iniciar
loadModel(models[currentIndex]);

// Rotação automática no eixo Y
setInterval(() => {
  const model = document.querySelector("#modelContainer");
  if (!model) return;
  const rotation = model.getAttribute("rotation");
  rotation.y += 0.5;
  model.setAttribute("rotation", rotation);
}, 30);

// Escala com gesto de pinça
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

// Rotação vertical (X) com um dedo
let startY = null;
let initialRotationX = 0;

window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    startY = e.touches[0].clientY;
    const model = document.querySelector("#modelContainer");
    initialRotationX = model.getAttribute("rotation").x;
  }
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1 && startY !== null) {
    const deltaY = e.touches[0].clientY - startY;
    const model = document.querySelector("#modelContainer");
    const rotation = model.getAttribute("rotation");
    const newX = Math.min(Math.max(initialRotationX - deltaY * 0.2, -90), 90);
    model.setAttribute("rotation", `${newX} ${rotation.y} ${rotation.z}`);
  }
});

window.addEventListener("touchend", () => {
  startY = null;
});
