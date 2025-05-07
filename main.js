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

let initialDistance = null;
let baseScale = 1;

// Função para atualizar escala do modelo
function updateScale(scaleFactor) {
  const newScale = baseScale * scaleFactor;
  const model = modelContainer.querySelector('a-entity');
  if (model) {
    model.setAttribute('scale', `${newScale} ${newScale} ${newScale}`);
  }
}

// Eventos de toque para pinça (zoom)
window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    initialDistance = Math.sqrt(dx * dx + dy * dy);

    const model = modelContainer.querySelector('a-entity');
    if (model) {
      const currentScale = model.getAttribute('scale');
      baseScale = parseFloat(currentScale.x); // escala uniforme
    }
  }
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2 && initialDistance) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);
    const scaleFactor = currentDistance / initialDistance;
    updateScale(scaleFactor);
  }
});

window.addEventListener("touchend", (e) => {
  if (e.touches.length < 2) {
    initialDistance = null;
  }
});

// Função para carregar o modelo atual
function loadModel() {
  const url = models[currentCategory][currentIndex];
  loadingIndicator.style.display = 'block';

  // Remove modelo anterior
  while (modelContainer.firstChild) {
    modelContainer.removeChild(modelContainer.firstChild);
  }

  // Cria nova entidade com o modelo e controles
  const newModel = document.createElement('a-entity');
  newModel.setAttribute('gltf-model', url);
  newModel.setAttribute('position', '0 0 0');
  newModel.setAttribute('scale', '1 1 1');
  newModel.setAttribute('rotation', '0 180 0');
  newModel.setAttribute('auto-rotate', 'speed: 0.3');

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

// Alternar modelo dentro da categoria
function changeModel(step) {
  const categoryModels = models[currentCategory];
  currentIndex = (currentIndex + step + categoryModels.length) % categoryModels.length;
  loadModel();
}

// Alternar visibilidade do menu
function toggleMenu() {
  const buttons = document.getElementById('categoryButtons');
  buttons.style.display = buttons.style.display === 'none' ? 'flex' : 'none';
}

// Carrega o primeiro modelo ao iniciar
window.addEventListener('DOMContentLoaded', () => {
  loadModel();
});
