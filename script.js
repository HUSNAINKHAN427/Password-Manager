    const form = document.getElementById('password-form');
    const passwordList = document.getElementById('password-list');
    const toggleDark = document.getElementById('toggle-dark');
    const searchInput = document.getElementById('search');

    let passwords = JSON.parse(localStorage.getItem('passwords')) || [];

    function savePasswords() {
      localStorage.setItem('passwords', JSON.stringify(passwords));
    }

    function checkPasswordStrength(password) {
      if (password.length < 6) {
        return 'Weak';
      } else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) {
        return 'Strong';
      } else {
        return 'Medium';
      }
    }

    function renderPasswords(filter = '') {
      passwordList.innerHTML = '';
      passwords
        .filter(entry =>
          entry.website.toLowerCase().includes(filter) ||
          entry.username.toLowerCase().includes(filter)
        )
        .forEach((entry, index) => {
          const card = document.createElement('div');
          card.className = 'card';

          const content = document.createElement('div');
          content.innerHTML = `
            <strong>Website:</strong> ${entry.website}<br>
            <strong>Username:</strong> ${entry.username}<br>
            <strong>Password:</strong> <span id="pass-${index}">•••••••</span>
          `;

          const viewBtn = document.createElement('button');
          viewBtn.textContent = '👁️ Show/Hide';
          viewBtn.addEventListener('click', () => togglePassword(index, entry.password));

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = '🗑️ Delete';
          deleteBtn.className = 'btn-delete';
          deleteBtn.addEventListener('click', () => deletePassword(index));

          const editBtn = document.createElement('button');
          editBtn.textContent = '✏️ Edit';
          editBtn.style.background = '#ffc107';
          editBtn.addEventListener('click', () => editPassword(index));

          card.appendChild(content);
          card.appendChild(viewBtn);
          card.appendChild(deleteBtn);
          card.appendChild(editBtn);

          passwordList.appendChild(card);
        });
    }

    function togglePassword(index, realPassword) {
      const span = document.getElementById(`pass-${index}`);
      span.innerText = span.innerText === '•••••••' ? realPassword : '•••••••';
    }

    function deletePassword(index) {
      if (confirm('Are you sure you want to delete this password?')) {
        passwords.splice(index, 1);
        savePasswords();
        renderPasswords(searchInput.value.toLowerCase());
      }
    }

    function editPassword(index) {
      const entry = passwords[index];
      const newWebsite = prompt('Edit Website:', entry.website);
      const newUsername = prompt('Edit Username:', entry.username);
      const newPassword = prompt('Edit Password:', entry.password);

      if (newWebsite && newUsername && newPassword) {
        passwords[index] = { website: newWebsite, username: newUsername, password: newPassword };
        savePasswords();
        renderPasswords(searchInput.value.toLowerCase());
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const website = document.getElementById('website').value;
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const strength = checkPasswordStrength(password);
      alert(`Password Strength: ${strength}`);
      passwords.push({ website, username, password });
      savePasswords();
      renderPasswords(searchInput.value.toLowerCase());
      form.reset();
    });

    searchInput.addEventListener('input', function () {
      renderPasswords(this.value.toLowerCase());
    });

    toggleDark.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        toggleDark.innerHTML = '☀️ Light Mode';
        toggleDark.style.background = '#333';
        toggleDark.style.color = '#fff';
      } else {
        toggleDark.innerHTML = '🌙 Dark Mode';
        toggleDark.style.background = '#fff';
        toggleDark.style.color = '#333';
      }
    });

    setTimeout(() => {
      renderPasswords();
    }, 1000);