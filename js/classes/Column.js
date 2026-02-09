// js/classes/Column.js
export class Column {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
    if (this.element) {
      this.initDropZone();
    }
  }

  initDropZone() {
    this.element.addEventListener('dragover', (e) => {
      e.preventDefault(); // Permite o drop
      const afterElement = this.getDragAfterElement(e.clientY);
      const draggable = document.querySelector('.is-dragging');

      if (!draggable) return;

      if (afterElement == null) {
        this.element.appendChild(draggable);
      } else {
        this.element.insertBefore(draggable, afterElement);
      }

      // Atualiza contadores instantaneamente
      document.dispatchEvent(new Event('board:update'));
    });
  }

  getDragAfterElement(y) {
    const draggableElements = [...this.element.querySelectorAll('.task-card:not(.is-dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
}