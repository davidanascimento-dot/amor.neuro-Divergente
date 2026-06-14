document.addEventListener('DOMContentLoaded', () => {
    
    const body = document.body;

    /* =========================================
       1. SIDEBAR RESPONSIVA
       ========================================= */
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    function isMobile() { return window.innerWidth <= 768; }

    function toggleSidebar() {
        if (!sidebar) return;
        if (isMobile()) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        } else {
            sidebar.classList.toggle('collapsed');
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    overlay.addEventListener('click', () => {
        if (isMobile() && sidebar && sidebar.classList.contains('active')) toggleSidebar();
    });

    window.addEventListener('resize', () => {
        if (!sidebar) return;
        if (!isMobile()) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            sidebar.classList.remove('collapsed');
        }
    });

    /* =========================================
       2. ACESSIBILIDADE - CORRIGIDA
       ========================================= */
    const btnAcessibilidade = document.getElementById('btnAcessibilidade');
    const menuAcessibilidade = document.getElementById('menuAcessibilidade');
    const closeAcessibilidade = document.getElementById('closeAcessibilidade');
    const accessBtns = document.querySelectorAll('.access-btn');

    if (btnAcessibilidade && menuAcessibilidade) {
        btnAcessibilidade.addEventListener('click', (e) => {
            e.stopPropagation();
            menuAcessibilidade.classList.toggle('active');
            btnAcessibilidade.setAttribute('aria-expanded', menuAcessibilidade.classList.contains('active'));
        });

        if (closeAcessibilidade) {
            closeAcessibilidade.addEventListener('click', () => {
                menuAcessibilidade.classList.remove('active');
                btnAcessibilidade.setAttribute('aria-expanded', 'false');
            });
        }

        document.addEventListener('click', (e) => {
            if (menuAcessibilidade && !menuAcessibilidade.contains(e.target) && e.target !== btnAcessibilidade && !btnAcessibilidade?.contains(e.target)) {
                menuAcessibilidade.classList.remove('active');
                btnAcessibilidade.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuAcessibilidade.classList.contains('active')) {
                menuAcessibilidade.classList.remove('active');
                btnAcessibilidade.setAttribute('aria-expanded', 'false');
                btnAcessibilidade.focus();
            }
        });
    }

    function getA11ySetting(key, defaultValue) { 
        const saved = localStorage.getItem(`a11y_${key}`);
        return saved !== null ? saved : defaultValue;
    }
    
    function setA11ySetting(key, value) { 
        localStorage.setItem(`a11y_${key}`, value); 
    }

    function applyAllA11ySettings() {
        body.classList.remove(
            'a11y-dark-mode','a11y-high-contrast','a11y-large-text','a11y-small-text',
            'a11y-spacing','a11y-highlight-links','a11y-saturation','a11y-grayscale','a11y-dyslexia'
        );
        
        if (getA11ySetting('darkMode','false') === 'true') body.classList.add('a11y-dark-mode');
        if (getA11ySetting('highContrast','false') === 'true') body.classList.add('a11y-high-contrast');
        if (getA11ySetting('textSize','normal') === 'large') body.classList.add('a11y-large-text');
        if (getA11ySetting('textSize','normal') === 'small') body.classList.add('a11y-small-text');
        if (getA11ySetting('spacing','false') === 'true') body.classList.add('a11y-spacing');
        if (getA11ySetting('highlightLinks','false') === 'true') body.classList.add('a11y-highlight-links');
        if (getA11ySetting('saturation','false') === 'true') body.classList.add('a11y-saturation');
        if (getA11ySetting('grayscale','false') === 'true') body.classList.add('a11y-grayscale');
        if (getA11ySetting('dyslexia','false') === 'true') body.classList.add('a11y-dyslexia');
    }

    function updateButtonStates() {
        accessBtns.forEach(btn => {
            const spanText = btn.querySelector('span')?.textContent.trim().toLowerCase() || '';
            btn.style.background = '';
            btn.style.border = '';
            btn.style.color = '';
            
            const icon = btn.querySelector('i');
            if (icon) icon.style.color = '#8b5cf6';
            
            let isActive = false;
            
            // Modo Escuro
            if (spanText.includes('modo escuro') && getA11ySetting('darkMode','false') === 'true') isActive = true;
            // Alto Contraste
            if (spanText.includes('alto contraste') && getA11ySetting('highContrast','false') === 'true') isActive = true;
            // Aumentar Texto
            if (spanText.includes('aumentar texto') && getA11ySetting('textSize','normal') === 'large') isActive = true;
            // Diminuir Texto
            if (spanText.includes('diminuir texto') && getA11ySetting('textSize','normal') === 'small') isActive = true;
            // Espaçamento
            if (spanText.includes('espaçamento') && getA11ySetting('spacing','false') === 'true') isActive = true;
            // Destacar Links
            if (spanText.includes('destacar links') && getA11ySetting('highlightLinks','false') === 'true') isActive = true;
            // Saturação
            if (spanText.includes('saturação') && getA11ySetting('saturation','false') === 'true') isActive = true;
            // Fonte Dislexia
            if (spanText.includes('fonte dislexia') && getA11ySetting('dyslexia','false') === 'true') isActive = true;
            // Reset
            if (spanText.includes('reset') && getA11ySetting('grayscale','false') === 'true') isActive = true;
            
            if (isActive) {
                btn.style.background = '#8b5cf6';
                btn.style.border = '2px solid #8b5cf6';
                btn.style.color = '#ffffff';
                if (icon) icon.style.color = '#ffffff';
            }
        });
    }

    function resetAllSettings() {
        localStorage.removeItem('a11y_darkMode');
        localStorage.removeItem('a11y_highContrast');
        localStorage.removeItem('a11y_textSize');
        localStorage.removeItem('a11y_spacing');
        localStorage.removeItem('a11y_highlightLinks');
        localStorage.removeItem('a11y_saturation');
        localStorage.removeItem('a11y_grayscale');
        localStorage.removeItem('a11y_dyslexia');
        
        body.classList.remove(
            'a11y-dark-mode','a11y-high-contrast','a11y-large-text','a11y-small-text',
            'a11y-spacing','a11y-highlight-links','a11y-saturation','a11y-grayscale','a11y-dyslexia'
        );
        
        accessBtns.forEach(btn => {
            btn.style.background = '';
            btn.style.border = '';
            btn.style.color = '';
            const icon = btn.querySelector('i');
            if (icon) icon.style.color = '#8b5cf6';
        });
        
        // Mostrar toast de confirmação
        showToastMessage('✅ Todas as configurações de acessibilidade foram resetadas!', 'success');
    }

    // Função para mostrar toast
    function showToastMessage(message, type = 'info') {
        const toast = document.getElementById('toastMsg');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `toast-msg-custom ${type}`;
        toast.style.opacity = '1';
        
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
    }

    accessBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const spanText = btn.querySelector('span')?.textContent.trim().toLowerCase() || '';
            
            // Reset
            if (spanText.includes('reset')) {
                resetAllSettings();
                return;
            }
            
            // Modo Escuro
            if (spanText.includes('modo escuro')) {
                const current = getA11ySetting('darkMode', 'false');
                setA11ySetting('darkMode', current === 'true' ? 'false' : 'true');
                showToastMessage(current === 'true' ? '🌙 Modo escuro desativado' : '🌙 Modo escuro ativado', 'info');
            }
            // Alto Contraste
            else if (spanText.includes('alto contraste')) {
                const current = getA11ySetting('highContrast', 'false');
                setA11ySetting('highContrast', current === 'true' ? 'false' : 'true');
                showToastMessage(current === 'true' ? '🎨 Alto contraste desativado' : '🎨 Alto contraste ativado', 'info');
            }
            // Aumentar Texto
            else if (spanText.includes('aumentar texto')) {
                const currentSize = getA11ySetting('textSize', 'normal');
                const newSize = currentSize === 'large' ? 'normal' : 'large';
                setA11ySetting('textSize', newSize);
                showToastMessage(newSize === 'large' ? '🔍 Texto aumentado' : '🔍 Texto normal', 'info');
            }
            // Diminuir Texto
            else if (spanText.includes('diminuir texto')) {
                const currentSize = getA11ySetting('textSize', 'normal');
                const newSize = currentSize === 'small' ? 'normal' : 'small';
                setA11ySetting('textSize', newSize);
                showToastMessage(newSize === 'small' ? '🔍 Texto diminuído' : '🔍 Texto normal', 'info');
            }
            // Espaçamento
            else if (spanText.includes('espaçamento')) {
                const current = getA11ySetting('spacing', 'false');
                setA11ySetting('spacing', current === 'true' ? 'false' : 'true');
                showToastMessage(current === 'true' ? '📏 Espaçamento normal' : '📏 Espaçamento aumentado', 'info');
            }
            // Destacar Links
            else if (spanText.includes('destacar links')) {
                const current = getA11ySetting('highlightLinks', 'false');
                setA11ySetting('highlightLinks', current === 'true' ? 'false' : 'true');
                showToastMessage(current === 'true' ? '🔗 Links sem destaque' : '🔗 Links destacados', 'info');
                // Aplicar destaque visual imediato
                if (current === 'false') {
                    const links = document.querySelectorAll('a');
                    links.forEach(link => {
                        link.style.outline = '2px solid #ff0';
                        link.style.backgroundColor = '#ff0';
                        link.style.color = '#000';
                    });
                } else {
                    const links = document.querySelectorAll('a');
                    links.forEach(link => {
                        link.style.outline = '';
                        link.style.backgroundColor = '';
                        link.style.color = '';
                    });
                }
            }
            // Saturação
            else if (spanText.includes('saturação')) {
                const current = getA11ySetting('saturation', 'false');
                setA11ySetting('saturation', current === 'true' ? 'false' : 'true');
                showToastMessage(current === 'true' ? '🎨 Saturação normal' : '🎨 Saturação ajustada', 'info');
            }
            // Fonte Dislexia
            else if (spanText.includes('fonte dislexia')) {
                const current = getA11ySetting('dyslexia', 'false');
                setA11ySetting('dyslexia', current === 'true' ? 'false' : 'true');
                showToastMessage(current === 'true' ? '🔤 Fonte padrão' : '🔤 Fonte para dislexia ativada', 'info');
            }
            
            applyAllA11ySettings();
            updateButtonStates();
        });
    });

    applyAllA11ySettings();
    updateButtonStates();

    // Função para aplicar destaque de links manualmente se já estiver ativo
    if (getA11ySetting('highlightLinks', 'false') === 'true') {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.style.outline = '2px solid #ff0';
            link.style.backgroundColor = '#ff0';
            link.style.color = '#000';
        });
    }

    /* =========================================
       3. FORMULÁRIO DE ATENDIMENTO
       ========================================= */
    const formCaso = document.getElementById('form-caso');
    const currentChars = document.getElementById('current-chars');
    const supportForm = document.getElementById('support-form');

    if (formCaso && currentChars) {
        formCaso.addEventListener('input', (e) => {
            const length = e.target.value.length;
            currentChars.textContent = length;
            currentChars.style.color = length >= 4000 ? '#fd3c4a' : '#91919f';
        });
    }

    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                nome: document.getElementById('form-nome')?.value || '',
                email: document.getElementById('form-email')?.value || '',
                telefone: document.getElementById('form-phone')?.value || 'Não informado',
                cidade: document.getElementById('form-cidade')?.value || 'Não informado',
                canalPreferido: document.getElementById('form-canal')?.value || '',
                departamento: document.getElementById('form-depto')?.value || '',
                assunto: document.getElementById('form-assunto')?.value || '',
                caso: formCaso?.value || ''
            };
            console.log('Solicitação de atendimento:', formData);
            alert('Atendimento aberto com sucesso! Um número de protocolo foi enviado para o seu e-mail.');
            supportForm.reset();
            if (currentChars) currentChars.textContent = 0;
        });
    }

    console.log('✅ Acessibilidade inicializada com sucesso!');
    console.log('   Modo Escuro, Alto Contraste, Aumentar/Diminuir Texto');
    console.log('   Espaçamento, Destacar Links, Saturação, Fonte Dislexia, Reset');
});