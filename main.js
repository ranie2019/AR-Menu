// Caminhos dos modelos por categoria
const models = {
  inicio: ['objetos3d/inicio/cubo.glb'],
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
    'objetos3d/pizzas/cubo.glb'
  ]
};

let currentCategory = 'inicio';
let currentIndex = 0;

const modelContainer = document.getElementById('modelContainer');
const loadingIndicator = document.getElementById('loadingIndicator');

// Função para carregar o modelo atual
function loadModel() {
  const url = models[currentCategory][currentIndex];
  loadingIndicator.style.display = 'block';

  // Remove modelo anterior
  while (modelContainer.firstChild) {
    modelContainer.removeChild(modelContainer.firstChild);
  }

  // Cria nova entidade com o modelo e controles de gesto
  const newModel = document.createElement('a-entity');
  newModel.setAttribute('gltf-model', url);
  newModel.setAttribute('position', '0 0 0');
  newModel.setAttribute('scale', '1 1 1');
  newModel.setAttribute('rotation', '0 180 0');
  
  // Adiciona o controle de gesto (pinça) para zoom
  newModel.setAttribute('gesture-controls', 'minScale: 0.5; maxScale: 2');

  // Adiciona rotação automática
  newModel.setAttribute('auto-rotate', 'speed: 0.3'); // rotação devagar no eixo Y

  // Esconde indicador após carregamento
  newModel.addEventListener('model-loaded', () => {
    loadingIndicator.style.display = 'none';
  });

  modelContainer.appendChild(newModel);
}

// Alternar categoria
function selectCategory(category) {
  currentCategory = category;
  currentIndex = 0;
  loadModel();
}

// Alternar modelo
function changeModel(step) {
  const categoryModels = models[currentCategory];
  currentIndex = (currentIndex + step + categoryModels.length) % categoryModels.length;
  loadModel();
}

// Alternar menu
function toggleMenu() {
  const buttons = document.getElementById('categoryButtons');
  buttons.style.display = buttons.style.display === 'none' ? 'flex' : 'none';
}

// Carrega modelo inicial
window.addEventListener('DOMContentLoaded', () => {
  loadModel();
});
