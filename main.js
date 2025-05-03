// Lista de modelos disponíveis
const models = [
  "champagne",
  "heineken",
  "redbull",
  "fizzydrink",
  "cubo",
  "sundae",
  "pizza",
];

let currentIndex = 0; // Índice atual do modelo
const modelCache = {}; // Cache para armazenar modelos já carregados

// Carrega um modelo 3D e exibe na cena
function loadModel(name) {
  const container = document.querySelector("#modelContainer");
  const loadingIndicator = document.querySelector("#loadingIndicator");

  // Exibe o indicador de carregamento
  loadingIndicator.style.display = "block";
  loadingIndicator.innerText = `Carregando ${name}...`; // Exibe o nome do modelo sendo carregado

  // Remove modelo atual antes de carregar o novo
  container.removeAttribute("gltf-model");

  // Redefine posição, rotação e escala do modelo sempre que carregar um novo
  container.setAttribute("position", "0 -0.5 -3"); // posição um pouco mais baixa
  container.setAttribute("rotation", "0 180 0");
  container.setAttribute("scale", "1 1 1");

  // Se o modelo já estiver no cache, usa direto
  if (modelCache[name]) {
    container.setAttribute("gltf-model", modelCache[name]);
    loadingIndicator.style.display = "none"; // Esconde o indicador quando terminar de carregar
  } else {
    // Cria uma requisição para carregar o modelo .glb
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `./3d/${name}.glb`, true);
    xhr.responseType = "blob";

    // Atualiza a porcentagem de carregamento durante o download
    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        loadingIndicator.innerText = `Carregando ${name}... ${percent}%`; // Atualiza com a porcentagem
      }
    };

    // Quando o download termina, exibe o modelo
    xhr.onload = () => {
      const blob = xhr.response;
      const url = URL.createObjectURL(blob);
      modelCache[name] = url;
      container.setAttribute("gltf-model", url);
      loadingIndicator.style.display = "none"; // Esconde o indicador quando terminar de carregar
    };

    // Se der erro no carregamento
    xhr.onerror = () => {
      console.error("Erro ao carregar o modelo.");
      loadingIndicator.innerText = "Erro ao carregar o modelo";
    };

    xhr.send(); // Envia a requisição
  }
}

// Muda o modelo com base na direção (-1 para anterior, +1 para próximo)
function changeModel(direction) {
  currentIndex = (currentIndex + direction + models.length) % models.length;
  loadModel(models[currentIndex]);
}

// Carrega o primeiro modelo assim que a página abre
loadModel(models[currentIndex]);

// Rotaciona o modelo automaticamente no eixo Y
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

// Atualiza escala do modelo com base no fator de escala
function updateScale(scaleFactor) {
  const model = document.querySelector("#modelContainer");
  const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.1), 10);
  model.setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
}

// Quando dois dedos tocam a tela, captura distância inicial
window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    initialDistance = Math.sqrt(dx * dx + dy * dy);
    const scale = document.querySelector("#modelContainer").getAttribute("scale");
    initialScale = scale.x;
  }
});

// Move os dedos para aplicar zoom
window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2 && initialDistance) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);
    const scaleFactor = currentDistance / initialDistance;
    updateScale(scaleFactor);
  }
});

// Quando o toque termina, reseta a distância
window.addEventListener("touchend", () => {
  initialDistance = null;
});

// Rotação vertical (X) com movimento de um dedo
let startY = null;
let initialRotationX = 0;

// Inicia rotação com um dedo
window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    startY = e.touches[0].clientY;
    const model = document.querySelector("#modelContainer");
    initialRotationX = model.getAttribute("rotation").x;
  }
});

// Move dedo para cima/baixo para rotacionar no eixo X
window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1 && startY !== null) {
    const deltaY = e.touches[0].clientY - startY;
    const model = document.querySelector("#modelContainer");
    const rotation = model.getAttribute("rotation");
    const newX = Math.min(Math.max(initialRotationX - deltaY * 0.2, -90), 90);
    model.setAttribute("rotation", `${newX} ${rotation.y} ${rotation.z}`);
  }
});

// Fim da rotação
