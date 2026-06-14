document.addEventListener('DOMContentLoaded', () => {
    
    const body = document.body;

    // ============================================
    // SIDEBAR RESPONSIVA
    // ============================================
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
        if (isMobile() && sidebar && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    document.addEventListener('click', (e) => {
        if (isMobile() && sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && e.target !== toggleBtn && !toggleBtn?.contains(e.target)) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
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

    // ============================================
    // ACESSIBILIDADE
    // ============================================
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
            const spanText = btn.querySelector('span').textContent.trim().toLowerCase();
            btn.style.background = ''; btn.style.border = ''; btn.style.color = '';
            const icon = btn.querySelector('i'); if (icon) icon.style.color = '#8b5cf6';
            let isActive = false;
            if (spanText.includes('escurecer') && getA11ySetting('darkMode','false')==='true') isActive=true;
            if (spanText.includes('alto') && getA11ySetting('highContrast','false')==='true') isActive=true;
            if (spanText.includes('maior') && getA11ySetting('textSize','normal')==='large') isActive=true;
            if (spanText.includes('menor') && getA11ySetting('textSize','normal')==='small') isActive=true;
            if (spanText.includes('espaçamento') && getA11ySetting('spacing','false')==='true') isActive=true;
            if (spanText.includes('links') && getA11ySetting('highlightLinks','false')==='true') isActive=true;
            if (spanText.includes('saturação') && getA11ySetting('saturation','false')==='true') isActive=true;
            if (spanText.includes('dislexia') && getA11ySetting('dyslexia','false')==='true') isActive=true;
            if (spanText.includes('reset') && getA11ySetting('grayscale','false')==='true') isActive=true;
            if (isActive) { btn.style.background='#8b5cf6'; btn.style.border='2px solid #8b5cf6'; btn.style.color='#ffffff'; if(icon) icon.style.color='#ffffff'; }
        });
    }

    function resetAllSettings() {
        ['darkMode','highContrast','textSize','spacing','highlightLinks','saturation','grayscale','dyslexia'].forEach(k => localStorage.removeItem(`a11y_${k}`));
        body.classList.remove('a11y-dark-mode','a11y-high-contrast','a11y-large-text','a11y-small-text','a11y-spacing','a11y-highlight-links','a11y-saturation','a11y-grayscale','a11y-dyslexia');
        accessBtns.forEach(btn => { btn.style.background=''; btn.style.border=''; btn.style.color=''; const icon=btn.querySelector('i'); if(icon) icon.style.color='#8b5cf6'; });
    }

    accessBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const spanText = btn.querySelector('span').textContent.trim().toLowerCase();
            if (spanText.includes('reset')) { resetAllSettings(); return; }
            if (spanText.includes('escurecer')) { const c=getA11ySetting('darkMode','false'); setA11ySetting('darkMode',c==='true'?'false':'true'); }
            else if (spanText.includes('alto')) { const c=getA11ySetting('highContrast','false'); setA11ySetting('highContrast',c==='true'?'false':'true'); }
            else if (spanText.includes('maior')) { const c=getA11ySetting('textSize','normal'); setA11ySetting('textSize',c==='large'?'normal':'large'); }
            else if (spanText.includes('menor')) { const c=getA11ySetting('textSize','normal'); setA11ySetting('textSize',c==='small'?'normal':'small'); }
            else if (spanText.includes('espaçamento')) { const c=getA11ySetting('spacing','false'); setA11ySetting('spacing',c==='true'?'false':'true'); }
            else if (spanText.includes('links')) { const c=getA11ySetting('highlightLinks','false'); setA11ySetting('highlightLinks',c==='true'?'false':'true'); }
            else if (spanText.includes('saturação')) { const c=getA11ySetting('saturation','false'); setA11ySetting('saturation',c==='true'?'false':'true'); }
            else if (spanText.includes('dislexia')) { const c=getA11ySetting('dyslexia','false'); setA11ySetting('dyslexia',c==='true'?'false':'true'); }
            applyAllA11ySettings(); updateButtonStates();
        });
    });

    applyAllA11ySettings();
    updateButtonStates();

    // ============================================
    // BANCO DE DADOS DE LEIS COM LINKS EXTERNOS
    // ============================================
    
    let lawsDatabase = [
        { 
            id: 1, 
            title: "Lei Berenice Piana", 
            description: "Estabelece direitos da pessoa com Transtorno do Espectro Autista, garantindo acesso à educação e serviços públicos.", 
            category: "saude", 
            setor: "saude", 
            setorNome: "Saúde", 
            year: "2012", 
            number: "12.764/2012",
            externalLink: "http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12764.htm",
            officialSite: "https://www.gov.br/planalto"
        },
        { 
            id: 2, 
            title: "Lei do Acompanhante Terapêutico", 
            description: "Garante o direito ao acompanhante terapêutico em instituições de ensino para pessoas com deficiência.", 
            category: "saude", 
            setor: "saude", 
            setorNome: "Saúde", 
            year: "2015", 
            number: "13.146/2015",
            externalLink: "http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm",
            officialSite: "https://www.gov.br/planalto"
        },
        { 
            id: 3, 
            title: "Direito à Saúde Mental", 
            description: "Redirecionamento do modelo assistencial em saúde mental, priorizando o tratamento em comunidade.", 
            category: "saude", 
            setor: "saude", 
            setorNome: "Saúde", 
            year: "2001", 
            number: "10.216/2001",
            externalLink: "http://www.planalto.gov.br/ccivil_03/leis/leis_2001/l10216.htm",
            officialSite: "https://www.gov.br/planalto"
        },
        { 
            id: 4, 
            title: "Lei Brasileira de Inclusão", 
            description: "Assegura e promove condições de igualdade e exercício dos direitos das pessoas com deficiência.", 
            category: "educacional", 
            setor: "educacao", 
            setorNome: "Educação", 
            year: "2015", 
            number: "13.146/2015",
            externalLink: "http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm",
            officialSite: "https://www.gov.br/planalto"
        },
        { 
            id: 5, 
            title: "Estatuto da Pessoa com Deficiência", 
            description: "Garante direitos fundamentais como educação, saúde, trabalho e acessibilidade.", 
            category: "educacional", 
            setor: "educacao", 
            setorNome: "Educação", 
            year: "2015", 
            number: "13.146/2015",
            externalLink: "http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm",
            officialSite: "https://www.gov.br/planalto"
        },
        { 
            id: 6, 
            title: "Lei de Diretrizes e Bases da Educação", 
            description: "Estabelece as diretrizes e bases da educação nacional, incluindo educação especial.", 
            category: "educacional", 
            setor: "educacao", 
            setorNome: "Educação", 
            year: "1996", 
            number: "9.394/1996",
            externalLink: "http://www.planalto.gov.br/ccivil_03/leis/l9394.htm",
            officialSite: "https://www.gov.br/planalto"
        },
        { 
            id: 7, 
            title: "Lei Romeo Mion", 
            description: "Cria a Carteira de Identificação da Pessoa com Transtorno do Espectro Autista (CIPTEA).", 
            category: "social", 
            setor: "social", 
            setorNome: "Social", 
            year: "2020", 
            number: "13.977/2020",
            externalLink: "http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/L13977.htm",
            officialSite: "https://www.gov.br/planalto"
        },
        { 
            id: 8, 
            title: "Benefício de Prestação Continuada (BPC)", 
            description: "Garante um salário mínimo mensal à pessoa com deficiência de baixa renda.", 
            category: "social", 
            setor: "social", 
            setorNome: "Social", 
            year: "1993", 
            number: "8.742/1993",
            externalLink: "http://www.planalto.gov.br/ccivil_03/leis/l8742.htm",
            officialSite: "https://www.gov.br/inss"
        },
        { 
            id: 9, 
            title: "Lei de Cotas para PCD", 
            description: "Reserva de vagas para pessoas com deficiência em empresas com mais de 100 funcionários.", 
            category: "social", 
            setor: "social", 
            setorNome: "Social", 
            year: "1991", 
            number: "8.213/1991",
            externalLink: "http://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm",
            officialSite: "https://www.gov.br/trabalho"
        },
        { 
            id: 10, 
            title: "Lei de Acessibilidade", 
            description: "Estabelece normas gerais e critérios básicos para promoção da acessibilidade.", 
            category: "acessibilidade", 
            setor: "acessibilidade", 
            setorNome: "Acessibilidade", 
            year: "2004", 
            number: "10.098/2004",
            externalLink: "http://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l10.098.htm",
            officialSite: "https://www.gov.br/mdh"
        },
        { 
            id: 11, 
            title: "Decreto de Acessibilidade", 
            description: "Regulamenta a acessibilidade em edificações, mobiliário e transporte.", 
            category: "acessibilidade", 
            setor: "acessibilidade", 
            setorNome: "Acessibilidade", 
            year: "2004", 
            number: "5.296/2004",
            externalLink: "http://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/decreto/d5296.htm",
            officialSite: "https://www.gov.br/mdh"
        },
        { 
            id: 12, 
            title: "Lei da Libras", 
            description: "Reconhece a Língua Brasileira de Sinais como meio legal de comunicação.", 
            category: "acessibilidade", 
            setor: "acessibilidade", 
            setorNome: "Acessibilidade", 
            year: "2002", 
            number: "10.436/2002",
            externalLink: "http://www.planalto.gov.br/ccivil_03/leis/2002/l10436.htm",
            officialSite: "https://www.gov.br/mdh"
        }
    ];

    let nextId = 13;
    let isLoading = false;
    let currentFilter = "Todas";
    let currentSearch = "";

    // Mapeamento de categorias
    const categoryMap = {
        "educacional": "Educacional",
        "social": "Social",
        "acessibilidade": "Acessibilidade",
        "saude": "Saúde"
    };

    // ============================================
    // FUNÇÕES AUXILIARES
    // ============================================
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showToast(message, type = 'info') {
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `custom-toast ${type}`;
        toast.setAttribute('role', 'alert');
        
        toast.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function openExternalLink(url, title) {
        if (url && url !== '#') {
            window.open(url, '_blank', 'noopener,noreferrer');
            showToast(`Abrindo: ${title}`, 'success');
        } else {
            showToast(`Link para ${title} será disponibilizado em breve`, 'info');
        }
    }

    function showLawDetails(law) {
        const modal = document.createElement('div');
        modal.className = 'resource-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        
        modal.innerHTML = `
            <div class="resource-modal-content law-modal">
                <div class="resource-modal-header">
                    <div class="icon-box-large"><i class="fa-solid fa-scale-balanced"></i></div>
                    <h2>${escapeHtml(law.title)}</h2>
                    <button class="modal-close" aria-label="Fechar detalhes"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="resource-modal-body">
                    <div class="law-badges">
                        <span class="law-badge category">${categoryMap[law.category] || law.category}</span>
                        <span class="law-badge setor">${law.setorNome}</span>
                        <span class="law-badge year">${law.year}</span>
                        <span class="law-badge number">Lei ${law.number}</span>
                    </div>
                    <p>${escapeHtml(law.description)}</p>
                    <div class="law-full-text">
                        <h4>Sobre esta lei</h4>
                        <p>A Lei ${law.number} é um marco importante na garantia de direitos para pessoas neurodivergentes. Clique no botão abaixo para acessar o texto completo no site oficial do Planalto.</p>
                    </div>
                </div>
                <div class="resource-modal-footer">
                    <button class="modal-action-btn primary" data-action="access" data-url="${law.externalLink || '#'}" data-title="${escapeHtml(law.title)}">
                        Ver Lei Completa no Planalto
                    </button>
                    <button class="modal-action-btn secondary" data-action="close">Fechar</button>
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
                const url = accessBtn.dataset.url;
                const title = accessBtn.dataset.title;
                openExternalLink(url, title);
            });
        }
        
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        
        const escHandler = (e) => {
            if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
        };
        document.addEventListener('keydown', escHandler);
    }

    // ============================================
    // RENDERIZAR LEIS
    // ============================================
    function renderLaws() {
        const cardsGrid = document.querySelector('.cards-grid');
        if (!cardsGrid) return;
        
        let filteredLaws = [...lawsDatabase];
        
        if (currentFilter !== "Todas") {
            filteredLaws = filteredLaws.filter(law => {
                const categoryName = categoryMap[law.category];
                return categoryName === currentFilter;
            });
        }
        
        if (currentSearch.trim() !== "") {
            const term = currentSearch.toLowerCase();
            filteredLaws = filteredLaws.filter(law =>
                law.title.toLowerCase().includes(term) ||
                law.description.toLowerCase().includes(term) ||
                law.number.toLowerCase().includes(term)
            );
        }
        
        if (filteredLaws.length === 0) {
            cardsGrid.innerHTML = `<div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                <h3>Nenhuma lei encontrada</h3><p>Tente usar outro termo ou filtro.</p></div>`;
            return;
        }
        
        cardsGrid.innerHTML = filteredLaws.map(law => `
            <div class="law-card" data-id="${law.id}">
                <span class="tag tag-${law.category}">${categoryMap[law.category]}</span>
                <h3>${escapeHtml(law.title)}</h3>
                <p>${escapeHtml(law.description)}</p>
                <div class="law-meta">
                    <span class="law-number">Lei ${law.number}</span>
                    <span class="law-year">${law.year}</span>
                    <span class="law-setor">${law.setorNome}</span>
                </div>
                <button class="law-details-btn" data-id="${law.id}">Ver detalhes →</button>
            </div>
        `).join('');
        
        document.querySelectorAll('.law-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const law = lawsDatabase.find(l => l.id === parseInt(btn.dataset.id));
                if (law) showLawDetails(law);
            });
        });
        
        document.querySelectorAll('.law-card').forEach(card => {
            card.addEventListener('click', () => {
                const law = lawsDatabase.find(l => l.id === parseInt(card.dataset.id));
                if (law) showLawDetails(law);
            });
        });
    }

    // ============================================
    // FILTROS DE PILLS
    // ============================================
    const pillButtons = document.querySelectorAll('.hero-rights .filter-pills .pill');
    if (pillButtons.length) {
        pillButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                pillButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.textContent.trim().replace(/[^\w\s]/g, '');
                renderLaws();
                showToast(currentFilter !== 'Todas' ? `Filtrando por: ${currentFilter}` : 'Mostrando todas as leis');
            });
        });
    }

    // ============================================
    // PESQUISA EM TEMPO REAL
    // ============================================
    const searchInput = document.querySelector('.hero-rights .search-container input');
    let searchDebounce;
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
                currentSearch = this.value;
                renderLaws();
                if (currentSearch.trim() !== '') showToast(`Buscando por: "${currentSearch}"`);
            }, 500);
        });
        
        const placeholders = ["Buscar leis...", "Ex: Lei Berenice Piana, LBI...", "Pesquise por número ou assunto..."];
        let phIndex = 0;
        setInterval(() => {
            if (!searchInput.matches(':focus')) {
                phIndex = (phIndex + 1) % placeholders.length;
                searchInput.placeholder = placeholders[phIndex];
            }
        }, 4000);
    }

    // ============================================
    // SCROLL INFINITO COM LEIS REAIS
    // ============================================
    function setupInfiniteScroll() {
        const cardsGrid = document.querySelector('.cards-grid');
        if (!cardsGrid) return;
        
        const sentinel = document.createElement('div');
        sentinel.className = 'scroll-sentinel';
        sentinel.innerHTML = '<div class="loading-spinner">⏳ Carregando mais leis...</div>';
        cardsGrid.insertAdjacentElement('afterend', sentinel);
        
        const observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && !isLoading) {
                isLoading = true;
                const spinner = sentinel.querySelector('.loading-spinner');
                if (spinner) spinner.style.display = 'block';
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const novasLeis = [
                    { id: nextId++, title: "Lei da Inclusão Profissional", description: "Estabelece quotas para pessoas com deficiência no mercado de trabalho.", category: "social", setor: "social", setorNome: "Social", year: "2016", number: "13.370/2016", externalLink: "http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2016/lei/l13370.htm", officialSite: "https://www.gov.br/planalto" },
                    { id: nextId++, title: "Lei da Educação Especial", description: "Diretrizes para a educação especial na perspectiva inclusiva.", category: "educacional", setor: "educacao", setorNome: "Educação", year: "2008", number: "11.788/2008", externalLink: "http://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11788.htm", officialSite: "https://www.gov.br/planalto" },
                    { id: nextId++, title: "Lei do Transporte Adaptado", description: "Obriga empresas de transporte a oferecer veículos adaptados.", category: "acessibilidade", setor: "acessibilidade", setorNome: "Acessibilidade", year: "2012", number: "12.587/2012", externalLink: "http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12587.htm", officialSite: "https://www.gov.br/planalto" }
                ];
                
                lawsDatabase.push(...novasLeis);
                renderLaws();
                
                if (spinner) spinner.style.display = 'none';
                isLoading = false;
            }
        }, { threshold: 0.1 });
        
        observer.observe(sentinel);
    }

    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    renderLaws();
    setupInfiniteScroll();

    console.log('Direitos inicializado!');
    console.log('   Sidebar responsiva');
    console.log('   Acessibilidade completa');
    console.log('   Filtros de pills');
    console.log('   Pesquisa em tempo real');
    console.log('   Scroll infinito');
    console.log('   Links externos para leis oficiais');
});