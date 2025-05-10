# Loja Statera

Backend de uma loja virtual desenvolvido com NestJS, Prisma e MySQL.

## Requisitos

- Node.js (v20 ou superior)
- MySQL (v8.0)
- npm ou yarn

## Configuração do Ambiente

### 1. Clone o repositório
```bash
git clone https://github.com/ayrtonlemes/Statera_Store.git
cd Loja_Statera
```

### 2. Instale as dependências
```bash
cd backend
npm install
```

### 3. Configure o banco de dados MySQL

1. Instale o MySQL se ainda não tiver:
```bash
sudo apt update
sudo apt install mysql-server
```

2. Inicie o serviço do MySQL:
```bash
sudo systemctl start mysql
```

3. Crie o banco de dados e usuário:
```sql
CREATE DATABASE loja_statera;
CREATE USER 'statera_user'@'localhost' IDENTIFIED BY 'statera123';
GRANT ALL PRIVILEGES ON loja_statera.* TO 'statera_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `backend` com o seguinte conteúdo:
```env
DATABASE_URL="mysql://statera_user:statera123@localhost:3306/loja_statera"
BCRYPT_ROUNDS=10
```

### 5. Execute as migrations do Prisma

```bash
# Gera o cliente Prisma
npm run prisma:generate

# Cria as tabelas no banco de dados
npm run prisma:migrate
```

## Executando o Projeto

### Desenvolvimento Local

1. Inicie o servidor em modo de desenvolvimento:
```bash
npm run start:dev
```

O servidor estará disponível em `http://localhost:3000`

### Produção

1. Compile o projeto:
```bash
npm run build
```

2. Inicie o servidor em modo de produção:
```bash
npm run start:prod
```

## Rotas da API

### Usuários (`/users`)

- `POST /users` - Criar novo usuário
- `GET /users` - Listar todos os usuários
- `GET /users/:id` - Buscar usuário por ID
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

### Pedidos (`/orders`)

- `POST /orders` - Criar novo pedido
- `GET /orders` - Listar todos os pedidos
- `GET /orders/:id` - Buscar pedido por ID
- `PATCH /orders/:id` - Atualizar pedido
- `DELETE /orders/:id` - Deletar pedido

## Estrutura do Projeto

```
backend/
├── src/
│   ├── users/           # Módulo de usuários
│   ├── orders/          # Módulo de pedidos
│   ├── prisma/          # Configuração do Prisma
│   └── main.ts          # Ponto de entrada da aplicação
├── prisma/
│   └── schema.prisma    # Schema do banco de dados
└── package.json         # Dependências e scripts
```

## Scripts Disponíveis

- `npm run start` - Inicia o servidor
- `npm run start:dev` - Inicia o servidor em modo de desenvolvimento com hot-reload
- `npm run build` - Compila o projeto
- `npm run start:prod` - Inicia o servidor em modo de produção
- `npm run prisma:generate` - Gera o cliente Prisma
- `npm run prisma:migrate` - Executa as migrations do banco de dados
- `npm run prisma:seed` - Popula o banco com dados iniciais

## Tecnologias Utilizadas

- NestJS - Framework Node.js
- Prisma - ORM
- MySQL - Banco de dados
- TypeScript - Linguagem de programação
- Docker - Containerização

## Próximos passos para desenvolvimento:

- Aplicação Frontend
- Dockerização ajustada
