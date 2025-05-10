// -------------------- CONFIGURAÇÃO INICIAL --------------------

let currentCategory = 'inicio'; // Categoria inicial ao iniciar
let currentIndex = 0; // Índice inicial do modelo
const modelCache = {}; // Armazena modelos carregados para evitar downloads repetidos

// -------------------- ATUALIZAÇÃO DE PREÇO NA TELA --------------------

function updatePrice(price) {
  document.getElementById("priceDisplay").innerText = `R$ ${price.toFixed(2)}`;
}

// -------------------- FUNÇÃO PRINCIPAL DE CARREGAMENTO DE MODELO --------------------

function loadModel(path) {
  const container = document.querySelector("#modelContainer");
  const loadingIndicator = document.getElementById("loadingIndicator");

  // Mostra o texto de carregando
  loadingIndicator.style.display = "block";
  loadingIndicator.innerText = "Carregando...";

  // Remove o modelo atual
  container.removeAttribute("gltf-model");

  // Reseta rotação, posição e escala
  container.setAttribute("rotation", "0 180 0");
  container.setAttribute("position", "0 0 0");
  container.setAttribute("scale", "1 1 1");

  // Verifica se o modelo está no cache
  if (modelCache[path]) {
    container.setAttribute("gltf-model", modelCache[path]);
    loadingIndicator.style.display = "none";
    updatePrice(getModelPrice(path));
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path + "?v=" + Date.now(), true); // Bloqueia cache
    xhr.responseType = "blob";

    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        loadingIndicator.innerText = `${percent}%`;
      }
    };

    xhr.onload = () => {
      const blobURL = URL.createObjectURL(xhr.response);
      modelCache[path] = blobURL;
      container.setAttribute("gltf-model", blobURL);
      loadingIndicator.style.display = "none";
      updatePrice(getModelPrice(path));
    };

    xhr.onerror = () => {
      console.error("Erro ao carregar o modelo:", path);
      loadingIndicator.innerText = "Erro ao carregar o modelo";
    };

    xhr.send();
  }
}

// -------------------- CONSULTA DE PREÇO DO MODELO --------------------

function getModelPrice(path) {
  for (let cat in models) {
    for (let model of models[cat]) {
      if (model.path === path) return model.price;
    }
  }
  return 0;
}

// -------------------- NAVEGAÇÃO ENTRE MODELOS DA MESMA CATEGORIA --------------------

function changeModel(dir) {
  const lista = models[currentCategory];
  currentIndex = (currentIndex + dir + lista.length) % lista.length;
  loadModel(lista[currentIndex].path);
}

// -------------------- SISTEMA DE MENU DE CATEGORIAS --------------------

function selectCategory(category) {
  if (!models[category]) return;
  currentCategory = category;
  currentIndex = 0;
  loadModel(models[category][0].path);
}

// Mostra ou oculta os botões de categoria
document.getElementById("menuBtn").addEventListener("click", () => {
  const el = document.getElementById("categoryButtons");
  el.style.display = el.style.display === "flex" ? "none" : "flex";
});

// -------------------- CARREGAMENTO INICIAL --------------------

window.addEventListener("DOMContentLoaded", () => {
  loadModel(models[currentCategory][0].path);
});

// -------------------- CONTROLE DE PINÇA PARA ZOOM --------------------

let initialDistance = null; // Distância inicial entre dois dedos
let initialScale = 1; // Escala inicial do modelo

// Atualiza a escala do modelo proporcional ao gesto de pinça
function updateScale(scaleFactor) {
  const model = document.querySelector("#modelContainer");
  const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.1), 10); // Limita zoom
  model.setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
}

// Detecta início do gesto de pinça
window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    initialDistance = Math.sqrt(dx * dx + dy * dy);
    const scale = document.querySelector("#modelContainer").getAttribute("scale");
    initialScale = scale.x;
  }
});

// Aplica zoom enquanto os dedos se movem
window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2 && initialDistance) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);
    const scaleFactor = currentDistance / initialDistance;
    updateScale(scaleFactor);
  }
});

// Finaliza o gesto de pinça
window.addEventListener("touchend", () => {
  initialDistance = null;
});

// -------------------- CONTROLE DE ROTAÇÃO VERTICAL COM UM DEDO --------------------

let startY = null; // Posição inicial do toque vertical
let initialRotationX = 0; // Rotação X inicial do modelo

// Inicia controle de rotação com um dedo
window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    startY = e.touches[0].clientY;
    const model = document.querySelector("#modelContainer");
    initialRotationX = model.getAttribute("rotation").x;
  }
});

// Rotaciona o modelo para cima/baixo com movimento vertical
window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1 && startY !== null) {
    const deltaY = e.touches[0].clientY - startY;
    const model = document.querySelector("#modelContainer");
    const rotation = model.getAttribute("rotation");
    const newX = Math.min(Math.max(initialRotationX - deltaY * 0.2, -90), 90); // Limita rotação
    model.setAttribute("rotation", `${newX} ${rotation.y} ${rotation.z}`);
  }
});

// Encerra rotação com um dedo
window.addEventListener("touchend", () => {
  startY = null;
});