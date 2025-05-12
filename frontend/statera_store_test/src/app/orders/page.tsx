'use client';

import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  IconButton,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { orderService, Order } from '@/services/order';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
} as const;

const statusLabels = {
  pending: 'Pendente',
  processing: 'Processando',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
} as const;

const paymentMethodLabels = {
  credit_card: 'Cartão de Crédito',
  boleto: 'Boleto Bancário',
  pix: 'PIX',
} as const;

function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

function formatDate(date: string) {
  return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
    locale: ptBR,
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [expandedOrder, setExpandedOrder] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadOrders = async () => {
      const currentOrders = await orderService.getOrders();
      setOrders(currentOrders);
      orderService.simulateOrderUpdates();
    };

    loadOrders();
    // Atualiza a lista a cada 5 segundos para pegar mudanças de status
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExpandOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (orders.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Você ainda não tem pedidos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.href = '/home'}
        >
          Fazer uma compra
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Meus Pedidos
      </Typography>
      <Box sx={{ display: 'grid', gap: 2 }}>
        {orders.map((order) => (
          <Card key={order.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1">
                    Pedido #{order.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(order.date)}
                  </Typography>
                </Box>
                <Box>
                  <Chip
                    label={statusLabels[order.status]}
                    color={statusColors[order.status]}
                    size="small"
                  />
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle1">
                    {formatPrice(order.total)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleExpandOrder(order.id)}
                  >
                    {expandedOrder === order.id ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={expandedOrder === order.id}>
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Itens do Pedido
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 1, mb: 2 }}>
                    {order.items.map((item) => (
                      <Box
                        key={item.product.id}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'auto 1fr auto',
                          gap: 2,
                          alignItems: 'center',
                        }}
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: 'contain',
                          }}
                        />
                        <Box>
                          <Typography variant="body2">
                            {item.product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantity} x {formatPrice(item.product.price)}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {formatPrice(item.product.price * item.quantity)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Endereço de Entrega
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingAddress.address1}
                        {order.shippingAddress.address2 && `, ${order.shippingAddress.address2}`}
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingAddress.country}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Forma de Pagamento
                      </Typography>
                      <Typography variant="body2">
                        {paymentMethodLabels[order.paymentMethod.type]}
                        {order.paymentMethod.lastDigits && ` (****${order.paymentMethod.lastDigits})`}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
