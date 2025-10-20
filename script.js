// ===============================
// SABORIZE 🌿 - SCRIPT PRINCIPAL
// ===============================

// ---- LOGIN NORMAL ----
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const rememberMeCheckbox = document.getElementById('rememberMe');
  const loginBtn = document.querySelector('.login-btn');

  // Mostrar/Ocultar senha
  togglePasswordBtn?.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordBtn.querySelector('i').classList.toggle('fa-eye');
    togglePasswordBtn.querySelector('i').classList.toggle('fa-eye-slash');
  });

  // Submeter formulário de login
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showToast('Preencha todos os campos!', 'error');
      return;
    }

    performLogin(username, password);
  });

  // Função de login normal
  function performLogin(username, password) {
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('saborize_registered_users')) || [];
      const validUsers = [
        { username: 'admin', password: '123456' },
        { username: 'usuario', password: 'senha123' },
        { username: 'saborize', password: 'saudavel' },
        ...users // inclui os cadastrados manualmente
      ];

      const isValid = validUsers.some(
        u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (isValid) {
        showToast('Login realizado com sucesso! 🌿', 'success');

        // Salvar dados da sessão
        sessionStorage.setItem('saborize_user', JSON.stringify({
          username,
          loginType: 'normal',
          loginTime: new Date().toISOString()
        }));

        if (rememberMeCheckbox.checked) {
          localStorage.setItem('saborize_user', username);
        } else {
          localStorage.removeItem('saborize_user');
        }

        // Redirecionar para index1.html
        setTimeout(() => {
          window.location.href = 'index1.html';
        }, 1500);

      } else {
        showToast('Usuário ou senha incorretos.', 'error');
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
      }
    }, 1200);
  }

  // Recuperar usuário salvo
  const savedUser = localStorage.getItem('saborize_user');
  if (savedUser) {
    usernameInput.value = savedUser;
    rememberMeCheckbox.checked = true;
  }
});

// ---- CADASTRO / LOGIN SOCIAL ----
document.addEventListener('DOMContentLoaded', () => {
  const googleBtn = document.querySelector('.google-btn');
  const facebookBtn = document.querySelector('.facebook-btn');
  const signupBtn = document.querySelector('.signup-btn');

  // Simulação de cadastro/login via rede social
  function simulateSocialLogin(provider) {
    showToast(`Conectando-se ao ${provider}...`, 'info');

    setTimeout(() => {
      showToast(`${provider} conectado com sucesso! 🌿`, 'success');

      // Armazena o usuário na sessão
      sessionStorage.setItem('saborize_user', JSON.stringify({
        username: `${provider.toLowerCase()}_user`,
        loginType: provider,
        registered: true,
        loginTime: new Date().toISOString()
      }));

      // Redireciona para index1.html
      setTimeout(() => {
        window.location.href = 'index1.html';
      }, 1500);
    }, 2000);
  }

  // Eventos dos botões
  if (googleBtn) googleBtn.addEventListener('click', () => simulateSocialLogin('Google'));
  if (facebookBtn) facebookBtn.addEventListener('click', () => simulateSocialLogin('Facebook'));

  // ---- CADASTRO MANUAL FUNCIONAL ----
  if (signupBtn) {
    signupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openRegisterModal();
    });
  }
});

// ---- MODAL DE CADASTRO ----
function openRegisterModal() {
  if (document.getElementById('registerModal')) return;

  const modal = document.createElement('div');
  modal.id = 'registerModal';
  modal.className = 'register-modal';
  modal.innerHTML = `
    <div class="register-content">
      <h2>Crie sua conta 🌱</h2>
      <input type="text" id="newUsername" placeholder="Usuário" required>
      <input type="password" id="newPassword" placeholder="Senha" required>
      <input type="password" id="confirmPassword" placeholder="Confirmar senha" required>
      <button id="registerBtn" class="btn-primary">Cadastrar</button>
      <button id="closeRegister" class="btn-ghost">Cancelar</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Ações
  document.getElementById('registerBtn').addEventListener('click', registerUser);
  document.getElementById('closeRegister').addEventListener('click', () => modal.remove());
}

function registerUser() {
  const username = document.getElementById('newUsername').value.trim();
  const password = document.getElementById('newPassword').value.trim();
  const confirm = document.getElementById('confirmPassword').value.trim();

  if (!username || !password || !confirm) {
    showToast('Preencha todos os campos!', 'error');
    return;
  }

  if (password !== confirm) {
    showToast('As senhas não coincidem!', 'error');
    return;
  }

  let users = JSON.parse(localStorage.getItem('saborize_registered_users')) || [];

  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    showToast('Usuário já cadastrado!', 'warning');
    return;
  }

  users.push({ username, password });
  localStorage.setItem('saborize_registered_users', JSON.stringify(users));

  showToast('Cadastro realizado com sucesso! 🌿', 'success');

  // Salva sessão e redireciona
  sessionStorage.setItem('saborize_user', JSON.stringify({
    username,
    loginType: 'manual',
    registered: true,
    loginTime: new Date().toISOString()
  }));

  setTimeout(() => {
    document.getElementById('registerModal')?.remove();
    window.location.href = 'index1.html';
  }, 1500);
}

// ---- TOAST ----
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${getIcon(type)}"></i> ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

function getIcon(type) {
  switch (type) {
    case 'success': return 'fa-check-circle';
    case 'error': return 'fa-exclamation-circle';
    case 'warning': return 'fa-exclamation-triangle';
    default: return 'fa-info-circle';
  }
}

// ---- HISTÓRICO DE PESQUISA ----
function saveSearchHistory(term) {
  let history = JSON.parse(localStorage.getItem('saborize_history')) || [];
  const timestamp = new Date().toLocaleString('pt-BR');
  history.unshift({ term, timestamp });
  if (history.length > 10) history = history.slice(0, 10);
  localStorage.setItem('saborize_history', JSON.stringify(history));
}

function getSearchHistory() {
  return JSON.parse(localStorage.getItem('saborize_history')) || [];
}
