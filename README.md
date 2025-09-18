# Somativa 2 - TDW

> Projeto da disciplina de **Tecnologias para Desenvolvimento Web** com foco na Somativa 2.

Aplicação React (Vite + TypeScript) com navegação mockada entre as páginas de Login, Cadastro e Dashboard utilizando `react-router-dom`. Em uma etapa futura integraremos Firebase Authentication e Firestore para validar credenciais e persistir dados reais.

## Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Acesse [http://localhost:5173](http://localhost:5173)

## Estrutura atual

- `src/pages/Login`: tela mock de login com links de navegação.
- `src/pages/Register`: tela mock de cadastro.
- `src/pages/Dashboard`: dashboard placeholder aguardando dados do Firestore.
- `src/App.tsx`: definição das rotas e layout base.

## Próximos passos sugeridos

- Conectar as páginas ao Firebase Authentication para fluxo real de login/cadastro.
- Carregar e exibir dados do usuário a partir do Firestore no Dashboard.
- Implementar validações de formulário e feedbacks visuais.

---

Desenvolvido por Diogo Lucas de Oliveira.
