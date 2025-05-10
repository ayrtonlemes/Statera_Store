import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar um usuário de teste

  const user = await prisma.user.create({
    data: {
      email: 'teste@exemplo.com',
      name: 'Usuário Teste',
      password: '123456', //geralmente as senhas são criptografadas
    },
  });

  console.log('Created test user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 