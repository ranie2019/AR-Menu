// Importa a lista de modelos e a função para carregar modelos
import { models, loadModel } from './modelManager.js';

// Importa as funções para mostrar e ocultar o indicador de carregamento
import { showLoading, hideLoading } from './loadingIndicator.js';

// Importa a função que inicia a rotação automática do modelo
import { startAutoRotate } from './autoRotate.js';

// Importa a função que inicializa o gesto de pinça para zoom
import { initPinchZoom } from './pinchZoom.js';

// Importa a função que inicializa a rotação vertical com movimento do dedo
import { initVerticalRotate } from './verticalRotate.js';

// Quando o conteúdo da página estiver totalmente carregado
window.addEventListener("DOMContentLoaded", async () => {
  // Mostra o indicador de carregamento com mensagem personalizada
  showLoading("Carregando modelo...");

  try {
    // Aguarda o carregamento do primeiro modelo da lista
    await loadModel(models[0]);
  } catch (error) {
    console.error("Erro ao carregar o modelo:", error);
  } finally {
    // Oculta o indicador de carregamento
    hideLoading();
  }

  // Inicia a rotação automática no eixo Y
  startAutoRotate();

  // Ativa o controle de zoom com gesto de pinça
  initPinchZoom();

  // Ativa a rotação vertical com movimento de um dedo
  initVerticalRotate();
});
