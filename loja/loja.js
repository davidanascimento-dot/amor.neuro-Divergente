document.addEventListener("DOMContentLoaded", () => {
    
    const body = document.body;
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");
    const searchInput = document.getElementById("productSearch");
    const productsGrid = document.getElementById("productsGrid");
    const noResults = document.getElementById("noResults");
    const productCounter = document.getElementById("productCounter");
    const loadingSpinner = document.getElementById("loadingSpinner");
    
    const btnAcessibilidade = document.getElementById('btnAcessibilidade');
    const menuAcessibilidade = document.getElementById('menuAcessibilidade');
    const closeAcessibilidade = document.getElementById('closeAcessibilidade');
    const accessBtns = document.querySelectorAll('.access-btn');

    let activeMarketplaceFilter = 'todos';
    let activeCategoryFilter = 'todos';
    let searchTimeout = null;
    let allCurrentResults = [];
    let renderedCount = 0;
    const PRODUCTS_PER_PAGE = 6;
    let isLoading = false;
    let currentQuery = '';

    // =========================================================================
    // 🧠 BANCO DE CONHECIMENTO - MAPEAMENTO INTELIGENTE
    // =========================================================================
    
    const synonymMap = {
        'aba': ['terapia aba', 'autismo', 'comportamento', 'fonoaudiologia', 'desenvolvimento'],
        'terapia': ['aba', 'ocupacional', 'fono', 'psicologia', 'tratamento', 'intervenção'],
        'fono': ['fonoaudiologia', 'fala', 'comunicação', 'linguagem', 'terapia'],
        'seletividade': ['alimentar', 'comida', 'textura', 'sensorial', 'prato', 'talher'],
        'alimentar': ['seletividade', 'comida', 'prato', 'talher', 'sensorial', 'textura'],
        'hiperfoco': ['foco', 'concentração', 'atenção', 'produtividade', 'tdah'],
        'meltdown': ['crise', 'regulação', 'calma', 'peso', 'compressão', 'cobertor'],
        'shutdown': ['silêncio', 'isolamento', 'fone', 'cancelamento ruído', 'óculos'],
        'ecolalia': ['repetição', 'fala', 'comunicação', 'terapia', 'fono'],
        'stimming': ['fidget', 'estimulação', 'movimento', 'repetitivo', 'mastigável'],
        'pe cs': ['comunicação', 'cartão', 'visual', 'figura', 'autismo', 'não verbal'],
    };

    const detailedProductDB = [
        // ===== SENSORIAL =====
        { keywords: ['manta peso', 'cobertor pesado', 'sensorial', 'ansiedade', 'autismo', 'tdah', 'meltdown', 'compressão', 'calma', 'sono', 'insônia'], title: 'Manta de Peso Sensorial Terapêutica 5kg - Alívio da Ansiedade', vendor: 'SensorPeso', rating: 5, ratingCount: 215, price: 'R$ 199,90', marketplace: 'amazon', category: 'sensorial', image: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&q=80&w=400', link: 'https://www.amazon.com.br/s?k=manta+peso+sensorial+autismo' },
        { keywords: ['colete compressão', 'colete sensorial', 'compressão', 'peso', 'acolhimento', 'meltdown', 'calma'], title: 'Colete de Compressão Sensorial para Autismo - Acolhimento e Calma', vendor: 'SensoryWear', rating: 4, ratingCount: 78, price: 'R$ 149,90', marketplace: 'shopee', category: 'sensorial', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400', link: 'https://shopee.com.br/search?keyword=colete+compressão+sensorial' },
        { keywords: ['fidget', 'stimming', 'cubo infinito', 'anti estresse', 'tdah', 'ansiedade', 'mão', 'dedo', 'inquietação'], title: 'Fidget Toy Cubo Infinito Anti Estresse para TDAH e Ansiedade', vendor: 'FidgetBrasil', rating: 4, ratingCount: 327, price: 'R$ 24,90', marketplace: 'shopee', category: 'foco-tdah', image: 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&q=80&w=400', link: 'https://shopee.com.br/search?keyword=fidget+cubo+infinito' },
        { keywords: ['massinha', 'slime', 'sensorial', 'criança', 'tátil', 'textura', 'amassar', 'stimming'], title: 'Kit Massinha Sensorial Terapêutica 12 Cores - Estimulação Tátil', vendor: 'KidsPlay', rating: 5, ratingCount: 198, price: 'R$ 34,90', marketplace: 'mercado-livre', category: 'sensorial', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400', link: 'https://lista.mercadolivre.com.br/massinha-sensorial' },
        { keywords: ['slime', 'meleca', 'geleca', 'sensorial', 'criança', 'tátil', 'stimming', 'anti estresse'], title: 'Kit Slime Sensorial 6 Unidades - Brinquedo Fidget Anti Estresse', vendor: 'SlimeFun', rating: 4, ratingCount: 176, price: 'R$ 29,90', marketplace: 'mercado-livre', category: 'sensorial', image: 'https://images.unsplash.com/photo-1600080972465-39d8f0b8477f?auto=format&fit=crop&q=80&w=400', link: 'https://lista.mercadolivre.com.br/kit-slime-sensorial' },
        { keywords: ['pulseira mastigável', 'mastigável', 'morder', 'stimming', 'sensorial', 'boca', 'dente', 'criança', 'adulto'], title: 'Pulseira Mastigável Sensorial Antiestresse - Crianças e Adultos', vendor: 'ChewyWear', rating: 5, ratingCount: 303, price: 'R$ 19,90', marketplace: 'shopee', category: 'sensorial', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400', link: 'https://shopee.com.br/search?keyword=pulseira+mastigavel+sensorial' },
        { keywords: ['colar mastigável', 'mastigável', 'morder', 'stimming', 'sensorial', 'adulto', 'discreto', 'colar'], title: 'Colar Mastigável Sensorial Discreto Adulto - Design Moderno', vendor: 'ChewyStyle', rating: 4, ratingCount: 194, price: 'R$ 35,90', marketplace: 'aliexpress', category: 'sensorial', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400', link: 'https://s.click.aliexpress.com/e/colar-mastigavel-sensorial' },
        { keywords: ['abajur', 'projetor', 'estrelas', 'luz', 'relaxamento', 'sono', 'sensorial', 'quarto', 'criança', 'calma', 'noite'], title: 'Projetor de Estrelas Giratório - Relaxamento Sensorial Noturno', vendor: 'StarLight', rating: 5, ratingCount: 532, price: 'R$ 79,90', marketplace: 'amazon', category: 'sensorial', image: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&q=80&w=400', link: 'https://www.amazon.com.br/s?k=projetor+estrelas+sensorial' },
        { keywords: ['cadeira balanço', 'balanço', 'sensorial', 'criança', 'autismo', 'movimento', 'vestibular'], title: 'Cadeira Balanço Sensorial Kids - Integração Vestibular Autismo', vendor: 'PlayBalance', rating: 5, ratingCount: 167, price: 'R$ 249,90', marketplace: 'shopee', category: 'sensorial', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=400', link: 'https://shopee.com.br/search?keyword=cadeira+balanço+sensorial+autismo' },
        { keywords: ['almofada', 'textura', 'sensorial', 'tátil', 'toque', 'casa', 'sofá', 'decoração'], title: 'Almofada Sensorial Texturizada para Estimulação Tátil', vendor: 'TextileArt', rating: 4, ratingCount: 131, price: 'R$ 45,90', marketplace: 'aliexpress', category: 'casa', image: 'https://images.unsplash.com/photo-1616628188503-1a3e4c2c5d7a?auto=format&fit=crop&q=80&w=400', link: 'https://s.click.aliexpress.com/e/almofada-sensorial-textura' },

        // ===== FOCO & TDAH =====
        { keywords: ['timer', 'visual', 'tempo', 'pomodoro', 'foco', 'tdah', 'gerenciamento', 'rotina', 'estudo'], title: 'Relógio Timer Visual 60min - Gerenciamento de Tempo TDAH', vendor: 'TimeManager', rating: 4, ratingCount: 283, price: 'R$ 39,90', marketplace: 'aliexpress', category: 'foco-tdah', image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80&w=400', link: 'https://s.click.aliexpress.com/e/timer-visual-tdah' },
        { keywords: ['fone', 'ouvido', 'cancelamento ruído', 'anc', 'silêncio', 'foco', 'tdah', 'autismo', 'shutdown', 'hipersensibilidade', 'som'], title: 'Fone de Ouvido Bluetooth Cancelamento de Ruído Ativo ANC', vendor: 'AudioPro', rating: 4, ratingCount: 456, price: 'R$ 149,90', marketplace: 'shopee', category: 'audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400', link: 'https://shopee.com.br/search?keyword=fone+cancelamento+ruido+anc' },
        { keywords: ['fone', 'abafador', 'ruído', 'criança', 'autismo', 'sensorial', 'ouvido', 'proteção', 'som alto'], title: 'Abafador de Ruído Infantil Protetor Auricular para Autismo', vendor: 'SafeEar', rating: 5, ratingCount: 189, price: 'R$ 59,90', marketplace: 'amazon', category: 'audio', image: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&q=80&w=400', link: 'https://www.amazon.com.br/s?k=abafador+ruido+autismo+infantil' },
        { keywords: ['planejador', 'semanal', 'bloco', 'notas', 'rotina', 'tdah', 'organização', 'checklist', 'mesa'], title: 'Planejador Semanal Bloco de Notas para Rotina TDAH', vendor: 'PlanPro', rating: 4, ratingCount: 167, price: 'R$ 27,90', marketplace: 'aliexpress', category: 'foco-tdah', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=400', link: 'https://s.click.aliexpress.com/e/planejador-semanal-tdah' },
        { keywords: ['bola', 'pilates', 'yoga', 'equilíbrio', 'foco', 'tdah', 'exercício', 'movimento', 'cadeira'], title: 'Bola de Pilates Yoga 65cm - Equilíbrio e Foco para TDAH', vendor: 'FitLife', rating: 4, ratingCount: 245, price: 'R$ 69,90', marketplace: 'mercado-livre', category: 'foco-tdah', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&q=80&w=400', link: 'https://lista.mercadolivre.com.br/bola-pilates-foco-tdah' },
        { keywords: ['relógio', 'despertador', 'vibratório', 'surdo', 'tdah', 'sono', 'vibração', 'acordar'], title: 'Relógio Despertador Vibratório para Surdos e TDAH', vendor: 'VibraWake', rating: 4, ratingCount: 145, price: 'R$ 89,90', marketplace: 'aliexpress', category: 'foco-tdah', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=400', link: 'https://s.click.aliexpress.com/e/relogio-vibratorio-tdah' },

        // ===== VESTUÁRIO =====
        { keywords: ['camiseta', 'orgulho', 'neurodivergente', 'frase', 'autismo', 'tdah', 'roupa', 'algodão'], title: 'Camiseta Algodão Orgulho Neurodivergente - Frases Motivacionais', vendor: 'NeuroStore', rating: 5, ratingCount: 142, price: 'R$ 49,90', marketplace: 'aliexpress', category: 'vestuario', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=400', link: 'https://s.click.aliexpress.com/e/camiseta-neurodivergente' },
        { keywords: ['colar', 'autismo', 'quebra-cabeça', 'consciência', 'joia', 'aço', 'pingente', 'símbolo'], title: 'Colar Autismo Consciência Quebra-Cabeça em Aço Inoxidável', vendor: 'colar de dAvid', rating: 5, ratingCount: 103, price: 'R$ 6,99', marketplace: 'aliexpress', category: 'vestuario', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400', link: 'https://s.click.aliexpress.com/e/colar-autismo-consciencia' },

        // ===== COMUNICAÇÃO =====
        { keywords: ['cartão', 'comunicação', 'pecs', 'visual', 'autismo', 'não verbal', 'fala', 'figura'], title: 'Kit Cartões de Comunicação PECS para Autismo - 200 Figuras', vendor: 'PECSCom', rating: 5, ratingCount: 278, price: 'R$ 79,90', marketplace: 'mercado-livre', category: 'livros', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400', link: 'https://lista.mercadolivre.com.br/cartoes-pecs-comunicacao-autismo' },

        // ===== ALIMENTAÇÃO =====
        { keywords: ['prato', 'divisória', 'seletividade', 'alimentar', 'comida', 'infantil', 'autismo', 'criança', 'refeição'], title: 'Prato com Divisórias para Seletividade Alimentar - Autismo', vendor: 'FoodFun', rating: 5, ratingCount: 312, price: 'R$ 34,90', marketplace: 'shopee', category: 'casa', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=400', link: 'https://shopee.com.br/search?keyword=prato+divisoria+seletividade+alimentar' },
    ];

    // =========================================================================
    // PRODUTOS INICIAIS (exibidos sem pesquisa)
    // =========================================================================
    const defaultProducts = [
        detailedProductDB[0],  // Manta de Peso
        detailedProductDB[2],  // Fidget Toy
        detailedProductDB[5],  // Pulseira Mastigável
        detailedProductDB[10], // Timer Visual
        detailedProductDB[11], // Fone ANC
        detailedProductDB[16], // Camiseta Neurodivergente
        detailedProductDB[7],  // Projetor Estrelas
        detailedProductDB[17], // Colar Autismo
        detailedProductDB[3],  // Massinha
        detailedProductDB[19], // Prato Divisória
        detailedProductDB[18], // PECS
        detailedProductDB[13], // Planejador Semanal
    ];

    // =========================================================================
    // RENDERIZAR PRODUTO
    // =========================================================================
    function createProductCard(product) {
        const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
        const marketplaceNames = { 'aliexpress': 'AliExpress', 'shopee': 'Shopee', 'mercado-livre': 'Mercado Livre', 'amazon': 'Amazon' };
        
        const card = document.createElement('article');
        card.className = 'product-card';
        if (product.isGenerated) card.classList.add('generated-product');
        card.setAttribute('data-title', product.title);
        card.setAttribute('data-marketplace', product.marketplace);
        card.setAttribute('data-category', product.category);
        card.style.animation = 'fadeIn 0.4s ease forwards';
        
        card.innerHTML = `
            <div class="product-image-area">
                <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
                <span class="marketplace-badge ${product.marketplace}">${marketplaceNames[product.marketplace] || product.marketplace}</span>
                ${product.isGenerated ? '<span class="generated-tag">🔍 Pesquisa web</span>' : ''}
                <button class="btn-wishlist" aria-label="Favorito"><i class="fa-regular fa-heart"></i></button>
            </div>
            <div class="product-info-area">
                <h4 class="product-title">${product.title}</h4>
                <div class="product-vendor">${product.vendor}</div>
                <div class="product-rating">${stars} <span class="rating-count">(${product.ratingCount})</span></div>
                <div class="product-price">${product.price}</div>
                <a href="${product.link}" target="_blank" rel="nofollow" class="btn-buy">↗ ${product.isGenerated ? 'Buscar na web' : 'Ver na ' + marketplaceNames[product.marketplace]}</a>
            </div>
        `;

        card.querySelector('.btn-wishlist').addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.className = this.classList.contains('active') ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
            icon.style.color = this.classList.contains('active') ? '#ef4444' : '';
        });

        return card;
    }

    // =========================================================================
    // 🧠 MOTOR DE BUSCA INTELIGENTE
    // =========================================================================
    function searchProducts(query) {
        const term = query.toLowerCase().trim();
        if (!term) return [];
        
        let expandedTerms = [term];
        for (const [key, synonyms] of Object.entries(synonymMap)) {
            if (term.includes(key)) {
                expandedTerms = [...expandedTerms, ...synonyms];
            }
        }
        expandedTerms = [...new Set(expandedTerms)];
        
        let results = detailedProductDB.filter(product => {
            const allKeywords = product.keywords.join(' ').toLowerCase();
            return expandedTerms.some(t => allKeywords.includes(t));
        });
        
        results = results.map(product => {
            const allKeywords = product.keywords.join(' ').toLowerCase();
            let score = 0;
            expandedTerms.forEach(t => {
                if (product.keywords.some(k => k === t)) score += 3;
                if (product.keywords.some(k => k.includes(t))) score += 2;
                if (allKeywords.includes(t)) score += 1;
            });
            return { ...product, score };
        });
        
        results.sort((a, b) => b.score - a.score);
        
        if (results.length < 6) {
            const generatedResults = generateAutomaticResults(term, 6 - results.length);
            results = [...results, ...generatedResults];
        }
        
        return results;
    }

    function generateAutomaticResults(query, count) {
        const results = [];
        const capitalizedQuery = query.charAt(0).toUpperCase() + query.slice(1);
        const marketplaces = ['amazon', 'shopee', 'mercado-livre', 'aliexpress'];
        const categories = ['sensorial', 'foco-tdah', 'criativo', 'livros', 'casa', 'vestuario'];
        const images = [
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&q=80&w=400',
        ];
        const suffixes = ['para Neurodivergentes', 'Sensorial e Terapêutico', 'Foco e Concentração', 'Regulação Emocional', 'Conforto e Bem-estar'];
        
        for (let i = 0; i < count; i++) {
            results.push({
                title: `${capitalizedQuery} - ${suffixes[i % suffixes.length]}`,
                vendor: 'Pesquisa Inteligente ND',
                rating: 4,
                ratingCount: Math.floor(Math.random() * 200) + 50,
                price: `R$ ${(Math.random() * 200 + 15).toFixed(2).replace('.', ',')}`,
                marketplace: marketplaces[i % 4],
                category: categories[i % 6],
                image: images[i % images.length],
                link: `https://www.google.com/search?q=${encodeURIComponent(query + ' ' + suffixes[i % suffixes.length] + ' comprar')}`,
                isGenerated: true,
                score: 1
            });
        }
        return results;
    }

    // =========================================================================
    // APLICAR FILTROS
    // =========================================================================
    function applyFiltersToResults(results) {
        let filtered = [...results];
        if (activeMarketplaceFilter !== 'todos') {
            filtered = filtered.filter(p => p.marketplace === activeMarketplaceFilter);
        }
        if (activeCategoryFilter !== 'todos') {
            filtered = filtered.filter(p => p.category === activeCategoryFilter);
        }
        return filtered;
    }

    // =========================================================================
    // RENDERIZAR LOTE INICIAL + SCROLL INFINITO
    // =========================================================================
    function renderInitialBatch() {
        productsGrid.innerHTML = '';
        renderedCount = 0;
        
        const filtered = applyFiltersToResults(allCurrentResults);
        
        if (filtered.length === 0 && currentQuery) {
            if (noResults) {
                noResults.innerHTML = `
                    <div style="text-align:center; padding:30px;">
                        <p style="font-size:1.2rem;">🔍 Nenhum resultado para "<strong>${currentQuery}</strong>"</p>
                        <p style="margin-top:12px; color:var(--text-muted);">Tente buscar por:</p>
                        <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:12px;">
                            <span class="search-hint">autismo</span><span class="search-hint">TDAH</span>
                            <span class="search-hint">sensorial</span><span class="search-hint">manta peso</span>
                            <span class="search-hint">fidget</span><span class="search-hint">timer</span>
                            <span class="search-hint">mastigável</span><span class="search-hint">seletividade alimentar</span>
                            <span class="search-hint">PECS</span><span class="search-hint">fone ruído</span>
                        </div>
                    </div>
                `;
                noResults.style.display = 'block';
            }
            return;
        }
        
        if (noResults) noResults.style.display = 'none';
        
        const batch = filtered.slice(0, PRODUCTS_PER_PAGE);
        batch.forEach(product => productsGrid.appendChild(createProductCard(product)));
        renderedCount = PRODUCTS_PER_PAGE;
        updateCounter(filtered.length);
    }

    function loadMoreProducts() {
        if (isLoading) return;
        
        const filtered = applyFiltersToResults(allCurrentResults);
        if (renderedCount >= filtered.length) return;
        
        isLoading = true;
        if (loadingSpinner) loadingSpinner.style.display = 'block';

        setTimeout(() => {
            const nextBatch = filtered.slice(renderedCount, renderedCount + PRODUCTS_PER_PAGE);
            nextBatch.forEach(product => productsGrid.appendChild(createProductCard(product)));
            renderedCount += PRODUCTS_PER_PAGE;
            isLoading = false;
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }, 500);
    }

    function updateCounter(total) {
        if (productCounter) {
            productCounter.textContent = total === 1 ? '1 produto encontrado' : `${total} produtos encontrados`;
        }
    }

    function handleScroll() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.documentElement.scrollHeight;
        
        if (scrollPosition >= pageHeight - 600 && !isLoading) {
            loadMoreProducts();
        }
    }

    // =========================================================================
    // ATUALIZA TUDO (BUSCA + FILTROS)
    // =========================================================================
    async function updateAll(query) {
        currentQuery = query;
        
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (query) {
            allCurrentResults = searchProducts(query);
        } else {
            allCurrentResults = [...defaultProducts];
        }
        
        renderInitialBatch();
        
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }

    // =========================================================================
    // EVENTOS DE BUSCA
    // =========================================================================
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            clearTimeout(searchTimeout);
            const query = searchInput.value.trim();
            
            searchTimeout = setTimeout(() => {
                updateAll(query);
            }, 400);
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('search-hint')) {
                searchInput.value = e.target.textContent;
                updateAll(e.target.textContent);
                searchInput.focus();
            }
        });
    }

    // =========================================================================
    // FILTROS
    // =========================================================================
    document.querySelectorAll('.filter-row').forEach((container, index) => {
        container.querySelectorAll('.pill-btn').forEach(pill => {
            pill.addEventListener('click', function() {
                container.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                if (index === 0) activeMarketplaceFilter = filter;
                if (index === 1) activeCategoryFilter = filter;
                
                updateAll(currentQuery);
            });
        });
    });

    // =========================================================================
    // SCROLL INFINITO
    // =========================================================================
    window.addEventListener('scroll', handleScroll);

    // =========================================================================
    // SIDEBAR
    // =========================================================================
    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            if (window.innerWidth <= 768) sidebar.classList.toggle("active");
            else sidebar.classList.toggle("collapsed");
        });
    }

    // =========================================================================
    // ACESSIBILIDADE (COMPACTA)
    // =========================================================================
    if (btnAcessibilidade && menuAcessibilidade) {
        btnAcessibilidade.addEventListener('click', (e) => {
            e.stopPropagation();
            menuAcessibilidade.classList.toggle('active');
        });
        closeAcessibilidade?.addEventListener('click', () => menuAcessibilidade.classList.remove('active'));
        document.addEventListener('click', (e) => {
            if (!menuAcessibilidade.contains(e.target) && e.target !== btnAcessibilidade) {
                menuAcessibilidade.classList.remove('active');
            }
        });
    }

    function getA11ySetting(key, d) { return localStorage.getItem(`a11y_${key}`) || d; }
    function setA11ySetting(key, v) { localStorage.setItem(`a11y_${key}`, v); }

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
            const t = btn.querySelector('span')?.textContent.trim().toLowerCase() || '';
            btn.style.background=''; btn.style.border=''; btn.style.color='';
            const icon=btn.querySelector('i'); if(icon) icon.style.color='#8b5cf6';
            let active=false;
            if(t.includes('escurecer')&&getA11ySetting('darkMode','false')==='true') active=true;
            if(t.includes('alto')&&getA11ySetting('highContrast','false')==='true') active=true;
            if(t.includes('maior')&&getA11ySetting('textSize','normal')==='large') active=true;
            if(t.includes('menor')&&getA11ySetting('textSize','normal')==='small') active=true;
            if(t.includes('espaçamento')&&getA11ySetting('spacing','false')==='true') active=true;
            if(t.includes('links')&&getA11ySetting('highlightLinks','false')==='true') active=true;
            if(t.includes('saturação')&&getA11ySetting('saturation','false')==='true') active=true;
            if(t.includes('dislexia')&&getA11ySetting('dyslexia','false')==='true') active=true;
            if(t.includes('reset')&&getA11ySetting('grayscale','false')==='true') active=true;
            if(active){ btn.style.background='#8b5cf6'; btn.style.border='2px solid #8b5cf6'; btn.style.color='#ffffff'; if(icon) icon.style.color='#ffffff'; }
        });
    }

    function resetAllSettings() {
        ['darkMode','highContrast','textSize','spacing','highlightLinks','saturation','grayscale','dyslexia'].forEach(k=>localStorage.removeItem(`a11y_${k}`));
        body.classList.remove('a11y-dark-mode','a11y-high-contrast','a11y-large-text','a11y-small-text','a11y-spacing','a11y-highlight-links','a11y-saturation','a11y-grayscale','a11y-dyslexia');
        accessBtns.forEach(btn=>{ btn.style.background=''; btn.style.border=''; btn.style.color=''; const icon=btn.querySelector('i'); if(icon) icon.style.color='#8b5cf6'; });
    }

    accessBtns.forEach(btn=>{
        btn.addEventListener('click',()=>{
            const t=btn.querySelector('span')?.textContent.trim().toLowerCase() || '';
            if(t.includes('reset')){ resetAllSettings(); return; }
            if(t.includes('escurecer')){ const c=getA11ySetting('darkMode','false'); setA11ySetting('darkMode',c==='true'?'false':'true'); }
            else if(t.includes('alto')){ const c=getA11ySetting('highContrast','false'); setA11ySetting('highContrast',c==='true'?'false':'true'); }
            else if(t.includes('maior')){ const c=getA11ySetting('textSize','normal'); setA11ySetting('textSize',c==='large'?'normal':'large'); }
            else if(t.includes('menor')){ const c=getA11ySetting('textSize','normal'); setA11ySetting('textSize',c==='small'?'normal':'small'); }
            else if(t.includes('espaçamento')){ const c=getA11ySetting('spacing','false'); setA11ySetting('spacing',c==='true'?'false':'true'); }
            else if(t.includes('links')){ const c=getA11ySetting('highlightLinks','false'); setA11ySetting('highlightLinks',c==='true'?'false':'true'); }
            else if(t.includes('saturação')){ const c=getA11ySetting('saturation','false'); setA11ySetting('saturation',c==='true'?'false':'true'); }
            else if(t.includes('dislexia')){ const c=getA11ySetting('dyslexia','false'); setA11ySetting('dyslexia',c==='true'?'false':'true'); }
            applyAllA11ySettings(); updateButtonStates();
        });
    });

    applyAllA11ySettings();
    updateButtonStates();

    // =========================================================================
    // INICIALIZAÇÃO - MOSTRA PRODUTOS NA LOJA
    // =========================================================================
    updateAll('');
    console.log('🛍️ Loja ND - Completa!');
    console.log('   📦 12 produtos iniciais na vitrine');
    console.log('   🔍 Busca inteligente com sinônimos');
    console.log('   📜 Scroll infinito ao rolar a página');
    console.log('   🎯 Filtros por marketplace e categoria');
    console.log('   ♿ Acessibilidade completa');
});