# Code Translator

Este projeto é uma API que permite aos usuários traduzir frases técnicas de inglês para português, com validação via GPT e sistema de pontuação.

## Descrição

O Code Translator é uma aplicação que utiliza Fastify, Prisma e OpenAI para oferecer um sistema de tradução e avaliação de frases técnicas. Os usuários podem se registrar, fazer login, obter frases aleatórias e enviar suas traduções para avaliação.

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd code_translator
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   JWT_SECRET=seu_jwt_secret
   OPENAI_API_KEY=sua_chave_api_openai
   DATABASE_URL=sua_url_do_banco_de_dados
   ```

4. Execute as migrações do Prisma:
   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

## Rotas da API

### Autenticação

- **POST /register**: Registra um novo usuário.
  - Corpo: `{ "email": "exemplo@email.com", "password": "senha", "name": "Nome" }`
  - Retorna: `{ "token": "jwt_token", "userId": "id_do_usuario" }`

- **POST /login**: Autentica um usuário existente.
  - Corpo: `{ "email": "exemplo@email.com", "password": "senha" }`
  - Retorna: `{ "token": "jwt_token", "userId": "id_do_usuario" }`

- **GET /me**: Retorna o perfil do usuário autenticado.
  - Requer token JWT no header: `Authorization: Bearer <token>`
  - Retorna: `{ "id": "id_do_usuario", "email": "exemplo@email.com", "name": "Nome", "points": 0 }`

### Frases

- **GET /phrases/random**: Retorna uma frase aleatória.
  - Requer token JWT no header: `Authorization: Bearer <token>`
  - Retorna: `{ "id": "id_da_frase", "textEN": "Frase em inglês", "explanation": "Explicação" }`

### Tradução

- **POST /phrases/:id/guess**: Envia uma tradução para avaliação.
  - Requer token JWT no header: `Authorization: Bearer <token>`
  - Corpo: `{ "userAnswer": "Tradução do usuário" }`
  - Retorna: `{ "isCorrect": true|false, "feedback": "Feedback do GPT", "pointsAwarded": 10|-5 }`

## Tecnologias Utilizadas

- **Fastify**: Framework web rápido e eficiente.
- **Prisma**: ORM para interação com o banco de dados.
- **JWT**: Autenticação via JSON Web Tokens.
- **OpenAI**: Integração com GPT para validação de traduções.
- **bcryptjs**: Criptografia de senhas.
- **dotenv**: Gerenciamento de variáveis de ambiente.

## Licença

Este projeto está licenciado sob a licença ISC. 