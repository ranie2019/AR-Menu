// Lista com os nomes dos modelos disponíveis
export const models = [
    "champagne", "heineken", "redbull", "fizzydrink", "cubo", "sundae", "pizza"
  ];
  
  // Índice atual do modelo exibido
  let currentIndex = 0;
  
  // Cache de URLs dos modelos já carregados (evita recarregamentos desnecessários)
  const modelCache = {};
  
  /**
   * Carrega um modelo 3D da pasta local '3d/' e aplica no #modelContainer
   * @param {string} name - Nome do modelo (sem extensão .glb)
   */
  export function loadModel(name) {
    const container = document.querySelector("#modelContainer");
    const loadingIndicator = document.querySelector("#loadingIndicator");
  
    loadingIndicator.style.display = "block";
    loadingIndicator.innerText = "0%";
  
    // Reset do container
    container.removeAttribute("gltf-model");
    container.setAttribute("position", "0 -0.5 -3");
    container.setAttribute("rotation", "0 180 0");
    container.setAttribute("scale", "1 1 1");
  
    // Se o modelo estiver no cache, usa direto
    if (modelCache[name]) {
      container.setAttribute("gltf-model", modelCache[name]);
      loadingIndicator.style.display = "none";
      return;
    }
  
    // Requisição via XHR
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `./3d/${name}.glb`, true);
    xhr.responseType = "blob";
  
    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        loadingIndicator.innerText = `${percent}%`;
      }
    };
  
    xhr.onload = () => {
      const blob = xhr.response;
      const url = URL.createObjectURL(blob);
      modelCache[name] = url;
      container.setAttribute("gltf-model", url);
      loadingIndicator.style.display = "none";
    };
  
    xhr.onerror = () => {
      console.error(`Erro ao carregar o modelo "${name}"`);
      loadingIndicator.innerText = "Erro ao carregar o modelo";
    };
  
    xhr.send();
  }
  
  /**
   * Troca o modelo atual com rotação circular
   * @param {number} direction - -1 para anterior, +1 para próximo
   */
  export function changeModel(direction) {
    currentIndex = (currentIndex + direction + models.length) % models.length;
    loadModel(models[currentIndex]);
  }
  