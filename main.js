// Caminhos dos modelos por categoria
const models = {
  inicio: ['objetos3d/inicio/inicio.glb'],
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
    'objetos3d/pizzas/cubo.glb'
  ],
  sobremesas: [
    'objetos3d/sobremesas/Chocolate_Quente.glb',
    'objetos3d/sobremesas/sundae.glb'
  ]
};

let currentCategory = 'inicio';
let currentIndex = 0;

// Referência ao container do modelo na cena A-Frame
const modelContainer = document.getElementById('modelContainer');
const loadingIndicator = document.getElementById('loadingIndicator');

// Função para carregar o modelo atual
function loadModel() {
  const url = models[currentCategory][currentIndex];

  // Mostra o indicador de carregamento
  loadingIndicator.style.display = 'block';

  // Remove modelo anterior (se existir)
  while (modelContainer.firstChild) {
    modelContainer.removeChild(modelContainer.firstChild);
  }

  // Cria uma nova entidade com o modelo GLB
  const newModel = document.createElement('a-entity');
  newModel.setAttribute('gltf-model', url);
  newModel.setAttribute('position', '0 0 0');
  newModel.setAttribute('scale', '1 1 1');
  newModel.setAttribute('rotation', '0 180 0');

  // Espera o carregamento para esconder o indicador
  newModel.addEventListener('model-loaded', () => {
    loadingIndicator.style.display = 'none';
  });

  // Adiciona o modelo à cena
  modelContainer.appendChild(newModel);
}

// Alternar categoria (ao clicar no botão "Menu")
function selectCategory(category) {
  currentCategory = category;
  currentIndex = 0;
  loadModel();
}

// Navegação entre os modelos da categoria
function changeModel(step) {
  const categoryModels = models[currentCategory];
  currentIndex = (currentIndex + step + categoryModels.length) % categoryModels.length;
  loadModel();
}

// Alternar visibilidade dos botões de categoria
function toggleMenu() {
  const buttons = document.getElementById('categoryButtons');
  buttons.style.display = buttons.style.display === 'none' ? 'flex' : 'none';
}

// Carrega o modelo inicial ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  loadModel();
});
