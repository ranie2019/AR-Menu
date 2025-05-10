let currentCategory = 'inicio';
let currentIndex = 0;
const modelCache = {};

// Atualiza o preço na tela
function updatePrice(price) {
  document.getElementById("priceDisplay").innerText = `R$ ${price.toFixed(2)}`;
}

// Carrega um modelo GLB na cena
function loadModel(path) {
  const container = document.querySelector("#modelContainer");
  const loadingIndicator = document.getElementById("loadingIndicator");

  // Exibe indicador de carregamento
  loadingIndicator.style.display = "block";
  loadingIndicator.innerText = "Carregando...";

  // Remove o modelo atual
  container.removeAttribute("gltf-model");

  // Reseta transformações
  container.setAttribute("rotation", "0 180 0");
  container.setAttribute("position", "0 0 0");
  container.setAttribute("scale", "1 1 1");

  // Verifica cache
  if (modelCache[path]) {
    container.setAttribute("gltf-model", modelCache[path]);
    loadingIndicator.style.display = "none";
    updatePrice(getModelPrice(path));
  } else {
    // Carrega o GLB via XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path + "?v=" + Date.now(), true);
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

// Retorna o preço do modelo
function getModelPrice(path) {
  for (let cat in models) {
    for (let model of models[cat]) {
      if (model.path === path) return model.price;
    }
  }
  return 0;
}

// Altera para o próximo ou anterior modelo
function changeModel(dir) {
  const lista = models[currentCategory];
  currentIndex = (currentIndex + dir + lista.length) % lista.length;
  loadModel(lista[currentIndex].path);
}

// Troca de categoria
function selectCategory(category) {
  if (!models[category]) return;
  currentCategory = category;
  currentIndex = 0;
  loadModel(models[category][0].path);
}

// Botão de menu
document.getElementById("menuBtn").addEventListener("click", () => {
  const el = document.getElementById("categoryButtons");
  el.style.display = el.style.display === "flex" ? "none" : "flex";
});

// Carrega modelo inicial
window.addEventListener("DOMContentLoaded", () => {
  loadModel(models[currentCategory][0].path);
});
