// js/classes/Task.js
export class Task {
  constructor(id, title, tag, color = 'bg-yellow') {
    this.id = id || `task-${Date.now()}`;
    this.title = title;
    this.tag = tag || 'General';
    this.color = color;
    this.element = this.createCardElement();
  }

  createCardElement() {
    const card = document.createElement('article');
    card.classList.add('task-card', this.color);
    card.setAttribute('draggable', 'true');
    card.id = this.id;

    card.innerHTML = `
            <div class="card-header">
                <span class="tag tag-${this.tag.toLowerCase()}">${this.tag}</span>
                <button class="btn-more" title="Delete">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
            <div class="card-body">
                <h4>${this.title}</h4>
                <p>Task created via TaskFlow.</p>
            </div>
            <footer class="card-footer">
                <div class="avatars">
                    <div class="avatar-sm" style="background-color: #ccc;"></div>
                </div>
                <div class="meta-info">
                    <span class="material-symbols-outlined icon-sm">schedule</span>
                    <span>Now</span>
                </div>
            </footer>
        `;

    this.attachEvents(card);
    return card;
  }

  attachEvents(card) {
    // Evento de Drag
    card.addEventListener('dragstart', () => card.classList.add('is-dragging'));
    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      // Dispara um evento customizado para o Board atualizar contadores
      document.dispatchEvent(new Event('board:update'));
    });

    // Evento de Deletar
    const btnDelete = card.querySelector('.btn-more');
    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        if (confirm('Delete this task?')) {
          card.remove();
          document.dispatchEvent(new Event('board:update'));
        }
      });
    }
  }
}