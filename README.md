# Loja Statera

Um sistema de e-commerce com frontend em React/Next.js e backend em NestJS.

## Visão Geral

Loja Statera é uma aplicação de e-commerce que permite aos usuários navegar por produtos, adicionar itens ao carrinho, gerenciar informações pessoais e finalizar compras. O sistema possui funcionalidades de gerenciamento de pedidos, autenticação de usuários e processamento de pagamentos.

## Arquitetura

O projeto é dividido em duas partes principais:

### Frontend (statera_store_test)
- Desenvolvido com Next.js e React
- Interface de usuário construída com Material UI
- Gerenciamento de estado local para carrinho e sessão
- Comunicação com backend via API REST

### Backend
- Desenvolvido com NestJS (framework Node.js)
- Banco de dados relacional gerenciado com Prisma ORM
- Sistema de autenticação baseado em JWT
- API RESTful para comunicação com o frontend

## Tecnologias Utilizadas

### Frontend
- Next.js / React
- TypeScript
- Material UI
- Fetch API para requisições HTTP

### Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL (banco de dados)
- JWT para autenticação
- Express.js (integrado ao NestJS)

## Estrutura do Projeto

```
Loja_Statera/
├── frontend/                # Código do frontend
│   └── statera_store_test/  # Aplicação Next.js
│       ├── public/          # Arquivos estáticos
│       └── src/             # Código fonte
│           ├── app/         # Rotas e páginas
│           ├── components/  # Componentes React
│           ├── services/    # Serviços de API
│           └── types/       # Definições de tipos
│
└── backend/                 # Código do backend
    ├── prisma/              # Configurações do Prisma
    └── src/                 # Código fonte
        ├── auth/            # Módulo de autenticação
        ├── orders/          # Módulo de pedidos
        ├── products/        # Módulo de produtos
        ├── users/           # Módulo de usuários
        └── routes/          # Rotas adicionais
```

## Instalação e Configuração

### Pré-requisitos
- Node.js (v16+)
- npm ou yarn
- PostgreSQL

### Backend

1. Clone o repositório e navegue até a pasta do backend:
```bash
cd Loja_Statera/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o ambiente:
   - Crie um arquivo `.env` na raiz do projeto backend com as seguintes variáveis:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/stateradb"
   JWT_SECRET="your-secret-key"
   ```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run start:dev
```

O backend estará disponível em `http://localhost:3000`.

### Frontend

1. Navegue até a pasta do frontend:
```bash
cd Loja_Statera/frontend/statera_store_test
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3001`.

## Uso

### Fluxo de Compra

1. Navegue pela loja e adicione produtos ao carrinho (✅)
2. Acesse a página de checkout (✅)
3. Preencha os dados de entrega (✅)
4. Selecione o método de pagamento (cartão de crédito, boleto ou PIX) (✅)
5. Revise o pedido e confirme a compra (❌)
6. Acompanhe o status do pedido na página de pedidos (❌) 

### Autenticação

- Para acessar áreas protegidas, o usuário deve se registrar ou fazer login
- O token JWT é armazenado no localStorage e enviado em todas as requisições autenticadas

## API Endpoints

### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Autenticar usuário

### Produtos
- `GET /products` - Listar todos os produtos
- `GET /products/:id` - Obter detalhes de um produto

### Pedidos
- `POST /orders` - Criar novo pedido
- `GET /orders` - Listar pedidos do usuário autenticado
- `GET /orders/:id` - Obter detalhes de um pedido

## Formato de Dados

### Criação de Pedido

```json
{
  "items": [
    {
      "productId": 101,
      "quantity": 2,
      "price": 29.99
    }
  ],
  "total": 59.98,
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "Anytown",
    "state": "Anystate",
    "zip": "12345",
    "country": "USA"
  },
  "paymentMethod": {
    "type": "credit_card",
    "lastDigits": "4242"
  }
}
```

### Resposta de Pedido

```json
{
  "id": 1,
  "date": "2025-05-12T07:40:55.020Z",
  "status": "pending",
  "items": [
    {
      "productId": 101,
      "quantity": 2,
      "price": 29.99
    }
  ],
  "total": 59.98,
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "Anytown",
    "state": "Anystate",
    "zip": "12345",
    "country": "USA"
  },
  "paymentMethod": {
    "type": "credit_card",
    "lastDigits": "4242"
  },
  "createdAt": "2025-05-12T07:40:55.020Z",
  "updatedAt": "2025-05-12T07:40:55.020Z"
}
```

## Próximos ajustes para o Desenvolvimento

- Dockerizaçao ajustada para frontend
- Criação e leitura de pedidos e ordens
- Resolução de problemas para finalizar pedidos (ainda tem problemas de unificação para problemas, e as compras são enviadas utilizando ferramentas como Postman, Insomnia, etc.)
- Listagem do histórico de pedidos feitos por usuário e geral (visto por um admin)

## Como usar

- Pode-se criar uma nova conta no register ou utilzar a padrão seed
email: admin@admin.com
password: admin

- Seleção de produtos (mockados previamente) na página após a criação.
- Adição dos produtos no carrinho
- Visualização dos produtos e total no carrinho.
