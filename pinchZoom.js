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
      initialScale = scale.x;
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

      document
        .querySelector("#modelContainer")
        .setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
    }
  });

  // Ao soltar os dedos
  window.addEventListener("touchend", () => {
    initialDistance = null;
  });
}