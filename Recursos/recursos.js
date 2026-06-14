document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. SIDEBAR RESPONSIVA
       ========================================= */
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const mainContent = document.querySelector('.main-content');
    
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

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    overlay.addEventListener('click', () => {
        if (isMobile() && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

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
    const body = document.body;

    if (btnAcessibilidade && menuAcessibilidade) {
        btnAcessibilidade.addEventListener('click', (e) => {
            e.stopPropagation();
            menuAcessibilidade.classList.toggle('active');
        });

        closeAcessibilidade?.addEventListener('click', () => {
            menuAcessibilidade.classList.remove('active');
        });

        document.addEventListener('click', (e) => {
            if (!menuAcessibilidade.contains(e.target) && e.target !== btnAcessibilidade) {
                menuAcessibilidade.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuAcessibilidade.classList.contains('active')) {
                menuAcessibilidade.classList.remove('active');
                btnAcessibilidade.focus();
            }
        });
    }

    /* =========================================
       3. LÓGICA DOS BOTÕES DE ACESSIBILIDADE
       ========================================= */
    const accessBtns = document.querySelectorAll('.access-btn');

    function getA11ySetting(key, defaultValue) {
        return localStorage.getItem(`a11y_${key}`) || defaultValue;
    }

    function setA11ySetting(key, value) {
        localStorage.setItem(`a11y_${key}`, value);
    }

    function applyAllA11ySettings() {
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

        const darkMode = getA11ySetting('darkMode', 'false');
        const highContrast = getA11ySetting('highContrast', 'false');
        const textSize = getA11ySetting('textSize', 'normal');
        const spacing = getA11ySetting('spacing', 'false');
        const highlightLinks = getA11ySetting('highlightLinks', 'false');
        const saturation = getA11ySetting('saturation', 'false');
        const grayscale = getA11ySetting('grayscale', 'false');
        const dyslexia = getA11ySetting('dyslexia', 'false');

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

    function updateButtonStates() {
        accessBtns.forEach(btn => {
            const spanText = btn.querySelector('span').textContent.trim().toLowerCase();
            btn.style.background = '';
            btn.style.border = '';
            btn.style.color = '';
            
            let isActive = false;
            
            if (spanText.includes('escurecer') && getA11ySetting('darkMode', 'false') === 'true') isActive = true;
            if (spanText.includes('alto') && getA11ySetting('highContrast', 'false') === 'true') isActive = true;
            if (spanText.includes('maior') && getA11ySetting('textSize', 'normal') === 'large') isActive = true;
            if (spanText.includes('menor') && getA11ySetting('textSize', 'normal') === 'small') isActive = true;
            if (spanText.includes('espaçamento') && getA11ySetting('spacing', 'false') === 'true') isActive = true;
            if (spanText.includes('links') && getA11ySetting('highlightLinks', 'false') === 'true') isActive = true;
            if (spanText.includes('saturação') && getA11ySetting('saturation', 'false') === 'true') isActive = true;
            if (spanText.includes('dislexia') && getA11ySetting('dyslexia', 'false') === 'true') isActive = true;
            if (spanText.includes('cores') && getA11ySetting('grayscale', 'false') === 'true') isActive = true;
            
            if (isActive) {
                btn.style.background = '#8b5cf6';
                btn.style.border = '2px solid #8b5cf6';
                btn.style.color = '#ffffff';
                const icon = btn.querySelector('i');
                if (icon) icon.style.color = '#ffffff';
            } else {
                const icon = btn.querySelector('i');
                if (icon) icon.style.color = '#8b5cf6';
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
        
        accessBtns.forEach(btn => {
            btn.style.background = '';
            btn.style.border = '';
            btn.style.color = '';
            const icon = btn.querySelector('i');
            if (icon) icon.style.color = '#8b5cf6';
        });
    }

    accessBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const spanText = btn.querySelector('span').textContent.trim().toLowerCase();

            if (spanText.includes('reset') || spanText.includes('cores')) {
                resetAllSettings();
                return;
            }

            if (spanText.includes('escurecer')) {
                const current = getA11ySetting('darkMode', 'false');
                setA11ySetting('darkMode', current === 'true' ? 'false' : 'true');
            }
            else if (spanText.includes('alto')) {
                const current = getA11ySetting('highContrast', 'false');
                setA11ySetting('highContrast', current === 'true' ? 'false' : 'true');
            }
            else if (spanText.includes('maior')) {
                const currentSize = getA11ySetting('textSize', 'normal');
                setA11ySetting('textSize', currentSize === 'large' ? 'normal' : 'large');
            }
            else if (spanText.includes('menor')) {
                const currentSize = getA11ySetting('textSize', 'normal');
                setA11ySetting('textSize', currentSize === 'small' ? 'normal' : 'small');
            }
            else if (spanText.includes('espaçamento')) {
                const current = getA11ySetting('spacing', 'false');
                setA11ySetting('spacing', current === 'true' ? 'false' : 'true');
            }
            else if (spanText.includes('links')) {
                const current = getA11ySetting('highlightLinks', 'false');
                setA11ySetting('highlightLinks', current === 'true' ? 'false' : 'true');
            }
            else if (spanText.includes('saturação')) {
                const current = getA11ySetting('saturation', 'false');
                setA11ySetting('saturation', current === 'true' ? 'false' : 'true');
            }
            else if (spanText.includes('dislexia')) {
                const current = getA11ySetting('dyslexia', 'false');
                setA11ySetting('dyslexia', current === 'true' ? 'false' : 'true');
            }

            applyAllA11ySettings();
            updateButtonStates();
        });
    });

    applyAllA11ySettings();
    updateButtonStates();

    /* =========================================
       4. LÓGICA DO MEGA MENU DROPDOWN
       ========================================= */
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownContainer = document.querySelector('#recursos-dropdown');

    if (dropdownToggle && dropdownContainer) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdownContainer.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target)) {
                dropdownContainer.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdownContainer.classList.remove('active');
            }
        });
    }

    /* =========================================
       5. RECURSOS - BUSCA, FILTROS E CARDS COM LINKS
       ========================================= */
    
    // Mapeamento de links para cada recurso
    const resourceLinks = {
        "Conteúdo Educativo": "/Recursos/conteudo-educativo.html",
        "Rede de Apoio": "/comunidade/comunidade.html",
        "Planos Individualizados": "/Recursos/planos-individualizados.html",
        "Tecnologia Assistiva": "/ferramentas/ferramentas.html",
        "Direitos e Leis": "/Direitos/direitos.html",
        "Comunidade Ativa": "/comunidade/comunidade.html"
    };

    // Dados dos recursos
    const resourcesData = [
        {
            id: 1,
            title: "Conteúdo Educativo",
            description: "Artigos, vídeos e materiais sobre neurodiversidade elaborados por especialistas.",
            icon: "fa-solid fa-book-open",
            category: "Conteúdo Educativo",
            link: "/Recursos/conteudo-educativo.html"
        },
        {
            id: 2,
            title: "Rede de Apoio",
            description: "Conecte-se com profissionais e outras famílias que compartilham experiências semelhantes.",
            icon: "fa-solid fa-user-group",
            category: "Rede de Apoio",
            link: "/comunidade/comunidade.html"
        },
        {
            id: 3,
            title: "Planos Individualizados",
            description: "Ferramentas para criar planos de ensino personalizados para cada criança.",
            icon: "fa-regular fa-lightbulb",
            category: "Planos Individualizados",
            link: "/Recursos/planos-individualizados.html"
        },
        {
            id: 4,
            title: "Tecnologia Assistiva",
            description: "Soluções tecnológicas que facilitam o dia a dia de pessoas neurodivergentes.",
            icon: "fa-solid fa-desktop",
            category: "Tecnologia Assistiva",
            link: "/ferramentas/ferramentas.html"
        },
        {
            id: 5,
            title: "Direitos e Leis",
            description: "Informações atualizadas sobre direitos legais e como acessá-los.",
            icon: "fa-solid fa-shield-halved",
            category: "Direitos e Leis",
            link: "/Direitos/direitos.html"
        },
        {
            id: 6,
            title: "Comunidade Ativa",
            description: "Espaço seguro para trocar experiências, fazer perguntas e receber apoio.",
            icon: "fa-regular fa-comments",
            category: "Comunidade Ativa",
            link: "/comunidade/comunidade.html"
        }
    ];

    // Elementos da seção de recursos
    const searchInput = document.querySelector('.search-container input');
    const filterPills = document.querySelectorAll('.pill');
    const resourcesGrid = document.querySelector('.resources-grid');
    
    // Estado atual
    let currentFilter = 'Todas';
    let currentSearch = '';

    // Função auxiliar para escapar HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Função para mostrar toast
    function showToast(message, type = 'info') {
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `custom-toast ${type}`;
        toast.setAttribute('role', 'alert');
        
        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-exclamation',
            info: 'fa-circle-info'
        };
        
        toast.innerHTML = `
            <i class="fa-solid ${icons[type] || icons.info}"></i>
            <span>${escapeHtml(message)}</span>
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Função para abrir link externo ou página interna
    function openResourceLink(link, resourceTitle) {
        if (link) {
            showToast(`Redirecionando para: ${resourceTitle}`, 'success');
            setTimeout(() => {
                window.location.href = link;
            }, 500);
        } else {
            showToast(`Link para ${resourceTitle} será disponibilizado em breve`, 'info');
        }
    }

    // Função para mostrar modal com detalhes do recurso
    function showResourceDetails(resourceId) {
        const resource = resourcesData.find(r => r.id === resourceId);
        if (!resource) return;

        const modal = document.createElement('div');
        modal.className = 'resource-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', `Detalhes do recurso: ${resource.title}`);
        
        modal.innerHTML = `
            <div class="resource-modal-content">
                <div class="resource-modal-header">
                    <div class="icon-box-large"><i class="${resource.icon}"></i></div>
                    <h2>${escapeHtml(resource.title)}</h2>
                    <button class="modal-close" aria-label="Fechar detalhes">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="resource-modal-body">
                    <p>${escapeHtml(resource.description)}</p>
                    <div class="resource-category-tag">
                        <i class="fa-solid fa-tag"></i>
                        <span>${escapeHtml(resource.category)}</span>
                    </div>
                </div>
                <div class="resource-modal-footer">
                    <button class="modal-action-btn primary" data-action="access" data-link="${resource.link}" data-title="${escapeHtml(resource.title)}">
                        <i class="fa-solid fa-arrow-right-to-bracket"></i> Acessar Recurso
                    </button>
                    <button class="modal-action-btn secondary" data-action="close">
                        <i class="fa-solid fa-times"></i> Fechar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => modal.classList.add('active'), 10);
        
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        };
        
        modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
        modal.querySelector('[data-action="close"]')?.addEventListener('click', closeModal);
        
        const accessBtn = modal.querySelector('[data-action="access"]');
        if (accessBtn) {
            accessBtn.addEventListener('click', () => {
                const link = accessBtn.getAttribute('data-link');
                const title = accessBtn.getAttribute('data-title');
                
                const btn = modal.querySelector('[data-action="access"]');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Redirecionando...';
                btn.disabled = true;
                
                setTimeout(() => {
                    openResourceLink(link, title);
                    closeModal();
                }, 800);
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // Função para renderizar os cards
    function renderResources() {
        if (!resourcesGrid) return;

        let filteredResources = [...resourcesData];
        
        if (currentFilter !== 'Todas') {
            filteredResources = filteredResources.filter(resource => 
                resource.category === currentFilter
            );
        }
        
        if (currentSearch.trim() !== '') {
            const searchTerm = currentSearch.toLowerCase().trim();
            filteredResources = filteredResources.filter(resource =>
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                resource.category.toLowerCase().includes(searchTerm)
            );
        }

        if (filteredResources.length === 0) {
            resourcesGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fa-solid fa-search" style="font-size: 48px; color: #9F7AEA; margin-bottom: 20px; display: inline-block;"></i>
                    <h3 style="color: #4A5568; margin-bottom: 10px;">Nenhum recurso encontrado</h3>
                    <p style="color: #718096;">Tente usar outro termo ou filtro para sua busca.</p>
                </div>
            `;
            return;
        }

        resourcesGrid.innerHTML = filteredResources.map(resource => `
            <div class="resource-card-alt" data-id="${resource.id}" data-category="${resource.category}" data-link="${resource.link}">
                <div class="icon-box"><i class="${resource.icon}"></i></div>
                <h3>${escapeHtml(resource.title)}</h3>
                <p>${escapeHtml(resource.description)}</p>
                <button class="resource-details-btn" data-id="${resource.id}" aria-label="Ver mais sobre ${escapeHtml(resource.title)}">
                    Saiba mais <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        `).join('');

        document.querySelectorAll('.resource-details-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const resourceId = parseInt(this.getAttribute('data-id'));
                showResourceDetails(resourceId);
            });
        });

        document.querySelectorAll('.resource-card-alt').forEach(card => {
            card.addEventListener('click', function(e) {
                // Evitar que o clique no card seja acionado se clicou no botão
                if (e.target.classList.contains('resource-details-btn') || e.target.closest('.resource-details-btn')) {
                    return;
                }
                const resourceId = parseInt(this.getAttribute('data-id'));
                showResourceDetails(resourceId);
            });
        });
    }

    // Função de acesso direto pelo card (simplificado)
    function accessResourceDirectly(resourceId) {
        const resource = resourcesData.find(r => r.id === resourceId);
        if (resource && resource.link) {
            showToast(`Acessando: ${resource.title}`, 'success');
            setTimeout(() => {
                window.location.href = resource.link;
            }, 500);
        }
    }

    // Eventos de busca com debounce
    let debounceTimeout;
    function handleSearchInput() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            currentSearch = searchInput.value;
            renderResources();
            if (currentSearch.trim() !== '') {
                showToast(`Buscando por: "${currentSearch}"`, 'info');
            }
        }, 300);
    }

    // Eventos dos filtros
    function handleFilterClick(clickedPill) {
        filterPills.forEach(pill => pill.classList.remove('active'));
        clickedPill.classList.add('active');
        currentFilter = clickedPill.textContent.trim();
        renderResources();
        
        if (currentFilter !== 'Todas') {
            showToast(`Filtrando por: ${currentFilter}`, 'info');
        } else {
            showToast('Mostrando todos os recursos', 'info');
        }
    }

    // Inicializar eventos de recursos
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        
        // Placeholder rotativo
        const placeholders = [
            "Buscar recursos...",
            "Ex: Autismo, TDAH, Direitos...",
            "O que você procura?",
            "Digite sua dúvida..."
        ];
        let placeholderIndex = 0;
        setInterval(() => {
            if (!searchInput.matches(':focus')) {
                placeholderIndex = (placeholderIndex + 1) % placeholders.length;
                searchInput.placeholder = placeholders[placeholderIndex];
            }
        }, 4000);
    }
    
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => handleFilterClick(pill));
    });
    
    // Renderizar recursos inicialmente
    renderResources();

    console.log('🚀 Recursos inicializado com sucesso!');
    console.log('   ✅ Busca em tempo real');
    console.log('   ✅ Filtros por categoria');
    console.log('   ✅ Cards com links funcionais');
    console.log('   ✅ Direitos e Leis → /Direitos/direitos.html');
    console.log('   ✅ Comunidade Ativa → /comunidade/comunidade.html');
    console.log('   ✅ Tecnologia Assistiva → /ferramentas/ferramentas.html');
});