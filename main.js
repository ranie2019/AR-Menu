const models = [
  "champagne",
  "heineken",
  "redbull",
  "fizzydrink",
  "chocolatecupcake",
  "sundae",
  "pizza",
];

let currentIndex = 0;
const container = document.querySelector("#modelContainer");
const loadingIndicator = document.querySelector("#loadingIndicator");

function loadModel(name) {
  loadingIndicator.style.display = "block";
  container.removeAttribute("gltf-model");

  fetch(`https://ar-menu-models.s3.amazonaws.com/ar-models/${name}.glb`)
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      container.setAttribute("gltf-model", url);
      container.setAttribute("scale", "1 1 1");
      loadingIndicator.style.display = "none";
    })
    .catch((err) => {
      console.error("Erro ao carregar o modelo:", err);
      loadingIndicator.innerText = "Erro ao carregar o modelo";
    });
}

function changeModel(direction) {
  currentIndex = (currentIndex + direction + models.length) % models.length;
  loadModel(models[currentIndex]);
}

document.querySelector("#prevBtn").addEventListener("click", () => changeModel(-1));
document.querySelector("#nextBtn").addEventListener("click", () => changeModel(1));

loadModel(models[currentIndex]);

// Rotação automática
setInterval(() => {
  const rot = container.getAttribute("rotation");
  container.setAttribute("rotation", { x: rot.x, y: rot.y + 0.5, z: rot.z });
}, 30);

// Zoom com gesto
let initialDistance = null;
let initialScale = 1;

window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    initialDistance = Math.hypot(dx, dy);
    initialScale = container.getAttribute("scale").x;
  }
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2 && initialDistance) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentDistance = Math.hypot(dx, dy);
    const scaleFactor = currentDistance / initialDistance;
    const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.1), 10);
    container.setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
  }
});

window.addEventListener("touchend", () => {
  initialDistance = null;
});
