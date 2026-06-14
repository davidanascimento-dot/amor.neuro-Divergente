document.addEventListener('DOMContentLoaded', () => {
    
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
        if (isMobile() && sidebar.classList.contains('active')) toggleSidebar();
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
       2. ACESSIBILIDADE
       ========================================= */
    const btnAcessibilidade = document.getElementById('btnAcessibilidade');
    const menuAcessibilidade = document.getElementById('menuAcessibilidade');
    const closeAcessibilidade = document.getElementById('closeAcessibilidade');
    const body = document.body;
    const accessBtns = document.querySelectorAll('.access-btn');
    const toastMsg = document.getElementById('toastMsg');

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
            if (menuAcessibilidade && !menuAcessibilidade.contains(e.target) && e.target !== btnAcessibilidade) {
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

    function getA11ySetting(key, defaultValue) { return localStorage.getItem(`a11y_${key}`) || defaultValue; }
    function setA11ySetting(key, value) { localStorage.setItem(`a11y_${key}`, value); }

    function applyAllA11ySettings() {
        body.classList.remove('a11y-dark-mode','a11y-high-contrast','a11y-large-text','a11y-small-text','a11y-spacing','a11y-highlight-links','a11y-saturation','a11y-grayscale','a11y-dyslexia');
        if (getA11ySetting('darkMode','false')==='true') body.classList.add('a11y-dark-mode');
        if (getA11ySetting('highContrast','false')==='true') body.classList.add('a11y-high-contrast');
        if (getA11ySetting('textSize','normal')==='large') body.classList.add('a11y-large-text');
        if (getA11ySetting('textSize','normal')==='small') body.classList.add('a11y-small-text');
        if (getA11ySetting('spacing','false')==='true') body.classList.add('a11y-spacing');
        if (getA11ySetting('highlightLinks','false')==='true') body.classList.add('a11y-highlight-links');
        if (getA11ySetting('saturation','false')==='true') body.classList.add('a11y-saturation');
        if (getA11ySetting('grayscale','false')==='true') body.classList.add('a11y-grayscale');
        if (getA11ySetting('dyslexia','false')==='true') body.classList.add('a11y-dyslexia');
    }

    function updateButtonStates() {
        accessBtns.forEach(btn => {
            const spanText = btn.querySelector('span')?.textContent.trim().toLowerCase() || '';
            btn.style.background = ''; btn.style.border = ''; btn.style.color = '';
            const icon = btn.querySelector('i'); if (icon) icon.style.color = '#8b5cf6';
            let isActive = false;
            if (spanText.includes('modo escuro') && getA11ySetting('darkMode','false')==='true') isActive=true;
            if (spanText.includes('alto contraste') && getA11ySetting('highContrast','false')==='true') isActive=true;
            if (spanText.includes('aumentar texto') && getA11ySetting('textSize','normal')==='large') isActive=true;
            if (spanText.includes('diminuir texto') && getA11ySetting('textSize','normal')==='small') isActive=true;
            if (spanText.includes('espaçamento') && getA11ySetting('spacing','false')==='true') isActive=true;
            if (spanText.includes('destacar links') && getA11ySetting('highlightLinks','false')==='true') isActive=true;
            if (spanText.includes('saturação') && getA11ySetting('saturation','false')==='true') isActive=true;
            if (spanText.includes('fonte dislexia') && getA11ySetting('dyslexia','false')==='true') isActive=true;
            if (spanText.includes('reset') && getA11ySetting('grayscale','false')==='true') isActive=true;
            if (isActive) { btn.style.background='#8b5cf6'; btn.style.border='2px solid #8b5cf6'; btn.style.color='#ffffff'; if(icon) icon.style.color='#ffffff'; }
        });
    }

    function resetAllSettings() {
        ['darkMode','highContrast','textSize','spacing','highlightLinks','saturation','grayscale','dyslexia'].forEach(k => localStorage.removeItem(`a11y_${k}`));
        body.classList.remove('a11y-dark-mode','a11y-high-contrast','a11y-large-text','a11y-small-text','a11y-spacing','a11y-highlight-links','a11y-saturation','a11y-grayscale','a11y-dyslexia');
        accessBtns.forEach(btn => { btn.style.background=''; btn.style.border=''; btn.style.color=''; const icon=btn.querySelector('i'); if(icon) icon.style.color='#8b5cf6'; });
        showToast('🔄 Configurações resetadas!', 'info');
    }

    accessBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const spanText = btn.querySelector('span')?.textContent.trim().toLowerCase() || '';
            if (spanText.includes('reset')) { resetAllSettings(); return; }
            if (spanText.includes('modo escuro')) { const c=getA11ySetting('darkMode','false'); setA11ySetting('darkMode',c==='true'?'false':'true'); }
            else if (spanText.includes('alto contraste')) { const c=getA11ySetting('highContrast','false'); setA11ySetting('highContrast',c==='true'?'false':'true'); }
            else if (spanText.includes('aumentar texto')) { const c=getA11ySetting('textSize','normal'); setA11ySetting('textSize',c==='large'?'normal':'large'); }
            else if (spanText.includes('diminuir texto')) { const c=getA11ySetting('textSize','normal'); setA11ySetting('textSize',c==='small'?'normal':'small'); }
            else if (spanText.includes('espaçamento')) { const c=getA11ySetting('spacing','false'); setA11ySetting('spacing',c==='true'?'false':'true'); }
            else if (spanText.includes('destacar links')) { const c=getA11ySetting('highlightLinks','false'); setA11ySetting('highlightLinks',c==='true'?'false':'true'); }
            else if (spanText.includes('saturação')) { const c=getA11ySetting('saturation','false'); setA11ySetting('saturation',c==='true'?'false':'true'); }
            else if (spanText.includes('fonte dislexia')) { const c=getA11ySetting('dyslexia','false'); setA11ySetting('dyslexia',c==='true'?'false':'true'); }
            applyAllA11ySettings(); updateButtonStates();
        });
    });

    applyAllA11ySettings();
    updateButtonStates();

    function showToast(message, type = 'info') {
        if (!toastMsg) return;
        toastMsg.textContent = message;
        toastMsg.className = `toast-msg-custom ${type}`;
        toastMsg.style.opacity = '1';
        setTimeout(() => { toastMsg.style.opacity = '0'; }, 3000);
    }

    /* =========================================
       3. BANCO DE DADOS DE CONTEÚDOS
       ========================================= */
    
    const contents = [
        { id: 1, title: "Guia Completo sobre Autismo", description: "Um guia detalhado sobre o Transtorno do Espectro Autista, incluindo sinais, diagnóstico e intervenções.", type: "guias", category: "autismo", readTime: "15 min", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=200&fit=crop", date: "15/03/2026", author: "Dra. Ana Maria" },
        { id: 2, title: "Estratégias para TDAH no Ambiente Escolar", description: "Dicas práticas para professores e pais ajudarem crianças com TDAH a terem melhor desempenho na escola.", type: "artigos", category: "tdah", readTime: "8 min", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&h=200&fit=crop", date: "10/03/2026", author: "Prof. Carlos Silva" },
        { id: 3, title: "Como funciona a mente superdotada?", description: "Entendendo as características e desafios de pessoas com altas habilidades/superdotação.", type: "videos", category: "superdotacao", duration: "12 min", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=200&fit=crop", date: "05/03/2026", author: "Psic. Fernanda Lima" },
        { id: 4, title: "Métodos eficazes para Dislexia", description: "Abordagens e técnicas para auxiliar no desenvolvimento da leitura e escrita.", type: "guias", category: "dislexia", readTime: "10 min", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop", date: "28/02/2026", author: "Dra. Mariana Santos" },
        { id: 5, title: "Podcast: Saúde Mental na Neurodiversidade", description: "Discussão sobre os desafios emocionais e estratégias de autocuidado.", type: "podcasts", category: "saude-mental", duration: "45 min", image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=200&fit=crop", date: "20/02/2026", author: "Dra. Beatriz Oliveira" },
        { id: 6, title: "Direitos da Pessoa com TEA na Educação", description: "Saiba quais são os direitos garantidos por lei para estudantes autistas.", type: "artigos", category: "direitos", readTime: "6 min", image: "https://images.unsplash.com/photo-1589391886645-519f553d2ea8?w=300&h=200&fit=crop", date: "15/02/2026", author: "Dr. Ricardo Almeida" },
        { id: 7, title: "Seminario: Inclusão no Mercado de Trabalho", description: "Como empresas podem se preparar para receber profissionais neurodivergentes.", type: "webinars", category: "direitos", duration: "90 min", image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=300&h=200&fit=crop", date: "10/02/2026", author: "Equipe NeuroInclusão" },
        { id: 8, title: "Vídeo: Técnicas de Regulação Sensorial", description: "Estratégias práticas para lidar com sobrecarga sensorial no dia a dia.", type: "videos", category: "autismo", duration: "8 min", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=200&fit=crop", date: "05/02/2026", author: "Terapeuta Juliana Costa" }
    ];

    let currentFilter = "todos";
    let currentSearch = "";
    let currentCategory = "";

    const contentGrid = document.getElementById('contentGrid');
    const searchInput = document.getElementById('searchInput');
    const filterPills = document.querySelectorAll('.pill');
    const categoryCards = document.querySelectorAll('.category-card');

    function renderContent() {
        if (!contentGrid) return;

        let filtered = [...contents];
        
        if (currentFilter !== "todos") {
            filtered = filtered.filter(item => item.type === currentFilter);
        }
        
        if (currentCategory) {
            filtered = filtered.filter(item => item.category === currentCategory);
        }
        
        if (currentSearch.trim() !== "") {
            const term = currentSearch.toLowerCase();
            filtered = filtered.filter(item => 
                item.title.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term) ||
                item.author.toLowerCase().includes(term)
            );
        }

        if (filtered.length === 0) {
            contentGrid.innerHTML = `<div class="no-results"><i class="fa-solid fa-search"></i><h3>Nenhum conteúdo encontrado</h3><p>Tente outro termo ou categoria</p></div>`;
            return;
        }

        contentGrid.innerHTML = filtered.map(item => `
            <div class="content-card" data-type="${item.type}">
                <div class="card-image" style="background-image: url('${item.image}')">
                    <span class="card-type ${item.type}">${item.type === 'artigos' ? '📄 Artigo' : item.type === 'videos' ? '🎬 Vídeo' : item.type === 'guias' ? '📘 Guia' : item.type === 'podcasts' ? '🎙️ Podcast' : '💻 Webinar'}</span>
                </div>
                <div class="card-content">
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.description.substring(0, 100))}${item.description.length > 100 ? '...' : ''}</p>
                    <div class="card-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${item.date}</span>
                        <span><i class="fa-regular fa-clock"></i> ${item.readTime || item.duration}</span>
                    </div>
                    <div class="card-footer">
                        <span class="card-author"><i class="fa-regular fa-user"></i> ${escapeHtml(item.author)}</span>
                        <button class="btn-read" data-id="${item.id}">Ler mais →</button>
                    </div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.btn-read').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                showToast('Abrindo conteúdo...', 'info');
                setTimeout(() => {
                    window.location.href = `/Recursos/conteudo/${id}.html`;
                }, 500);
            });
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Filtros
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilter = pill.dataset.filter;
            currentCategory = "";
            renderContent();
            showToast(`Mostrando: ${pill.textContent}`, 'info');
        });
    });

    // Categorias
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            currentCategory = category;
            currentFilter = "todos";
            filterPills.forEach(p => p.classList.remove('active'));
            document.querySelector('.pill[data-filter="todos"]')?.classList.add('active');
            renderContent();
            showToast(`Categoria: ${card.querySelector('h3').textContent}`, 'info');
        });
    });

    // Busca
    let searchDebounce;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
                currentSearch = searchInput.value;
                renderContent();
                if (currentSearch) showToast(`Buscando: "${currentSearch}"`, 'info');
            }, 500);
        });
    }

    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (email) {
                showToast(`Inscrição confirmada! Enviaremos novidades para ${email}`, 'success');
                newsletterForm.reset();
            }
        });
    }

    renderContent();

    console.log('📚 Conteúdo Educativo inicializado!');
});