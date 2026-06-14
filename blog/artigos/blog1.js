document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. SIDEBAR RESPONSIVA
       ========================================= */
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const body = document.body;
    
    // Criar overlay se não existir
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function toggleSidebar() {
        if (isMobile()) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        } else {
            sidebar.classList.toggle('collapsed');
        }
    }

    // Evento para abrir/fechar no clique do botão hambúrguer
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Fechar ao clicar no overlay
    overlay.addEventListener('click', () => {
        if (isMobile() && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    // Ajusta classes no redimensionamento
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            sidebar.classList.remove('collapsed');
        }
    });

    /* =========================================
       2. MENU DE ACESSIBILIDADE (ABRIR/FECHAR)
       ========================================= */
    const btnAcessibilidade = document.getElementById('btnAcessibilidade');
    const menuAcessibilidade = document.getElementById('menuAcessibilidade');
    const closeAcessibilidade = document.getElementById('closeAcessibilidade');

    if (btnAcessibilidade && menuAcessibilidade) {
        btnAcessibilidade.addEventListener('click', (e) => {
            e.stopPropagation();
            menuAcessibilidade.classList.toggle('active');
            
            // Atualiza aria-expanded
            const isOpen = menuAcessibilidade.classList.contains('active');
            btnAcessibilidade.setAttribute('aria-expanded', isOpen);
        });

        if (closeAcessibilidade) {
            closeAcessibilidade.addEventListener('click', () => {
                menuAcessibilidade.classList.remove('active');
                btnAcessibilidade.setAttribute('aria-expanded', 'false');
            });
        }

        // Fechar menu de acessibilidade ao clicar fora
        document.addEventListener('click', (e) => {
            if (!menuAcessibilidade.contains(e.target) && e.target !== btnAcessibilidade) {
                menuAcessibilidade.classList.remove('active');
                btnAcessibilidade.setAttribute('aria-expanded', 'false');
            }
        });

        // Fechar com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuAcessibilidade.classList.contains('active')) {
                menuAcessibilidade.classList.remove('active');
                btnAcessibilidade.setAttribute('aria-expanded', 'false');
                btnAcessibilidade.focus();
            }
        });
    }

    /* =========================================
       3. LÓGICA DOS BOTÕES DE ACESSIBILIDADE
       ========================================= */
    const accessBtns = document.querySelectorAll('.access-btn');

    // Função para pegar configuração salva
    function getA11ySetting(key, defaultValue) {
        return localStorage.getItem(`a11y_${key}`) || defaultValue;
    }

    // Função para salvar configuração
    function setA11ySetting(key, value) {
        localStorage.setItem(`a11y_${key}`, value);
    }

    // Função que APLICA todas as classes no body
    function applyAllA11ySettings() {
        // Remove TODAS as classes de acessibilidade primeiro
        body.classList.remove(
            'a11y-dark-mode',
            'a11y-high-contrast',
            'a11y-large-text',
            'a11y-small-text',
            'a11y-spacing',
            'a11y-highlight-links',
            'a11y-saturation',
            'a11y-grayscale',
            'a11y-dyslexia'
        );

        // Pega os valores salvos
        const darkMode = getA11ySetting('darkMode', 'false');
        const highContrast = getA11ySetting('highContrast', 'false');
        const textSize = getA11ySetting('textSize', 'normal');
        const spacing = getA11ySetting('spacing', 'false');
        const highlightLinks = getA11ySetting('highlightLinks', 'false');
        const saturation = getA11ySetting('saturation', 'false');
        const grayscale = getA11ySetting('grayscale', 'false');
        const dyslexia = getA11ySetting('dyslexia', 'false');

        // Aplica conforme salvo
        if (darkMode === 'true') body.classList.add('a11y-dark-mode');
        if (highContrast === 'true') body.classList.add('a11y-high-contrast');
        if (textSize === 'large') body.classList.add('a11y-large-text');
        if (textSize === 'small') body.classList.add('a11y-small-text');
        if (spacing === 'true') body.classList.add('a11y-spacing');
        if (highlightLinks === 'true') body.classList.add('a11y-highlight-links');
        if (saturation === 'true') body.classList.add('a11y-saturation');
        if (grayscale === 'true') body.classList.add('a11y-grayscale');
        if (dyslexia === 'true') body.classList.add('a11y-dyslexia');
    }

    // Função para atualizar estado visual dos botões
    function updateButtonStates() {
        accessBtns.forEach(btn => {
            const spanText = btn.querySelector('span').textContent.trim().toLowerCase();
            
            // Reseta o estilo
            btn.style.background = '';
            btn.style.border = '';
            btn.style.color = '';
            
            // Restaura cor original do ícone
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.color = '#8b5cf6';
            }
            
            // Verifica se o botão está ativo
            const isActive = checkIfActive(spanText);
            
            if (isActive) {
                btn.style.background = '#8b5cf6';
                btn.style.border = '2px solid #8b5cf6';
                btn.style.color = '#ffffff';
                
                if (icon) {
                    icon.style.color = '#ffffff';
                }
            }
        });
    }

    // Função auxiliar para verificar se botão está ativo
    function checkIfActive(spanText) {
        if (spanText.includes('escurecer') && getA11ySetting('darkMode', 'false') === 'true') return true;
        if (spanText.includes('alto') && getA11ySetting('highContrast', 'false') === 'true') return true;
        if (spanText.includes('maior') && getA11ySetting('textSize', 'normal') === 'large') return true;
        if (spanText.includes('menor') && getA11ySetting('textSize', 'normal') === 'small') return true;
        if (spanText.includes('espaçamento') && getA11ySetting('spacing', 'false') === 'true') return true;
        if (spanText.includes('links') && getA11ySetting('highlightLinks', 'false') === 'true') return true;
        if (spanText.includes('saturação') && getA11ySetting('saturation', 'false') === 'true') return true;
        if (spanText.includes('dislexia') && getA11ySetting('dyslexia', 'false') === 'true') return true;
        if ((spanText.includes('reset') || spanText.includes('cores')) && getA11ySetting('grayscale', 'false') === 'true') return true;
        return false;
    }

    // FUNÇÃO DE RESET - Remove todas as configurações
    function resetAllSettings() {
        localStorage.removeItem('a11y_darkMode');
        localStorage.removeItem('a11y_highContrast');
        localStorage.removeItem('a11y_textSize');
        localStorage.removeItem('a11y_spacing');
        localStorage.removeItem('a11y_highlightLinks');
        localStorage.removeItem('a11y_saturation');
        localStorage.removeItem('a11y_grayscale');
        localStorage.removeItem('a11y_dyslexia');
        
        // Remove todas as classes do body
        body.classList.remove(
            'a11y-dark-mode',
            'a11y-high-contrast',
            'a11y-large-text',
            'a11y-small-text',
            'a11y-spacing',
            'a11y-highlight-links',
            'a11y-saturation',
            'a11y-grayscale',
            'a11y-dyslexia'
        );
        
        // Reseta estilos inline dos botões
        accessBtns.forEach(btn => {
            btn.style.background = '';
            btn.style.border = '';
            btn.style.color = '';
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.color = '#8b5cf6';
            }
        });
    }

    // Adiciona evento de clique em cada botão
    accessBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const spanText = btn.querySelector('span').textContent.trim().toLowerCase();

            // Botão RESET
            if (spanText.includes('reset') || spanText.includes('cores')) {
                resetAllSettings();
                return;
            }

            // Botão ESCURECER
            if (spanText.includes('escurecer')) {
                const current = getA11ySetting('darkMode', 'false');
                setA11ySetting('darkMode', current === 'true' ? 'false' : 'true');
            }
            // Botão ALTO CONTRASTE
            else if (spanText.includes('alto')) {
                const current = getA11ySetting('highContrast', 'false');
                setA11ySetting('highContrast', current === 'true' ? 'false' : 'true');
            }
            // Botão TEXTO MAIOR
            else if (spanText.includes('maior')) {
                const currentSize = getA11ySetting('textSize', 'normal');
                if (currentSize === 'large') {
                    setA11ySetting('textSize', 'normal');
                } else {
                    setA11ySetting('textSize', 'large');
                }
            }
            // Botão TEXTO MENOR
            else if (spanText.includes('menor')) {
                const currentSize = getA11ySetting('textSize', 'normal');
                if (currentSize === 'small') {
                    setA11ySetting('textSize', 'normal');
                } else {
                    setA11ySetting('textSize', 'small');
                }
            }
            // Botão ESPAÇAMENTO
            else if (spanText.includes('espaçamento')) {
                const current = getA11ySetting('spacing', 'false');
                setA11ySetting('spacing', current === 'true' ? 'false' : 'true');
            }
            // Botão LINKS
            else if (spanText.includes('links')) {
                const current = getA11ySetting('highlightLinks', 'false');
                setA11ySetting('highlightLinks', current === 'true' ? 'false' : 'true');
            }
            // Botão SATURAÇÃO
            else if (spanText.includes('saturação')) {
                const current = getA11ySetting('saturation', 'false');
                setA11ySetting('saturation', current === 'true' ? 'false' : 'true');
            }
            // Botão FONTE DISLEXIA
            else if (spanText.includes('dislexia')) {
                const current = getA11ySetting('dyslexia', 'false');
                setA11ySetting('dyslexia', current === 'true' ? 'false' : 'true');
            }
            // Botão CORES (Escala de Cinza)
            else if (spanText.includes('cores')) {
                const current = getA11ySetting('grayscale', 'false');
                setA11ySetting('grayscale', current === 'true' ? 'false' : 'true');
            }

            // Aplica as mudanças visuais
            applyAllA11ySettings();
            updateButtonStates();
        });
    });

    // Inicializa o estado visual ao carregar a página
    applyAllA11ySettings();
    updateButtonStates();

    /* =========================================
       4. LÓGICA DO MEGA MENU DROPDOWN
       ========================================= */
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownContainer = document.querySelector('#recursos-dropdown');

    if (dropdownToggle && dropdownContainer) {
        // Abre ou fecha ao clicar no botão
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdownContainer.classList.toggle('active');
        });

        // Fecha se clicar fora do menu
        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target)) {
                dropdownContainer.classList.remove('active');
            }
        });

        // Fecha se apertar a tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdownContainer.classList.remove('active');
            }
        });
    }

    /* =========================================
       5. FILTROS DO BLOG (se existirem)
       ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active de todos os irmãos
            const parent = this.parentElement;
            parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Adiciona active no clicado
            this.classList.add('active');
        });
    });

    console.log('🚀 Sistema inicializado com sucesso!');
    console.log('   ✅ Sidebar responsiva');
    console.log('   ✅ Menu de acessibilidade');
    console.log('   ✅ Modos de acessibilidade com persistência');
    console.log('   ✅ Função de reset');
    console.log('   ✅ Mega menu dropdown');
    console.log('   ✅ Filtros do blog');
});