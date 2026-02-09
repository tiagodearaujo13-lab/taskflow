// js/app.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('TaskFlow System Initialized!');

  // Verificação
  if (!document.getElementById('board')) {
    console.log('Landing Page detected. Dashboard scripts skipped.');

    return;
  }

  // --- ELEMENTOS DO DOM ---
  const draggables = document.querySelectorAll('.task-card');
  const columns = document.querySelectorAll('.task-list');

  const btnAddTask = document.getElementById('btn-add-task');
  const modal = document.getElementById('task-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const taskForm = document.getElementById('task-form');
  const todoList = document.getElementById('todo-list');

  const btnMenuMobile = document.getElementById('btn-menu-mobile');
  const sidebar = document.querySelector('.sidebar');
  const btnCloseSidebar = document.querySelector('.btn-close-sidebar'); // Novo botão

  // Abrir Menu
  if (btnMenuMobile) {
    btnMenuMobile.addEventListener('click', (e) => {
      e.stopPropagation(); // Impede que o clique feche o menu imediatamente
      sidebar.classList.add('active');
    });
  }

  // Fechar com o botão X
  if (btnCloseSidebar) {
    btnCloseSidebar.addEventListener('click', () => {
      sidebar.classList.remove('active');
    });
  }

  // Fechar clicando fora (no corpo do site)
  document.addEventListener('click', (e) => {
    // Se o menu está aberto E o clique NÃO foi dentro da sidebar E NÃO foi no botão de abrir
    if (sidebar.classList.contains('active') &&
      !sidebar.contains(e.target) &&
      e.target !== btnMenuMobile) {

      sidebar.classList.remove('active');
    }
  });

  // --- 1. DRAG AND DROP LOGIC ---

  // Adiciona eventos aos cards que já existem no HTML
  draggables.forEach(card => {
    attachCardEvents(card);
  });

  // Configura as colunas para aceitar os cards
  columns.forEach(column => {
    column.addEventListener('dragover', e => {
      e.preventDefault(); // Necessário para permitir o drop

      // Descobre onde soltar o card (acima ou abaixo de outro)
      const afterElement = getDragAfterElement(column, e.clientY);
      const draggable = document.querySelector('.is-dragging');

      if (!draggable) return; // Segurança

      if (afterElement == null) {
        column.appendChild(draggable);
      } else {
        column.insertBefore(draggable, afterElement);
      }

      updateCounts(); // Atualiza contadores em tempo real
    });
  });

  // --- 2. MODAL LOGIC ---

  btnAddTask.addEventListener('click', () => {
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('active'), 10);
  });

  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 300);
  };

  btnCloseModal.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // --- 3. CREATE TASK LOGIC ---

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const titleInput = taskForm.querySelector('input[type="text"]');
    const title = titleInput.value;

    if (!title) return;

    createTask(title);
    titleInput.value = '';
    closeModal();
    updateCounts();
  });

  // --- FUNÇÕES AUXILIARES ---

  // Função unificada para adicionar Drag & Drop E Deletar
  function attachCardEvents(card) {
    // Drag Starts
    card.addEventListener('dragstart', () => {
      card.classList.add('is-dragging');
    });

    // Drag Ends
    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging'); // Remove a classe
      updateCounts();
    });

    // Lógica de Deletar (Botão "...")
    const btnMore = card.querySelector('.btn-more');
    if (btnMore) {
      btnMore.addEventListener('click', () => {
        // Efeito visual simples de confirmação
        if (confirm("Deseja deletar esta tarefa?")) {
          card.remove();
          updateCounts();
        }
      });
    }
  }

  function createTask(title) {
    const card = document.createElement('article');
    card.classList.add('task-card', 'bg-yellow');
    card.setAttribute('draggable', 'true');

    card.innerHTML = `
        <div class="card-header">
          <span class="tag tag-design">General</span>
          <button class="btn-more" title="Delete Task">
            <span class="material-symbols-outlined">delete</span> </button>
        </div>
        <div class="card-body">
          <h4>${title}</h4>
          <p>New task created manually via dashboard.</p>
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

    // Adiciona eventos ao novo card
    attachCardEvents(card);

    // Adiciona na coluna To Do
    todoList.appendChild(card);
  }

  function getDragAfterElement(container, y) {
    // Pega todos os cards que NÃO estão sendo arrastados
    const draggableElements = [...container.querySelectorAll('.task-card:not(.is-dragging)')];

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

  function updateCounts() {
    document.getElementById('count-todo').innerText = document.getElementById('todo-list').children.length;
    document.getElementById('count-progress').innerText = document.getElementById('inprogress-list').children.length;
    document.getElementById('count-done').innerText = document.getElementById('done-list').children.length;
  }

  const btnLogout = document.getElementById('btn-logout');
    
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            // Efeito de confirmação simples
            if(confirm("Are you sure you want to log out?")) {
                // Redireciona para o Login
                window.location.href = 'login.html';
            }
        });
    }

    
  // Inicializa contadores
  updateCounts();
});