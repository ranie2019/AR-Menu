// Variável para armazenar a distância inicial entre dois dedos
let initialDistance = null;

// Variável para armazenar a escala inicial do modelo
let initialScale = 1;

// Função que ativa o gesto de zoom com dois dedos (pinça)
export function initPinchZoom() {
  // Evento acionado quando o usuário toca na tela
  window.addEventListener("touchstart", (e) => {
    // Verifica se dois dedos estão tocando na tela
    if (e.touches.length === 2) {
      // Calcula a distância entre os dois dedos no eixo X e Y
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;

      // Calcula a distância total entre os dedos (teorema de Pitágoras)
      initialDistance = Math.sqrt(dx * dx + dy * dy);

      // Captura a escala atual do modelo
      const scale = document.querySelector("#modelContainer").getAttribute("scale");
      initialScale = scale.x; // Usa o eixo X como referência (supõe escala uniforme)
    }
  });

  // Evento acionado quando os dedos se movem na tela
  window.addEventListener("touchmove", (e) => {
    // Só executa se ainda houver dois dedos e a distância inicial foi definida
    if (e.touches.length === 2 && initialDistance) {
      // Calcula a nova distância entre os dedos
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);

      // Define o fator de escala com base na variação da distância
      const scaleFactor = currentDistance / initialDistance;

      // Calcula a nova escala do modelo, limitada entre 0.1 e 10
      const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.1), 10);

      // Aplica a nova escala uniformemente nos 3 eixos
      const model = document.querySelector("#modelContainer");
      model.setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
    }
  });

  // Evento acionado quando o toque termina
  window.addEventListener("touchend", () => {
    // Reseta a distância inicial
    initialDistance = null;
  });
}
