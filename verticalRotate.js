// Variável para armazenar a posição inicial do toque no eixo Y
let startY = null;

// Variável para armazenar a rotação inicial no eixo X do modelo
let initialRotationX = 0;

// Função que ativa a rotação vertical do modelo com o movimento de um dedo (deslizar para cima/baixo)
export function initVerticalRotate() {
  // Quando o usuário toca na tela
  window.addEventListener("touchstart", (e) => {
    // Verifica se apenas um dedo está tocando
    if (e.touches.length === 1) {
      // Armazena a posição Y inicial do toque
      startY = e.touches[0].clientY;

      // Captura a rotação atual do modelo
      const model = document.querySelector("#modelContainer");
      initialRotationX = model.getAttribute("rotation").x;
    }
  });

  // Quando o usuário move o dedo
  window.addEventListener("touchmove", (e) => {
    // Continua somente se for um toque com um dedo e a posição inicial foi registrada
    if (e.touches.length === 1 && startY !== null) {
      // Calcula a diferença de posição Y entre o início e o movimento atual
      const deltaY = e.touches[0].clientY - startY;

      // Captura o modelo e sua rotação atual
      const model = document.querySelector("#modelContainer");
      const rotation = model.getAttribute("rotation");

      // Calcula a nova rotação no eixo X, limitando entre -90 e 90 graus para evitar giros exagerados
      const newX = Math.min(Math.max(initialRotationX - deltaY * 0.2, -90), 90);

      // Aplica a nova rotação mantendo os outros eixos (Y e Z) inalterados
      model.setAttribute("rotation", `${newX} ${rotation.y} ${rotation.z}`);
    }
  });

  // Quando o usuário solta o dedo da tela
  window.addEventListener("touchend", () => {
    // Reseta a posição inicial do toque
    startY = null;
  });
}
