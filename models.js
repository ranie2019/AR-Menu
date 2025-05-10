// Define todos os modelos disponíveis por categoria
const models = {
  inicio: [
    { path: 'objetos3d/inicio/cubo.glb', price: 0.00 }
  ],
  bebidas: [
    { path: 'objetos3d/bebidas/absolut_vodka_1l.glb', price: 79.90 },
    { path: 'objetos3d/bebidas/champagne_Lorem.glb', price: 120.00 },
    { path: 'objetos3d/bebidas/champagne.glb', price: 98.50 },
    { path: 'objetos3d/bebidas/fizzy_drink.glb', price: 8.00 },
    { path: 'objetos3d/bebidas/heineken.glb', price: 12.90 },
    { path: 'objetos3d/bebidas/JACK_DANIELS.glb', price: 130.00 },
    { path: 'objetos3d/bebidas/redbull.glb', price: 9.90 }
  ],
  pizzas: [
    { path: 'objetos3d/pizzas/pizza.glb', price: 45.00 },
    { path: 'objetos3d/pizzas/caneca.glb', price: 15.00 },
  ],
  sobremesas: [
    { path: 'objetos3d/sobremesas/Chocolate_Quente.glb', price: 12.00 },
    { path: 'objetos3d/sobremesas/sundae.glb', price: 10.50 },
  ]
};

/**
 * Formata dinamicamente o nome do produto com base no caminho do arquivo.
 * Exemplo: 'objetos3d/bebidas/absolut_vodka_1l.glb' => 'Absolut Vodka 1L'
 * @param {string} filePath Caminho completo do arquivo .glb
 * @returns {string} Nome formatado do produto
 */
function formatProductName(filePath) {
  // Extrai apenas o nome do arquivo (sem caminho e sem extensão)
  let name = filePath.split('/').pop().replace('.glb', '');

  // Substitui underlines por espaços
  name = name.replace(/_/g, ' ');

  // Coloca a primeira letra de cada palavra em maiúsculo
  name = name.replace(/\b\w/g, char => char.toUpperCase());

  return name;
}
