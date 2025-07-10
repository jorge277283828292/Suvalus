document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");

  // Copiar contenido al principio y al final para hacerlo infinito
  carousel.innerHTML += carousel.innerHTML; // Duplicar contenido al final
  carousel.innerHTML = carousel.innerHTML;  // Re-renderizar

  let scrollAmount = 0;

  function scrollCarousel() {
    scrollAmount += 1;
    if (scrollAmount >= carousel.scrollWidth / 2) {
      scrollAmount = 0;
      carousel.style.transition = "none";
      carousel.style.transform = "translateX(0)";
      setTimeout(() => {
        carousel.style.transition = "transform 0.5s ease";
      }, 20);
    } else {
      carousel.style.transform = `translateX(-${scrollAmount}px)`;
    }
  }

  setInterval(scrollCarousel, 50); // Velocidad del scroll automático
});