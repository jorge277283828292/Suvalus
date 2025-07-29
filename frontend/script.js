document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('comment-form');
  const commentText = document.getElementById('comment-text');
  const errorContainer = document.getElementById('comment-error');

  // Limpiar mensaje de error al modificar el texto
  commentText.addEventListener('input', () => {
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';
  });
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('comment-name').value;
    const comentario = commentText.value;
  
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';
  
    console.log('Enviando comentario:', { nombre, comentario });
  
    try {
      const response = await fetch('http://127.0.0.1:8000/comments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nombre, comentario })
      });
      console.log('Respuesta recibida:', response);
      if (response.ok) {
        // Comentario enviado con éxito, sin alertas
        form.reset();
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
          div.innerHTML = `
            <p>"${c.comentario}"</p>
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
