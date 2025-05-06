let categorias = {
  bebidas: [
    'modelos/bebidas/absolut_vodka_1l.glb',
    'modelos/bebidas/champagne_Lorem.glb',
    'modelos/bebidas/champagne.glb',
    'modelos/bebidas/fizzydrink.glb',
    'modelos/bebidas/heineken.glb',
    'modelos/bebidas/JACK_DANIELS.glb',
    'modelos/bebidas/redbull.glb'
  ],
  pizzas: [
    'modelos/pizzas/pizza.glb',
    'modelos/pizzas/cubo.glb'
  ],
  sobremesas: [
    'modelos/sobremesas/Chocolate_Quente.glb',
    'modelos/sobremesas/sundae.glb'
  ]
};

// Junta todos os modelos numa lista geral
let todosModelos = [];
for (const cat in categorias) todosModelos = todosModelos.concat(categorias[cat]);

let indexAtual = 0;
let modelosAtivos = [...todosModelos];
let menuAberto = false;
let categoriaSelecionada = null;

const container = document.getElementById('modelContainer');
const loadingIndicator = document.getElementById('loadingIndicator');

// Carrega o modelo atual
function carregarModelo(url) {
  loadingIndicator.style.display = 'block';

  // Remove modelo antigo
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const modelo = document.createElement('a-entity');
  modelo.setAttribute('gltf-model', url);
  modelo.setAttribute('scale', '1 1 1');
  modelo.setAttribute('position', '0 0 0');

  modelo.addEventListener('model-loaded', () => {
    loadingIndicator.style.display = 'none';
  });

  container.appendChild(modelo);
}

// Troca o modelo na direção (anterior ou próxima)
function changeModel(direcao) {
  if (modelosAtivos.length === 0) return;
  indexAtual = (indexAtual + direcao + modelosAtivos.length) % modelosAtivos.length;
  carregarModelo(modelosAtivos[indexAtual]);
}

// Alterna visibilidade dos botões de categoria
function toggleMenu() {
  menuAberto = !menuAberto;

  const botoesCategoria = document.getElementById('categoryButtons');
  botoesCategoria.style.display = menuAberto ? 'flex' : 'none';

  if (!menuAberto) {
    modelosAtivos = [...todosModelos];
    categoriaSelecionada = null;
    indexAtual = 0;
    carregarModelo(modelosAtivos[indexAtual]);
  }
}

// Ativa apenas a categoria selecionada
function selectCategory(categoria) {
  if (!categorias[categoria]) return;

  categoriaSelecionada = categoria;
  modelosAtivos = [...categorias[categoria]];
  indexAtual = 0;
  carregarModelo(modelosAtivos[indexAtual]);
}

// Carrega modelo inicial
document.addEventListener('DOMContentLoaded', () => {
  carregarModelo(modelosAtivos[0]);
});
