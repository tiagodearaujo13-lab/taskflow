// js/app.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('TaskFlow System Initialized!');

  // --- 1. LÓGICA GLOBAL (Roda em todas as páginas) ---
  initGlobalFunctions();

  // --- 2. ROTEADOR (Detecta a página e roda a lógica específica) ---
  if (document.getElementById('board')) {
    initDashboard();
  } else if (document.querySelector('.backlog-container')) {
    initBacklog();
  } else if (document.querySelector('.reports-container')) {
    initReports();
  }
});

// =========================================================
// FUNÇÕES GLOBAIS (Sidebar, Menu, Logout)
// =========================================================
function initGlobalFunctions() {
  // Menu Mobile
  const btnMenuMobile = document.getElementById('btn-menu-mobile');
  const sidebar = document.querySelector('.sidebar');
  const btnCloseSidebar = document.querySelector('.btn-close-sidebar');

  if (btnMenuMobile && sidebar) {
    btnMenuMobile.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.add('active');
    });

    if (btnCloseSidebar) {
      btnCloseSidebar.addEventListener('click', () => {
        sidebar.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        e.target !== btnMenuMobile) {
        sidebar.classList.remove('active');
      }
    });
  }

  // Logout Logic
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm("Are you sure you want to log out?")) {
        window.location.href = 'login.html';
      }
    });
  }
}

// =========================================================
// PÁGINA: DASHBOARD (Kanban)
// =========================================================
function initDashboard() {
  console.log("Dashboard Loaded");

  const draggables = document.querySelectorAll('.task-card');
  const columns = document.querySelectorAll('.task-list');
  const todoList = document.getElementById('todo-list'); // Coluna padrão para novas tasks

  // Inicializa Drag & Drop nos cards existentes
  draggables.forEach(card => attachDragEvents(card));

  // Configura colunas
  columns.forEach(column => {
    column.addEventListener('dragover', e => {
      e.preventDefault();
      const afterElement = getDragAfterElement(column, e.clientY);
      const draggable = document.querySelector('.is-dragging');
      if (!draggable) return;

      if (afterElement == null) {
        column.appendChild(draggable);
      } else {
        column.insertBefore(draggable, afterElement);
      }
      updateCounts();
    });
  });

  // Inicializa Modal de Criação (Reutilizando função auxiliar)
  setupModal((title) => {
    createKanbanCard(title, todoList);
  });

  updateCounts();
}

// Auxiliares do Dashboard
function attachDragEvents(card) {
  card.addEventListener('dragstart', () => card.classList.add('is-dragging'));
  card.addEventListener('dragend', () => {
    card.classList.remove('is-dragging');
    updateCounts();
  });

  // Botão de deletar (...)
  const btnMore = card.querySelector('.btn-more');
  if (btnMore) {
    btnMore.addEventListener('click', () => {
      if (confirm('Delete this task?')) {
        card.remove();
        updateCounts();
      }
    })
  }
}

function getDragAfterElement(container, y) {
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
  const todo = document.getElementById('todo-list').children.length;
  const progress = document.getElementById('inprogress-list').children.length;
  const done = document.getElementById('done-list').children.length;

  document.getElementById('count-todo').innerText = todo;
  document.getElementById('count-progress').innerText = progress;
  document.getElementById('count-done').innerText = done;
}

function createKanbanCard(title, container) {
  const card = document.createElement('article');
  card.classList.add('task-card', 'bg-yellow');
  card.setAttribute('draggable', 'true');
  card.innerHTML = `
        <div class="card-header">
          <span class="tag tag-design">General</span>
          <button class="btn-more"><span class="material-symbols-outlined">delete</span></button>
        </div>
        <div class="card-body">
          <h4>${title}</h4>
          <p>New task created manually.</p>
        </div>
        <footer class="card-footer">
          <div class="avatars"><div class="avatar-sm" style="background-color: #ccc;"></div></div>
          <div class="meta-info"><span class="material-symbols-outlined icon-sm">schedule</span><span>Now</span></div>
        </footer>
    `;
  attachDragEvents(card);
  container.appendChild(card);
  updateCounts();
}

// =========================================================
// PÁGINA: BACKLOG (Lista Vertical)
// =========================================================
function initBacklog() {
  console.log("Backlog Loaded");

  const backlogList = document.querySelector('.backlog-list'); // Container da lista

  // Configura botões de deletar nos itens existentes
  document.querySelectorAll('.backlog-card .btn-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (confirm('Remove item from backlog?')) {
        e.target.closest('.backlog-card').remove();
        updateBacklogCount();
      }
    });
  });

  // Usa o Modal Genérico para criar novo item
  setupModal((title) => {
    createBacklogItem(title, backlogList);
  });
}

function createBacklogItem(title, container) {
  const item = document.createElement('article');
  item.className = 'backlog-card bg-white';
  item.innerHTML = `
        <div class="card-left">
            <span class="material-symbols-outlined drag-handle">drag_indicator</span>
            <div class="card-content">
                <h4>${title}</h4>
                <p>New item added to backlog.</p>
            </div>
        </div>
        <div class="card-right">
            <span class="tag tag-design">General</span>
            <div class="meta-date">
                 <span class="material-symbols-outlined icon-sm">calendar_today</span>
                 <span>Today</span>
            </div>
            <div class="avatars"><div class="avatar-sm" style="background-color:#ccc"></div></div>
            <button class="btn-more">
                <span class="material-symbols-outlined">delete</span>
            </button>
        </div>
    `;

  // Adiciona evento de deletar no novo item
  item.querySelector('.btn-more').addEventListener('click', () => {
    if (confirm('Remove item from backlog?')) item.remove();
  });

  // Adiciona no topo da lista
  container.insertBefore(item, container.firstChild);
}

function updateBacklogCount() {
  // Se tiver um contador no header, atualizaria aqui
}

// =========================================================
// PÁGINA: REPORTS (Animações de Gráfico)
// =========================================================
function initReports() {
  console.log("Reports Loaded");

  // Animação das Barras Verticais
  const bars = document.querySelectorAll('.neo-chart-bars .bar');
  bars.forEach(bar => {
    // Salva a altura original que está no CSS style
    const targetHeight = bar.style.height;
    // Zera a altura
    bar.style.height = '0%';
    // Anima para a altura correta
    setTimeout(() => {
      bar.style.height = targetHeight;
    }, 300);
  });

  // Animação das Barras Horizontais
  const progressFills = document.querySelectorAll('.progress-fill');
  progressFills.forEach(fill => {
    const targetWidth = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.width = targetWidth;
    }, 300);
  });
}

// =========================================================
// UTILITÁRIO: CONFIGURAÇÃO DO MODAL (Genérico)
// =========================================================
function setupModal(onSubmitCallback) {
  const btnAdd = document.querySelector('.btn-primary'); // Botão "Add" da página
  const modal = document.getElementById('task-modal');
  const btnClose = document.getElementById('btn-close-modal');
  const form = document.getElementById('task-form');

  if (!btnAdd || !modal || !form) return;

  // Abrir
  btnAdd.addEventListener('click', () => {
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('active'), 10);
    form.querySelector('input').focus();
  });

  // Fechar
  const close = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 300);
  };
  if (btnClose) btnClose.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="text"]');
    const value = input.value.trim();
    if (value) {
      onSubmitCallback(value); // Chama a função específica da página (Kanban ou Backlog)
      input.value = '';
      close();
    }
  });
}