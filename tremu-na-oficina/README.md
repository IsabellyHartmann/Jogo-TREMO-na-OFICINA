# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Entra na APP pelo telemóvel
https://supreme-capybara-q7gw4qw9x55934559-5173.app.github.dev/


# 🔧 TREMU NA OFICINA 🔧
### Jogo para Inserção Social — Aprendizagem de Língua Gestual Portuguesa (LGP)

---

## 📋 Informações do Projeto
* **Curso:** Técnico de Programador de Informática (Turma 1P)
* **Disciplina:** Programação
* **Módulo:** (10791) Desenvolvimento de Aplicações Web em JAVA / JavaScript (React)
* **Docente:** Luis Santos
* **Aluno:** Isabelly Hartmann
* **Proposta de Trabalho:** #2

---

## 🚀 Demonstração Técnica e Acesso à Aplicação
A aplicação foi implementada com sucesso no ambiente GitHub Codespaces e encontra-se pública para validação remota multiplataforma:

* **Link de Desenvolvimento (Vite):** (https://supreme-capybara-q7gw4qw9x55934559-5173.app.github.dev/)
---

## 🛠️ Cumprimento dos Requisitos da Proposta

A aplicação foi desenhada com foco estrito nas três condições obrigatórias da ficha de trabalho:

1. **Condição Stand-Alone (100% Local):** A aplicação não consome APIs ou microsserviços de inteligência artificial de terceiros (Third-Party). Toda a infraestrutura corre no browser do utilizador utilizando o ecossistema local do **Google MediaPipe Tasks-Vision**, permitindo privacidade total e execução sem latência externa.
2. **Tecnologias Autorizadas:** O ecossistema foi construído de raiz utilizando **React, JavaScript (ES6+) e NodeJS** (através do gestor de pacotes npm e do bundler Vite).
3. **Vertente Escolhida:** **Jogo para Inserção Social (Tipo 1)**. Consiste num jogo interativo focado em acessibilidade e inclusão, onde palavras temáticas de 4 letras associadas a oficinas mecânicas devem ser adivinhadas letra a letra. O progresso só avança quando o utilizador reproduzir fisicamente o caractere correto através do alfabeto manual da Língua Gestual Portuguesa (LGP).

---

## 🧠 Arquitetura do Motor de Inteligência Artificial Local

A lógica de visão computacional da aplicação está dividida em camadas modulares para respeitar o ciclo de vida do React:

* **Captura de Imagem contínua (`CameraView.jsx`):** Inicializa o fluxo de vídeo nativo através da API `navigator.mediaDevices.getUserMedia` e envia quadros (frames) em tempo real para processamento usando a sub-rotina gráfica do sistema (`requestAnimationFrame`).
* **Mapeamento Geométrico (`GestureModel.jsx`):** Invoca os ficheiros binários em formato WebAssembly (WASM) locais do MediaPipe. O modelo analisa a matriz tridimensional da mão e isola **21 pontos anatómicos cruciais (Landmarks)**.
* **Algoritmo de Validação Espacial:** Executa uma verificação geométrica que mede a altura relativa e a extensão dos eixos cartesianos `(X, Y, Z)` dos nós dos dedos (ex: extremidades dos dedos indicador, médio, anelar e mindinho em relação à base da palma) para certificar a precisão do gesto em LGP.

---

## 📁 Estrutura de Ficheiros do Repositório

```plaintext
tremu-na-oficina/
├── src/
│   ├── components/
│   │   ├── CameraView.jsx     # Ativação do hardware e loop de renderização do vídeo.
│   │   ├── GestureModel.jsx   # Inicialização do classificador WASM e validação do esqueleto.
│   │   └── GameLogic.jsx      # Motor do jogo: dicionário oficinal, estados e pontuação.
│   ├── App.jsx                # Contentor principal da interface com o utilizador.
│   └── main.jsx               # Ponto de entrada do ecossistema React.
├── package.json               # Dependências do ecossistema (TensorFlow/MediaPipe).
└── README.md                  # Documentação técnica de avaliação.
```

---

## 📦 Instruções para Execução Local

Caso o docente pretenda correr o projeto localmente fora do ambiente Codespace, basta clonar o repositório e executar:

```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar o servidor de desenvolvimento local
npm run dev
```


