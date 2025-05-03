// Variável para armazenar a distância inicial entre dois dedos
let initialDistance = null;

// Variável para armazenar a escala inicial do modelo
let initialScale = 1;

/**
 * Inicializa o gesto de zoom com dois dedos (pinça)
 * Aplica zoom ao modelo com id "modelContainer"
 */
export function initPinchZoom() {
  // Ao tocar na tela
  window.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialDistance = Math.hypot(dx, dy); // Distância entre os dois dedos

      // Captura escala atual do modelo
      const scale = document.querySelector("#modelContainer").getAttribute("scale");
      const scaleValues = scale.split(" ").map(Number); // Transforma a string "x y z" em um array de números
      initialScale = scaleValues[0]; // Usamos o valor de escala no eixo X (pode ser o mesmo para Y e Z)
    }
  });

  // Ao mover os dedos
  window.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2 && initialDistance) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDistance = Math.hypot(dx, dy);

      const scaleFactor = currentDistance / initialDistance;
      const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.1), 10);

      // Aplica a nova escala no modelo
      const model = document.querySelector("#modelContainer");
      model.setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
    }
  });

  // Ao soltar os dedos
  window.addEventListener("touchend", () => {
    initialDistance = null;
  });
}

/**
 * Inicializa o gesto de rotação vertical com um dedo
 * Aplica rotação ao modelo com id "modelContainer"
 */
export function initVerticalRotate() {
  let startX = null;
  let currentRotation = 0;

  // Ao tocar na tela
  window.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
    }
  });

  // Ao mover o dedo
  window.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1 && startX !== null) {
      const dx = e.touches[0].clientX - startX;
      currentRotation += dx * 0.1; // A multiplicação controla a velocidade da rotação

      // Aplica rotação ao modelo
      const model = document.querySelector("#modelContainer");
      model.setAttribute("rotation", `0 ${currentRotation} 0`);

      startX = e.touches[0].clientX; // Atualiza o valor de startX para o novo ponto
    }
  });

  // Ao soltar o dedo
  window.addEventListener("touchend", () => {
    startX = null;
  });
}
