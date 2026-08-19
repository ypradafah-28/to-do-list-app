/* ============================================
   TO-DO LIST MODERN
   Logika Aplikasi (Clean Code)
   ============================================ */

'use strict';

/* ---------- Konstanta ---------- */
const STORAGE_KEY = 'todolist.tasks';

const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

/* ---------- Elemen DOM ---------- */
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const countEl = document.getElementById('todo-count');
const clearBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

/* ---------- State ---------- */
let tasks = loadTasks();
let currentFilter = FILTERS.ALL;

/* ---------- Penyimpanan (LocalStorage) ---------- */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* ---------- Operasi Tugas ---------- */
function addTask(text) {
  const task = {
    id: Date.now().toString(),
    text,
    completed: false,
  };
  tasks.push(task);
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
}

/* ---------- Filter ---------- */
function getVisibleTasks() {
  switch (currentFilter) {
    case FILTERS.ACTIVE:
      return tasks.filter((t) => !t.completed);
    case FILTERS.COMPLETED:
      return tasks.filter((t) => t.completed);
    default:
      return tasks;
  }
}

function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  render();
}

/* ---------- Render ---------- */
function render() {
  const visibleTasks = getVisibleTasks();

  list.innerHTML = '';

  if (visibleTasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-message';
    empty.textContent = getEmptyMessage();
    list.appendChild(empty);
  } else {
    visibleTasks.forEach((task) => list.appendChild(createTaskItem(task)));
  }

  updateCount();
}

function createTaskItem(task) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', 'Tandai selesai');
  checkbox.addEventListener('change', () => toggleTask(task.id));

  // Teks tugas
  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = task.text;

  // Tombol hapus
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-delete';
  deleteBtn.textContent = '×';
  deleteBtn.setAttribute('aria-label', 'Hapus tugas');
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  li.append(checkbox, span, deleteBtn);
  return li;
}

function getEmptyMessage() {
  if (tasks.length === 0) return 'Belum ada tugas. Tambahkan tugas baru!';
  if (currentFilter === FILTERS.ACTIVE) return 'Tidak ada tugas aktif.';
  if (currentFilter === FILTERS.COMPLETED) return 'Belum ada tugas selesai.';
  return 'Belum ada tugas.';
}

function updateCount() {
  const remaining = tasks.filter((t) => !t.completed).length;
  countEl.textContent = `${remaining} tugas tersisa`;
}

/* ---------- Event Handlers ---------- */
function handleSubmit(e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  input.value = '';
  input.focus();
}

/* ---------- Inisialisasi ---------- */
function init() {
  form.addEventListener('submit', handleSubmit);
  clearBtn.addEventListener('click', clearCompleted);

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  render();
}

init();
