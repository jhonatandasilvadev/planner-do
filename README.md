# 📝 Planner Do

**A mistura perfeita entre um Planner e uma lista To-Do!**

Planner Do é um aplicativo desktop de anotações visual e interativo que combina a flexibilidade de um planner com a praticidade de listas de tarefas. Organize sua semana, gerencie afazeres diários, estabeleça metas e acompanhe qualquer tipo de tarefa de forma visual e intuitiva.

![Planner Do](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Electron](https://img.shields.io/badge/Electron-28.0.0-47848F)

## 🎯 Por que "Planner Do"?

O nome **Planner Do** representa a união de dois conceitos:
- **Planner**: Planejamento visual e organização espacial
- **To-Do**: Listas de tarefas e checkboxes interativos

Esta combinação permite que você organize visualmente seus afazeres, metas e tarefas, utilizando um canvas infinito com cards movíveis e personalizáveis.

## ✨ Recursos Principais

### 📌 Gerenciamento Visual
- **Cards Arrastáveis**: Organize suas notas livremente no canvas
- **Redimensionamento**: Ajuste o tamanho de cada card conforme necessário
- **Navegação Infinita**: Ctrl + Arrastar para mover pela área de trabalho
- **Zoom Dinâmico**: Ctrl + Scroll para ampliar ou reduzir (30% - 300%)

### 🎨 Personalização
- **3 Estilos de Cards**:
  - 🎨 **Default**: Glassmorphism com 4 opções de cores
  - ✨ **Glass**: Efeito neon com gradientes ciano
  - 🌟 **Modern**: Minimalista com barra lateral colorida

- **6 Temas de Fundo**:
  - 🌌 **Padrão**: Cinza escuro profissional
  - ✨ **Partículas Verdes**: Fundo animado com partículas brilhantes
  - ☀️ **Claro**: Ideal para ambientes iluminados
  - 🌑 **Escuro Profundo**: Minimalismo absoluto
  - 💜 **Neon**: Vibrante e moderno
  - 🌆 **Synthwave**: Estilo retro anos 80

### ☑️ Sistema de Tarefas
- **Checkboxes Interativos**: Adicione listas de tarefas em cada card
- **Marcação Visual**: Tarefas completadas ficam riscadas
- **Edição Inline**: Edite tarefas diretamente, sem popups
- **Exclusão Rápida**: Remova itens com um clique

### 📝 Edição de Conteúdo
- **Títulos Editáveis**: Personalize o nome de cada card
- **Texto Livre**: Escreva notas e observações
- **Formatação**: Negrito e cores de texto
- **Checklists**: Múltiplas tarefas por card

### 💾 Gerenciamento de Projetos
- **Salvamento Automático**: LocalStorage salva tudo automaticamente
- **Exportar/Importar**: Backup em formato JSON
- **Múltiplos Projetos**: Abra e salve diferentes projetos
- **Persistência**: Mantém posição, zoom e pan ao reabrir

## 🚀 Como Usar

### Instalação

#### Opção 1: Executável Pronto (Recomendado para uso diário)
1. Acesse a seção [Releases](https://github.com/jhonatandasilvadev/planner-do/releases)
2. Baixe a versão mais recente:
   - **`Planner do John.exe`** - Versão portable (não precisa instalar, só executar)
   - **`Planner do John Setup.exe`** - Instalador completo
3. Execute o arquivo baixado
4. Pronto! O app está rodando 🎉

#### Opção 2: Rodar do Código-Fonte (Para desenvolvedores)

**Passo 1: Clone o repositório**
```bash
git clone https://github.com/jhonatandasilvadev/planner-do.git
```

**Passo 2: Entre na pasta do projeto**
```bash
cd planner-do
```

**Passo 3: Instale as dependências**
```bash
npm install
```
*Isso vai baixar o Electron e todas as dependências necessárias (~200MB)*

**Passo 4: Execute em modo desenvolvimento**

**Opção A - Linha de comando:**
```bash
npm start
```

**Opção B - Scripts prontos (Windows):**
- Duplo clique em **`dev-start.bat`**

O aplicativo vai abrir automaticamente! ✨

#### Opção 3: Compilar seu Próprio Executável

Se você fez modificações e quer gerar seu próprio `.exe`:

**Método Rápido (Windows):**
1. Duplo clique em **`install-and-build.bat`**
2. Aguarde a compilação (~5-10 minutos)
3. Os executáveis estarão em **`dist/`**

**Método Manual:**
```bash
# Compilar tudo (instalador + portable)
npm run build

# Apenas versão portable
npm run build-portable
```

**📂 Onde encontrar os arquivos compilados:**
```
planner-do/
└── dist/
    ├── Planner do John Setup.exe    (Instalador - ~80MB)
    └── Planner do John.exe           (Portable - ~150MB)
```

### 📁 Estrutura do Projeto

```
planner-do/
├── index.html              ← Interface principal do app
├── style.css               ← Estilos e temas
├── script.js               ← Toda a lógica JavaScript
├── main.js                 ← Configuração do Electron
├── package.json            ← Dependências e scripts
├── README.md               ← Este arquivo
├── LICENSE                 ← Licença MIT
├── dev-start.bat           ← Atalho: iniciar em modo dev
├── install-and-build.bat   ← Atalho: instalar e compilar
├── LEIA-ME.md              ← Documentação em PT-BR
├── COMPILAR.txt            ← Guia de compilação rápido
├── node_modules/           ← Dependências (gerado após npm install)
└── dist/                   ← Executáveis (gerado após npm run build)
```

### Primeiros Passos

1. **Criar um Card**
   - Clique no botão `+` no canto inferior direito
   - Ou use o atalho de teclado (próxima versão)

2. **Mover um Card**
   - Arraste pelo ícone `...` no rodapé do card
   - Solte onde desejar no canvas

3. **Adicionar Tarefas**
   - Clique em "Adicionar Checkbox"
   - Digite o nome da tarefa
   - Marque quando concluir

4. **Personalizar**
   - Menu "Estilos de Card" para mudar o visual
   - Menu "Tema de Fundo" para mudar o ambiente
   - Círculos coloridos no card Default para cores

5. **Navegar**
   - **Ctrl + Arrastar**: Mova a tela inteira
   - **Ctrl + Scroll**: Zoom in/out

## 📖 Casos de Uso

### 📅 Organização Semanal
```
Segunda | Terça | Quarta | Quinta | Sexta
[Card]  [Card]  [Card]  [Card]  [Card]
```
Crie um card para cada dia da semana e liste suas tarefas.

### 💼 Afazeres Diários no Trabalho
- **Card "Urgente"**: Tarefas prioritárias em vermelho
- **Card "Em Andamento"**: Tarefas atuais em amarelo
- **Card "Concluído"**: Tarefas finalizadas em verde

### 🎯 Metas e Projetos
- **Card por Meta**: Uma meta por card com checkboxes de progresso
- **Card por Projeto**: Organize fases e entregas

### 📋 Brainstorming
- Use o tema Partículas Verdes para criatividade
- Cards flutuantes para ideias não estruturadas
- Organize depois arrastando e agrupando

## ⌨️ Atalhos do Teclado

| Atalho | Função |
|--------|--------|
| `Ctrl` + `Arrastar` | Navegar pela tela (pan) |
| `Ctrl` + `Scroll` | Zoom in/out |
| `Ctrl` + `Q` | Sair do aplicativo |
| `Ctrl` + `R` | Recarregar |
| `Ctrl` + `Shift` + `I` | DevTools (debug) |

## 📂 Estrutura de Dados

Os projetos são salvos em formato JSON:

```json
{
  "cards": [
    {
      "id": "card-1234567890",
      "left": "20px",
      "top": "20px",
      "width": "240px",
      "height": "200px",
      "title": "Meu Card",
      "content": "<div>...</div>",
      "color": "default",
      "style": "default"
    }
  ],
  "projectName": "Meu Projeto",
  "currentCardStyle": "default",
  "currentTheme": "default",
  "panX": 0,
  "panY": 0,
  "zoom": 1
}
```

## 🛠️ Tecnologias

- **Electron 28.0.0**: Framework desktop
- **HTML5 Canvas**: Animação de partículas
- **Vanilla JavaScript**: Sem dependências externas
- **CSS3**: Efeitos glassmorphism e animações
- **LocalStorage**: Persistência de dados

## 🎨 Temas Disponíveis

### Partículas Verdes ✨
Fundo animado com 100 partículas verdes brilhantes que se movem aleatoriamente e criam conexões dinâmicas. Perfeito para ambiente de trabalho criativo.

### Synthwave 🌆
Grid retro inspirado nos anos 80 com gradientes rosa e azul. Ideal para quem gosta de estética cyberpunk.

### Neon 💜
Roxo vibrante com efeitos neon. Para quem prefere cores intensas e modernas.

## 📦 Build e Distribuição

### Scripts Disponíveis

```bash
# Modo desenvolvimento (abre o app direto)
npm start

# Compilar instalador + portable
npm run build

# Compilar apenas portable
npm run build-portable
```

### Arquivos Gerados

Após compilar, você terá:

```
dist/
├── Planner do John Setup.exe    ← Instalador NSIS (~80MB)
│   └── Instala em: C:\Program Files\Planner do John\
│
└── Planner do John.exe           ← Versão Portable (~150MB)
    └── Roda de qualquer pasta, sem instalação
```

### Requisitos de Sistema

- **Sistema Operacional**: Windows 10 ou superior (64-bit)
- **RAM**: Mínimo 2GB, recomendado 4GB
- **Espaço em Disco**: 200MB livres
- **Resolução**: Mínimo 1280x720

### Para Desenvolvimento

- **Node.js**: Versão 16 ou superior
- **NPM**: Versão 7 ou superior
- **Git**: Para clonar o repositório

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você tem ideias para melhorar o Planner Do:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/jhonatandasilvadev/planner-do/issues) com:
- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Sistema operacional e versão do app

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Jhonatan da Silva**
- GitHub: [@jhonatandasilvadev](https://github.com/jhonatandasilvadev)

## 🙏 Agradecimentos

- Inspirado em aplicativos como Notion, Trello e Sticky Notes
- Desenvolvido com auxílio de Claude AI (Anthropic)
- Comunidade Electron por fornecer excelente documentação

---

**Planner Do** - Organize, Planeje, Execute! 🚀

*Versão 1.0.0 - 2025*
