// Caminhos dos modelos organizados por categoria
const models = {
  inicio: ['objetos3d/inicio/cubo.glb'], // Modelo inicial de exibição
  bebidas: [
    'objetos3d/bebidas/absolut_vodka_1l.glb',
    'objetos3d/bebidas/champagne_Lorem.glb',
    'objetos3d/bebidas/champagne.glb',
    'objetos3d/bebidas/fizzydrink.glb',
    'objetos3d/bebidas/heineken.glb',
    'objetos3d/bebidas/JACK_DANIELS.glb',
    'objetos3d/bebidas/redbull.glb'
  ],
  pizzas: [
    'objetos3d/pizzas/pizza.glb',
    'objetos3d/pizzas/caneca.glb',
    'objetos3d/pizzas/cubo.glb'
  ],
  sobremesas: [
    'objetos3d/sobremesas/Chocolate_Quente.glb',
    'objetos3d/sobremesas/sundae.glb',
    'objetos3d/pizzas/cubo.glb' // Reutilizando modelo
  ]
};

let currentIndex = 0; // Índice do modelo atual sendo exibido
const modelCache = {}; // Armazena modelos já carregados (evita recarregamento)

// Função que carrega um modelo 3D na cena
function loadModel(name) {
  const container = document.querySelector("#modelContainer"); // Container da cena
  const loadingIndicator = document.querySelector("#loadingIndicator"); // Indicador de carregamento

  // Mostra mensagem de carregamento
  loadingIndicator.style.display = "block";
  loadingIndicator.innerText = "Carregando...";

  // Remove qualquer modelo já carregado
  container.removeAttribute("gltf-model");

  // Reseta posição, rotação e escala do modelo
  container.setAttribute("position", "0 -0.5 -3");
  container.setAttribute("rotation", "0 180 0");
  container.setAttribute("scale", "1 1 1");

  // Se o modelo já estiver carregado em cache, reutiliza
  if (modelCache[name]) {
    container.setAttribute("gltf-model", modelCache[name]);
    loadingIndicator.style.display = "none";
  } else {
    // Se não, carrega com XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("GET", name, true);
    xhr.responseType = "blob"; // Espera um arquivo binário

    // Atualiza indicador de progresso durante o download
    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        loadingIndicator.innerText = `${percent}%`;
      }
    };

    // Quando terminar o download, mostra o modelo
    xhr.onload = () => {
      const blob = xhr.response;
      const url = URL.createObjectURL(blob); // Cria URL temporária
      modelCache[name] = url; // Salva no cache
      container.setAttribute("gltf-model", url); // Aplica na cena
      loadingIndicator.style.display = "none";
    };

    // Se falhar o carregamento, exibe erro
    xhr.onerror = () => {
      console.error("Erro ao carregar o modelo.");
      loadingIndicator.innerText = "Erro ao carregar o modelo";
    };

    xhr.send(); // Inicia a requisição
  }
}

// Função para trocar o modelo atual (próximo ou anterior)
function changeModel(direction) {
  const modelList = models[currentCategory]; // Lista de modelos da categoria atual
  currentIndex = (currentIndex + direction + modelList.length) % modelList.length; // Garante loop infinito
  loadModel(modelList[currentIndex]); // Carrega novo modelo
}

// Carrega o primeiro modelo ao iniciar a página
loadModel(models[currentCategory][currentIndex]);

// Faz rotação automática do modelo no eixo Y
setInterval(() => {
  const model = document.querySelector("#modelContainer");
  if (!model) return;
  const rotation = model.getAttribute("rotation");
  rotation.y += 0.5; // Incrementa rotação
  model.setAttribute("rotation", rotation);
}, 30); // Roda a cada 30ms (~33 vezes por segundo)

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

// -------------------- SISTEMA DE MENU DE CATEGORIAS --------------------

const menuBtn = document.getElementById("menuBtn"); // Botão principal de menu
const categoryButtons = document.getElementById("categoryButtons"); // Contêiner de botões de categoria

// Alterna visibilidade dos botões de categoria
menuBtn.addEventListener("click", () => {
  const isVisible = categoryButtons.style.display === "flex";
  categoryButtons.style.display = isVisible ? "none" : "flex";
});

let currentCategory = "inicio"; // Categoria inicial ao carregar

// Troca a categoria e recarrega os modelos correspondentes
function selectCategory(category) {
  if (!models[category]) {
    console.warn(`Categoria não encontrada: ${category}`); // Segurança contra erro
    return;
  }

  currentCategory = category; // Atualiza a categoria global
  currentIndex = 0; // Sempre começa do primeiro modelo
  loadModel(models[currentCategory][currentIndex]); // Carrega modelo da nova categoria
}
