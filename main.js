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
