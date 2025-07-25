document.addEventListener('DOMContentLoaded', () => {
  const folderPath = 'frontend/productos/Img_Productos/';
  const carouselLeft = document.getElementById('carousel-left');
  const carouselRight = document.getElementById('carousel-right');

  // Fetch productos.json to get image list dynamically
  fetch('frontend/productos/productos.json')
    .then(response => response.json())
    .then(products => {
      const images = products.map(product => {
        // Extract only the filename from the image path
        return product.imagen.split('/').pop();
      });

      // Function to create an img element with hover effects
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

      // Create carousel with images randomly duplicated for infinite effect
      function createCarousel(container, direction = 'left') {
        const totalImages = images.length;
        for (let i = 0; i < totalImages * 2; i++) {
          const imgIndex = Math.floor(Math.random() * totalImages);
          const img = createImageElement(images[imgIndex]);
          container.appendChild(img);
        }

        let scrollAmount = 0;
        const scrollStep = 1; // scroll speed
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
    })
    .catch(error => {
      console.error('Error loading productos.json:', error);
    });
});
