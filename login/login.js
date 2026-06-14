// =========================================================================
// 🧠 AMOR NEURODIVERGENTE - LOGIN & CADASTRO
// =========================================================================

document.addEventListener("DOMContentLoaded", () => {

    // =========================================================================
    // ELEMENTOS DO DOM
    // =========================================================================
    const loginCard = document.getElementById('loginCard');
    const registerCard = document.getElementById('registerCard');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // =========================================================================
    // ALTERNAR ENTRE LOGIN E CADASTRO
    // =========================================================================
    const toggleLinks = document.querySelectorAll('.toggle-link');
    
    toggleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-show');
            
            // Esconde todos os cards
            document.querySelectorAll('.auth-card').forEach(card => {
                card.style.display = 'none';
            });
            
            // Mostra o card alvo
            const targetCard = document.getElementById(targetId);
            if (targetCard) {
                targetCard.style.display = 'block';
                targetCard.style.animation = 'none';
                targetCard.offsetHeight; // Trigger reflow
                targetCard.style.animation = 'fadeInUp 0.5s ease';
            }

            // Remove mensagens de feedback
            removeAllFeedback();
        });
    });

    // =========================================================================
    // MOSTRAR/OCULTAR SENHA
    // =========================================================================
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                
                // Alterna o ícone
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    });

    // =========================================================================
    // VALIDAÇÃO DE LOGIN
    // =========================================================================
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            // Validações
            if (!email) {
                showFeedback(loginForm, 'Por favor, insira seu e-mail.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFeedback(loginForm, 'Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            if (!password) {
                showFeedback(loginForm, 'Por favor, insira sua senha.', 'error');
                return;
            }
            
            if (password.length < 6) {
                showFeedback(loginForm, 'A senha deve ter pelo menos 6 caracteres.', 'error');
                return;
            }
            
            // Simula login bem-sucedido
            showFeedback(loginForm, '✅ Login realizado com sucesso! Redirecionando...', 'success');
            
            // Salva sessão
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            // Redireciona após 1.5 segundos
            setTimeout(() => {
                window.location.href = '/inicio.html';
            }, 1500);
        });
    }

    // =========================================================================
    // VALIDAÇÃO DE CADASTRO
    // =========================================================================
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('regFirstName').value.trim();
            const lastName = document.getElementById('regLastName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const confirmPassword = document.getElementById('regConfirmPassword').value.trim();
            const termsCheck = document.getElementById('termsCheck');
            
            // Validações
            if (!firstName) {
                showFeedback(registerForm, 'Por favor, insira seu nome.', 'error');
                return;
            }
            
            if (!lastName) {
                showFeedback(registerForm, 'Por favor, insira seu sobrenome.', 'error');
                return;
            }
            
            if (!email) {
                showFeedback(registerForm, 'Por favor, insira seu e-mail.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFeedback(registerForm, 'Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            if (!password) {
                showFeedback(registerForm, 'Por favor, crie uma senha.', 'error');
                return;
            }
            
            if (password.length < 6) {
                showFeedback(registerForm, 'A senha deve ter pelo menos 6 caracteres.', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showFeedback(registerForm, 'As senhas não coincidem.', 'error');
                return;
            }
            
            if (!termsCheck.checked) {
                showFeedback(registerForm, 'Você precisa aceitar os Termos de Uso.', 'error');
                return;
            }
            
            // Simula cadastro bem-sucedido
            showFeedback(registerForm, '🎉 Conta criada com sucesso! Redirecionando para o login...', 'success');
            
            // Salva dados
            const userData = {
                firstName,
                lastName,
                email,
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('registeredUser', JSON.stringify(userData));
            
            // Redireciona para o login após 2 segundos
            setTimeout(() => {
                // Alterna para o card de login
                loginCard.style.display = 'block';
                loginCard.style.animation = 'none';
                loginCard.offsetHeight;
                loginCard.style.animation = 'fadeInUp 0.5s ease';
                registerCard.style.display = 'none';
                
                // Preenche o e-mail
                document.getElementById('loginEmail').value = email;
                
                // Remove feedback
                removeAllFeedback();
            }, 2000);
        });
    }

    // =========================================================================
    // UTILITÁRIOS
    // =========================================================================
    
    // Valida formato de e-mail
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Mostra mensagem de feedback
    function showFeedback(form, message, type) {
        // Remove feedbacks anteriores
        const existingFeedback = form.querySelector('.feedback-message');
        if (existingFeedback) existingFeedback.remove();
        
        // Cria novo feedback
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type}`;
        feedback.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> ${message}`;
        
        // Insere antes do botão
        const submitBtn = form.querySelector('.btn-submit');
        form.insertBefore(feedback, submitBtn);
        
        // Auto-remove após 5 segundos (só erros)
        if (type === 'error') {
            setTimeout(() => {
                feedback.remove();
            }, 5000);
        }
    }

    // Remove todas as mensagens de feedback
    function removeAllFeedback() {
        document.querySelectorAll('.feedback-message').forEach(msg => msg.remove());
    }

    // =========================================================================
    // PREENCHIMENTO AUTOMÁTICO (se voltou do cadastro)
    // =========================================================================
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail && document.getElementById('loginEmail')) {
        document.getElementById('loginEmail').value = savedEmail;
    }

    console.log('🧠 Login & Cadastro inicializado!');
    console.log('   ✅ Alternância Login/Cadastro');
    console.log('   ✅ Validação de formulários');
    console.log('   ✅ Mostrar/ocultar senha');
    console.log('   ✅ Persistência no localStorage');
});