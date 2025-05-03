// Variável para armazenar a posição inicial do toque no eixo Y
let startY = null;

// Variável para armazenar a rotação inicial no eixo X do modelo
let initialRotationX = 0;

/**
 * Inicializa rotação vertical com um dedo (movimento para cima/baixo)
 * Aplica rotação no eixo X ao modelo com id "modelContainer"
 */
export function initVerticalRotate() {
  // Ao tocar na tela
  window.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      startY = e.touches[0].clientY;
      const model = document.querySelector("#modelContainer");
      initialRotationX = model.getAttribute("rotation").x;
    }
  });

  // Ao mover o dedo
  window.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1 && startY !== null) {
      const deltaY = e.touches[0].clientY - startY;
      const model = document.querySelector("#modelContainer");
      const rotation = model.getAttribute("rotation");

      const newX = Math.min(Math.max(initialRotationX - deltaY * 0.2, -90), 90);
      model.setAttribute("rotation", `${newX} ${rotation.y} ${rotation.z}`);
    }
  });

  // Ao soltar o dedo
  window.addEventListener("touchend", () => {
    startY = null;
  });
}
