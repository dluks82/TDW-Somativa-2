# Somativa 2 - TDW

> Projeto da disciplina de **Tecnologias para Desenvolvimento Web** (Somativa 2) com autenticação e persistência via Firebase.

Aplicação **React + Vite + TypeScript** com rotas protegidas pela autenticação do Firebase, cadastro de novos usuários e sincronização dos dados básicos (nome, sobrenome e data de nascimento) no Firestore.

## Funcionalidades

- **Cadastro**: formulário com validação que cria o usuário no Firebase Authentication e registra o perfil no Firestore.
- **Login**: valida credenciais com Firebase Authentication e controla sessões para acesso às rotas privadas.
- **Dashboard**: exibe os dados persistidos do usuário autenticado e permite realizar logout.
- **Guarda de rotas**: redireciona visitantes para o login e impede que usuários autenticados acessem novamente as telas de login/cadastro.

## Pré-requisitos

1. Node.js 18+ instalado.
2. Projeto Firebase configurado com Authentication (e-mail/senha) e Firestore.
3. Variáveis de ambiente configuradas (copie `.env.example` para `.env` e ajuste os valores do seu projeto).
4. Regras do Firestore ajustadas para permitir que cada usuário leia/escreva somente o próprio documento.

## Executando o projeto

```bash
npm install
npm run dev
```

A aplicação ficará disponível em [http://localhost:5173](http://localhost:5173).

## Estrutura de pastas

- `src/services/firebase`: inicialização do SDK e helpers de autenticação.
- `src/hooks`: hooks reutilizáveis para acompanhar o estado de autenticação e buscar perfis.
- `src/pages`: telas de Login, Cadastro e Dashboard.
- `src/App.tsx`: definição das rotas protegidas e fluxo de navegação.

---

Desenvolvido por Diogo Lucas de Oliveira.
