// main.js

// Lista de modelos disponíveis (os arquivos .glb devem estar na pasta "3d")
const models = [
  "champagne",
  "heineken",
  "redbull",
  "fizzydrink",
  "cubo",
  "sundae",
  "pizza"
];

let currentModelIndex = 0;
const modelContainer = document.querySelector("#modelContainer");
const loadingIndicator = document.getElementById("loadingIndicator");

// Carrega o modelo GLB no modelContainer
function loadModel(index) {
  // Remove qualquer modelo anterior
  while (modelContainer.firstChild) {
    modelContainer.removeChild(modelContainer.firstChild);
  }

  const modelPath = `3d/${models[index]}.glb`;

  // Cria nova entidade glTF
  const model = document.createElement("a-entity");
  model.setAttribute("gltf-model", modelPath);
  model.setAttribute("rotation", "0 180 0");
  model.setAttribute("position", "0 0 0");
  model.setAttribute("scale", "1 1 1");

  // Exibe indicador de carregamento
  loadingIndicator.style.display = "block";
  loadingIndicator.textContent = "0%";

  // Atualiza progresso
  model.addEventListener("model-progress", (evt) => {
    const percent = Math.floor((evt.detail.loaded / evt.detail.total) * 100);
    loadingIndicator.textContent = `${percent}%`;
  });

  // Quando terminar de carregar
  model.addEventListener("model-loaded", () => {
    loadingIndicator.style.display = "none";
  });

  modelContainer.appendChild(model);
}

// Troca de modelo (próximo ou anterior)
window.changeModel = function (direction) {
  currentModelIndex += direction;

  if (currentModelIndex < 0) {
    currentModelIndex = models.length - 1;
  } else if (currentModelIndex >= models.length) {
    currentModelIndex = 0;
  }

  loadModel(currentModelIndex);
};

// Inicializa rotação vertical com um dedo
import("./rotate-vertical.js").then((module) => {
  module.initVerticalRotate();
});

// Carrega o primeiro modelo
loadModel(currentModelIndex);
