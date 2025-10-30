# 📝 Planner do John

Aplicativo de anotações estilo Stick Notes para Windows!

## ✨ Recursos

- 📌 **Cards Arrastáveis** - Organize suas notas como quiser
- 🎨 **3 Estilos de Cards** - Default, Glass (neon) e Modern (minimalista)
- 🎨 **6 Temas de Fundo** - Padrão, Partículas Verdes, Claro, Escuro, Neon e Synthwave
- 🎨 **4 Cores de Cards** - Para o estilo Default (padrão, branco, vermelho, verde)
- ☑️ **Checklists** - Adicione listas de tarefas em cada card
- ✍️ **Formatação de Texto** - Negrito e cores personalizadas
- 🖱️ **Navegação com Ctrl** - Arraste a tela segurando Ctrl
- 🔍 **Zoom** - Use Ctrl + Scroll para zoom (30% a 300%)
- 💾 **Salvamento Automático** - Suas anotações nunca serão perdidas!
- 📂 **Gerenciamento de Projetos** - Salvar, abrir, exportar e importar
- 🪟 **Aplicativo Desktop** - Funciona offline no Windows

## 🚀 Como Usar

### Modo Teste (Desenvolvimento)
Duplo clique em: **`dev-start.bat`**

### Compilar para EXE
Duplo clique em: **`install-and-build.bat`**

Depois de compilar, os arquivos estarão em: **`dist/`**

## 🎮 Controles

### Menu
- **Arquivo** → Novo Projeto, Abrir, Salvar, Salvar Como, Exportar/Importar JSON
- **Estilos de Card** → Escolha entre Default, Glass ou Modern
- **Tema de Fundo** → 6 temas diferentes para personalizar
- **Indicadores** → Mostram o estilo de card e tema atual

### Cards
- Arraste pelo ícone **`...`** no canto inferior direito
- Redimensione pelo canto inferior direito
- Delete com o **`X`** que aparece ao passar o mouse
- Mude a cor com os círculos coloridos no topo
- **Estilos de Card disponíveis:**
  - 🎨 **Default** - Estilo original com efeito glassmorphism e seletor de cores
  - ✨ **Glass** - Efeito neon com gradientes ciano
  - 🌟 **Modern** - Minimalista com barra lateral colorida

### Temas de Fundo
- 🌌 **Padrão** - Cinza escuro com grid sutil
- ✨ **Partículas Verdes** - Fundo escuro com partículas verdes brilhantes animadas
- ☀️ **Claro** - Gradiente azul claro para ambientes iluminados
- 🌑 **Escuro Profundo** - Preto absoluto com gradientes sutis
- 💜 **Neon** - Roxo escuro com efeitos neon vibrantes
- 🌆 **Synthwave** - Estilo retro anos 80 com grid synthwave

### Navegação e Zoom
- **Ctrl + Arrastar** = Mover/navegar pela tela toda (pan)
- **Ctrl + Scroll** = Zoom in/out (30% até 300%)
  - Scroll para cima = Zoom in (aproximar)
  - Scroll para baixo = Zoom out (afastar)
  - O zoom é centralizado na posição do mouse
- **Botão +** (canto inferior direito) = Novo card

### Checklists
- Clique em **"Adicionar Checkbox"**
- Marque/desmarque tarefas
- Delete itens com o **X** que aparece ao passar o mouse

### Formatação de Texto
- Clique no ícone **T** no topo do card
- Escolha negrito ou cores de texto

## 💾 Onde Ficam os Dados?

Todos os seus cards são salvos **automaticamente** no localStorage do navegador Electron. 

**Isso significa:**
- ✅ Salvamento instantâneo a cada alteração
- ✅ Dados persistem após fechar o app
- ✅ Não precisa "Salvar" manualmente
- ✅ Funciona 100% offline

## 📦 Estrutura do Projeto

```
planner-do/
├── index.html          # Interface do app
├── style.css           # Estilos visuais
├── script.js           # Lógica e funcionalidades
├── main.js             # Configuração do Electron
├── package.json        # Dependências e scripts
├── dev-start.bat       # Iniciar em modo teste
├── install-and-build.bat  # Compilar para EXE
└── dist/              # Arquivos compilados (após build)
```

## 🔧 Comandos Manuais

Se preferir usar o terminal:

```bash
# Instalar dependências
npm install

# Testar em modo desenvolvimento
npm start

# Compilar instalador + portable
npm run build

# Apenas instalador
npm run build

# Apenas portable
npm run build-portable
```

## 📋 Requisitos

- Windows 10 ou superior
- Node.js (já tem instalado)
- Electron (instalado automaticamente)

## 🎨 Personalização

Você pode editar facilmente:

- **`style.css`** - Mudar cores, tamanhos, estilos
- **`script.js`** - Adicionar novas funcionalidades
- **`main.js`** - Configurar janela, menu, atalhos

## ⚙️ Configurações do Electron

O app está configurado para:
- ✅ Janela de 1400x900 (redimensionável)
- ✅ Menu em português
- ✅ Ícone personalizado (quando adicionar)
- ✅ Apenas uma instância por vez
- ✅ Minimizar para bandeja (opcional)

## 🐛 Solução de Problemas

### O app não compila
```bash
# Delete node_modules e reinstale
rmdir /s node_modules
npm install
npm run build
```

### Windows Defender bloqueia
- É normal para apps não assinados
- Clique em "Mais informações" → "Executar assim mesmo"

### Erros de permissão
- Execute o terminal como Administrador
- Ou execute o .bat como Administrador

## 📜 Licença

MIT - Livre para uso pessoal e comercial!

---

**Desenvolvido por John** 🚀
Versão 1.0.0

