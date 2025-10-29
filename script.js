// ===============================
// SABORIZE 🌿 - SCRIPT PRINCIPAL
// ===============================

// Função para exibir o Toast (completa e funcional)
function showToast(message, type = 'info') {
  // Remove toasts existentes
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${getIcon(type)}"></i> ${message}`;
  document.body.appendChild(toast);

  // Adiciona a classe 'show' após um pequeno delay para a transição
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove o toast após 4 segundos
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

// ---- CADASTRO MANUAL FUNCIONAL (cadastro.html) ----
function setupCadastroForm() {
    const formCadastro = document.getElementById('formCadastro');
    if (!formCadastro) return;

    formCadastro.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

        if (!nome || !email || !senha || !confirmarSenha) {
            showToast('Preencha todos os campos!', 'error');
            return;
        }

        if (senha.length < 6) {
            showToast('A senha deve ter pelo menos 6 caracteres!', 'warning');
            return;
        }

        if (senha !== confirmarSenha) {
            showToast('As senhas não coincidem!', 'error');
            return;
        }
        
        const username = email;
        let users = JSON.parse(localStorage.getItem('saborize_registered_users')) || [];

        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            showToast('E-mail já cadastrado!', 'warning');
            return;
        }

        users.push({ nome, username, password: senha });
        localStorage.setItem('saborize_registered_users', JSON.stringify(users));

        showToast('Cadastro realizado com sucesso! 🌿', 'success');

        sessionStorage.setItem('saborize_user', JSON.stringify({
            username,
            nome,
            loginType: 'manual',
            registered: true,
            loginTime: new Date().toISOString()
        }));

        setTimeout(() => {
            window.location.href = 'login.html'; 
        }, 1500);
    });
}

// ---- LOGIN NORMAL (login.html) ----
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginBtn = document.querySelector('.login-btn');

    // Mostrar/Ocultar senha
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePasswordBtn.querySelector('i').classList.toggle('fa-eye');
            togglePasswordBtn.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Submeter formulário de login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showToast('Preencha todos os campos!', 'error');
            return;
        }

        performLogin(username, password, loginBtn, rememberMeCheckbox);
    });

    // Recuperar usuário salvo (lembrar-me)
    const savedUser = localStorage.getItem('saborize_user_remember');
    if (savedUser) {
        usernameInput.value = savedUser;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }
    
    // Redirecionamento para cadastro
    const signupBtn = document.querySelector('.signup-btn');
    if (signupBtn) {
        signupBtn.href = 'cadastro.html';
    }
}

// Função de login normal
function performLogin(username, password, loginBtn, rememberMeCheckbox) {
    if (loginBtn) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
    }

    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('saborize_registered_users')) || [];

        const matchedUser = users.find(
            u => u.username.toLowerCase() === username.toLowerCase() 
        );

        if (!matchedUser) {
            showToast('Usuário não cadastrado! Faça seu cadastro primeiro.', 'warning');
            if (loginBtn) {
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
            }
            return;
        }

        const isValid = matchedUser.password === password;

        if (isValid) {
            showToast('Login realizado com sucesso! 🌿', 'success');

            sessionStorage.setItem('saborize_user', JSON.stringify({
                username: matchedUser.username,
                nome: matchedUser.nome,
                loginType: 'manual',
                loginTime: new Date().toISOString()
            }));

            if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                localStorage.setItem('saborize_user_remember', matchedUser.username);
            } else {
                localStorage.removeItem('saborize_user_remember');
            }

            setTimeout(() => {
                window.location.href = 'index1.html';
            }, 1500);

        } else {
            showToast('Senha incorreta.', 'error');
            if (loginBtn) {
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
            }
        }
    }, 1200);
}

// ---- BLOQUEIO DE ACESSO (index1.html) ----
function checkAccessBlock() {
    if (window.location.pathname.includes('index1.html')) {
        const user = sessionStorage.getItem('saborize_user');
        if (!user) {
            showToast('Acesso negado! Faça login para continuar.', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            const userData = JSON.parse(user);
            showToast(`Bem-vindo, ${userData.nome || userData.username}!`, 'info');
        }
    }
}

// ---- LOGIN SOCIAL ----
function setupSocialLogin() {
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');

    function simulateSocialLogin(provider) {
        showToast(`Conectando-se ao ${provider}...`, 'info');

        setTimeout(() => {
            const username = `${provider.toLowerCase()}_user@saborize.com`;
            const nome = `${provider} User`;

            let users = JSON.parse(localStorage.getItem('saborize_registered_users')) || [];
            if (!users.some(u => u.username === username)) {
                users.push({ nome, username, password: 'social_password' });
                localStorage.setItem('saborize_registered_users', JSON.stringify(users));
            }

            showToast(`${provider} conectado com sucesso! 🌿`, 'success');

            sessionStorage.setItem('saborize_user', JSON.stringify({
                username,
                nome,
                loginType: provider,
                registered: true,
                loginTime: new Date().toISOString()
            }));

            setTimeout(() => {
                window.location.href = 'index1.html';
            }, 1500);
        }, 2000);
    }

    if (googleBtn) googleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        simulateSocialLogin('Google');
    });
    if (facebookBtn) facebookBtn.addEventListener('click', (e) => {
        e.preventDefault();
        simulateSocialLogin('Facebook');
    });
}

// ---- INICIALIZAÇÃO ----
document.addEventListener('DOMContentLoaded', () => {
    checkAccessBlock();
    setupCadastroForm();
    setupLoginForm();
    setupSocialLogin();
});

// ---- FUNÇÕES DE HISTÓRICO ----
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
