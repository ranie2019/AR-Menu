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

let currentIndex = 0; // Índice atual do modelo exibido
const modelCache = {}; // Objeto para armazenar os modelos já carregados (cache)

// Função para carregar e exibir o modelo 3D
function loadModel(name) {
  const container = document.querySelector("#modelContainer"); // Elemento onde o modelo será exibido
  const loadingIndicator = document.querySelector("#loadingIndicator"); // Indicador de carregamento

  // Mostra o indicador de carregamento
  loadingIndicator.style.display = "block";
  loadingIndicator.innerText = "Carregando...";

  // Remove o modelo atual (caso exista)
  container.removeAttribute("gltf-model");

  // Define a posição, rotação e escala iniciais
  container.setAttribute("position", "0 -0.5 -3");
  container.setAttribute("rotation", "0 180 0");
  container.setAttribute("scale", "1 1 1");

  // Verifica se o modelo já foi carregado anteriormente
  if (modelCache[name]) {
    // Usa o modelo do cache
    container.setAttribute("gltf-model", modelCache[name]);
    loadingIndicator.style.display = "none"; // Esconde indicador
  } else {
    // Carrega o modelo usando XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `./3d/${name}.glb`, true); // Caminho para o arquivo .glb
    xhr.responseType = "blob"; // Resposta esperada em blob (arquivo binário)

    // Quando o carregamento for concluído
    xhr.onload = () => {
      const blob = xhr.response; // Pega o arquivo
      const url = URL.createObjectURL(blob); // Cria uma URL temporária
      modelCache[name] = url; // Salva no cache
      container.setAttribute("gltf-model", url); // Atribui ao contêiner
      loadingIndicator.style.display = "none"; // Esconde indicador
    };

    // Tratamento de erro
    xhr.onerror = () => {
      console.error("Erro ao carregar o modelo.");
      loadingIndicator.innerText = "Erro ao carregar o modelo";
    };

    // Envia a requisição
    xhr.send();
  }
}

// Função para trocar o modelo atual (1 para próximo, -1 para anterior)
function changeModel(direction) {
  currentIndex = (currentIndex + direction + models.length) % models.length; // Navegação circular
  loadModel(models[currentIndex]); // Carrega novo modelo
}

// Carrega o primeiro modelo automaticamente ao iniciar
loadModel(models[currentIndex]);

// Rotação automática contínua no eixo Y (horizontal)
setInterval(() => {
  const model = document.querySelector("#modelContainer");
  if (!model) return;
  const rotation = model.getAttribute("rotation");
  rotation.y += 0.5; // Incrementa lentamente o ângulo Y
  model.setAttribute("rotation", rotation);
}, 30); // A cada 30 milissegundos

// Variáveis para gesto de pinça (zoom)
let initialDistance = null;
let initialScale = 1;

// Atualiza a escala do modelo com base no fator de escala calculado
function updateScale(scaleFactor) {
  const model = document.querySelector("#modelContainer");
  const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.1), 10); // Limita escala entre 0.1 e 10
  model.setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
}

// Captura o início do gesto de pinça
window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    initialDistance = Math.sqrt(dx * dx + dy * dy); // Distância inicial entre dedos
    const scale = document.querySelector("#modelContainer").getAttribute("scale");
    initialScale = scale.x; // Escala atual
  }
});

// Atualiza a escala enquanto o gesto de pinça acontece
window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2 && initialDistance) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy); // Nova distância
    const scaleFactor = currentDistance / initialDistance; // Fator de escala
    updateScale(scaleFactor); // Atualiza a escala
  }
});

// Quando o gesto termina, reseta a distância
window.addEventListener("touchend", () => {
  initialDistance = null;
});

// Variáveis para controle de rotação vertical com um dedo
let startY = null;
let initialRotationX = 0;

// Captura a posição inicial do toque vertical
window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    startY = e.touches[0].clientY;
    const model = document.querySelector("#modelContainer");
    initialRotationX = model.getAttribute("rotation").x;
  }
});

// Atualiza rotação no eixo X com base no movimento do dedo
window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1 && startY !== null) {
    const deltaY = e.touches[0].clientY - startY;
    const model = document.querySelector("#modelContainer");
    const rotation = model.getAttribute("rotation");
    const newX = Math.min(Math.max(initialRotationX - deltaY * 0.2, -90), 90); // Limita rotação vertical
    model.setAttribute("rotation", `${newX} ${rotation.y} ${rotation.z}`);
  }
});

// Finaliza rotação vertical ao soltar o dedo
window.addEventListener("touchend", () => {
  startY = null;
});
