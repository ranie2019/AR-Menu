// Lista com os nomes dos modelos disponíveis
export const models = [
    "champagne", "heineken", "redbull", "fizzydrink", "cubo", "sundae", "pizza"
  ];
  
  // Índice atual do modelo exibido
  let currentIndex = 0;
  
  // Cache para armazenar URLs dos modelos já carregados (evita recarregamentos desnecessários)
  const modelCache = {};
  
  // Função para carregar um modelo 3D pelo nome
  export function loadModel(name) {
    // Seleciona o container onde o modelo será exibido
    const container = document.querySelector("#modelContainer");
  
    // Seleciona o elemento que exibe o indicador de carregamento
    const loadingIndicator = document.querySelector("#loadingIndicator");
  
    // Exibe o indicador de carregamento e inicia com 0%
    loadingIndicator.style.display = "block";
    loadingIndicator.innerText = "0%";
  
    // Reseta os atributos do container antes de carregar o novo modelo
    container.removeAttribute("gltf-model");
    container.setAttribute("position", "0 -0.5 -3"); // Posição inicial do modelo
    container.setAttribute("rotation", "0 180 0");   // Rotação para exibir de frente
    container.setAttribute("scale", "1 1 1");        // Escala padrão
  
    // Verifica se o modelo já foi carregado anteriormente
    if (modelCache[name]) {
      // Usa o modelo do cache, sem precisar recarregar
      container.setAttribute("gltf-model", modelCache[name]);
      loadingIndicator.style.display = "none"; // Oculta o indicador
    } else {
      // Cria uma requisição HTTP para buscar o arquivo .glb do modelo
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `./3d/${name}.glb`, true); // Caminho relativo ao modelo
      xhr.responseType = "blob"; // Resposta esperada em formato binário
  
      // Atualiza o progresso de carregamento
      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          loadingIndicator.innerText = `${percent}%`; // Exibe porcentagem
        }
      };
  
      // Quando o carregamento terminar com sucesso
      xhr.onload = () => {
        const blob = xhr.response;                    // Recebe o conteúdo do modelo
        const url = URL.createObjectURL(blob);        // Cria um link temporário para uso no atributo
        modelCache[name] = url;                       // Armazena no cache para uso futuro
        container.setAttribute("gltf-model", url);    // Aplica o modelo no container
        loadingIndicator.style.display = "none";      // Oculta o indicador
      };
  
      // Em caso de erro na requisição
      xhr.onerror = () => {
        console.error("Erro ao carregar o modelo.");
        loadingIndicator.innerText = "Erro ao carregar o modelo"; // Mostra mensagem de erro
      };
  
      // Envia a requisição
      xhr.send();
    }
  }
  
  // Função para trocar o modelo atual com base na direção (-1 para anterior, +1 para próximo)
  export function changeModel(direction) {
    // Atualiza o índice do modelo, mantendo-o dentro dos limites da lista
    currentIndex = (currentIndex + direction + models.length) % models.length;
  
    // Carrega o novo modelo com base no índice atualizado
    loadModel(models[currentIndex]);
  }
  