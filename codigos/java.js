// ==================== CONFIGURAÇÃO INICIAL ====================

// Define a categoria exibida ao iniciar o app
let currentCategory = 'inicio';

// Define o índice do modelo atual dentro da categoria selecionada
let currentIndex = 0;

// Cache dos modelos GLB já carregados (por blob URL), para evitar múltiplos downloads
const modelCache = {};


// ==================== ATUALIZAÇÃO DE PREÇO NA TELA ====================

/**
 * Atualiza o valor do prato exibido no campo de preço.
 * @param {number} price - Preço do modelo atual.
 */
function updatePrice(price) {
  document.getElementById("priceDisplay").innerText = `R$ ${price.toFixed(2)}`;
}


// ==================== FUNÇÃO PRINCIPAL DE CARREGAMENTO DE MODELO ====================

/**
 * Carrega um modelo GLB dinamicamente e o aplica no container da cena.
 * Garante que o cache seja utilizado se possível, e mostra indicador de progresso.
 * @param {string} path - Caminho para o arquivo GLB do modelo.
 */
function loadModel(path) {
  const container = document.querySelector("#modelContainer"); // Elemento da cena AR onde o modelo será exibido
  const loadingIndicator = document.getElementById("loadingIndicator"); // Elemento de texto que mostra progresso de carregamento

  // Exibe mensagem de carregamento
  loadingIndicator.style.display = "block";
  loadingIndicator.innerText = "Carregando...";

  // Remove modelo anterior (evita bugs com troca de modelos)
  container.removeAttribute("gltf-model");

  // Reseta transformação (posição, escala, rotação)
  container.setAttribute("rotation", "0 180 0"); // Rotaciona modelo para ficar virado pra frente
  container.setAttribute("position", "0 -.6 0");
  container.setAttribute("scale", "1 1 1");

  // Se o modelo já estiver no cache, usa direto
  if (modelCache[path]) {
    container.setAttribute("gltf-model", modelCache[path]);
    loadingIndicator.style.display = "none";
    updatePrice(getModelPrice(path));
  } else {
    // Cria requisição para baixar o modelo GLB como blob (evita cache com Date.now)
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path + "?v=" + Date.now(), true); // Cache-busting
    xhr.responseType = "blob";

    // Mostra progresso de download em porcentagem
    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        loadingIndicator.innerText = `${percent}%`;
      }
    };

    // Quando o modelo for carregado com sucesso
    xhr.onload = () => {
      const blobURL = URL.createObjectURL(xhr.response);
      modelCache[path] = blobURL; // Salva no cache
      container.setAttribute("gltf-model", blobURL);
      loadingIndicator.style.display = "none";
      updatePrice(getModelPrice(path)); // Atualiza preço na tela
    };

    // Se der erro no carregamento
    xhr.onerror = () => {
      console.error("Erro ao carregar o modelo:", path);
      loadingIndicator.innerText = "Erro ao carregar o modelo";
    };

    xhr.send(); // Inicia o download
  }
}


// ==================== CONSULTA DE PREÇO DO MODELO ====================

/**
 * Retorna o preço do modelo com base no caminho (path).
 * Pesquisa em todas as categorias e seus modelos.
 * @param {string} path - Caminho do modelo GLB.
 * @returns {number} - Preço do modelo, ou 0 se não encontrado.
 */
function getModelPrice(path) {
  for (let cat in models) {
    for (let model of models[cat]) {
      if (model.path === path) return model.price;
    }
  }
  return 0;
}


// ==================== NAVEGAÇÃO ENTRE MODELOS DA MESMA CATEGORIA ====================

/**
 * Altera o modelo atual para o próximo ou anterior da mesma categoria.
 * @param {number} dir - Direção (1 para próximo, -1 para anterior).
 */
function changeModel(dir) {
  const lista = models[currentCategory]; // Lista de modelos da categoria atual
  currentIndex = (currentIndex + dir + lista.length) % lista.length; // Rotação circular
  loadModel(lista[currentIndex].path);
}


// ==================== SISTEMA DE MENU DE CATEGORIAS ====================

/**
 * Troca a categoria de modelos e carrega o primeiro modelo da nova categoria.
 * @param {string} category - Nome da nova categoria.
 */
function selectCategory(category) {
  if (!models[category]) return; // Ignora se a categoria não existe
  currentCategory = category;
  currentIndex = 0;
  loadModel(models[category][0].path);
}

// Alterna visibilidade do menu de categorias (mostra/esconde)
document.getElementById("menuBtn").addEventListener("click", () => {
  const el = document.getElementById("categoryButtons");
  el.style.display = el.style.display === "flex" ? "none" : "flex";
});


// ==================== CARREGAMENTO INICIAL ====================

// Quando o app carregar pela primeira vez, carrega o modelo inicial da categoria "inicio"
window.addEventListener("DOMContentLoaded", () => {
  loadModel(models[currentCategory][0].path);
});

// Faz rotação automática do modelo no eixo Y
setInterval(() => {
  const model = document.querySelector("#modelContainer");
  if (!model) return;
  const rotation = model.getAttribute("rotation");
  rotation.y += 0.5; // Incrementa rotação
  model.setAttribute("rotation", rotation);
}, 30); // Roda a cada 30ms (~33 vezes por segundo)

// ==================== CONTROLE DE PINÇA PARA ZOOM ====================

let initialDistance = null; // Distância entre dois dedos no início do gesto de pinça
let initialScale = 1; // Escala do modelo antes do gesto

/**
 * Aplica novo valor de escala ao modelo com base no gesto de pinça.
 * @param {number} scaleFactor - Fator de multiplicação da escala.
 */
function updateScale(scaleFactor) {
  const model = document.querySelector("#modelContainer");
  const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.1), 10); // Limita entre 0.1x e 10x
  model.setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
}

// Detecta início do gesto de pinça (2 dedos tocando)
window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    initialDistance = Math.sqrt(dx * dx + dy * dy);
    const scale = document.querySelector("#modelContainer").getAttribute("scale");
    initialScale = scale.x;
  }
});

// Aplica escala conforme a distância entre os dedos muda
window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2 && initialDistance) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);
    const scaleFactor = currentDistance / initialDistance;
    updateScale(scaleFactor);
  }
});

// Reseta variáveis ao finalizar o gesto
window.addEventListener("touchend", () => {
  initialDistance = null;
});


// ==================== CONTROLE DE ROTAÇÃO VERTICAL COM UM DEDO ====================

let startY = null; // Posição vertical inicial do toque
let initialRotationX = 0; // Rotação X do modelo no início do movimento

// Armazena posição inicial ao começar toque com 1 dedo
window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    startY = e.touches[0].clientY;
    const model = document.querySelector("#modelContainer");
    initialRotationX = model.getAttribute("rotation").x;
  }
});

// Aplica rotação vertical proporcional ao movimento do dedo
window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1 && startY !== null) {
    const deltaY = e.touches[0].clientY - startY;
    const model = document.querySelector("#modelContainer");
    const rotation = model.getAttribute("rotation");
    const newX = Math.min(Math.max(initialRotationX - deltaY * 0.2, -90), 90); // Limita entre -90° e 90°
    model.setAttribute("rotation", `${newX} ${rotation.y} ${rotation.z}`);
  }
});

// Finaliza gesto ao soltar o dedo
window.addEventListener("touchend", () => {
  startY = null;
});
