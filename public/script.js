const API = '/users';

async function loadUsers() {
  const res = await fetch(API);
  const users = await res.json();

  const tbody = document.getElementById('users-table');
  tbody.innerHTML = '';
  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button onclick="editUser('${user.userId}', '${user.name}', '${user.email}')">Edit</button>
        <button onclick="deleteUser('${user.userId}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function createUser() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });

  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  loadUsers();
}

function editUser(id, oldName, oldEmail) {
  const name = prompt('New name:', oldName);
  const email = prompt('New email:', oldEmail);
  if (!name || !email) return;

  fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  }).then(() => loadUsers());
}

function deleteUser(id) {
  if (!confirm('Are you sure?')) return;
  fetch(`${API}/${id}`, { method: 'DELETE' }).then(() => loadUsers());
}

// Load users on page load
loadUsers();
