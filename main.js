// main.js

// Lista de modelos 3D hospedados no S3
const models = [
  "https://SEU_BUCKET.s3.amazonaws.com/modelo1.glb",
  "https://SEU_BUCKET.s3.amazonaws.com/modelo2.glb",
  "https://SEU_BUCKET.s3.amazonaws.com/modelo3.glb"
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

  // Cria nova entidade glTF
  const model = document.createElement("a-entity");
  model.setAttribute("gltf-model", models[index]);
  model.setAttribute("rotation", "0 180 0");
  model.setAttribute("position", "0 0 0");
  model.setAttribute("scale", "1 1 1");

  // Exibe indicador de carregamento
  loadingIndicator.style.display = "block";
  loadingIndicator.textContent = "0%";

  // Evento de carregamento para atualizar o progresso
  model.addEventListener("model-progress", (evt) => {
    const percent = Math.floor((evt.detail.loaded / evt.detail.total) * 100);
    loadingIndicator.textContent = `${percent}%`;
  });

  // Quando o modelo terminar de carregar
  model.addEventListener("model-loaded", () => {
    loadingIndicator.style.display = "none";
  });

  // Adiciona o novo modelo à cena
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

// Inicializa a rotação vertical
import("./verticalRotate.js").then((module) => {
  module.initVerticalRotate();
});

// ⚠️ Caso você tenha criado um pinchZoom.js, adicione a linha abaixo:
// import("./pinchZoom.js").then((module) => module.initPinchZoom());

// Carrega o modelo inicial
loadModel(currentModelIndex);