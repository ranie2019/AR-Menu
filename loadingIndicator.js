// loadingIndicator.js

// Função para mostrar o indicador de carregamento
export function showLoading(message = "Carregando...") {
    const indicator = document.getElementById("loadingIndicator");
  
    if (indicator) {
      indicator.textContent = message; // Define a mensagem
      indicator.style.display = "block"; // Torna visível
    }
  }
  
  // Função para ocultar o indicador de carregamento
  export function hideLoading() {
    const indicator = document.getElementById("loadingIndicator");
  
    if (indicator) {
      indicator.style.display = "none"; // Esconde o indicador
    }
  }
  