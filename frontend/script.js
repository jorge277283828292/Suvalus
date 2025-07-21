document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('comment-form');
  const commentText = document.getElementById('comment-text');
  const errorContainer = document.getElementById('comment-error');

  // Lista ampliada de palabras prohibidas en español para mayor bloqueo
  const palabrasProhibidas = [
    "puta", "puto", "mierda", "mierdas", "joder", "jodido", "jodida", "coño", "gilipollas", "cabron", "cabrona",
    "pendejo", "pendeja", "culo", "chinga", "chingar", "chingada", "chingado", "verga", "polla", "zorra", "zorro",
    "maricon", "maricón", "maricona", "puta madre", "hijo de puta", "hijo de la gran puta", "cabrón",
    "cabrone", "cabronea", "cabroneado", "cabroneada", "chingue", "chinguen", "chingada madre", "chingada la madre",
    "pendejada", "pendejadas", "pendejear", "pendejito", "pendejita", "verga madre", "verga puta", "verga puta madre",
    "chingar a su madre", "chinga tu madre", "chinga tu puta madre", "chingada su madre", "chingada tu madre", "pene", "vagina"
  ];

  // Función para verificar si el comentario contiene palabras prohibidas
  function contienePalabrasProhibidas(texto) {
    const textoMinusculas = texto.toLowerCase();
    return palabrasProhibidas.some(palabra => textoMinusculas.includes(palabra));
  }

  // Limpiar mensaje de error al modificar el texto
  commentText.addEventListener('input', () => {
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('comment-name').value;
    const comentario = commentText.value;

    if (contienePalabrasProhibidas(comentario)) {
      errorContainer.textContent = "Por favor, evita usar lenguaje ofensivo o inapropiado en los comentarios.";
      errorContainer.style.display = 'block';
      return; // Detener el envío del formulario
    }

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
        console.error('Error al enviar comentario:', errorText);
        // No mostrar alerta de error
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
