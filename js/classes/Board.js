// js/classes/Board.js
import { Column } from './Column.js';
import { Task } from './Task.js';

export class Board {
  constructor() {
    this.todoCol = new Column('todo-list');
    this.progressCol = new Column('inprogress-list');
    this.doneCol = new Column('done-list');

    // Escuta o evento global de atualização
    document.addEventListener('board:update', () => this.updateCounts());
  }

  init() {
    console.log("Board Initialized");
    // Adiciona eventos aos cards que já vieram no HTML estático (se houver)
    document.querySelectorAll('.task-card').forEach(card => {
      // Recria a lógica de eventos para cards estáticos
      const taskLogic = new Task();
      taskLogic.attachEvents(card);
    });

    this.updateCounts();
  }

  addNewTask(title) {
    const newTask = new Task(null, title, 'General');
    const todoList = document.getElementById('todo-list');
    if (todoList) {
      todoList.appendChild(newTask.element);
      this.updateCounts();
    }
  }

  updateCounts() {
    const counts = {
      todo: document.getElementById('todo-list')?.children.length || 0,
      progress: document.getElementById('inprogress-list')?.children.length || 0,
      done: document.getElementById('done-list')?.children.length || 0
    };

    if (document.getElementById('count-todo'))
      document.getElementById('count-todo').innerText = counts.todo;

    if (document.getElementById('count-progress'))
      document.getElementById('count-progress').innerText = counts.progress;

    if (document.getElementById('count-done'))
      document.getElementById('count-done').innerText = counts.done;
  }
}