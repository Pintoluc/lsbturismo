document.querySelectorAll(".gallery-container").forEach((container) => {
  let currentIndex = 0;
  const videos = container.querySelectorAll("video");
  const images = container.querySelectorAll("img");
  const placeElement = container.querySelector(".place"); // Selecciona el elemento donde mostrar el ID

  // Inicializa la galería
  function updateActive() {
    videos.forEach((video, index) => {
      video.classList.toggle(
        "active",
        index === currentIndex && video.tagName === "VIDEO"
      );
    });
    images.forEach((image, index) => {
      image.classList.toggle(
        "active",
        index === currentIndex - videos.length && image.tagName === "IMG"
      );
    });

    // Muestra el ID del video o la imagen si tienen uno
    if (currentIndex < videos.length) {
      // Para videos
      const video = videos[currentIndex];
      if (video.id) {
        placeElement.textContent = video.id; // Muestra el ID del video
      } else {
        placeElement.textContent = ""; // Limpia el texto si no hay ID
      }
    } else {
      // Para imágenes
      const image = images[currentIndex - videos.length];
      if (image.id) {
        placeElement.textContent = image.id; // Muestra el ID de la imagen
      } else {
        placeElement.textContent = ""; // Limpia el texto si no hay ID
      }
    }

    updateDots();
  }

  function changeImage(direction) {
    currentIndex += direction;

    if (currentIndex < 0) {
      currentIndex = videos.length + images.length - 1; // Vuelve al final
    } else if (currentIndex >= videos.length + images.length) {
      currentIndex = 0; // Vuelve al inicio
    }

    updateActive();
  }

  function setCurrentImage(index) {
    currentIndex = index;

    if (currentIndex < 0) {
      currentIndex = videos.length + images.length - 1; // Vuelve al final
    } else if (currentIndex >= videos.length + images.length) {
      currentIndex = 0; // Vuelve al inicio
    }

    updateActive();
  }

  function updateDots() {
    const dots = container.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  // Asignar funciones a los botones
  container.querySelector(".prev").onclick = () => changeImage(-1);
  container.querySelector(".next").onclick = () => changeImage(1);
  const dots = container.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.onclick = () => setCurrentImage(index);
  });

  // Inicializa la galería al cargar
  updateActive();
});

function toggleFullScreen(element) {
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch((err) => {
      console.error(
        `Error al intentar entrar en pantalla completa: ${err.message}`
      );
    });
  } else {
    document.exitFullscreen();
  }
}
