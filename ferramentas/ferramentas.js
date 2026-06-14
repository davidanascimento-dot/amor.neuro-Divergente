document.addEventListener('DOMContentLoaded', function() {
    
    const body = document.body;

    // =============================================
    // SIDEBAR MOBILE TOGGLE
    // =============================================
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (menuToggle && sidebar && sidebarOverlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // =============================================
    // ACESSIBILIDADE (PADRÃO DO PROJETO)
    // =============================================
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
            if (!menuAcessibilidade.contains(e.target) && e.target !== btnAcessibilidade) {
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

    // =============================================
    // TAB SYSTEM
    // =============================================
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContents = document.querySelectorAll('.tab-content');

    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetTab = trigger.getAttribute('data-tab');

            tabTriggers.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            trigger.classList.add('active');
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // =============================================
    // TIMER VISUAL (TAB 1)
    // =============================================
    const timerDigits = document.getElementById('timerDigits');
    const btnTimerStart = document.getElementById('btnTimerStart');
    const btnTimerReset = document.getElementById('btnTimerReset');
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    let timerInterval = null;
    let timeLeft = 25 * 60;
    let isRunning = false;
    let currentMinutes = 25;

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        if (timerDigits) {
            timerDigits.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    function setTimerPreset(minutes) {
        if (isRunning) pauseTimer();
        currentMinutes = minutes;
        timeLeft = minutes * 60;
        updateTimerDisplay();
        
        presetButtons.forEach(btn => {
            const btnMinutes = parseInt(btn.getAttribute('data-minutes'));
            btn.classList.toggle('active', btnMinutes === minutes);
        });
        
        if (btnTimerStart) {
            btnTimerStart.innerHTML = '<i class="fa-solid fa-play"></i> Iniciar';
            btnTimerStart.classList.remove('pause');
        }
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        if (btnTimerStart) {
            btnTimerStart.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar';
            btnTimerStart.classList.add('pause');
        }
        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                if (btnTimerStart) {
                    btnTimerStart.innerHTML = '<i class="fa-solid fa-play"></i> Iniciar';
                    btnTimerStart.classList.remove('pause');
                }
                if (timerDigits) timerDigits.textContent = '00:00';
                playTimerSound();
                if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
                setTimeout(() => {
                    timeLeft = currentMinutes * 60;
                    updateTimerDisplay();
                }, 2000);
                return;
            }
            timeLeft--;
            updateTimerDisplay();
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        if (btnTimerStart) {
            btnTimerStart.innerHTML = '<i class="fa-solid fa-play"></i> Continuar';
            btnTimerStart.classList.remove('pause');
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        timeLeft = currentMinutes * 60;
        updateTimerDisplay();
        if (btnTimerStart) {
            btnTimerStart.innerHTML = '<i class="fa-solid fa-play"></i> Iniciar';
            btnTimerStart.classList.remove('pause');
        }
    }

    function playTimerSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.3;
            oscillator.start();
            setTimeout(() => { oscillator.stop(); audioContext.close(); }, 300);
        } catch (e) {}
    }

    if (btnTimerStart) btnTimerStart.addEventListener('click', () => isRunning ? pauseTimer() : startTimer());
    if (btnTimerReset) btnTimerReset.addEventListener('click', resetTimer);
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => setTimerPreset(parseInt(btn.getAttribute('data-minutes'))));
    });
    updateTimerDisplay();

    // =============================================
    // SAFE SPACE CHECKLIST (TAB 2)
    // =============================================
    const checklistItems = [
        { id: 1, text: 'Chaves', icon: '🔑' },
        { id: 2, text: 'Celular', icon: '📱' },
        { id: 3, text: 'Carteira', icon: '👛' },
        { id: 4, text: 'Fones de ouvido', icon: '🎧' },
        { id: 5, text: 'Garrafa de água', icon: '💧' },
        { id: 6, text: 'Lanches/ snacks', icon: '🍎' },
        { id: 7, text: 'Medicamentos', icon: '💊' },
        { id: 8, text: 'Óculos de sol', icon: '🕶️' },
        { id: 9, text: 'Carregador portátil', icon: '🔋' },
        { id: 10, text: 'Objeto sensorial/ fidget', icon: '🧸' },
        { id: 11, text: 'Documento de identidade', icon: '🪪' },
        { id: 12, text: 'Máscara (se necessário)', icon: '😷' },
        { id: 13, text: 'Guarda-chuva', icon: '☂️' },
        { id: 14, text: 'Caderno/ planner', icon: '📓' },
        { id: 15, text: 'Capa de chuva', icon: '🧥' },
        { id: 16, text: 'Protetor solar', icon: '☀️' },
        { id: 17, text: 'Cartão de transporte', icon: '🚌' },
        { id: 18, text: 'Lenços de papel', icon: '🤧' }
    ];

    const checklistContainer = document.getElementById('checklistContainer');
    const progressBar = document.getElementById('progressBar');
    const progressCount = document.getElementById('progressCount');

    function createChecklistItemElement(itemData, isCustom = false) {
        const itemRow = document.createElement('div');
        itemRow.className = 'checklist-item';
        itemRow.setAttribute('data-id', itemData.id);
        const checked = isCustom ? itemData.checked : isChecked(itemData.id);
        if (checked) itemRow.classList.add('completed');
        itemRow.innerHTML = `
            <div class="item-left">
                <input type="checkbox" class="checklist-checkbox" ${checked ? 'checked' : ''}>
                <span class="checklist-icon">${itemData.icon || '📋'}</span>
                <span class="checklist-text">${itemData.text}</span>
            </div>
            <button class="delete-btn" aria-label="Remover item"><i class="fa-solid fa-trash-can"></i></button>
        `;
        const checkbox = itemRow.querySelector('.checklist-checkbox');
        checkbox.addEventListener('change', () => {
            itemRow.classList.toggle('completed', checkbox.checked);
            if (!isCustom) toggleChecklistItem(itemData.id, checkbox.checked);
            updateProgress();
            if (getCheckedCount() === checklistItems.length) celebrateCompletion();
        });
        const deleteBtn = itemRow.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            itemRow.remove();
            if (!isCustom) removeChecklistItem(itemData.id);
            updateProgress();
        });
        return itemRow;
    }

    function renderChecklist() {
        if (!checklistContainer) return;
        checklistContainer.innerHTML = '';
        checklistItems.forEach(item => {
            checklistContainer.appendChild(createChecklistItemElement(item, false));
        });
        updateProgress();
    }

    function isChecked(id) {
        try { return JSON.parse(localStorage.getItem('safeSpaceChecklist') || '[]').includes(id); } catch { return false; }
    }

    function toggleChecklistItem(id, checked) {
        try {
            let saved = JSON.parse(localStorage.getItem('safeSpaceChecklist') || '[]');
            if (checked) { if (!saved.includes(id)) saved.push(id); }
            else { saved = saved.filter(item => item !== id); }
            localStorage.setItem('safeSpaceChecklist', JSON.stringify(saved));
        } catch (e) {}
    }

    function removeChecklistItem(id) {
        try {
            let saved = JSON.parse(localStorage.getItem('safeSpaceChecklist') || '[]');
            saved = saved.filter(item => item !== id);
            localStorage.setItem('safeSpaceChecklist', JSON.stringify(saved));
        } catch (e) {}
    }

    function getCheckedCount() {
        return checklistContainer ? checklistContainer.querySelectorAll('.checklist-checkbox:checked').length : 0;
    }

    function updateProgress() {
        const checked = getCheckedCount();
        const total = checklistItems.length;
        if (progressBar) progressBar.style.width = ((checked / total) * 100) + '%';
        if (progressCount) progressCount.textContent = `${checked}/${total}`;
    }

    function celebrateCompletion() {
        const confetti = document.createElement('div');
        confetti.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:48px;z-index:9999;pointer-events:none;';
        confetti.textContent = '🎉✨';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    }

    const newItemInput = document.getElementById('newItemInput');
    const addItemBtn = document.getElementById('addItemBtn');
    let customItemCounter = 1000;

    if (addItemBtn && newItemInput) {
        addItemBtn.addEventListener('click', () => {
            const text = newItemInput.value.trim();
            if (text !== '') {
                const customItem = { id: customItemCounter++, text: text, icon: '📋', checked: false };
                checklistContainer.appendChild(createChecklistItemElement(customItem, true));
                newItemInput.value = '';
                updateProgress();
            }
        });
        newItemInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addItemBtn.click(); });
    }

    function checkAndResetDaily() {
        const lastReset = localStorage.getItem('checklistLastReset');
        const today = new Date().toDateString();
        if (lastReset !== today) {
            localStorage.setItem('safeSpaceChecklist', '[]');
            localStorage.setItem('checklistLastReset', today);
            renderChecklist();
        }
    }

    checkAndResetDaily();
    renderChecklist();

    // =============================================
    // DIÁRIO SENSORIAL (TAB 3)
    // =============================================
    const moodButtons = document.querySelectorAll('.mood-btn');
    const energySlider = document.getElementById('energySlider');
    const energyDisplay = document.getElementById('energyDisplay');
    const stimuliButtons = document.querySelectorAll('.stimuli-btn');
    const sensoryNotes = document.getElementById('sensoryNotes');
    const btnSaveSensory = document.getElementById('btnSaveSensory');
    
    if (energySlider && energyDisplay) {
        energySlider.addEventListener('input', (e) => { energyDisplay.textContent = `${e.target.value}/5`; });
    }
    
    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            moodButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    stimuliButtons.forEach(btn => {
        btn.addEventListener('click', () => { btn.classList.toggle('active'); });
    });
    
    if (btnSaveSensory) {
        btnSaveSensory.addEventListener('click', () => {
            const activeMood = document.querySelector('.mood-btn.active');
            const mood = activeMood ? activeMood.getAttribute('data-mood') : 'Neutro';
            const energy = energySlider ? energySlider.value : 3;
            const selectedStimuli = Array.from(document.querySelectorAll('.stimuli-btn.active')).map(btn => btn.getAttribute('data-stimulus'));
            const notes = sensoryNotes ? sensoryNotes.value : '';
            saveSensoryEntry({ date: new Date().toISOString(), mood, energy, stimuli: selectedStimuli, notes });
            showNotification('Entrada sensorial registrada com sucesso! ✅');
            if (sensoryNotes) sensoryNotes.value = '';
        });
    }
    
    function saveSensoryEntry(data) {
        try {
            let entries = JSON.parse(localStorage.getItem('sensoryDiary') || '[]');
            entries.push(data);
            if (entries.length > 30) entries = entries.slice(-30);
            localStorage.setItem('sensoryDiary', JSON.stringify(entries));
        } catch (e) {}
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = 'position:fixed;top:20px;right:20px;background:var(--primary);color:white;padding:12px 24px;border-radius:12px;z-index:9999;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // =============================================
    // KEYBOARD NAVIGATION
    // =============================================
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && document.activeElement === btnTimerStart) {
            e.preventDefault();
            btnTimerStart.click();
        }
        if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey && 
            document.getElementById('tab-timer') && 
            document.getElementById('tab-timer').classList.contains('active')) {
            e.preventDefault();
            resetTimer();
        }
    });

    // =============================================
    // RESPONSIVE HANDLER
    // =============================================
    function handleResize() {
        if (window.innerWidth > 1024) {
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
    window.addEventListener('resize', handleResize);

    // =============================================
    // INICIALIZAÇÃO
    // =============================================
    console.log('✨ Central de Planejamento Visual - Amor NeuroDivergente');
    console.log('🚀 Todas as ferramentas carregadas com sucesso!');
    console.log('📋 Funcionalidades ativas:');
    console.log('  - Timer Visual com presets e som');
    console.log('  - Checklist Safe Space com itens personalizáveis');
    console.log('  - Diário Sensorial completo');
    console.log('  - Menu de Acessibilidade com 9 opções');
    console.log('  - Cards Informativos');
    console.log('  - Sidebar responsiva');
    console.log('  - Persistência de dados via localStorage');
});