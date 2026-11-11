# Zé Bank 🏦

Aplicação bancária didática com funcionalidades de gestão de perfil, consulta de ações e simulador de empréstimos.

## 🚀 Tecnologias

- **Backend:** Node.js, Express 5.1, MongoDB (Mongoose)
- **Frontend:** Vanilla JS, HTML5, CSS3, Chart.js
- **Segurança:** JWT (JSON Web Tokens), Bcryptjs para hashing de senhas
- **Integrações:** Finnhub API (Notícias), Brapi (Ações)

## 🛠️ Instalação e Uso

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure o arquivo `.env` com as seguintes chaves:
   - `MONGO_URI`: String de conexão do MongoDB
   - `JWT_SECRET`: Chave secreta para tokens JWT
   - `FINNHUB_TOKEN`: Token da API Finnhub
   - `BRAPI_TOKEN`: Token da API Brapi

3. Inicie o servidor:
   ```bash
   npm start
   ```
   Ou em modo desenvolvimento:
   ```bash
   npm run dev
   ```

## 🧪 Testes

Para rodar os testes automatizados:
```bash
npm test
```

## 📁 Estrutura do Projeto

- `/js`: Lógica do frontend centralizada.
- `/middleware`: Middlewares de autenticação.
- `/models`: Esquemas do banco de dados (Mongoose).
- `/scr/User`: Páginas relacionadas ao usuário autenticado.
- `/scr/pages`: Conteúdo institucional e investimentos.
- `/scr/components`: Componentes reutilizáveis de UI.
- `server.js`: Ponto de entrada da API.
