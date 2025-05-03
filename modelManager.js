// Lista com os nomes dos modelos disponíveis
export const models = [
  "champagne", "heineken", "redbull", "fizzydrink", "cubo", "sundae", "pizza"
];

// Índice atual do modelo exibido
let currentIndex = 0;

// Cache para armazenar URLs dos modelos já carregados (evita recarregamentos desnecessários)
const modelCache = {};

/**
 * Função para carregar um modelo 3D pelo nome
 * @param {string} name - Nome do modelo a ser carregado (sem extensão .glb)
 */
export function loadModel(name) {
  // Seleciona o container onde o modelo será exibido
  const container = document.querySelector("#modelContainer");

  // Seleciona o elemento do indicador de carregamento
  const loadingIndicator = document.querySelector("#loadingIndicator");

  // Exibe o indicador com 0%
  loadingIndicator.style.display = "block";
  loadingIndicator.innerText = "0%";

  // Reseta o container para o novo modelo
  container.removeAttribute("gltf-model");
  container.setAttribute("position", "0 -0.5 -3"); // Posição padrão
  container.setAttribute("rotation", "0 180 0");   // Rotação frontal
  container.setAttribute("scale", "1 1 1");        // Escala padrão

  // Se o modelo já foi carregado anteriormente, usa o cache
  if (modelCache[name]) {
    container.setAttribute("gltf-model", modelCache[name]);
    loadingIndicator.style.display = "none";
  } else {
    // Cria requisição para carregar o modelo do disco
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `./3d/${name}.glb`, true); // Caminho da pasta 3d
    xhr.responseType = "blob";

    // Mostra progresso de carregamento (em %)
    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        loadingIndicator.innerText = `${percent}%`;
      }
    };

    // Ao terminar de carregar
    xhr.onload = () => {
      const blob = xhr.response;
      const url = URL.createObjectURL(blob);
      modelCache[name] = url; // Armazena em cache
      container.setAttribute("gltf-model", url); // Aplica o modelo
      loadingIndicator.style.display = "none";
    };

    // Se houver erro no carregamento
    xhr.onerror = () => {
      console.error("Erro ao carregar o modelo.");
      loadingIndicator.innerText = "Erro ao carregar o modelo";
    };

    // Inicia o download
    xhr.send();
  }
}

/**
 * Função para mudar o modelo atual
 * @param {number} direction - -1 para anterior, +1 para próximo
 */
export function changeModel(direction) {
  // Atualiza o índice circularmente
  currentIndex = (currentIndex + direction + models.length) % models.length;

  // Carrega o novo modelo
  loadModel(models[currentIndex]);
}
