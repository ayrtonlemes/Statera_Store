import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient, OrderStatus, Prisma } from '@prisma/client';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();

// Extende o tipo Request para incluir o usuário
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

// Middleware de autenticação
const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: number; email: string };
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Aplica o middleware de autenticação em todas as rotas
router.use(authenticateToken);

// Middleware para garantir que todas as respostas sejam JSON
router.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Schema de validação para criação de pedido
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1),
    price: z.number().positive(),
  })),
  total: z.number().positive(),
  // Agora aceitamos tanto a estrutura aninhada (do frontend) quanto a estrutura plana (do Insomnia)
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }).optional(),
  // Campos individuais para compatibilidade com o Insomnia
  shippingFirstName: z.string().optional(),
  shippingLastName: z.string().optional(),
  shippingAddress1: z.string().optional(),
  shippingAddress2: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingZip: z.string().optional(),
  shippingCountry: z.string().optional(),
  // Estrutura aninhada para payment
  paymentMethod: z.object({
    type: z.enum(['credit_card', 'boleto', 'pix']),
    lastDigits: z.string().optional(),
  }).optional(),
  // Campo individual para compatibilidade com o Insomnia
  paymentMethodType: z.string().optional(),
  paymentLastDigits: z.string().optional(),
});

// Criar um novo pedido
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    // Log dos dados recebidos
    console.log('Received order data:', {
      body: req.body,
      user: req.user,
    });

    const data = createOrderSchema.parse(req.body);
    const clientId = req.user?.id;

    if (!clientId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Log dos dados validados
    console.log('Validated order data:', {
      data,
      clientId,
    });

    // Extrair os campos de endereço e pagamento da estrutura aninhada ou dos campos individuais
    const shippingFirstName = data.shippingAddress?.firstName || data.shippingFirstName;
    const shippingLastName = data.shippingAddress?.lastName || data.shippingLastName;
    const shippingAddress1 = data.shippingAddress?.address1 || data.shippingAddress1;
    const shippingAddress2 = data.shippingAddress?.address2 || data.shippingAddress2;
    const shippingCity = data.shippingAddress?.city || data.shippingCity;
    const shippingState = data.shippingAddress?.state || data.shippingState;
    const shippingZip = data.shippingAddress?.zip || data.shippingZip;
    const shippingCountry = data.shippingAddress?.country || data.shippingCountry;
    
    const paymentMethodType = data.paymentMethod?.type || data.paymentMethodType || 'CREDIT_CARD';
    const paymentLastDigits = data.paymentMethod?.lastDigits || data.paymentLastDigits;

    // Cria o pedido usando a estrutura correta do Prisma
    const order = await prisma.order.create({
      data: {
        client: {
          connect: { id: clientId }
        },
        total: data.total,
        status: OrderStatus.PENDING,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        shippingFirstName,
        shippingLastName,
        shippingAddress1,
        shippingAddress2: shippingAddress2 || null,
        shippingCity,
        shippingState,
        shippingZip,
        shippingCountry,
        paymentMethodType: paymentMethodType.toUpperCase() as 'CREDIT_CARD' | 'BOLETO' | 'PIX',
        paymentLastDigits: paymentLastDigits || null,
      },
      include: {
        items: true,
        client: true,
      },
    });

    // Log do pedido criado
    console.log('Created order:', order);

    // Transforma o pedido para o formato esperado pelo frontend
    const formattedOrder = {
      id: order.id,
      date: order.createdAt.toISOString(),
      status: order.status.toLowerCase(),
      items: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      shippingAddress: {
        firstName: order.shippingFirstName,
        lastName: order.shippingLastName,
        address1: order.shippingAddress1,
        address2: order.shippingAddress2,
        city: order.shippingCity,
        state: order.shippingState,
        zip: order.shippingZip,
        country: order.shippingCountry,
      },
      paymentMethod: {
        type: order.paymentMethodType.toLowerCase(),
        lastDigits: order.paymentLastDigits,
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    res.status(201).json(formattedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.errors,
        receivedData: req.body,
      });
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

// Listar pedidos do usuário
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const orders = await prisma.order.findMany({
      where: {
        clientId,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transforma os pedidos para o formato esperado pelo frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      date: order.createdAt.toISOString(),
      status: order.status.toLowerCase(),
      items: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      shippingAddress: {
        firstName: order.shippingFirstName,
        lastName: order.shippingLastName,
        address1: order.shippingAddress1,
        address2: order.shippingAddress2,
        city: order.shippingCity,
        state: order.shippingState,
        zip: order.shippingZip,
        country: order.shippingCountry,
      },
      paymentMethod: {
        type: order.paymentMethodType.toLowerCase(),
        lastDigits: order.paymentLastDigits,
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar um pedido específico
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const orderId = parseInt(id);
    const clientId = req.user?.id;

    if (!clientId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'ID de pedido inválido' });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        clientId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Transforma o pedido para o formato esperado pelo frontend
    const formattedOrder = {
      id: order.id,
      date: order.createdAt.toISOString(),
      status: order.status.toLowerCase(),
      items: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      shippingAddress: {
        firstName: order.shippingFirstName,
        lastName: order.shippingLastName,
        address1: order.shippingAddress1,
        address2: order.shippingAddress2,
        city: order.shippingCity,
        state: order.shippingState,
        zip: order.shippingZip,
        country: order.shippingCountry,
      },
      paymentMethod: {
        type: order.paymentMethodType.toLowerCase(),
        lastDigits: order.paymentLastDigits,
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router; 