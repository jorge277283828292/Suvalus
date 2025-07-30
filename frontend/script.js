document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('comment-form');
  const commentText = document.getElementById('comment-text');
  const errorContainer = document.getElementById('comment-error');
  const stars = document.querySelectorAll('.star');
  const ratingValue = document.getElementById('rating-value');

  // Limpiar mensaje de error al modificar el texto o calificación
  commentText.addEventListener('input', () => {
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';
  });

  stars.forEach((star) => {
    star.addEventListener('mouseover', () => {
      const val = parseInt(star.getAttribute('data-value'));
      highlightStars(val);
    });

    star.addEventListener('mouseout', () => {
      highlightStars(parseInt(ratingValue.value));
    });

    star.addEventListener('click', () => {
      const val = parseInt(star.getAttribute('data-value'));
      ratingValue.value = val;
      highlightStars(val);
    });
  });

  function highlightStars(rating) {
    stars.forEach((s) => {
      const val = parseInt(s.getAttribute('data-value'));
      s.classList.toggle('selected', val <= rating);
      s.classList.toggle('hovered', val <= rating);
    });
  }

  // Validar que el nombre solo contenga letras y espacios
  function validarNombre(nombre) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return regex.test(nombre);
  }

  // Filtrar groserías reemplazándolas por asteriscos
  function filtrarGroserias(texto) {
    const groserias = ['puta', 'mierda', 'coño', 'joder', 'gilipollas', 'cabron', 'pendejo', 'culo', 'chinga']; // Lista real de groserías
    let textoFiltrado = texto;
    groserias.forEach(groseria => {
      const regex = new RegExp(groseria, 'gi');
      textoFiltrado = textoFiltrado.replace(regex, '*'.repeat(groseria.length));
    });
    return textoFiltrado;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let nombre = document.getElementById('comment-name').value.trim();
    let comentario = commentText.value.trim();
    let estrellas = parseInt(ratingValue.value);

    errorContainer.style.display = 'none';
    errorContainer.textContent = '';

    if (!validarNombre(nombre)) {
      errorContainer.textContent = 'El nombre solo puede contener letras y espacios.';
      errorContainer.style.display = 'block';
      return;
    }

    if (comentario.length > 0 && (isNaN(estrellas) || estrellas < 1 || estrellas > 5)) {
      errorContainer.textContent = 'Por favor, selecciona una calificación con estrellas.';
      errorContainer.style.display = 'block';
      return;
    }

    nombre = filtrarGroserias(nombre);
    comentario = filtrarGroserias(comentario);

    console.log('Enviando comentario:', { nombre, comentario, estrellas });

    try {
      const response = await fetch('http://127.0.0.1:8000/comments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nombre, comentario, estrellas })
      });
      console.log('Respuesta recibida:', response);
      if (response.ok) {
        // Comentario enviado con éxito, sin alertas
        form.reset();
        ratingValue.value = 0;
        highlightStars(0);
        cargarComentarios();
      } else {
        const errorText = await response.text();
        errorContainer.textContent = errorText;
        errorContainer.style.display = 'block';
      }
    } catch (error) {
      console.error('Error de red al enviar el comentario:', error);
      // No mostrar alerta de error
    }
  });

  async function cargarComentarios() {
    console.log("Ejecutando cargarComentarios...");
    try {
      const response = await fetch('http://127.0.0.1:8000/comments/random');
      console.log("Respuesta de fetch cargarComentarios:", response);
      if (response.ok) {
        const comentarios = await response.json();
        console.log("Comentarios recibidos:", comentarios);
        const contenedor = document.getElementById('testimonial-cards');
        contenedor.innerHTML = '';
        comentarios.forEach(c => {
          const div = document.createElement('div');
          div.className = 'testimonial';

          // Mostrar estrellas
          let estrellasHTML = '<div class="stars">';
          for (let i = 1; i <= 5; i++) {
            if (i <= c.estrellas) {
              estrellasHTML += '<span class="star selected">&#9733;</span>';
            } else {
              estrellasHTML += '<span class="star">&#9733;</span>';
            }
          }
          estrellasHTML += '</div>';

          div.innerHTML = `
            <p>"${c.comentario}"</p>
            ${estrellasHTML}
            <div class="client">
              <div>
                <strong>${c.nombre}</strong><br>
              </div>
            </div>
          `;
          contenedor.appendChild(div);
        });
      } else {
        console.error('Error al cargar comentarios:', response.statusText);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    }
  }

  cargarComentarios();
});
