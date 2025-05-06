// Referências aos elementos do DOM
const modelContainer = document.getElementById('modelContainer');
const loadingIndicator = document.getElementById('loadingIndicator');

// Variáveis de controle
let currentModelIndex = 0;
let currentCategory = 'inicio'; // Categoria inicial
let modelList = ['inicio.glb']; // Lista de modelos da categoria atual

// Caminho base para os modelos
const BASE_PATH = '3d';

// Exibe ou oculta o indicador de carregamento
function showLoading(show) {
  loadingIndicator.style.display = show ? 'block' : 'none';
}

// Carrega um modelo GLB dentro do container
function loadModel(filename) {
  showLoading(true);

  // Define o caminho completo para o modelo
  const fullPath = currentCategory === 'inicio'
    ? `${BASE_PATH}/${filename}` // modelo padrão fora de subpastas
    : `${BASE_PATH}/${currentCategory}/${filename}`;

  // Remove qualquer modelo anterior
  while (modelContainer.firstChild) {
    modelContainer.removeChild(modelContainer.firstChild);
  }

  // Cria novo elemento <a-entity> com o modelo 3D
  const model = document.createElement('a-entity');
  model.setAttribute('gltf-model', fullPath);
  model.setAttribute('animation-mixer', '');
  model.setAttribute('position', '0 0 0');
  model.setAttribute('rotation', '0 180 0');
  model.setAttribute('scale', '1 1 1');

  // Esconde o "Carregando..." quando o modelo estiver pronto
  model.addEventListener('model-loaded', () => {
    showLoading(false);
  });

  modelContainer.appendChild(model);
}

// Troca de modelo: -1 = anterior, 1 = próximo
function changeModel(direction) {
  if (modelList.length <= 1) return; // Evita erro se só há 1 modelo

  currentModelIndex += direction;

  // Garantir que o índice fique dentro dos limites da lista
  if (currentModelIndex < 0) currentModelIndex = modelList.length - 1;
  if (currentModelIndex >= modelList.length) currentModelIndex = 0;

  // Carrega o modelo novo
  loadModel(modelList[currentModelIndex]);
}

// Alterna a exibição do menu de categorias
function toggleMenu() {
  const menu = document.getElementById('categoryButtons');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// Seleciona uma categoria (bebidas, pizzas, etc.) e carrega o primeiro modelo dela
function selectCategory(category) {
  currentCategory = category;
  currentModelIndex = 0;

  // Modelos disponíveis por categoria (adicione os nomes reais dos seus arquivos aqui)
  const modelsByCategory = {
    bebidas: ['coca.glb', 'suco.glb'],
    pizzas: ['marguerita.glb', 'calabresa.glb'],
    sobremesas: ['bolo.glb', 'sorvete.glb']
  };

  // Atualiza a lista de modelos com base na categoria
  modelList = modelsByCategory[category] || [];

  if (modelList.length === 0) {
    alert('Nenhum modelo encontrado para esta categoria.');
    return;
  }

  toggleMenu(); // Fecha o menu de categorias
  loadModel(modelList[0]); // Carrega o primeiro modelo da nova categoria
}

// Ao carregar a página, mostra o modelo padrão "inicio.glb"
window.addEventListener('load', () => {
  currentCategory = 'inicio';
  loadModel('inicio.glb');
});
