document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. SIDEBAR RESPONSIVA
       ========================================= */
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
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
        if (!sidebar) return;
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
       3. LÓGICA DOS BOTÕES DE ACESSIBILIDADE - CORRIGIDA PARA TEXTO "Modo Escuro", "Alto Contraste", etc.
       ========================================= */
    const accessBtns = document.querySelectorAll('.access-btn');

    function getA11ySetting(key, defaultValue) {
        const saved = localStorage.getItem(`a11y_${key}`);
        return saved !== null ? saved : defaultValue;
    }

    function setA11ySetting(key, value) {
        localStorage.setItem(`a11y_${key}`, value);
    }

    function applyAllA11ySettings() {
        body.classList.remove(
            'a11y-dark-mode', 'a11y-high-contrast', 'a11y-large-text', 'a11y-small-text',
            'a11y-spacing', 'a11y-highlight-links', 'a11y-saturation', 'a11y-grayscale', 'a11y-dyslexia'
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
            const spanText = btn.querySelector('span')?.textContent.trim().toLowerCase() || '';
            
            btn.style.background = '';
            btn.style.border = '';
            btn.style.color = '';
            
            const icon = btn.querySelector('i');
            if (icon) icon.style.color = '#8b5cf6';
            
            let isActive = false;
            
            // Modo Escuro
            if (spanText.includes('modo escuro') && getA11ySetting('darkMode', 'false') === 'true') isActive = true;
            // Alto Contraste
            if (spanText.includes('alto contraste') && getA11ySetting('highContrast', 'false') === 'true') isActive = true;
            // Aumentar Texto
            if (spanText.includes('aumentar texto') && getA11ySetting('textSize', 'normal') === 'large') isActive = true;
            // Diminuir Texto
            if (spanText.includes('diminuir texto') && getA11ySetting('textSize', 'normal') === 'small') isActive = true;
            // Espaçamento
            if (spanText.includes('espaçamento') && getA11ySetting('spacing', 'false') === 'true') isActive = true;
            // Destacar Links
            if (spanText.includes('destacar links') && getA11ySetting('highlightLinks', 'false') === 'true') isActive = true;
            // Saturação
            if (spanText.includes('saturação') && getA11ySetting('saturation', 'false') === 'true') isActive = true;
            // Fonte Dislexia
            if (spanText.includes('fonte dislexia') && getA11ySetting('dyslexia', 'false') === 'true') isActive = true;
            // Reset
            if (spanText.includes('reset') && getA11ySetting('grayscale', 'false') === 'true') isActive = true;
            
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
            'a11y-dark-mode', 'a11y-high-contrast', 'a11y-large-text', 'a11y-small-text',
            'a11y-spacing', 'a11y-highlight-links', 'a11y-saturation', 'a11y-grayscale', 'a11y-dyslexia'
        );
        
        accessBtns.forEach(btn => {
            btn.style.background = '';
            btn.style.border = '';
            btn.style.color = '';
            const icon = btn.querySelector('i');
            if (icon) icon.style.color = '#8b5cf6';
        });
        
        showToast('🔄 Todas as configurações de acessibilidade foram resetadas!', 'info');
    }

    function showToast(message, type = 'info') {
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

            if (spanText.includes('reset')) {
                resetAllSettings();
                return;
            }
            
            if (spanText.includes('modo escuro')) {
                const current = getA11ySetting('darkMode', 'false');
                setA11ySetting('darkMode', current === 'true' ? 'false' : 'true');
                showToast(current === 'true' ? '🌙 Modo escuro desativado' : '🌙 Modo escuro ativado', 'info');
            }
            else if (spanText.includes('alto contraste')) {
                const current = getA11ySetting('highContrast', 'false');
                setA11ySetting('highContrast', current === 'true' ? 'false' : 'true');
                showToast(current === 'true' ? '🎨 Alto contraste desativado' : '🎨 Alto contraste ativado', 'info');
            }
            else if (spanText.includes('aumentar texto')) {
                const currentSize = getA11ySetting('textSize', 'normal');
                const newSize = currentSize === 'large' ? 'normal' : 'large';
                setA11ySetting('textSize', newSize);
                showToast(newSize === 'large' ? '🔍 Texto aumentado' : '🔍 Texto normal', 'info');
            }
            else if (spanText.includes('diminuir texto')) {
                const currentSize = getA11ySetting('textSize', 'normal');
                const newSize = currentSize === 'small' ? 'normal' : 'small';
                setA11ySetting('textSize', newSize);
                showToast(newSize === 'small' ? '🔍 Texto diminuído' : '🔍 Texto normal', 'info');
            }
            else if (spanText.includes('espaçamento')) {
                const current = getA11ySetting('spacing', 'false');
                setA11ySetting('spacing', current === 'true' ? 'false' : 'true');
                showToast(current === 'true' ? '📏 Espaçamento normal' : '📏 Espaçamento aumentado', 'info');
            }
            else if (spanText.includes('destacar links')) {
                const current = getA11ySetting('highlightLinks', 'false');
                setA11ySetting('highlightLinks', current === 'true' ? 'false' : 'true');
                showToast(current === 'true' ? '🔗 Links sem destaque' : '🔗 Links destacados', 'info');
            }
            else if (spanText.includes('saturação')) {
                const current = getA11ySetting('saturation', 'false');
                setA11ySetting('saturation', current === 'true' ? 'false' : 'true');
                showToast(current === 'true' ? '🎨 Saturação normal' : '🎨 Saturação ajustada', 'info');
            }
            else if (spanText.includes('fonte dislexia')) {
                const current = getA11ySetting('dyslexia', 'false');
                setA11ySetting('dyslexia', current === 'true' ? 'false' : 'true');
                showToast(current === 'true' ? '🔤 Fonte padrão' : '🔤 Fonte para dislexia ativada', 'info');
            }

            applyAllA11ySettings();
            updateButtonStates();
        });
    });

    applyAllA11ySettings();
    updateButtonStates();

    /* =========================================
       4. BANCO DE DADOS DE ARTIGOS
       ========================================= */
    
    let articles = [
        {
            id: 1,
            title: "Autonomia no autismo com apoio da comunicação visual",
            description: "Descubra como a comunicação visual pode ajudar crianças com autismo a desenvolver autonomia no dia a dia.",
            category: "Autismo",
            tags: ["Blog", "Autismo", "Comunicação"],
            date: "05/02/2026",
            readTime: "1 min",
            image: "/img/blog-post-1-DvwhQAY4.jpg",
            link: "/blog/artigos/blog1.html"
        },
        {
            id: 2,
            title: "Como conseguir terapia de graça para autistas?",
            description: "Guia completo sobre como acessar terapias gratuitas pelo SUS e outros programas para crianças autistas.",
            category: "Direitos",
            tags: ["Blog", "Terapia", "Direitos", "SUS"],
            date: "05/02/2026",
            readTime: "1 min",
            image: "/img/blog-post-2-Dk5Jy2bJ.jpg",
            link: "/blog/artigos - 2/blog1.html"
        },
        {
            id: 3,
            title: "Fonoaudiologia ABA: qual é o papel desse profissional na comunicação do autista?",
            description: "Entenda como o fonoaudiólogo especializado em ABA pode auxiliar no desenvolvimento da comunicação.",
            category: "Fonoaudiologia",
            tags: ["Blog", "ABA", "Fonoaudiologia", "TDAH"],
            date: "05/02/2026",
            readTime: "1 min",
            image: "/img/blog-post-3-EqM0ehGW.jpg",
            link: "/blog/artigos -3/blog1.html"
        }
    ];

    let nextId = 4;
    let currentFilter = "Blog";
    let currentSearch = "";
    let currentPage = 1;
    let isLoading = false;
    let hasMoreArticles = true;
    const articlesPerPage = 3;

    // Artigos adicionais para carregamento infinito
    const additionalArticles = [
        {
            id: 4,
            title: "Neurodiversidade no ambiente de trabalho",
            description: "Como empresas podem se tornar mais inclusivas para profissionais neurodivergentes.",
            category: "Inclusão",
            tags: ["Blog", "Inclusão", "Trabalho", "Direitos"],
            date: "10/02/2026",
            readTime: "3 min",
            image: "/img/blog-post-4.jpg",
            link: "/blog/artigos/neurodiversidade-trabalho.html"
        },
        {
            id: 5,
            title: "Estratégias para lidar com a sobrecarga sensorial",
            description: "Técnicas e ferramentas para gerenciar a sobrecarga sensorial no dia a dia.",
            category: "Autismo",
            tags: ["Blog", "Autismo", "Sensorial", "Bem-estar"],
            date: "12/02/2026",
            readTime: "2 min",
            image: "/img/blog-post-5.jpg",
            link: "/blog/artigos/sobrecarga-sensorial.html"
        },
        {
            id: 6,
            title: "TDAH em adultos: desafios e estratégias",
            description: "Como o TDAH se manifesta na vida adulta e quais estratégias podem ajudar no dia a dia.",
            category: "TDAH",
            tags: ["Blog", "TDAH", "Adultos", "Estratégias"],
            date: "15/02/2026",
            readTime: "2 min",
            image: "/img/blog-post-6.jpg",
            link: "/blog/artigos/tdah-adultos.html"
        },
        {
            id: 7,
            title: "Direitos da pessoa com TEA na educação",
            description: "Quais são os direitos garantidos por lei para estudantes com Transtorno do Espectro Autista.",
            category: "Direitos",
            tags: ["Blog", "Direitos", "Educação", "TEA"],
            date: "18/02/2026",
            readTime: "2 min",
            image: "/img/blog-post-7.jpg",
            link: "/blog/artigos/direitos-educacao-tea.html"
        },
        {
            id: 8,
            title: "Terapia ABA: o que é e como funciona",
            description: "Entenda os princípios da Análise do Comportamento Aplicada e seus benefícios para o autismo.",
            category: "Terapia",
            tags: ["Blog", "ABA", "Terapia", "Autismo"],
            date: "20/02/2026",
            readTime: "3 min",
            image: "/img/blog-post-8.jpg",
            link: "/blog/artigos/terapia-aba.html"
        }
    ];

    // Elementos do DOM
    const blogGrid = document.getElementById('blogGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');

    /* =========================================
       5. FUNÇÕES AUXILIARES
       ========================================= */
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /* =========================================
       6. RENDERIZAR ARTIGOS
       ========================================= */
    
    function renderArticles() {
        if (!blogGrid) return;

        let filteredArticles = [...articles];
        
        // Filtrar por categoria
        if (currentFilter !== "Blog") {
            filteredArticles = filteredArticles.filter(article => 
                article.category === currentFilter ||
                article.tags.includes(currentFilter)
            );
        }
        
        // Filtrar por busca
        if (currentSearch.trim() !== "") {
            const term = currentSearch.toLowerCase().trim();
            filteredArticles = filteredArticles.filter(article =>
                article.title.toLowerCase().includes(term) ||
                article.description.toLowerCase().includes(term) ||
                article.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }
        
        // Paginação
        const endIndex = currentPage * articlesPerPage;
        const displayArticles = filteredArticles.slice(0, endIndex);
        
        if (displayArticles.length === 0) {
            blogGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fa-solid fa-search" style="font-size: 48px; color: #9F7AEA; margin-bottom: 20px;"></i>
                    <h3>Nenhum artigo encontrado</h3>
                    <p>Tente usar outro termo ou filtro para sua busca.</p>
                </div>
            `;
            hasMoreArticles = false;
            return;
        }
        
        blogGrid.innerHTML = displayArticles.map(article => `
            <div class="blog-card" data-id="${article.id}">
                <div class="card-image" style="background-image: url('${article.image}'); background-size: cover; background-position: center;">
                    <div class="card-badges">
                        <span class="badge"><i class="fa-regular fa-clock"></i> ${article.date}</span>
                        <span class="badge badge-purple"><i class="fa-solid fa-book-open"></i> ~${article.readTime}</span>
                    </div>
                </div>
                <div class="card-content">
                    <h3>${escapeHtml(article.title)}</h3>
                    <div class="card-tags">
                        ${article.tags.slice(0, 4).map(tag => `<span><i class="fa-solid fa-tag"></i> ${escapeHtml(tag)}</span>`).join('')}
                    </div>
                    <p>${escapeHtml(article.description)}</p>
                    <a href="${article.link}" class="btn-outline">Ler mais <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
        `).join('');
        
        hasMoreArticles = endIndex < filteredArticles.length;
    }

    /* =========================================
       7. CARREGAR MAIS ARTIGOS (SCROLL INFINITO)
       ========================================= */
    
    async function loadMoreArticles() {
        if (isLoading || !hasMoreArticles) return;
        
        isLoading = true;
        
        // Mostrar indicador de carregamento
        const sentinel = document.querySelector('.scroll-sentinel');
        if (sentinel) {
            const spinner = sentinel.querySelector('.loading-spinner');
            if (spinner) spinner.style.display = 'flex';
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Adicionar artigos do banco adicional
        if (additionalArticles.length > 0) {
            const newArticle = additionalArticles.shift();
            articles.push(newArticle);
        }
        
        currentPage++;
        isLoading = false;
        renderArticles();
        
        // Esconder indicador de carregamento
        if (sentinel) {
            const spinner = sentinel.querySelector('.loading-spinner');
            if (spinner) spinner.style.display = 'none';
        }
    }

    function setupInfiniteScroll() {
        if (!blogGrid) return;
        
        // Remove sentinel existente se houver
        const existingSentinel = document.querySelector('.scroll-sentinel');
        if (existingSentinel) existingSentinel.remove();
        
        const sentinel = document.createElement('div');
        sentinel.className = 'scroll-sentinel';
        sentinel.innerHTML = '<div class="loading-spinner" style="display: none;"><i class="fa-solid fa-spinner fa-spin"></i> Carregando mais artigos...</div>';
        blogGrid.parentElement.appendChild(sentinel);
        
        const observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && !isLoading && hasMoreArticles) {
                await loadMoreArticles();
            }
        }, { threshold: 0.1, rootMargin: '100px' });
        
        observer.observe(sentinel);
    }

    /* =========================================
       8. FILTROS DO BLOG
       ========================================= */
    
    function handleFilterClick(clickedBtn) {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
        currentFilter = clickedBtn.textContent.trim();
        currentPage = 1;
        hasMoreArticles = true;
        renderArticles();
        
        // Resetar scroll infinito
        setupInfiniteScroll();
        
        if (currentFilter !== 'Blog') {
            showToast(`Filtrando por: ${currentFilter}`, 'info');
        } else {
            showToast('Mostrando todos os artigos', 'info');
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => handleFilterClick(btn));
    });

    /* =========================================
       9. PESQUISA EM TEMPO REAL
       ========================================= */
    
    let searchDebounce;
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
                currentSearch = this.value;
                currentPage = 1;
                hasMoreArticles = true;
                renderArticles();
                setupInfiniteScroll();
                
                if (currentSearch.trim() !== '') {
                    showToast(`Buscando por: "${currentSearch}"`, 'info');
                }
            }, 500);
        });
        
        // Placeholder rotativo
        const placeholders = [
            "Pesquisar artigos...",
            "Ex: Autismo, TDAH, Direitos...",
            "Busque por temas específicos...",
            "Digite sua dúvida sobre neurodiversidade..."
        ];
        let phIndex = 0;
        setInterval(() => {
            if (!searchInput.matches(':focus')) {
                phIndex = (phIndex + 1) % placeholders.length;
                searchInput.placeholder = placeholders[phIndex];
            }
        }, 4000);
    }

    /* =========================================
       10. INICIALIZAÇÃO
       ========================================= */
    
    renderArticles();
    setupInfiniteScroll();

    console.log('🚀 Blog inicializado com sucesso!');
    console.log('   ✅ Sidebar responsiva');
    console.log('   ✅ Acessibilidade: Modo Escuro, Alto Contraste, Texto, Espaçamento, Links, Saturação, Fonte Dislexia');
    console.log('   ✅ Filtros do blog');
    console.log('   ✅ Busca em tempo real');
    console.log('   ✅ Scroll infinito');
    console.log(`   ✅ Total de artigos iniciais: ${articles.length}`);
});