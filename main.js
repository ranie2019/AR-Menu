// Mapas com os modelos de cada categoria
const categorias = {
  bebidas: [
    'models/bebidas/absolut_vodka_1l.glb',
    'models/bebidas/champagne_Lorem.glb',
    'models/bebidas/champagne.glb',
    'models/bebidas/fizzydrink.glb',
    'models/bebidas/heineken.glb',
    'models/bebidas/JACK_DANIELS.glb',
    'models/bebidas/redbull.glb'
  ],
  pizzas: [
    'models/pizzas/pizza.glb',
    'models/pizzas/cubo.glb'
  ],
  sobremesas: [
    'models/sobremesas/Chocolate_Quente.glb',
    'models/sobremesas/sundae.glb'
  ]
};

let modelosAtivos = [];              // Lista de modelos atualmente visíveis
let indexAtual = 0;                 // Índice do modelo atual
let categoriaSelecionada = null;    // Categoria ativa, se houver
let menuAtivo = false;              // Estado do menu (aberto/fechado)

// Função para carregar um modelo na cena
function carregarModelo(modeloPath) {
  const container = document.getElementById('modelContainer');
  const loading = document.getElementById('loadingIndicator');

  // Mostra o indicador de carregamento
  loading.style.display = 'block';

  // Remove modelos anteriores
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Cria nova entidade GLTF
  const modelEntity = document.createElement('a-entity');
  modelEntity.setAttribute('gltf-model', modeloPath);
  modelEntity.setAttribute('scale', '1 1 1');

  // Ao carregar, esconde o indicador
  modelEntity.addEventListener('model-loaded', () => {
    loading.style.display = 'none';
  });

  container.appendChild(modelEntity);
}

// Alterna visibilidade dos botões de categoria
function toggleMenu() {
  menuAtivo = !menuAtivo;
  document.getElementById('categoryButtons').style.display = menuAtivo ? 'flex' : 'none';

  if (!menuAtivo) {
    // Se o menu foi fechado, volta para rotação de todos os modelos
    modelosAtivos = [
      ...categorias.bebidas,
      ...categorias.pizzas,
      ...categorias.sobremesas
    ];
    indexAtual = 0;
    categoriaSelecionada = null;
    carregarModelo(modelosAtivos[0]);
  }
}

// Troca de modelo com base no botão (1: próximo, -1: anterior)
function changeModel(direction) {
  if (modelosAtivos.length === 0) return;

  indexAtual += direction;

  if (indexAtual < 0) {
    indexAtual = modelosAtivos.length - 1;
  } else if (indexAtual >= modelosAtivos.length) {
    indexAtual = 0;
  }

  carregarModelo(modelosAtivos[indexAtual]);
}

// Seleciona uma categoria (ex: bebidas)
function selectCategory(categoria) {
  if (!categorias[categoria]) return;

  categoriaSelecionada = categoria;
  modelosAtivos = [...categorias[categoria]];
  indexAtual = 0;
  carregarModelo(modelosAtivos[0]);
}
