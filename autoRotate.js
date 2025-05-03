// Função que inicia a rotação automática do modelo no eixo Y
export function startAutoRotate() {
  // Define um intervalo que executa a cada 30 milissegundos (~33fps)
  setInterval(() => {
      // Seleciona o elemento que contém o modelo 3D
      const model = document.querySelector("#modelContainer");

      // Se o modelo não existir ainda, sai da função
      if (!model) return;

      // Obtém a rotação atual do modelo (como objeto {x, y, z})
      const rotation = model.getAttribute("rotation");

      // Incrementa o valor do eixo Y para rotacionar horizontalmente
      rotation.y += 0.5;

      // Previne que o valor de rotação Y ultrapasse 360 (ou seja, faz um loop)
      if (rotation.y >= 360) {
          rotation.y = 0;
      }

      // Aplica a nova rotação ao modelo
      model.setAttribute("rotation", rotation);
  }, 30); // Executa a cada 30ms para uma rotação suave
}
