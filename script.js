document.addEventListener('DOMContentLoaded', () => {
    const mainBoard = document.getElementById('main-board');
    const addCardBtn = document.getElementById('add-card-btn');
    const cardTemplate = document.getElementById('card-template');

    const GRID_SIZE = 20;
    let activeCard = null;
    let action = null;
    let activeTextPopup = null;
    
    // --- VARIÁVEIS PARA PAN COM CTRL ---
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;
    let currentPanX = 0;
    let currentPanY = 0;
    let isCtrlPressed = false;
    
    // --- VARIÁVEIS PARA ZOOM ---
    let currentZoom = 1;
    const MIN_ZOOM = 0.3;
    const MAX_ZOOM = 3;
    const ZOOM_SPEED = 0.1;
    
    // --- VARIÁVEIS PARA ESTILO DE CARDS ---
    let currentCardStyle = 'default'; // default, glass, modern
    let currentProjectName = 'Projeto Sem Nome';
    
    // --- VARIÁVEIS PARA TEMA DE FUNDO ---
    let currentTheme = 'default'; // default, particles, light, dark, neon, synthwave

    // --- SALVAR E CARREGAR ---
    const saveCards = () => {
        const cardsData = [];
        document.querySelectorAll('.card').forEach(card => {
            cardsData.push({
                id: card.dataset.id,
                left: card.style.left,
                top: card.style.top,
                width: card.style.width,
                height: card.style.height,
                title: card.querySelector('.card-title').innerHTML,
                content: card.querySelector('.card-content').innerHTML,
                color: card.dataset.color || 'default',
                style: card.dataset.style || 'default'
            });
        });
        const projectData = {
            cards: cardsData,
            projectName: currentProjectName,
            currentCardStyle: currentCardStyle,
            currentTheme: currentTheme,
            panX: currentPanX,
            panY: currentPanY,
            zoom: currentZoom
        };
        localStorage.setItem('dashboardCards', JSON.stringify(projectData));
    };

    const loadCards = () => {
        const savedData = JSON.parse(localStorage.getItem('dashboardCards'));
        if (!savedData) return;
        
        // Compatibilidade com versão antiga (array direto)
        if (Array.isArray(savedData)) {
            savedData.forEach(data => createCard(data));
            return;
        }
        
        // Nova versão (objeto com projeto)
        if (savedData.cards) {
            savedData.cards.forEach(data => createCard(data));
        }
        if (savedData.projectName) {
            currentProjectName = savedData.projectName;
        }
        if (savedData.currentCardStyle) {
            currentCardStyle = savedData.currentCardStyle;
            updateStyleIndicator();
        }
        if (savedData.currentTheme) {
            currentTheme = savedData.currentTheme;
            applyTheme(currentTheme, true); // true = não salva novamente
        }
        if (savedData.panX !== undefined) {
            currentPanX = savedData.panX;
            currentPanY = savedData.panY;
            currentZoom = savedData.zoom || 1;
            updateTransform();
        }
    };

    // --- CRIAÇÃO E LÓGICA DO CARD ---
    const createCard = (data = {}) => {
        const cardNode = cardTemplate.content.cloneNode(true);
        const newCard = cardNode.querySelector('.card');
        const cardContent = newCard.querySelector('.card-content');

        newCard.dataset.id = data.id || `card-${Date.now()}`;
        newCard.style.left = data.left || `${GRID_SIZE}px`;
        newCard.style.top = data.top || `${GRID_SIZE}px`;
        newCard.style.width = data.width || '240px';
        newCard.style.height = data.height || '200px';
        newCard.querySelector('.card-title').innerHTML = data.title || 'TÍTULO';
        
        // Aplica o estilo do card
        const cardStyle = data.style || currentCardStyle;
        newCard.dataset.style = cardStyle;
        applyCardStyle(newCard, cardStyle);
        
        applyColor(newCard, data.color || 'default');

        if(data.content) {
            cardContent.innerHTML = data.content;
        }
        
        mainBoard.appendChild(newCard);
        attachCardEvents(newCard);
    };
    
    const applyCardStyle = (card, style) => {
        // Remove todos os estilos anteriores
        card.classList.remove('card-style-default', 'card-style-glass', 'card-style-modern');
        
        // Aplica o novo estilo
        if (style !== 'default') {
            card.classList.add(`card-style-${style}`);
        }
        
        card.dataset.style = style;
    };
    
    const applyColor = (card, color) => {
        card.className = card.className.replace(/card-color-\w+/g, '');
        if (color !== 'default') {
            card.classList.add(`card-color-${color}`);
        }
        card.dataset.color = color;
    };

    const addChecklistItem = (contentDiv) => {
        const item = document.createElement('div');
        item.className = 'checklist-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const label = document.createElement('span');
        label.className = 'checklist-item-label';
        label.contentEditable = true;
        label.innerText = 'Novo item';
        
        // --- NOVO BOTÃO DE DELETAR ---
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-checklist-item-btn';
        deleteBtn.innerHTML = '&times;'; // Símbolo 'x'
        deleteBtn.title = 'Excluir item';
        
        deleteBtn.addEventListener('click', () => {
            item.remove(); // Remove a linha inteira do checklist
            saveCards(); // Salva a alteração
        });
        // --- FIM DO NOVO BOTÃO ---

        checkbox.addEventListener('change', () => {
            label.classList.toggle('completed', checkbox.checked);
            saveCards();
        });
        label.addEventListener('blur', saveCards);
        
        item.appendChild(checkbox);
        item.appendChild(label);
        item.appendChild(deleteBtn); // Adiciona o botão ao item
        contentDiv.appendChild(item);
        
        label.focus();
        saveCards();
    };
    
    // --- FUNÇÃO ATUALIZADA PARA RE-ANEXAR TODOS OS EVENTOS DE CONTEÚDO ---
    const reattachContentEvents = (card) => {
        card.querySelectorAll('.checklist-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const label = item.querySelector('.checklist-item-label');
            const deleteBtn = item.querySelector('.delete-checklist-item-btn');
            
            // Evita adicionar múltiplos listeners
            if (item.dataset.eventsAttached) return;

            checkbox.addEventListener('change', () => {
                label.classList.toggle('completed', checkbox.checked);
                saveCards();
            });

            label.addEventListener('blur', saveCards);

            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    item.remove();
                    saveCards();
                });
            }
            
            item.dataset.eventsAttached = true;
        });
    };

    // --- GERENCIADOR DE EVENTOS PRINCIPAL ---
    const attachCardEvents = (card) => {
        const cardContent = card.querySelector('.card-content');
        const textFormatBtn = card.querySelector('.text-format-btn');
        const textFormatPopup = card.querySelector('.text-format-popup');

        card.querySelector('.delete-btn').addEventListener('click', () => {
            card.remove();
            saveCards();
            if (activeTextPopup === textFormatPopup) {
                activeTextPopup.classList.remove('open');
                activeTextPopup = null;
            }
        });

        card.querySelectorAll('[contenteditable="true"]').forEach(el => {
            el.addEventListener('blur', saveCards);
        });

        card.querySelector('.add-checkbox-btn').addEventListener('click', () => {
            addChecklistItem(cardContent);
        });

        card.querySelector('.card-colors').addEventListener('click', (e) => {
            if (e.target.classList.contains('color-dot')) {
                const color = e.target.dataset.color;
                applyColor(card, color);
                saveCards();
            }
        });
        
        textFormatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeTextPopup && activeTextPopup !== textFormatPopup) {
                activeTextPopup.classList.remove('open');
            }
            textFormatPopup.classList.toggle('open');
            activeTextPopup = textFormatPopup.classList.contains('open') ? textFormatPopup : null;
        });

        textFormatPopup.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const target = e.target.closest('button, .color-dot');
            if (!target) return;

            if (target.dataset.command) {
                document.execCommand(target.dataset.command, false, null);
            } else if (target.dataset.color) {
                document.execCommand('foreColor', false, target.dataset.color);
            }
        });

        cardContent.addEventListener('click', (e) => {
            if (e.target === cardContent && cardContent.innerHTML.trim() === '') {
                cardContent.innerHTML = '';
                const p = document.createElement('p');
                p.contentEditable = true;
                cardContent.appendChild(p);
                p.focus();
            }
        });
        
        card.querySelector('.drag-handle').addEventListener('mousedown', (e) => startAction(e, card, 'drag'));
        card.querySelector('.resize-handle').addEventListener('mousedown', (e) => startAction(e, card, 'resize'));
        
        reattachContentEvents(card); // Função com novo nome e nova responsabilidade
    };

    // --- LÓGICA DE DRAG, RESIZE E AÇÕES GLOBAIS ---
    let offsetX, offsetY;
    let initialCardLeft, initialCardTop;

    const startAction = (e, card, actionType) => {
        if (e.target.closest('[contenteditable="true"]')) { return; }
        e.preventDefault();
        activeCard = card;
        action = actionType;

        if (action === 'drag') {
            card.classList.add('dragging');
            // Armazena a posição inicial do card
            initialCardLeft = parseFloat(card.style.left) || 0;
            initialCardTop = parseFloat(card.style.top) || 0;
            
            // Calcula o offset considerando o zoom
            const rect = card.getBoundingClientRect();
            const boardRect = mainBoard.getBoundingClientRect();
            offsetX = (e.clientX - rect.left) / currentZoom;
            offsetY = (e.clientY - rect.top) / currentZoom;
        } else {
            e.stopPropagation();
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopAction, { once: true });
    };

    const onMouseMove = (e) => {
        if (!activeCard) return;
        if (action === 'drag') {
            // Converte a posição do mouse para coordenadas do mainBoard considerando zoom e pan
            const boardRect = mainBoard.getBoundingClientRect();
            const mouseXInBoard = (e.clientX - boardRect.left) / currentZoom;
            const mouseYInBoard = (e.clientY - boardRect.top) / currentZoom;
            
            // Calcula a nova posição do card
            let newX = mouseXInBoard - offsetX;
            let newY = mouseYInBoard - offsetY;
            
            activeCard.style.left = `${newX}px`;
            activeCard.style.top = `${newY}px`;
        } else if (action === 'resize') {
            const rect = activeCard.getBoundingClientRect();
            const boardRect = mainBoard.getBoundingClientRect();
            
            // Calcula o tamanho considerando o zoom
            let newWidth = (e.clientX - rect.left) / currentZoom;
            let newHeight = (e.clientY - rect.top) / currentZoom;
            
            // Aplica tamanho mínimo
            newWidth = Math.max(200, newWidth);
            newHeight = Math.max(150, newHeight);
            
            activeCard.style.width = `${newWidth}px`;
            activeCard.style.height = `${newHeight}px`;
        }
    };

    const stopAction = () => {
        if (!activeCard) return;

        if (action === 'drag') {
            activeCard.classList.remove('dragging');
            // Mantém posição suave sem snap
        } else if (action === 'resize') {
            // Snap to grid no redimensionamento
            const currentWidth = parseFloat(activeCard.style.width);
            const currentHeight = parseFloat(activeCard.style.height);
            
            const snappedWidth = Math.round(currentWidth / GRID_SIZE) * GRID_SIZE;
            const snappedHeight = Math.round(currentHeight / GRID_SIZE) * GRID_SIZE;
            
            activeCard.style.width = `${snappedWidth}px`;
            activeCard.style.height = `${snappedHeight}px`;
        }
        
        activeCard = null;
        document.removeEventListener('mousemove', onMouseMove);
        saveCards();
    };

    document.addEventListener('click', (e) => {
        if (activeTextPopup && !activeTextPopup.contains(e.target) && !e.target.closest('.text-format-btn')) {
            activeTextPopup.classList.remove('open');
            activeTextPopup = null;
        }
    });

    // --- CONTROLE DE DROPDOWNS (CLICK) ---
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.navbar-btn');
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Fecha todos os outros dropdowns
            dropdowns.forEach(other => {
                if (other !== dropdown) {
                    other.classList.remove('open');
                }
            });
            
            // Toggle do dropdown atual
            dropdown.classList.toggle('open');
        });
    });
    
    // Fecha dropdowns ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }
    });
    
    // Fecha dropdown após selecionar uma opção
    document.querySelectorAll('.dropdown-content button').forEach(btn => {
        btn.addEventListener('click', () => {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        });
    });

    // --- FUNÇÕES DE MENU ---
    const updateStyleIndicator = () => {
        const indicator = document.getElementById('current-style-indicator');
        const styleNames = {
            'default': 'Default',
            'glass': 'Glass',
            'modern': 'Modern'
        };
        indicator.innerHTML = `Estilo: <strong>${styleNames[currentCardStyle]}</strong>`;
    };
    
    // Seletores de estilo
    document.querySelectorAll('.style-selector').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCardStyle = btn.dataset.style;
            updateStyleIndicator();
            saveCards();
        });
    });
    
    // Novo Projeto
    document.getElementById('new-project-btn').addEventListener('click', () => {
        if (confirm('Criar um novo projeto? Dados não salvos serão perdidos.')) {
            document.querySelectorAll('.card').forEach(card => card.remove());
            currentPanX = 0;
            currentPanY = 0;
            currentZoom = 1;
            updateTransform();
            currentProjectName = 'Projeto Sem Nome';
            saveCards();
        }
    });
    
    // Salvar Projeto
    document.getElementById('save-project-btn').addEventListener('click', () => {
        saveCards();
        alert('✅ Projeto salvo com sucesso!');
    });
    
    // Salvar Como
    document.getElementById('save-as-project-btn').addEventListener('click', () => {
        const newName = prompt('Nome do projeto:', currentProjectName);
        if (newName) {
            currentProjectName = newName;
            saveCards();
            alert(`✅ Projeto "${newName}" salvo com sucesso!`);
        }
    });
    
    // Exportar JSON
    document.getElementById('export-json-btn').addEventListener('click', () => {
        const projectData = JSON.parse(localStorage.getItem('dashboardCards'));
        const dataStr = JSON.stringify(projectData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentProjectName.replace(/\s/g, '_')}.json`;
        link.click();
        URL.revokeObjectURL(url);
        alert('✅ Projeto exportado com sucesso!');
    });
    
    // Importar JSON
    const fileInput = document.getElementById('file-input');
    document.getElementById('import-json-btn').addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const projectData = JSON.parse(event.target.result);
                localStorage.setItem('dashboardCards', JSON.stringify(projectData));
                location.reload();
            } catch (error) {
                alert('❌ Erro ao importar arquivo. Verifique se é um JSON válido.');
            }
        };
        reader.readAsText(file);
    });
    
    // Abrir Projeto (mesmo que importar)
    document.getElementById('open-project-btn').addEventListener('click', () => {
        fileInput.click();
    });
    
    // --- SISTEMA DE TEMAS DE FUNDO ---
    const updateThemeIndicator = () => {
        const indicator = document.getElementById('current-theme-indicator');
        const themeNames = {
            'default': 'Padrão',
            'particles': 'Partículas Verdes',
            'light': 'Claro',
            'dark': 'Escuro Profundo',
            'darkfog': 'Dark Fog',
            'neon': 'Neon',
            'synthwave': 'Synthwave'
        };
        indicator.innerHTML = `Tema: <strong>${themeNames[currentTheme]}</strong>`;
    };
    
    const applyTheme = (theme, skipSave = false) => {
        // Remove todos os temas
        document.body.classList.remove('theme-particles', 'theme-light', 'theme-dark', 'theme-darkfog', 'theme-neon', 'theme-synthwave');
        
        // Aplica o novo tema
        if (theme !== 'default') {
            document.body.classList.add(`theme-${theme}`);
        }
        
        currentTheme = theme;
        updateThemeIndicator();
        
        // Para animações anteriores
        stopParticles();
        stopFog();
        stopSmoke();
        
        // Inicia animação do tema
        if (theme === 'particles') {
            initParticles();
        } else if (theme === 'darkfog') {
            initFog();
        } else if (theme === 'dark') {
            initSmoke();
        }
        
        if (!skipSave) {
            saveCards();
        }
    };
    
    // Seletores de tema
    document.querySelectorAll('.theme-selector').forEach(btn => {
        btn.addEventListener('click', () => {
            applyTheme(btn.dataset.theme);
        });
    });
    
    // --- SISTEMA DE PARTÍCULAS VERDES ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.glowIntensity = Math.random() * 0.5 + 0.5;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Reposiciona se sair da tela
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
            
            // Efeito pulsante
            this.glowIntensity += Math.random() * 0.05 - 0.025;
            this.glowIntensity = Math.max(0.3, Math.min(1, this.glowIntensity));
        }
        
        draw() {
            ctx.beginPath();
            
            // Brilho externo
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 4
            );
            gradient.addColorStop(0, `rgba(34, 197, 94, ${this.opacity * this.glowIntensity})`);
            gradient.addColorStop(0.4, `rgba(34, 197, 94, ${this.opacity * 0.5 * this.glowIntensity})`);
            gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
            
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Núcleo brilhante
            ctx.beginPath();
            ctx.fillStyle = `rgba(134, 239, 172, ${this.opacity * this.glowIntensity})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    const initParticles = () => {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
        animateParticles();
    };
    
    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Conectar partículas próximas
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        animationId = requestAnimationFrame(animateParticles);
    };
    
    const stopParticles = () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = [];
    };
    
    // --- SISTEMA DE NÉVOA INTERATIVA (DARK FOG) ---
    const fogCanvas = document.getElementById('fog-canvas');
    const fogCtx = fogCanvas.getContext('2d');
    let fogClouds = [];
    let fogAnimationId = null;
    let mouseX = 0;
    let mouseY = 0;
    
    fogCanvas.width = window.innerWidth;
    fogCanvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        fogCanvas.width = window.innerWidth;
        fogCanvas.height = window.innerHeight;
    });
    
    // Rastreamento do mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    class FogCloud {
        constructor() {
            this.x = Math.random() * fogCanvas.width;
            this.y = Math.random() * fogCanvas.height;
            this.radius = Math.random() * 150 + 100;
            this.baseSpeedX = (Math.random() - 0.5) * 0.3;
            this.baseSpeedY = (Math.random() - 0.5) * 0.3;
            this.speedX = this.baseSpeedX;
            this.speedY = this.baseSpeedY;
            this.opacity = Math.random() * 0.15 + 0.05;
            this.pulseSpeed = Math.random() * 0.003 + 0.001;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }
        
        update() {
            // Movimento base
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Interação com o mouse (afasta a névoa)
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                const force = (200 - distance) / 200;
                this.speedX = this.baseSpeedX + (dx / distance) * force * 2;
                this.speedY = this.baseSpeedY + (dy / distance) * force * 2;
            } else {
                // Retorna gradualmente à velocidade base
                this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
                this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
            }
            
            // Loop na tela
            if (this.x < -this.radius) this.x = fogCanvas.width + this.radius;
            if (this.x > fogCanvas.width + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = fogCanvas.height + this.radius;
            if (this.y > fogCanvas.height + this.radius) this.y = -this.radius;
            
            // Efeito de pulsação
            this.opacity = (Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) + 1) * 0.07 + 0.03;
        }
        
        draw() {
            const gradient = fogCtx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            
            gradient.addColorStop(0, `rgba(220, 220, 220, ${this.opacity})`);
            gradient.addColorStop(0.5, `rgba(180, 180, 180, ${this.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(160, 160, 160, 0)');
            
            fogCtx.fillStyle = gradient;
            fogCtx.beginPath();
            fogCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            fogCtx.fill();
        }
    }
    
    const initFog = () => {
        fogClouds = [];
        // Cria 15 nuvens de névoa
        for (let i = 0; i < 15; i++) {
            fogClouds.push(new FogCloud());
        }
        animateFog();
    };
    
    const animateFog = () => {
        fogCtx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
        
        // Fundo com gradiente sutil
        const bgGradient = fogCtx.createRadialGradient(
            fogCanvas.width / 2, fogCanvas.height / 2, 0,
            fogCanvas.width / 2, fogCanvas.height / 2, fogCanvas.width / 2
        );
        bgGradient.addColorStop(0, 'rgba(20, 20, 20, 0.3)');
        bgGradient.addColorStop(1, 'rgba(10, 10, 10, 0.1)');
        fogCtx.fillStyle = bgGradient;
        fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
        
        fogClouds.forEach(cloud => {
            cloud.update();
            cloud.draw();
        });
        
        fogAnimationId = requestAnimationFrame(animateFog);
    };
    
    const stopFog = () => {
        if (fogAnimationId) {
            cancelAnimationFrame(fogAnimationId);
            fogAnimationId = null;
        }
        fogCtx.clearRect(0, 0, fogCanvas.width, fogCanvas.height);
        fogClouds = [];
    };
    
    // --- SISTEMA DE FUMAÇA CINEMATOGRÁFICA (DARK THEME) ---
    const smokeCanvas = document.getElementById('smoke-canvas');
    const smokeCtx = smokeCanvas.getContext('2d');
    let smokePuffs = [];
    let embers = []; // Partículas de brasa
    let smokeAnimationId = null;
    let smokeMouseX = window.innerWidth / 2;
    let smokeMouseY = window.innerHeight / 2;
    let prevSmokeMouseX = smokeMouseX;
    let prevSmokeMouseY = smokeMouseY;
    let lightPosition = { x: window.innerWidth * 0.3, y: window.innerHeight * 0.2 }; // Fonte de luz
    
    smokeCanvas.width = window.innerWidth;
    smokeCanvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        smokeCanvas.width = window.innerWidth;
        smokeCanvas.height = window.innerHeight;
        lightPosition = { x: window.innerWidth * 0.3, y: window.innerHeight * 0.2 };
    });
    
    // Rastreamento do mouse para fumaça
    document.addEventListener('mousemove', (e) => {
        prevSmokeMouseX = smokeMouseX;
        prevSmokeMouseY = smokeMouseY;
        smokeMouseX = e.clientX;
        smokeMouseY = e.clientY;
    });
    
    // Classe para partículas de brasa/ember
    class Ember {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.speedY = -(Math.random() * 2 + 0.8); // Mais rápido
            this.speedX = (Math.random() - 0.5) * 1.2; // Mais movimento lateral
            this.size = Math.random() * 4 + 1.5; // Maior
            this.life = 0;
            this.maxLife = Math.random() * 250 + 150; // Vive mais tempo
            this.brightness = Math.random() * 0.8 + 0.6;
            this.flickerSpeed = Math.random() * 0.15 + 0.08; // Mais intenso
            this.color = Math.random() < 0.6 ? 'orange' : (Math.random() < 0.5 ? 'red' : 'yellow'); // 3 cores
            this.turbulence = Math.random() * Math.PI * 2; // Para ondulação
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            
            // Ondulação lateral complexa
            this.x += Math.sin(this.life * 0.05 + this.turbulence) * 0.8;
            
            this.speedY += 0.008; // Gravidade mais sutil
            this.speedX += (Math.random() - 0.5) * 0.15; // Mais ondulação
            this.speedX *= 0.995; // Desacelera lateralmente
            this.life++;
            
            // Flicker (tremulação) mais intenso
            this.brightness = 0.5 + Math.sin(this.life * this.flickerSpeed) * 0.5;
        }
        
        draw() {
            const opacity = 1 - (this.life / this.maxLife);
            const glowSize = this.size * 5; // Brilho maior
            
            // Brilho externo INTENSO
            const glow = smokeCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize);
            if (this.color === 'orange') {
                glow.addColorStop(0, `rgba(255, 200, 100, ${opacity * this.brightness * 0.9})`);
                glow.addColorStop(0.2, `rgba(255, 180, 80, ${opacity * this.brightness * 0.7})`);
                glow.addColorStop(0.4, `rgba(255, 150, 50, ${opacity * this.brightness * 0.5})`);
                glow.addColorStop(0.7, `rgba(255, 120, 30, ${opacity * this.brightness * 0.2})`);
                glow.addColorStop(1, 'rgba(255, 100, 0, 0)');
            } else if (this.color === 'red') {
                glow.addColorStop(0, `rgba(255, 120, 80, ${opacity * this.brightness * 0.9})`);
                glow.addColorStop(0.2, `rgba(255, 90, 60, ${opacity * this.brightness * 0.7})`);
                glow.addColorStop(0.4, `rgba(255, 50, 20, ${opacity * this.brightness * 0.5})`);
                glow.addColorStop(0.7, `rgba(220, 30, 10, ${opacity * this.brightness * 0.2})`);
                glow.addColorStop(1, 'rgba(200, 0, 0, 0)');
            } else { // yellow
                glow.addColorStop(0, `rgba(255, 255, 150, ${opacity * this.brightness * 0.9})`);
                glow.addColorStop(0.2, `rgba(255, 240, 120, ${opacity * this.brightness * 0.7})`);
                glow.addColorStop(0.4, `rgba(255, 220, 80, ${opacity * this.brightness * 0.5})`);
                glow.addColorStop(0.7, `rgba(255, 180, 50, ${opacity * this.brightness * 0.2})`);
                glow.addColorStop(1, 'rgba(255, 150, 0, 0)');
            }
            smokeCtx.fillStyle = glow;
            smokeCtx.fillRect(this.x - glowSize, this.y - glowSize, glowSize * 2, glowSize * 2);
            
            // Brilho médio (camada adicional)
            const midGlow = smokeCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize * 0.5);
            midGlow.addColorStop(0, `rgba(255, 255, 220, ${opacity * this.brightness * 0.6})`);
            midGlow.addColorStop(1, 'rgba(255, 200, 100, 0)');
            smokeCtx.fillStyle = midGlow;
            smokeCtx.fillRect(this.x - glowSize * 0.5, this.y - glowSize * 0.5, glowSize, glowSize);
            
            // Núcleo super brilhante
            smokeCtx.fillStyle = `rgba(255, 255, 240, ${opacity * this.brightness})`;
            smokeCtx.beginPath();
            smokeCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            smokeCtx.fill();
        }
        
        isDead() {
            return this.life >= this.maxLife;
        }
    }
    
    class SmokePuff {
        constructor(x, y) {
            this.x = x || Math.random() * smokeCanvas.width;
            this.y = y || smokeCanvas.height + 80;
            this.radius = Math.random() * 80 + 60; // Muito maior
            this.baseSpeedY = -(Math.random() * 0.8 + 0.4); // Mais rápido
            this.baseSpeedX = (Math.random() - 0.5) * 0.8;
            this.speedY = this.baseSpeedY;
            this.speedX = this.baseSpeedX;
            this.opacity = Math.random() * 0.6 + 0.3; // Mais opaco
            this.maxOpacity = this.opacity;
            this.life = 0;
            this.maxLife = Math.random() * 500 + 400;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.03;
            this.expansion = Math.random() * 0.3 + 0.2; // Mais expansão
            this.dispersed = false;
            this.turbulenceOffset = Math.random() * 1000;
            this.layer = Math.random(); // Profundidade para parallax
            this.temperature = 1 - (Math.random() * 0.3); // Para variação de cor
        }
        
        update() {
            // Interação CINEMATOGRÁFICA com o mouse
            const dx = this.x - smokeMouseX;
            const dy = this.y - smokeMouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Velocidade do mouse para efeitos dramáticos
            const mouseVelX = smokeMouseX - prevSmokeMouseX;
            const mouseVelY = smokeMouseY - prevSmokeMouseY;
            const mouseSpeed = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);
            
            // Raio de influência MUITO maior e dinâmico
            const influenceRadius = 250 + mouseSpeed * 5 + this.radius * 0.5;
            
            if (distance < influenceRadius) {
                const force = Math.pow((influenceRadius - distance) / influenceRadius, 1.5);
                const pushStrength = 5 + mouseSpeed * 0.5;
                
                // Dispersão DRAMÁTICA
                this.speedX += (dx / distance) * force * pushStrength;
                this.speedY += (dy / distance) * force * pushStrength;
                
                // Turbulência aumentada
                this.rotationSpeed += (Math.random() - 0.5) * 0.1;
                this.speedX += (Math.random() - 0.5) * 0.5;
                
                // Dispersão intensa quando muito perto
                if (distance < influenceRadius * 0.4) {
                    this.dispersed = true;
                    this.expansion += 1.0;
                    this.opacity *= 0.92;
                    this.rotationSpeed *= 1.5;
                }
            } else {
                // Retorno suave e natural
                this.speedX += (this.baseSpeedX - this.speedX) * 0.01;
                this.speedY += (this.baseSpeedY - this.speedY) * 0.01;
                this.rotationSpeed *= 0.95;
            }
            
            // Turbulência procedural (Perlin-like noise simulation)
            const turbulence = Math.sin(this.life * 0.03 + this.turbulenceOffset) * 
                              Math.cos(this.life * 0.02) * 0.8;
            this.x += turbulence;
            this.speedX += turbulence * 0.1;
            
            // Movimento com inércia
            this.y += this.speedY * (1 + this.layer * 0.3); // Parallax
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            
            // Ondulação lateral complexa
            if (!this.dispersed) {
                this.x += Math.sin(this.life * 0.03 + this.turbulenceOffset) * 1.2;
                this.y += Math.cos(this.life * 0.025) * 0.3;
            }
            
            // Expansão volumétrica
            this.radius += this.expansion * (1 + this.layer * 0.2);
            
            // Sistema de vida cinematográfico
            this.life++;
            
            // Fade in suave e longo
            if (this.life < 60) {
                this.opacity = Math.pow(this.life / 60, 2) * this.maxOpacity;
            }
            // Fade out dramático
            else if (this.life > this.maxLife * 0.4) {
                const fadeProgress = (this.life - this.maxLife * 0.4) / (this.maxLife * 0.6);
                this.opacity = this.maxOpacity * Math.pow(1 - fadeProgress, 2);
            }
            
            // Física de fluído
            this.speedY *= 0.994;
            this.speedX *= 0.98;
            
            // Temperatura diminui (esfria)
            this.temperature *= 0.998;
        }
        
        draw() {
            smokeCtx.save();
            smokeCtx.translate(this.x, this.y);
            smokeCtx.rotate(this.rotation);
            
            // ILUMINAÇÃO VOLUMÉTRICA - Calcula luz da fonte
            const lightDx = lightPosition.x - this.x;
            const lightDy = lightPosition.y - this.y;
            const lightDist = Math.sqrt(lightDx * lightDx + lightDy * lightDy);
            const lightIntensity = Math.max(0, 1 - lightDist / (smokeCanvas.width * 0.6));
            
            // Cores cinematográficas baseadas na temperatura e iluminação
            const ageProgress = this.life / this.maxLife;
            const warmth = this.temperature * lightIntensity;
            
            // Gradiente complexo com MUITAS camadas
            const gradient = smokeCtx.createRadialGradient(
                this.radius * 0.1, -this.radius * 0.1, 0,
                0, 0, this.radius * 1.3
            );
            
            // Centro - mais quente se iluminado
            const r1 = Math.floor(110 + warmth * 60);
            const g1 = Math.floor(110 + warmth * 40);
            const b1 = Math.floor(110 + warmth * 10);
            gradient.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${this.opacity * 0.9})`);
            
            // Camadas intermediárias com variação
            gradient.addColorStop(0.15, `rgba(${r1-15}, ${g1-15}, ${b1-5}, ${this.opacity * 0.85})`);
            gradient.addColorStop(0.3, `rgba(${r1-30}, ${g1-30}, ${b1-10}, ${this.opacity * 0.75})`);
            gradient.addColorStop(0.45, `rgba(${r1-45}, ${g1-40}, ${b1-15}, ${this.opacity * 0.60})`);
            gradient.addColorStop(0.6, `rgba(${r1-60}, ${g1-55}, ${b1-20}, ${this.opacity * 0.45})`);
            gradient.addColorStop(0.75, `rgba(${r1-75}, ${g1-70}, ${b1-25}, ${this.opacity * 0.25})`);
            gradient.addColorStop(0.9, `rgba(${r1-85}, ${g1-80}, ${b1-30}, ${this.opacity * 0.10})`);
            gradient.addColorStop(1, 'rgba(20, 20, 20, 0)');
            
            smokeCtx.fillStyle = gradient;
            smokeCtx.beginPath();
            smokeCtx.arc(0, 0, this.radius, 0, Math.PI * 2);
            smokeCtx.fill();
            
            // MÚLTIPLAS CAMADAS DE TURBULÊNCIA
            if (!this.dispersed && this.life > 30) {
                // Camada 1 - Turbulência interna
                smokeCtx.globalAlpha = this.opacity * 0.4;
                const turb1 = smokeCtx.createRadialGradient(
                    this.radius * 0.25, this.radius * 0.15, 0,
                    this.radius * 0.25, this.radius * 0.15, this.radius * 0.7
                );
                turb1.addColorStop(0, `rgba(${r1-10}, ${g1-10}, ${b1-5}, 0.6)`);
                turb1.addColorStop(1, 'rgba(40, 40, 40, 0)');
                smokeCtx.fillStyle = turb1;
                smokeCtx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
                
                // Camada 2 - Redemoinhos
                smokeCtx.globalAlpha = this.opacity * 0.3;
                const turb2 = smokeCtx.createRadialGradient(
                    -this.radius * 0.2, -this.radius * 0.25, 0,
                    -this.radius * 0.2, -this.radius * 0.25, this.radius * 0.6
                );
                turb2.addColorStop(0, `rgba(${r1-20}, ${g1-20}, ${b1-10}, 0.5)`);
                turb2.addColorStop(1, 'rgba(35, 35, 35, 0)');
                smokeCtx.fillStyle = turb2;
                smokeCtx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
            }
            
            // God rays effect (raios de luz volumétrica)
            if (lightIntensity > 0.3 && this.life > 60 && this.life < this.maxLife * 0.7) {
                smokeCtx.globalAlpha = lightIntensity * 0.15 * this.opacity;
                const rayGradient = smokeCtx.createRadialGradient(
                    lightDx * 0.01, lightDy * 0.01, 0,
                    lightDx * 0.01, lightDy * 0.01, this.radius * 0.8
                );
                rayGradient.addColorStop(0, 'rgba(200, 180, 140, 0.4)');
                rayGradient.addColorStop(1, 'rgba(150, 140, 120, 0)');
                smokeCtx.fillStyle = rayGradient;
                smokeCtx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
            }
            
            smokeCtx.restore();
        }
        
        isDead() {
            return this.life >= this.maxLife || this.y < -this.radius || this.opacity <= 0;
        }
    }
    
    const initSmoke = () => {
        embers = [];
        // Começa com bastante brasas na tela
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * smokeCanvas.width;
            const y = Math.random() * smokeCanvas.height;
            embers.push(new Ember(x, y));
        }
        animateSmoke();
    };
    
    const animateSmoke = () => {
        // Fundo escuro com fade suave para trail
        smokeCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        smokeCtx.fillRect(0, 0, smokeCanvas.width, smokeCanvas.height);
        
        // Vignette effect (escurece as bordas)
        const vignetteGradient = smokeCtx.createRadialGradient(
            smokeCanvas.width / 2, smokeCanvas.height / 2, smokeCanvas.width * 0.3,
            smokeCanvas.width / 2, smokeCanvas.height / 2, smokeCanvas.width * 0.7
        );
        vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        smokeCtx.fillStyle = vignetteGradient;
        smokeCtx.fillRect(0, 0, smokeCanvas.width, smokeCanvas.height);
        
        // Adiciona MUITAS brasas com alta frequência
        if (Math.random() < 0.35) { // 35% de chance - MUITO mais frequente
            const x = Math.random() * smokeCanvas.width;
            const y = smokeCanvas.height + Math.random() * 100 + 50;
            
            // Cria múltiplas brasas de uma vez (clusters)
            const clusterSize = Math.floor(Math.random() * 3) + 1; // 1 a 3 brasas por vez
            for (let i = 0; i < clusterSize; i++) {
                if (embers.length < 150) { // Permite até 150 brasas simultâneas
                    embers.push(new Ember(
                        x + (Math.random() - 0.5) * 30,
                        y + (Math.random() - 0.5) * 20
                    ));
                }
            }
        }
        
        // Atualiza e desenha brasas
        embers.forEach((ember, index) => {
            ember.update();
            ember.draw();
            if (ember.isDead()) {
                embers.splice(index, 1);
            }
        });
        
        // Atualiza posição da luz (segue o mouse sutilmente)
        lightPosition.x += (smokeMouseX - lightPosition.x) * 0.02;
        lightPosition.y += (smokeMouseY * 0.3 - lightPosition.y) * 0.02;
        
        smokeAnimationId = requestAnimationFrame(animateSmoke);
    };
    
    const stopSmoke = () => {
        if (smokeAnimationId) {
            cancelAnimationFrame(smokeAnimationId);
            smokeAnimationId = null;
        }
        smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
        smokePuffs = [];
        embers = [];
    };

    // --- INICIALIZAÇÃO ---
    addCardBtn.addEventListener('click', () => {
        const cards = document.querySelectorAll('.card');
        const lastCard = cards[cards.length - 1];
        let newPosition = { left: `${GRID_SIZE}px`, top: `${GRID_SIZE}px` };

        if (lastCard) {
            const newLeft = lastCard.offsetLeft + lastCard.offsetWidth + GRID_SIZE;
            newPosition.left = `${newLeft}px`;
            newPosition.top = `${lastCard.offsetTop}px`;
        }
        createCard(newPosition);
    });

    // --- FUNÇÃO PARA ATUALIZAR TRANSFORM (PAN + ZOOM) ---
    const updateTransform = () => {
        mainBoard.style.transform = `translate(${currentPanX}px, ${currentPanY}px) scale(${currentZoom})`;
    };

    // --- FUNCIONALIDADE DE PAN COM CTRL ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Control' && !isCtrlPressed) {
            isCtrlPressed = true;
            document.body.classList.add('ctrl-pressed');
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Control') {
            isCtrlPressed = false;
            document.body.classList.remove('ctrl-pressed');
            if (isPanning) {
                isPanning = false;
                mainBoard.classList.remove('panning');
            }
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (isCtrlPressed && !e.target.closest('.card')) {
            isPanning = true;
            panStartX = e.clientX;
            panStartY = e.clientY;
            mainBoard.classList.add('panning');
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isPanning && isCtrlPressed) {
            const deltaX = e.clientX - panStartX;
            const deltaY = e.clientY - panStartY;
            
            currentPanX += deltaX;
            currentPanY += deltaY;
            
            updateTransform();
            
            panStartX = e.clientX;
            panStartY = e.clientY;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isPanning) {
            isPanning = false;
            mainBoard.classList.remove('panning');
        }
    });

    // --- FUNCIONALIDADE DE ZOOM COM CTRL + SCROLL ---
    document.addEventListener('wheel', (e) => {
        if (isCtrlPressed) {
            e.preventDefault();
            
            const delta = e.deltaY > 0 ? -ZOOM_SPEED : ZOOM_SPEED;
            const newZoom = currentZoom + delta;
            
            // Limita o zoom entre MIN_ZOOM e MAX_ZOOM
            if (newZoom >= MIN_ZOOM && newZoom <= MAX_ZOOM) {
                // Calcula o ponto do mouse para zoom centralizado
                const rect = mainBoard.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                // Ajusta a posição para manter o ponto sob o mouse fixo
                const zoomRatio = newZoom / currentZoom;
                currentPanX = mouseX - (mouseX - currentPanX) * zoomRatio;
                currentPanY = mouseY - (mouseY - currentPanY) * zoomRatio;
                
                currentZoom = newZoom;
                updateTransform();
            }
        }
    }, { passive: false });

    loadCards();
});