const models = [
  "champagne",
  "heineken",
  "redbull",
  "fizzydrink",
  "cubo",
  "sundae",
  "pizza",
];

let currentIndex = 0;
const modelCache = {};

function loadModel(name) {
  const container = document.querySelector("#modelContainer");
  const loadingIndicator = document.querySelector("#loadingIndicator");

  loadingIndicator.style.display = "block";
  container.removeAttribute("gltf-model");

  if (modelCache[name]) {
    container.setAttribute("gltf-model", modelCache[name]);
    loadingIndicator.style.display = "none";
  } else {
    fetch(`https://ar-menu-models.s3.amazonaws.com/ar-models/${name}.glb`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        modelCache[name] = url;
        container.setAttribute("gltf-model", url);
        loadingIndicator.style.display = "none";
      })
      .catch((error) => {
        console.error("Erro ao carregar o modelo:", error);
        loadingIndicator.innerText = "Erro ao carregar o modelo";
      });
  }
}

function changeModel(direction) {
  currentIndex = (currentIndex + direction + models.length) % models.length;
  loadModel(models[currentIndex]);
}

loadModel(models[currentIndex]);

// Rotação automática
setInterval(() => {
  const model = document.querySelector("#modelContainer");
  const rotation = model.getAttribute("rotation");
  rotation.y += 0.5;
  model.setAttribute("rotation", rotation);
}, 30);

// Zoom com gesto de pinça
let initialDistance = null;
let initialScale = 1;

function updateScale(scaleFactor) {
  const model = document.querySelector("#modelContainer");
  const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.1), 10);
  model.setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
}

window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    initialDistance = Math.sqrt(dx * dx + dy * dy);
    const scale = document.querySelector("#modelContainer").getAttribute("scale");
    initialScale = scale.x;
  }
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2 && initialDistance) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);
    const scaleFactor = currentDistance / initialDistance;
    updateScale(scaleFactor);
  }
});

window.addEventListener("touchend", () => {
  initialDistance = null;
});
