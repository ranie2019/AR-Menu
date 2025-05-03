// loadingIndicator.js

// Função para mostrar o indicador de carregamento
export function showLoading(message = "Carregando...") {
    // Seleciona o elemento com o ID 'loadingIndicator'
    const indicator = document.getElementById("loadingIndicator");
  
    // Se o indicador existir, ajusta a mensagem e a exibe
    if (indicator) {
      indicator.textContent = message;  // Define a mensagem de carregamento
      indicator.style.display = "block"; // Torna o indicador visível
    }
  }
  
  // Função para ocultar o indicador de carregamento
  export function hideLoading() {
    // Seleciona o elemento com o ID 'loadingIndicator'
    const indicator = document.getElementById("loadingIndicator");
  
    // Se o indicador existir, oculta-o
    if (indicator) {
      indicator.style.display = "none";  // Esconde o indicador
    }
  }
  