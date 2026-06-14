document.addEventListener("DOMContentLoaded", () => {
    
    // Auxiliar para detectar telas mobile/tablet
    const isMobile = () => window.innerWidth <= 768;
    const body = document.body;

    /* ==========================================================================
       1. GERENCIAMENTO DA SIDEBAR RESPONSIVA (MENU LATERAL)
       ========================================================================== */
    const sidebar = document.getElementById("sidebar") || document.querySelector(".sidebar");
    const sidebarToggleBtn = document.querySelector("#sidebar-toggle-btn, .sidebar-toggle");

    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay && sidebar) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    function toggleSidebar() {
        if (!sidebar) return;

        if (isMobile()) {
            sidebar.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        } else {
            sidebar.classList.toggle('collapsed');
        }
    }

    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            if (isMobile() && sidebar && sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        });
    }

    document.addEventListener("click", (e) => {
        if (isMobile() && sidebar && sidebar.classList.contains("active")) {
            if (!sidebar.contains(e.target) && e.target !== sidebarToggleBtn && !sidebarToggleBtn?.contains(e.target)) {
                sidebar.classList.remove("active");
                if (overlay) overlay.classList.remove("active");
                document.body.style.overflow = '';
            }
        }
    });

    window.addEventListener('resize', () => {
        if (!sidebar) return;
        if (!isMobile()) {
            sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            sidebar.classList.remove('collapsed');
        }
    });

    /* ==========================================================================
       2. CONTROLADOR DO DROPDOWN / MEGA-MENU (RECURSOS)
       ========================================================================== */
    const dropdownToggle = document.querySelector("#dropdown-btn, .dropdown-toggle");
    const dropdownContainer = document.getElementById("recursos-dropdown");

    if (dropdownToggle && dropdownContainer) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdownContainer.classList.toggle('show');
            dropdownContainer.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target) && e.target !== dropdownToggle && !dropdownToggle.contains(e.target)) {
                dropdownContainer.classList.remove('active');
                dropdownContainer.classList.remove('show');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdownContainer.classList.remove('active');
                dropdownContainer.classList.remove('show');
            }
        });
    }

    /* ==========================================================================
       3. MENU DE ACESSIBILIDADE (ABRIR/FECHAR)
       ========================================================================== */
    const btnAcessibilidade = document.getElementById('btnAcessibilidade');
    const menuAcessibilidade = document.getElementById('menuAcessibilidade');
    const closeAcessibilidade = document.getElementById('closeAcessibilidade');

    if (btnAcessibilidade && menuAcessibilidade) {
        btnAcessibilidade.addEventListener('click', (e) => {
            e.stopPropagation();
            menuAcessibilidade.classList.toggle('active');
            const isOpen = menuAcessibilidade.classList.contains('active');
            btnAcessibilidade.setAttribute('aria-expanded', isOpen);
        });

        if (closeAcessibilidade) {
            closeAcessibilidade.addEventListener('click', () => {
                menuAcessibilidade.classList.remove('active');
                btnAcessibilidade.setAttribute('aria-expanded', 'false');
            });
        }

        document.addEventListener('click', (e) => {
            if (!menuAcessibilidade.contains(e.target) && e.target !== btnAcessibilidade && !btnAcessibilidade?.contains(e.target)) {
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

    /* ==========================================================================
       4. LÓGICA DOS BOTÕES DE ACESSIBILIDADE - CORRIGIDA
       ========================================================================== */
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
            const spanText = btn.querySelector('span')?.textContent.trim().toLowerCase() || '';
            
            btn.style.background = '';
            btn.style.border = '';
            btn.style.color = '';
            
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.color = '#8b5cf6';
            }
            
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
            }
            // Alto Contraste
            else if (spanText.includes('alto contraste')) {
                const current = getA11ySetting('highContrast', 'false');
                setA11ySetting('highContrast', current === 'true' ? 'false' : 'true');
            }
            // Aumentar Texto
            else if (spanText.includes('aumentar texto')) {
                const currentSize = getA11ySetting('textSize', 'normal');
                setA11ySetting('textSize', currentSize === 'large' ? 'normal' : 'large');
            }
            // Diminuir Texto
            else if (spanText.includes('diminuir texto')) {
                const currentSize = getA11ySetting('textSize', 'normal');
                setA11ySetting('textSize', currentSize === 'small' ? 'normal' : 'small');
            }
            // Espaçamento
            else if (spanText.includes('espaçamento')) {
                const current = getA11ySetting('spacing', 'false');
                setA11ySetting('spacing', current === 'true' ? 'false' : 'true');
            }
            // Destacar Links
            else if (spanText.includes('destacar links')) {
                const current = getA11ySetting('highlightLinks', 'false');
                setA11ySetting('highlightLinks', current === 'true' ? 'false' : 'true');
            }
            // Saturação
            else if (spanText.includes('saturação')) {
                const current = getA11ySetting('saturation', 'false');
                setA11ySetting('saturation', current === 'true' ? 'false' : 'true');
            }
            // Fonte Dislexia
            else if (spanText.includes('fonte dislexia')) {
                const current = getA11ySetting('dyslexia', 'false');
                setA11ySetting('dyslexia', current === 'true' ? 'false' : 'true');
            }

            applyAllA11ySettings();
            updateButtonStates();
            
            // Feedback visual
            let message = '';
            if (spanText.includes('modo escuro')) message = getA11ySetting('darkMode', 'false') === 'true' ? '🌙 Modo escuro ativado' : '☀️ Modo claro ativado';
            else if (spanText.includes('alto contraste')) message = getA11ySetting('highContrast', 'false') === 'true' ? '🎨 Alto contraste ativado' : '🎨 Alto contraste desativado';
            else if (spanText.includes('aumentar texto')) message = '🔍 Texto aumentado';
            else if (spanText.includes('diminuir texto')) message = '🔍 Texto diminuído';
            else if (spanText.includes('espaçamento')) message = getA11ySetting('spacing', 'false') === 'true' ? '📏 Espaçamento aumentado' : '📏 Espaçamento normal';
            else if (spanText.includes('destacar links')) message = '🔗 Links destacados';
            else if (spanText.includes('saturação')) message = '🎨 Saturação ajustada';
            else if (spanText.includes('fonte dislexia')) message = '🔤 Fonte para dislexia ativada';
            else if (spanText.includes('reset')) message = '🔄 Configurações resetadas';
            
            if (message) showToast(message, 'info');
        });
    });

    applyAllA11ySettings();
    updateButtonStates();

    /* ==========================================================================
       5. SISTEMA DE TOAST (NOTIFICAÇÕES)
       ========================================================================== */
    const toastMsg = document.getElementById('toastMsg');
    
    function showToast(message, type = 'info', duration = 2500) {
        if (!toastMsg) return;
        
        toastMsg.textContent = message;
        toastMsg.className = `toast-msg-custom ${type}`;
        toastMsg.style.opacity = '1';
        
        setTimeout(() => {
            toastMsg.style.opacity = '0';
        }, duration);
    }

    /* ==========================================================================
       6. BANCO DE DADOS DA COMUNIDADE
       ========================================================================== */
    
    let posts = [
        {
            id: 1,
            author: "TonyEsterco",
            authorAvatar: "/img/avatar-1776703979307.png",
            tag: "# Geral",
            content: "Bem-vindes à nossa comunidade! 💜 Aqui é um espaço seguro para todes.",
            likes: 2,
            likedByUser: false,
            comments: [],
            date: new Date().toISOString()
        },
        {
            id: 2,
            author: "david",
            authorAvatar: "",
            authorInitial: "D",
            tag: "# Apoio",
            content: "Olá pessoal! Alguém tem dicas para lidar com sobrecarga sensorial?",
            likes: 5,
            likedByUser: false,
            comments: [
                { author: "Maria", content: "Tente usar fones com ruído branco! Me ajudou muito.", date: new Date().toISOString() },
                { author: "João", content: "Técnicas de respiração profunda também funcionam.", date: new Date().toISOString() }
            ],
            date: new Date().toISOString()
        }
    ];

    let nextPostId = 3;

    let groups = [
        {
            id: 1,
            name: "Grupo de Apoio para Pais de Autistas",
            description: "Um espaço para compartilhar experiências e desafios da parentalidade atípica.",
            members: 156,
            category: "Apoio",
            userJoined: false,
            chatHistory: [
                { author: "Sistema", message: "Bem-vindo ao grupo! Compartilhe suas experiências.", isSystem: true, time: new Date().toISOString() },
                { author: "Maria", message: "Olá pessoal! Alguém mais está começando agora nessa jornada?", isSystem: false, time: new Date(Date.now() - 3600000).toISOString() }
            ]
        },
        {
            id: 2,
            name: "TDAH Adultos - Estratégias e Rotina",
            description: "Dicas e trocas de experiências sobre gestão do TDAH no dia a dia.",
            members: 89,
            category: "TDAH",
            userJoined: false,
            chatHistory: [
                { author: "Sistema", message: "Dicas e estratégias para o dia a dia!", isSystem: true, time: new Date().toISOString() },
                { author: "João", message: "Alguém usa aplicativos de organização? Recomendações?", isSystem: false, time: new Date(Date.now() - 7200000).toISOString() }
            ]
        }
    ];

    let events = [
        {
            id: 1,
            title: "Encontro de Apoio - Pais de Autistas",
            description: "Discussão sobre estratégias para lidar com desafios diários.",
            date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
            meetLink: "https://meet.google.com/abc-defg-hij",
            participants: 23,
            category: "Apoio",
            userConfirmed: false
        },
        {
            id: 2,
            title: "TDAH: Organização e Produtividade",
            description: "Workshop sobre técnicas de organização para adultos com TDAH.",
            date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
            meetLink: "https://meet.google.com/klm-nopq-rst",
            participants: 45,
            category: "TDAH",
            userConfirmed: false
        }
    ];

    let userGroups = [];
    let currentChatGroup = null;

    /* ==========================================================================
       7. FUNÇÕES AUXILIARES
       ========================================================================== */
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function formatChatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function formatEventDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    /* ==========================================================================
       8. RENDERIZAR POSTS
       ========================================================================== */
    
    function renderPosts() {
        const postsGrid = document.getElementById('postsGrid');
        if (!postsGrid) return;

        postsGrid.innerHTML = posts.map(post => `
            <article class="post-card" data-post-id="${post.id}">
                <div>
                    <div class="post-header">
                        <div class="post-author">
                            ${post.authorAvatar ? 
                                `<img src="${post.authorAvatar}" alt="Avatar de ${post.author}" class="post-author-img">` :
                                `<div class="post-author-img" style="background-color:#f59e0b; display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:bold;">${post.authorInitial || post.author.charAt(0).toUpperCase()}</div>`
                            }
                            <span class="post-author-name">${escapeHtml(post.author)}</span>
                        </div>
                        <button class="btn-report" data-post-id="${post.id}" aria-label="Denunciar publicação"><i class="fa-solid fa-flag"></i></button>
                    </div>
                    <span class="post-tag">${escapeHtml(post.tag)}</span>
                    <p class="post-text">${escapeHtml(post.content)}</p>
                    <div class="post-date">${formatDate(post.date)}</div>
                </div>
                <div class="post-footer">
                    <button class="action-btn like-btn ${post.likedByUser ? 'liked' : ''}" data-post-id="${post.id}">
                        <i class="fa-regular fa-heart"></i> <span class="count">${post.likes}</span>
                    </button>
                    <button class="action-btn comment-toggle-btn" data-post-id="${post.id}">
                        <i class="fa-regular fa-comment"></i> <span>${post.comments.length}</span>
                    </button>
                </div>
                <div class="comments-section" id="comments-${post.id}" style="display: none;">
                    <div class="comments-list">
                        ${post.comments.map(comment => `
                            <div class="comment-item">
                                <strong>${escapeHtml(comment.author)}</strong>
                                <p>${escapeHtml(comment.content)}</p>
                                <small>${formatDate(comment.date)}</small>
                            </div>
                        `).join('')}
                    </div>
                    <div class="add-comment">
                        <input type="text" placeholder="Escreva um comentário..." id="comment-input-${post.id}">
                        <button class="submit-comment-btn" data-post-id="${post.id}">Enviar</button>
                    </div>
                </div>
            </article>
        `).join('');

        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.dataset.postId);
                const post = posts.find(p => p.id === postId);
                if (post) {
                    if (post.likedByUser) {
                        post.likes--;
                        post.likedByUser = false;
                        showToast('Você removeu sua curtida!', 'info');
                    } else {
                        post.likes++;
                        post.likedByUser = true;
                        showToast('Você curtiu este post!', 'success');
                    }
                    renderPosts();
                }
            });
        });

        document.querySelectorAll('.comment-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.dataset.postId);
                const commentsDiv = document.getElementById(`comments-${postId}`);
                if (commentsDiv) {
                    commentsDiv.style.display = commentsDiv.style.display === 'none' ? 'block' : 'none';
                }
            });
        });

        document.querySelectorAll('.submit-comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.dataset.postId);
                const input = document.getElementById(`comment-input-${postId}`);
                const commentText = input?.value.trim();
                
                if (commentText) {
                    const post = posts.find(p => p.id === postId);
                    if (post) {
                        post.comments.push({
                            author: "Você",
                            content: commentText,
                            date: new Date().toISOString()
                        });
                        input.value = '';
                        renderPosts();
                        showToast('Comentário adicionado!', 'success');
                    }
                } else {
                    showToast('Digite um comentário antes de enviar.', 'error');
                }
            });
        });

        document.querySelectorAll('.btn-report').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showToast('Publicação denunciada. Nossa equipe irá analisar.', 'info');
            });
        });
    }

    /* ==========================================================================
       9. RENDERIZAR GRUPOS
       ========================================================================== */
    
    function renderGroups() {
        const groupsGrid = document.getElementById('groupsGrid');
        if (!groupsGrid) return;

        groupsGrid.innerHTML = groups.map(group => `
            <div class="group-card-custom" data-group-id="${group.id}">
                <div class="group-icon"><i class="fa-solid fa-users"></i></div>
                <div class="group-info">
                    <h4>${escapeHtml(group.name)}</h4>
                    <p>${escapeHtml(group.description)}</p>
                    <div class="group-meta">
                        <span><i class="fa-regular fa-user"></i> ${group.members} membros</span>
                        <span class="group-category">${escapeHtml(group.category)}</span>
                    </div>
                </div>
                <button class="group-join-btn ${group.userJoined ? 'joined' : ''}" data-group-id="${group.id}">
                    <i class="fa-solid ${group.userJoined ? 'fa-check' : 'fa-plus'}"></i> ${group.userJoined ? 'Participando' : 'Participar'}
                </button>
            </div>
        `).join('');

        document.querySelectorAll('.group-join-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const groupId = parseInt(btn.dataset.groupId);
                const group = groups.find(g => g.id === groupId);
                if (group) {
                    if (group.userJoined) {
                        group.userJoined = false;
                        group.members--;
                        const index = userGroups.findIndex(g => g.id === group.id);
                        if (index !== -1) userGroups.splice(index, 1);
                        if (currentChatGroup === group.id) {
                            currentChatGroup = null;
                        }
                        showToast(`🚪 Você saiu do grupo "${group.name}"`, 'info');
                    } else {
                        group.userJoined = true;
                        group.members++;
                        userGroups.push({
                            id: group.id,
                            name: group.name,
                            chatHistory: JSON.parse(JSON.stringify(group.chatHistory || []))
                        });
                        showToast(`✨ Você entrou no grupo "${group.name}"!`, 'success');
                    }
                    renderGroups();
                    renderUserGroupsChat();
                }
            });
        });
    }

    /* ==========================================================================
       10. RENDERIZAR EVENTOS
       ========================================================================== */
    
    function renderEvents() {
        const eventsGrid = document.getElementById('eventsGrid');
        if (!eventsGrid) return;

        eventsGrid.innerHTML = events.map(event => `
            <div class="event-card-custom" data-event-id="${event.id}">
                <div class="event-date-badge">
                    <span class="event-day">${new Date(event.date).getDate()}</span>
                    <span class="event-month">${new Date(event.date).toLocaleString('pt-BR', { month: 'short' })}</span>
                </div>
                <div class="event-info">
                    <h4>${escapeHtml(event.title)}</h4>
                    <p>${escapeHtml(event.description)}</p>
                    <div class="event-meta">
                        <span><i class="fa-regular fa-calendar"></i> ${formatEventDate(event.date)}</span>
                        <span><i class="fa-regular fa-user"></i> ${event.participants} participantes</span>
                    </div>
                </div>
                <button class="event-join-btn ${event.userConfirmed ? 'confirmed' : ''}" data-event-id="${event.id}" data-meet-link="${event.meetLink}">
                    <i class="fa-solid ${event.userConfirmed ? 'fa-check-circle' : 'fa-google'}"></i> ${event.userConfirmed ? 'Confirmado' : 'Participar'}
                </button>
            </div>
        `).join('');

        document.querySelectorAll('.event-join-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = parseInt(btn.dataset.eventId);
                const meetLink = btn.dataset.meetLink;
                const event = events.find(e => e.id === eventId);
                
                if (event) {
                    if (event.userConfirmed) {
                        showToast(`ℹ️ Você já está confirmado no evento "${event.title}"`, 'info');
                    } else {
                        event.userConfirmed = true;
                        event.participants++;
                        renderEvents();
                        showToast(`✅ Presença confirmada em "${event.title}"!`, 'success');
                        if (meetLink && meetLink !== '#') {
                            setTimeout(() => {
                                window.open(meetLink, '_blank');
                            }, 1000);
                        }
                    }
                }
            });
        });
    }

    /* ==========================================================================
       11. SISTEMA DE CHAT (COM SELEÇÃO DE GRUPO)
       ========================================================================== */
    
    function renderUserGroupsChat() {
        const groupsListContainer = document.getElementById('groupsListContainer');
        const chatMessagesContainer = document.getElementById('chatMessages');
        
        if (!groupsListContainer) return;
        
        if (userGroups.length === 0) {
            groupsListContainer.innerHTML = `
                <div class="no-groups-message">
                    <i class="fa-solid fa-comments"></i>
                    <p>Você ainda não entrou em nenhum grupo.</p>
                    <p>Vá até a aba <strong>Grupos</strong> e participe de uma conversa!</p>
                </div>
            `;
            if (chatMessagesContainer) {
                chatMessagesContainer.innerHTML = `
                    <div class="chat-placeholder">
                        <i class="fa-solid fa-users"></i>
                        <p>Selecione um grupo para começar a conversar</p>
                    </div>
                `;
            }
            return;
        }
        
        groupsListContainer.innerHTML = userGroups.map(group => `
            <div class="group-chat-item ${currentChatGroup === group.id ? 'active' : ''}" data-group-id="${group.id}">
                <div class="group-chat-avatar">
                    <i class="fa-solid fa-users"></i>
                </div>
                <div class="group-chat-info">
                    <h4>${escapeHtml(group.name)}</h4>
                    <p>${currentChatGroup === group.id ? 'Conversa ativa' : 'Clique para conversar'}</p>
                </div>
            </div>
        `).join('');
        
        document.querySelectorAll('.group-chat-item').forEach(item => {
            item.addEventListener('click', () => {
                const groupId = parseInt(item.dataset.groupId);
                const group = userGroups.find(g => g.id === groupId);
                if (group) {
                    currentChatGroup = group.id;
                    renderUserGroupsChat();
                    loadChatForGroup(group);
                }
            });
        });
        
        if (currentChatGroup) {
            const selectedGroup = userGroups.find(g => g.id === currentChatGroup);
            if (selectedGroup) {
                loadChatForGroup(selectedGroup);
            } else if (userGroups.length > 0) {
                currentChatGroup = userGroups[0].id;
                loadChatForGroup(userGroups[0]);
                renderUserGroupsChat();
            }
        } else if (userGroups.length > 0) {
            currentChatGroup = userGroups[0].id;
            loadChatForGroup(userGroups[0]);
            renderUserGroupsChat();
        }
    }
    
    function loadChatForGroup(group) {
        const chatMessagesContainer = document.getElementById('chatMessages');
        if (!chatMessagesContainer) return;
        
        const originalGroup = groups.find(g => g.id === group.id);
        const chatHistory = originalGroup?.chatHistory || group.chatHistory || [];
        
        if (chatHistory.length === 0) {
            chatMessagesContainer.innerHTML = `
                <div class="chat-welcome">
                    <i class="fa-solid fa-comment-dots"></i>
                    <p>Seja bem-vindo ao ${escapeHtml(group.name)}!</p>
                    <p>Envie a primeira mensagem para iniciar a conversa.</p>
                </div>
            `;
            return;
        }
        
        chatMessagesContainer.innerHTML = chatHistory.map(msg => `
            <div class="chat-message ${msg.author === 'Você' ? 'sent' : 'received'} ${msg.isSystem ? 'system' : ''}">
                ${msg.author !== 'Você' && !msg.isSystem ? `<div class="message-avatar">${msg.author.charAt(0)}</div>` : ''}
                <div class="message-content">
                    ${!msg.isSystem ? `<div class="message-author">${escapeHtml(msg.author)}</div>` : ''}
                    <div class="message-text">${escapeHtml(msg.message)}</div>
                    <div class="message-time">${formatChatTime(msg.time)}</div>
                </div>
            </div>
        `).join('');
        
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
    
    function sendGroupMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        if (!message) {
            showToast('Digite uma mensagem antes de enviar', 'error');
            return;
        }
        
        if (!currentChatGroup) {
            showToast('Selecione um grupo para enviar mensagem', 'error');
            return;
        }
        
        const group = userGroups.find(g => g.id === currentChatGroup);
        if (!group) {
            showToast('Grupo não encontrado', 'error');
            return;
        }
        
        const originalGroup = groups.find(g => g.id === group.id);
        
        const newMessage = {
            author: "Você",
            message: message,
            isSystem: false,
            time: new Date().toISOString()
        };
        
        if (originalGroup) {
            if (!originalGroup.chatHistory) originalGroup.chatHistory = [];
            originalGroup.chatHistory.push(newMessage);
            group.chatHistory = originalGroup.chatHistory;
        } else {
            if (!group.chatHistory) group.chatHistory = [];
            group.chatHistory.push(newMessage);
        }
        
        chatInput.value = '';
        loadChatForGroup(group);
        
        setTimeout(() => {
            const autores = ["Maria", "João", "Ana", "Pedro", "Carla"];
            const respostas = [
                "Que legal! Obrigado por compartilhar!",
                "Interessante ponto de vista!",
                "Isso é muito importante para a comunidade.",
                "Concordo plenamente com você!",
                "Você tem razão, é algo que todos deveriam saber.",
                "Adorei sua mensagem! Continue participando!",
                "Obrigado pela contribuição!"
            ];
            
            const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
            const autorAleatorio = autores[Math.floor(Math.random() * autores.length)];
            
            const respostaMessage = {
                author: autorAleatorio,
                message: respostaAleatoria,
                isSystem: false,
                time: new Date().toISOString()
            };
            
            if (originalGroup) {
                originalGroup.chatHistory.push(respostaMessage);
                group.chatHistory = originalGroup.chatHistory;
            } else {
                group.chatHistory.push(respostaMessage);
            }
            
            loadChatForGroup(group);
        }, 1000);
    }

    function setupChatEvents() {
        const sendChatBtn = document.getElementById('sendChatBtn');
        const chatInput = document.getElementById('chatInput');
        
        if (sendChatBtn) {
            const newSendBtn = sendChatBtn.cloneNode(true);
            sendChatBtn.parentNode.replaceChild(newSendBtn, sendChatBtn);
            newSendBtn.addEventListener('click', sendGroupMessage);
        }
        
        if (chatInput) {
            const newChatInput = chatInput.cloneNode(true);
            chatInput.parentNode.replaceChild(newChatInput, chatInput);
            newChatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendGroupMessage();
                }
            });
        }
    }

    /* ==========================================================================
       12. SISTEMA DE ABAS
       ========================================================================== */
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeContent = document.getElementById(`tab-${tabId}`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
        
        const activeBtn = Array.from(tabBtns).find(btn => btn.dataset.tab === tabId);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        if (tabId === 'grupos') {
            renderGroups();
        } else if (tabId === 'eventos') {
            renderEvents();
        } else if (tabId === 'forum') {
            renderPosts();
        } else if (tabId === 'conversa') {
            renderUserGroupsChat();
            setupChatEvents();
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            if (tabId) {
                switchTab(tabId);
            }
        });
    });

    /* ==========================================================================
       13. MODAL DE CRIAÇÃO DE POSTS
       ========================================================================== */
    
    const postModal = document.getElementById("postModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const submitPostBtn = document.getElementById("submitPostBtn");
    const postContentInput = document.getElementById("postContentInput");

    function abrirModal() {
        if (postModal) {
            postModal.classList.add("active");
            postModal.style.display = "flex";
            if (postContentInput) postContentInput.focus();
        }
    }

    function fecharModal() {
        if (postModal) {
            postModal.classList.remove("active");
            postModal.style.display = "none";
            if (postContentInput) postContentInput.value = ""; 
        }
    }

    if (openModalBtn) openModalBtn.addEventListener("click", abrirModal);
    if (closeModalBtn) closeModalBtn.addEventListener("click", fecharModal);

    window.addEventListener("click", (e) => {
        if (e.target === postModal) {
            fecharModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && postModal && postModal.classList.contains('active')) {
            fecharModal();
        }
    });

    function createNewPost(content) {
        if (!content.trim()) {
            showToast('⚠️ Por favor, digite algo antes de postar!', 'error');
            return false;
        }

        const newPost = {
            id: nextPostId++,
            author: "Você",
            authorAvatar: "",
            authorInitial: "V",
            tag: "# Nova discussão",
            content: content,
            likes: 0,
            likedByUser: false,
            comments: [],
            date: new Date().toISOString()
        };

        posts.unshift(newPost);
        renderPosts();
        showToast('✨ Post publicado com sucesso!', 'success');
        return true;
    }

    if (submitPostBtn && postContentInput) {
        submitPostBtn.addEventListener("click", () => {
            const textoPost = postContentInput.value.trim();
            if (createNewPost(textoPost)) {
                fecharModal();
            }
        });
    }

    /* ==========================================================================
       14. BOTÕES ADICIONAIS
       ========================================================================== */
    
    const btnJoin = document.querySelector('.btn-join');
    if (btnJoin) {
        btnJoin.addEventListener('click', () => {
            showToast('👋 Seja bem-vindo(a) à nossa comunidade!', 'success');
        });
    }

    const btnIaChat = document.querySelector('.btn-ia-chat');
    if (btnIaChat) {
        btnIaChat.addEventListener('click', () => {
            showToast('🤖 AcolherIA está pronta para te ajudar!', 'info');
            setTimeout(() => {
                window.location.href = '/chat-Ia/chat-Ia.html';
            }, 1000);
        });
    }

    const btnPromoAction = document.querySelector('.btn-promo-action');
    if (btnPromoAction) {
        btnPromoAction.addEventListener('click', () => {
            showToast('🎉 Participe da nossa comunidade! Faça login ou crie sua conta.', 'success');
        });
    }

    /* ==========================================================================
       15. INICIALIZAÇÃO
       ========================================================================== */
    
    renderPosts();
    renderGroups();
    renderEvents();
    switchTab('forum');

    console.log('🚀 Comunidade Amor NeuroDivergente inicializada com sucesso!');
    console.log('   ✅ Curtir/Descurtir posts');
    console.log('   ✅ Participar de grupos');
    console.log('   ✅ Participar de eventos');
    console.log('   ✅ Chat com seleção de grupos');
    console.log('   ✅ Acessibilidade: Modo Escuro, Alto Contraste, Texto, Espaçamento, Links, Saturação, Fonte Dislexia');
});