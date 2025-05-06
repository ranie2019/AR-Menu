const models = [
  "champagne",
  "heineken",
  "redbull",
  "fizzydrink",
  "cubo",
  "sundae",
  "pizza",
  "Chocolate_Quente",
  "absolut_vodka_1l",
  "JACK_DANIELS",
  "champagne_Lorem"
];

let currentIndex = 0;
const modelCache = {};

function loadModel(name) {
  const container = document.querySelector("#modelContainer");
  const loadingIndicator = document.querySelector("#loadingIndicator");

  loadingIndicator.style.display = "block";
  loadingIndicator.innerText = "Carregando...";

  container.removeAttribute("gltf-model");
  container.setAttribute("position", "0 -0.5 -3");
  container.setAttribute("rotation", "0 180 0");
  container.setAttribute("scale", "1 1 1");

  if (modelCache[name]) {
    container.setAttribute("gltf-model", modelCache[name]);
    loadingIndicator.style.display = "none";
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `./3d/${name}.glb`, true);
    xhr.responseType = "blob";

    xhr.onload = () => {
      const url = URL.createObjectURL(xhr.response);
      modelCache[name] = url;
      container.setAttribute("gltf-model", url);
      loadingIndicator.style.display = "none";
    };

    xhr.onerror = () => {
      console.error("Erro ao carregar o modelo.");
      loadingIndicator.innerText = "Erro ao carregar o modelo";
    };

    xhr.send();
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
  if (!model) return;
  const rotation = model.getAttribute("rotation");
  model.setAttribute("rotation", {
    x: rotation.x,
    y: rotation.y + 0.5,
    z: rotation.z
  });
}, 30);

// Escala com gesto de pinça
let pinchStartDist = null;
let pinchStartScale = 1;

function getDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    pinchStartDist = getDistance(e.touches);
    const scale = document.querySelector("#modelContainer").getAttribute("scale");
    pinchStartScale = scale.x;
  }
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2 && pinchStartDist) {
    const newDist = getDistance(e.touches);
    const scaleFactor = newDist / pinchStartDist;
    const newScale = Math.min(Math.max(pinchStartScale * scaleFactor, 0.1), 10);
    document.querySelector("#modelContainer").setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
  }
});

window.addEventListener("touchend", () => {
  pinchStartDist = null;
});

// Rotação vertical com 1 dedo
let rotateStartY = null;
let rotateStartX = 0;

window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    rotateStartY = e.touches[0].clientY;
    rotateStartX = document.querySelector("#modelContainer").getAttribute("rotation").x;
  }
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1 && rotateStartY !== null) {
    const deltaY = e.touches[0].clientY - rotateStartY;
    const model = document.querySelector("#modelContainer");
    const rotation = model.getAttribute("rotation");
    const newX = Math.min(Math.max(rotateStartX - deltaY * 0.2, -90), 90);
    model.setAttribute("rotation", `${newX} ${rotation.y} ${rotation.z}`);
  }
});

window.addEventListener("touchend", () => {
  rotateStartY = null;
});
