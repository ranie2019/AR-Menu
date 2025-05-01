const models = [
  "champagne",
  "heineken",
  "redbull",
  "fizzydrink",
  "chocolatecupcake",
  "sundae",
  "pizza",
];

let currentIndex = 0;
const modelCache = {};  // Cache para os modelos carregados

// Função para carregar o modelo
function loadModel(name) {
  const container = document.querySelector("#modelContainer");
  const loadingIndicator = document.querySelector("#loadingIndicator");

  loadingIndicator.style.display = "block";
  container.removeAttribute("gltf-model");  // Remover modelo anterior

  if (modelCache[name]) {
    // Se o modelo já foi carregado e está no cache, apenas usa ele
    container.setAttribute("gltf-model", modelCache[name]);
    loadingIndicator.style.display = "none";
  } else {
    console.log(`Carregando o modelo: https://ar-menu-models.s3.amazonaws.com/ar-models/${name}.glb`);
    
    // Carregar modelo do servidor
    fetch(`https://ar-menu-models.s3.amazonaws.com/ar-models/${name}.glb`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        modelCache[name] = url;  // Armazenar o modelo no cache
        container.setAttribute("gltf-model", url);
        loadingIndicator.style.display = "none";
      })
      .catch((error) => {
        console.error("Erro ao carregar o modelo:", error);
        loadingIndicator.innerText = "Erro ao carregar o modelo";
      });
  }
}

// Função para trocar de modelo
function changeModel(direction) {
  currentIndex = (currentIndex + direction + models.length) % models.length;
  loadModel(models[currentIndex]);
}

// Inicializa o primeiro modelo
loadModel(models[currentIndex]);

// Rotação automática do modelo 3D
setInterval(() => {
  const model = document.querySelector("#modelContainer");
  const rotation = model.getAttribute("rotation");
  rotation.y += 0.5;
  model.setAttribute("rotation", rotation);
}, 30);

// Zoom com gesto de pinça otimizado
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
