const models = [
  "champagne",  // Modelo 1
  "heineken",   // Modelo 2
  "redbull",    // Modelo 3
  "fizzydrink", // Modelo 4
  "cubo",       // Modelo 5
  "sundae",     // Modelo 6
  "pizza",      // Modelo 7
];

let currentIndex = 0;  // Índice do modelo atual

// Função para carregar o modelo
function loadModel(name) {
  const container = document.querySelector("#modelContainer");
  const loadingIndicator = document.querySelector("#loadingIndicator");

  // Remove qualquer modelo anterior da cena
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Atualiza posição, rotação e escala do container do modelo
  container.setAttribute("position", "0 -0.5 -3");
  container.setAttribute("rotation", "0 180 0");
  container.setAttribute("scale", "1 1 1");

  // Cria um novo modelo 3D
  const newModel = document.createElement("a-entity");
  newModel.setAttribute("gltf-model", `url(./3d/${name}.glb)`); // Caminho para o modelo .glb

  // Exibe o indicador de carregamento
  loadingIndicator.style.display = "block"; // Mostra o indicador de carregamento

  // Quando o modelo for carregado com sucesso, esconde o indicador de carregamento
  newModel.addEventListener("model-loaded", () => {
    loadingIndicator.style.display = "none"; // Esconde o indicador
  });

  // Caso ocorra um erro no carregamento
  newModel.addEventListener("model-error", () => {
    loadingIndicator.innerText = "Erro ao carregar"; // Mensagem de erro
  });

  // Adiciona o novo modelo na cena
  container.appendChild(newModel);
}

// Função para alternar entre os modelos (anterior ou próximo)
function changeModel(direction) {
  // Atualiza o índice do modelo
  currentIndex = (currentIndex + direction + models.length) % models.length;
  loadModel(models[currentIndex]); // Carrega o modelo baseado no índice
}

// Carrega o primeiro modelo ao inicializar
loadModel(models[currentIndex]);

// Rotação automática do modelo (movendo suavemente o modelo)
setInterval(() => {
  const container = document.querySelector("#modelContainer");
  const rotation = container.getAttribute("rotation");
  rotation.y += 0.5; // Incrementa a rotação no eixo Y
  container.setAttribute("rotation", rotation); // Aplica a rotação
}, 30);

// Zoom com dois dedos
let initialDistance = null;
let initialScale = 1;

// Detecta o início do toque (dois dedos)
window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    // Calcula a distância inicial entre os dedos
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    initialDistance = Math.sqrt(dx * dx + dy * dy); // Distância entre os dedos
    const scale = document.querySelector("#modelContainer").getAttribute("scale");
    initialScale = scale.x; // Escala inicial
  }
});

// Detecta o movimento dos dedos (zoom)
window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2 && initialDistance) {
    // Calcula a nova distância entre os dedos
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);
    const scaleFactor = currentDistance / initialDistance; // Fator de escala baseado na distância
    const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.1), 10); // Limita a escala de 0.1 a 10
    const container = document.querySelector("#modelContainer");
    container.setAttribute("scale", `${newScale} ${newScale} ${newScale}`); // Aplica o zoom
  }
});

// Reseta o estado inicial do zoom
window.addEventListener("touchend", () => {
  initialDistance = null;
});

// Rotação vertical com um dedo
let startY = null;
let initialRotationX = 0;

// Detecta o início do toque (um dedo)
window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    startY = e.touches[0].clientY; // Armazena a posição inicial
    const container = document.querySelector("#modelContainer");
    initialRotationX = container.getAttribute("rotation").x; // Armazena a rotação inicial no eixo X
  }
});

// Detecta o movimento vertical do dedo (rotação)
window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1 && startY !== null) {
    const deltaY = e.touches[0].clientY - startY; // Movimentação do dedo
    const container = document.querySelector("#modelContainer");
    const rotation = container.getAttribute("rotation");
    const newX = Math.min(Math.max(initialRotationX - deltaY * 0.2, -90), 90); // Limita a rotação no eixo X
    container.setAttribute("rotation", `${newX} ${rotation.y} ${rotation.z}`); // Aplica a rotação
  }
});

// Reseta o estado de rotação ao finalizar o toque
window.addEventListener("touchend", () => {
  startY = null;
});
