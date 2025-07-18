document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");

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

  const commentForm = document.getElementById("comment-form");
  const commentsList = document.getElementById("testimonial-cards");

  async function loadComments() {
    try {
      const response = await fetch("http://127.0.0.1:8000/comments");
      if (!response.ok) throw new Error("Error fetching comments");
      const comments = await response.json();
      commentsList.innerHTML = "";
      comments.forEach(comment => {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("testimonial");
        commentDiv.innerHTML = `
          <p>"${comment.comentario}"</p>
          <div class="client">
            <img src="https://placehold.co/40x40" alt="Cliente">
            <div>
              <strong>${comment.nombre}</strong><br>
              <small>${new Date(comment.fecha).toLocaleString()}</small>
            </div>
          </div>
        `;
        commentsList.appendChild(commentDiv);
      });
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  }

  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("comment-name");
    const textInput = document.getElementById("comment-text");
    if (nameInput.value.trim() === "" || textInput.value.trim() === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }
    const newComment = {
      nombre: nameInput.value.trim(),
      comentario: textInput.value.trim()
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment)
      });
      if (!response.ok) throw new Error("Error sending comment");
      await loadComments();
      commentForm.reset();
    } catch (error) {
      console.error("Failed to send comment:", error);
      alert("Error al enviar el comentario. Intenta de nuevo.");
    }
  });

  loadComments();
});
