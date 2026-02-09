// js/app.js
import { Board } from './classes/Board.js';
// Se futuramente criar Backlog.js ou Reports.js, importe aqui.

document.addEventListener('DOMContentLoaded', () => {
  console.log('TaskFlow App Started [Modular]');

  // 1. Inicializa Componentes Globais (Sidebar, Modal, Logout)
  initGlobalUI();

  // 2. Roteamento Simples
  const pageId = document.body.id || ''; // Adicione ids no body se quiser controle estrito, ou verifique elementos

  // Lógica do Dashboard
  if (document.getElementById('board')) {
    const board = new Board();
    board.init();

    // Configura o Modal para usar a classe Board
    setupModal((title) => {
      board.addNewTask(title);
    });
  }
  // Lógica do Backlog
  else if (document.querySelector('.backlog-container')) {
    initBacklogLogic(); // Mantendo função local por enquanto ou criar classe Backlog
  }
  // Lógica do Reports
  else if (document.querySelector('.reports-container')) {
    initReportsLogic();
  }
});

// --- UI GLOBAIS ---

function initGlobalUI() {
  // Menu Mobile & Sidebar
  const btnMenuMobile = document.getElementById('btn-menu-mobile');
  const sidebar = document.querySelector('.sidebar');
  const btnCloseSidebar = document.querySelector('.btn-close-sidebar');

  if (btnMenuMobile && sidebar) {
    btnMenuMobile.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.add('active');
    });

    if (btnCloseSidebar) {
      btnCloseSidebar.addEventListener('click', () => sidebar.classList.remove('active'));
    }

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== btnMenuMobile) {
        sidebar.classList.remove('active');
      }
    });
  }

  // Logout
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm("Log out?")) window.location.href = 'login.html';
    });
  }
}

function setupModal(submitCallback) {
  const btnAdd = document.querySelector('.btn-primary'); // Botão genérico de adicionar
  const modal = document.getElementById('task-modal');
  const btnClose = document.getElementById('btn-close-modal');
  const form = document.getElementById('task-form');

  if (!btnAdd || !modal || !form) return;

  const open = () => {
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('active'), 10);
    const input = form.querySelector('input');
    if (input) input.focus();
  };

  const close = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 300);
  };

  btnAdd.addEventListener('click', open);
  if (btnClose) btnClose.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="text"]');
    const value = input.value.trim();
    if (value) {
      submitCallback(value);
      input.value = '';
      close();
    }
  });
}

// --- LÓGICA ESPECÍFICA (Backlog/Reports) ---
// Idealmente mover para classes/Backlog.js e classes/Reports.js

function initBacklogLogic() {
  console.log("Backlog Logic Loaded");

  // Configura o modal para adicionar ao backlog
  setupModal((title) => {
    const container = document.querySelector('.backlog-list');
    const itemHtml = `
            <article class="backlog-card bg-white">
                <div class="card-left">
                    <span class="material-symbols-outlined drag-handle">drag_indicator</span>
                    <div class="card-content"><h4>${title}</h4><p>New Item</p></div>
                </div>
                <div class="card-right">
                    <span class="tag tag-design">General</span>
                    <button class="btn-more" onclick="this.closest('article').remove()"><span class="material-symbols-outlined">delete</span></button>
                </div>
            </article>
        `;
    container.insertAdjacentHTML('afterbegin', itemHtml);
  });
}

function initReportsLogic() {
  console.log("Reports Logic Loaded");
  // Animação simples
  setTimeout(() => {
    document.querySelectorAll('.bar').forEach(b => {
      b.style.height = b.getAttribute('title').split(':')[1].trim().split(' ')[0] * 10 + '%'; // Exemplo simples
    });
    document.querySelectorAll('.progress-fill').forEach(f => {
      f.style.width = f.style.width; // Força repaint se animado via CSS transition
    });
  }, 100);
}