const backdrop = document.getElementById('modalBackdrop');
const openBtns = [document.getElementById('openGenerateBtn'), document.getElementById('openGenerateBtn2')];
const generateBtn = document.getElementById('generateBtn');

openBtns.forEach(b => b && b.addEventListener('click', openModal));
generateBtn.addEventListener('click', simulateGenerate);

function openModal(){
  backdrop.style.display = 'flex';
  backdrop.setAttribute('aria-hidden','false');
}

function closeModal(){
  backdrop.style.display = 'none';
  backdrop.setAttribute('aria-hidden','true');
  document.getElementById('recipeResult').style.display = 'none';
}

backdrop.addEventListener('click', (e) => {
  if (e.target === backdrop) closeModal();
});

// Simulação da IA
function simulateGenerate(){
  const ing = document.getElementById('ingredients').value.trim();
  if(!ing){
    alert('Informe pelo menos um ingrediente.');
    return;
  }

  const result = document.getElementById('recipeResult');
  result.innerHTML = `
    <h4>Receita sugerida</h4>
    <p><strong>Título:</strong> ${ing.split(',')[0]} Fit</p>
    <p><strong>Ingredientes:</strong> ${ing}</p>
    <p><strong>Modo de preparo:</strong> Misture os ingredientes e cozinhe até ficar pronto.</p>
    <button class="btn btn-ghost" onclick="closeModal()">Fechar</button>
  `;
  result.style.display = 'block';
}

function toggleLike(el){
  const span = el.querySelector('.like-count');
  let count = parseInt(span.textContent.trim()) || 0;
  const liked = el.getAttribute('data-liked') === 'true';

  if(liked){
    count--;
    el.setAttribute('data-liked','false');
  } else {
    count++;
    el.setAttribute('data-liked','true');
  }
  span.textContent = ' ' + count;
}

// Login básico (simulação)
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if(form){
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        window.location.href = "index1.html"; // Redireciona para o feed
      });
    }
  });
  

  //script login

  
// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
  // Elementos do formulário
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const loginBtn = document.querySelector('.login-btn');
  const rememberMeCheckbox = document.getElementById('rememberMe');
  
  // Funcionalidade de mostrar/ocultar senha
  togglePasswordBtn.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      const icon = this.querySelector('i');
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
  });
  
  // Validação em tempo real dos campos
  function validateField(input) {
      const value = input.value.trim();
      const inputWrapper = input.closest('.input-wrapper');
      
      if (value === '') {
          inputWrapper.classList.add('error');
          return false;
      } else {
          inputWrapper.classList.remove('error');
          return true;
      }
  }
  
  // Adiciona validação aos campos
  usernameInput.addEventListener('blur', function() {
      validateField(this);
  });
  
  passwordInput.addEventListener('blur', function() {
      validateField(this);
  });
  
  // Funcionalidade de login
  loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      
      // Validação básica
      if (!username || !password) {
          showNotification('Por favor, preencha todos os campos.', 'error');
          return;
      }
      
      // Simula processo de login
      performLogin(username, password);
  });
  
  // Função para realizar o login
  function performLogin(username, password) {
      // Adiciona estado de loading ao botão
      loginBtn.classList.add('loading');
      loginBtn.disabled = true;
      
      // Simula chamada à API (2 segundos)
      setTimeout(() => {
          // Credenciais de demonstração
          const validCredentials = [
              { username: 'admin', password: '123456' },
              { username: 'usuario', password: 'senha123' },
              { username: 'demo', password: 'demo' },
              { username: 'saborize', password: 'saudavel' }
          ];
          
          const isValidLogin = validCredentials.some(cred => 
              cred.username.toLowerCase() === username.toLowerCase() && 
              cred.password === password
          );
          
          if (isValidLogin) {
              // Login bem-sucedido
              showNotification('Login realizado com sucesso!', 'success');
              
              // Salva dados se "Lembrar-me" estiver marcado
              if (rememberMeCheckbox.checked) {
                  localStorage.setItem('saborize_remember_user', username);
              } else {
                  localStorage.removeItem('saborize_remember_user');
              }
              
              // Salva dados da sessão
              sessionStorage.setItem('saborize_user', JSON.stringify({
                  username: username,
                  loginTime: new Date().toISOString()
              }));
              
              // Redireciona após 1.5 segundos
              setTimeout(() => {
                  window.location.href = 'index1.html';
              }, 1500);
              
          } else {
              // Login falhou
              showNotification('Usuário ou senha incorretos.', 'error');
              loginBtn.classList.remove('loading');
              loginBtn.disabled = false;
              
              // Adiciona efeito de shake no formulário
              loginForm.classList.add('shake');
              setTimeout(() => {
                  loginForm.classList.remove('shake');
              }, 500);
          }
      }, 2000);
  }
  
  // Função para mostrar notificações
  function showNotification(message, type = 'info') {
      // Remove notificação existente
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
          existingNotification.remove();
      }
      
      // Cria nova notificação
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `
          <div class="notification-content">
              <i class="fas ${getNotificationIcon(type)}"></i>
              <span>${message}</span>
              <button class="notification-close">
                  <i class="fas fa-times"></i>
              </button>
          </div>
      `;
      
      // Adiciona ao body
      document.body.appendChild(notification);
      
      // Animação de entrada
      setTimeout(() => {
          notification.classList.add('show');
      }, 100);
      
      // Remove automaticamente após 5 segundos
      setTimeout(() => {
          removeNotification(notification);
      }, 5000);
      
      // Adiciona evento de fechar
      const closeBtn = notification.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => {
          removeNotification(notification);
      });
  }
  
  // Função para obter ícone da notificação
  function getNotificationIcon(type) {
      switch (type) {
          case 'success': return 'fa-check-circle';
          case 'error': return 'fa-exclamation-circle';
          case 'warning': return 'fa-exclamation-triangle';
          default: return 'fa-info-circle';
      }
  }
  
  // Função para remover notificação
  function removeNotification(notification) {
      notification.classList.add('hide');
      setTimeout(() => {
          if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
          }
      }, 300);
  }
  
  // Carrega usuário salvo se existir
  const rememberedUser = localStorage.getItem('saborize_remember_user');
  if (rememberedUser) {
      usernameInput.value = rememberedUser;
      rememberMeCheckbox.checked = true;
  }
  
  // Funcionalidade dos botões sociais
  const socialButtons = document.querySelectorAll('.social-btn');
  socialButtons.forEach(btn => {
      btn.addEventListener('click', function() {
          const provider = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
          showNotification(`Redirecionando para login com ${provider}...`, 'info');
          
          // Simula redirecionamento (em uma aplicação real, seria para a URL do OAuth)
          setTimeout(() => {
              showNotification(`Login com ${provider} não implementado nesta demonstração.`, 'warning');
          }, 2000);
      });
  });
  
  // Funcionalidade do link "Esqueceu a senha?"
  const forgotPasswordLink = document.querySelector('.forgot-password');
  forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      showNotification('Funcionalidade de recuperação de senha será implementada em breve.', 'info');
  });
  
  // Funcionalidade do link "Cadastre-se"
  const signupLink = document.querySelector('.signup-btn');
  signupLink.addEventListener('click', function(e) {
      e.preventDefault();
      showNotification('Página de cadastro será implementada em breve.', 'info');
  });
  
  // Adiciona efeitos de foco nos inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
      input.addEventListener('focus', function() {
          this.closest('.input-wrapper').classList.add('focused');
      });
      
      input.addEventListener('blur', function() {
          this.closest('.input-wrapper').classList.remove('focused');
      });
  });
  
  // Adiciona animação de digitação
  inputs.forEach(input => {
      input.addEventListener('input', function() {
          const wrapper = this.closest('.input-wrapper');
          if (this.value.length > 0) {
              wrapper.classList.add('has-content');
          } else {
              wrapper.classList.remove('has-content');
          }
      });
  });
  
  // Efeito de partículas no fundo (opcional)
  function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
          if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
          }
      }, 5000);
  }
  
  // Cria partículas periodicamente
  setInterval(createParticle, 2000);
  
  // Adiciona suporte a teclas de atalho
  document.addEventListener('keydown', function(e) {
      // Enter para submeter o formulário
      if (e.key === 'Enter' && (usernameInput === document.activeElement || passwordInput === document.activeElement)) {
          loginForm.dispatchEvent(new Event('submit'));
      }
      
      // Escape para limpar campos
      if (e.key === 'Escape') {
          usernameInput.value = '';
          passwordInput.value = '';
          usernameInput.focus();
      }
  });
  
  // Adiciona animação de entrada aos elementos
  const animatedElements = document.querySelectorAll('.login-card > *, .feature-card');
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
          }
      });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(el => {
      observer.observe(el);
  });
});

// Estilos CSS adicionais para JavaScript
const additionalStyles = `
  .input-wrapper.error input {
      border-color: #f44336 !important;
      box-shadow: 0 0 0 4px rgba(244, 67, 54, 0.1) !important;
  }
  
  .input-wrapper.focused input {
      transform: translateY(-2px);
  }
  
  .input-wrapper.has-content .input-icon {
      color: #4CAF50;
  }
  
  .shake {
      animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
  }
  
  .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      transform: translateX(400px);
      transition: all 0.3s ease;
      max-width: 400px;
      border-left: 4px solid #4CAF50;
  }
  
  .notification.show {
      transform: translateX(0);
  }
  
  .notification.hide {
      transform: translateX(400px);
      opacity: 0;
  }
  
  .notification.error {
      border-left-color: #f44336;
  }
  
  .notification.warning {
      border-left-color: #ff9800;
  }
  
  .notification.info {
      border-left-color: #2196f3;
  }
  
  .notification-content {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      gap: 12px;
  }
  
  .notification-content i:first-child {
      font-size: 18px;
      color: #4CAF50;
  }
  
  .notification.error .notification-content i:first-child {
      color: #f44336;
  }
  
  .notification.warning .notification-content i:first-child {
      color: #ff9800;
  }
  
  .notification.info .notification-content i:first-child {
      color: #2196f3;
  }
  
  .notification-content span {
      flex: 1;
      font-size: 14px;
      color: #333;
  }
  
  .notification-close {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
  }
  
  .notification-close:hover {
      background: #f5f5f5;
      color: #666;
  }
  
  .particle {
      position: fixed;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      pointer-events: none;
      animation: particleFloat linear infinite;
      z-index: 1;
  }
  
  @keyframes particleFloat {
      0% {
          transform: translateY(100vh) rotate(0deg);
      }
      100% {
          transform: translateY(-10px) rotate(360deg);
      }
  }
  
  .animate-in {
      animation: fadeInUp 0.6s ease-out both;
  }
  
  @media (max-width: 768px) {
      .notification {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
          transform: translateY(-100px);
      }
      
      .notification.show {
          transform: translateY(0);
      }
      
      .notification.hide {
          transform: translateY(-100px);
      }
  }
`;

// Adiciona os estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);


