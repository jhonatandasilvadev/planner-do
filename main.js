const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'icon.png'),
        backgroundColor: '#34495e',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            devTools: true // Mude para false em produção
        },
        autoHideMenuBar: true,
        frame: true,
        titleBarStyle: 'default',
        show: false
    });

    mainWindow.loadFile('index.html');

    // Mostra a janela quando estiver pronta
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Menu personalizado (opcional)
    const menuTemplate = [
        {
            label: 'Arquivo',
            submenu: [
                {
                    label: 'Recarregar',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => mainWindow.reload()
                },
                {
                    label: 'Ferramentas do Desenvolvedor',
                    accelerator: 'CmdOrCtrl+Shift+I',
                    click: () => mainWindow.webContents.toggleDevTools()
                },
                { type: 'separator' },
                {
                    label: 'Sair',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => app.quit()
                }
            ]
        },
        {
            label: 'Editar',
            submenu: [
                { role: 'undo', label: 'Desfazer' },
                { role: 'redo', label: 'Refazer' },
                { type: 'separator' },
                { role: 'cut', label: 'Recortar' },
                { role: 'copy', label: 'Copiar' },
                { role: 'paste', label: 'Colar' },
                { role: 'delete', label: 'Deletar' },
                { type: 'separator' },
                { role: 'selectAll', label: 'Selecionar Tudo' }
            ]
        },
        {
            label: 'Visualizar',
            submenu: [
                { role: 'resetZoom', label: 'Zoom Padrão' },
                { role: 'zoomIn', label: 'Aumentar Zoom' },
                { role: 'zoomOut', label: 'Diminuir Zoom' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Tela Cheia' }
            ]
        },
        {
            label: 'Ajuda',
            submenu: [
                {
                    label: 'Sobre',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Sobre',
                            message: 'Planner do John',
                            detail: 'Aplicativo de anotações estilo Stick Notes\nVersão 1.0.0\n\nDesenvolvido por John',
                            buttons: ['OK']
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Quando o Electron estiver pronto, criar a janela
app.whenReady().then(createWindow);

// Sair quando todas as janelas estiverem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// No macOS, recriar a janela quando clicar no ícone do dock
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Prevenir múltiplas instâncias
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

