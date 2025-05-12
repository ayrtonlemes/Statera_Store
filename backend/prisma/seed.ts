import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar um usuário de teste

  const user = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      name: 'Usuário Teste',
      password: 'admin', //geralmente as senhas são criptografadas
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