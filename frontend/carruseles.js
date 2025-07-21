document.addEventListener('DOMContentLoaded', () => {
  const folderPath = 'frontend/Faroles/';
  const carouselLeft = document.getElementById('carousel-left');
  const carouselRight = document.getElementById('carousel-right');

  // Obtener lista de imágenes de la carpeta Faroles
  // Como no podemos leer directorios con JS puro en navegador, listamos manualmente las imágenes
  const images = [
    'WhatsApp Image 2025-07-03 at 21.04.09_18ad1db2.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.09_ab529456.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.10_41317276.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.10_e3d1d7da.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.10_f0f91603.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.12_9cae62b9.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.13_06b5f8cf.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.13_31d208e3.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.13_091c93c5.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.13_33454ae6.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.13_c313fb9d.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.14_0e374ade.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.14_8e3cc73c.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.14_776b2e06.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.14_6438e8ab.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.14_87483951.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.15_88c09f42.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.15_de6b56b4.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.15_e5a5afc1.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.15_fe56a2cc.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.16_56e96813.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.16_9250876a.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.16_ab522691.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.16_c8f12830.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.17_2d47a2dd.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.17_561aa72b.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.17_413913c9.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.17_804326d4.jpg',
    'WhatsApp Image 2025-07-03 at 21.04.17_f330b12d.jpg'
  ];

  // Función para crear un elemento img con efectos hover
  function createImageElement(src) {
    const img = document.createElement('img');
    img.src = folderPath + src;
    img.classList.add('carousel-image');
    img.style.transition = 'transform 0.3s ease';
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.1)';
    });
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
    return img;
  }

  // Crear carrusel con imágenes aleatorias
  function createCarousel(container, direction = 'left') {
    // Duplicar imágenes para efecto infinito
    const totalImages = images.length;
    for (let i = 0; i < totalImages * 2; i++) {
      const imgIndex = Math.floor(Math.random() * totalImages);
      const img = createImageElement(images[imgIndex]);
      container.appendChild(img);
    }

    let scrollAmount = 0;
    const scrollStep = 1; // velocidad del scroll
    const maxScroll = container.scrollWidth / 2;

    function scroll() {
      if (direction === 'left') {
        scrollAmount += scrollStep;
        if (scrollAmount >= maxScroll) {
          scrollAmount = 0;
        }
        container.scrollLeft = scrollAmount;
      } else {
        scrollAmount -= scrollStep;
        if (scrollAmount <= 0) {
          scrollAmount = maxScroll;
        }
        container.scrollLeft = scrollAmount;
      }
      requestAnimationFrame(scroll);
    }
    scroll();
  }

  createCarousel(carouselLeft, 'left');
  createCarousel(carouselRight, 'right');
});
