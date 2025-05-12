'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { cartService } from '@/services/cart';

const steps = ['Endereço de Entrega', 'Pagamento', 'Revisão do Pedido'];

function getStepContent(step: number) {
  const [cart, setCart] = React.useState(cartService.getCart());

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = cartService.updateQuantity(productId, newQuantity);
    setCart(updatedCart);
  };

  const handleRemoveItem = (productId: number) => {
    const updatedCart = cartService.removeItem(productId);
    setCart(updatedCart);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  switch (step) {
    case 0:
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Endereço de Entrega
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              required
              id="firstName"
              name="firstName"
              label="Nome"
              fullWidth
              autoComplete="given-name"
              variant="outlined"
            />
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Sobrenome"
              fullWidth
              autoComplete="family-name"
              variant="outlined"
            />
            <TextField
              required
              id="address1"
              name="address1"
              label="Endereço"
              fullWidth
              autoComplete="shipping address-line1"
              variant="outlined"
            />
            <TextField
              id="address2"
              name="address2"
              label="Complemento"
              fullWidth
              autoComplete="shipping address-line2"
              variant="outlined"
            />
            <TextField
              required
              id="city"
              name="city"
              label="Cidade"
              fullWidth
              autoComplete="shipping address-level2"
              variant="outlined"
            />
            <TextField
              required
              id="state"
              name="state"
              label="Estado"
              fullWidth
              variant="outlined"
            />
            <TextField
              required
              id="zip"
              name="zip"
              label="CEP"
              fullWidth
              autoComplete="shipping postal-code"
              variant="outlined"
            />
            <TextField
              required
              id="country"
              name="country"
              label="País"
              fullWidth
              autoComplete="shipping country"
              variant="outlined"
            />
            <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
              <FormControlLabel
                control={
                  <Checkbox color="primary" name="saveAddress" value="yes" />
                }
                label="Usar este endereço para pagamento"
              />
            </Box>
          </Box>
        </Box>
      );
    case 1:
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Detalhes do Pagamento
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              required
              id="cardName"
              label="Nome no Cartão"
              fullWidth
              autoComplete="cc-name"
              variant="outlined"
            />
            <TextField
              required
              id="cardNumber"
              label="Número do Cartão"
              fullWidth
              autoComplete="cc-number"
              variant="outlined"
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                required
                id="expDate"
                label="Data de Expiração"
                fullWidth
                autoComplete="cc-exp"
                variant="outlined"
              />
              <TextField
                required
                id="cvv"
                label="CVV"
                fullWidth
                autoComplete="cc-csc"
                variant="outlined"
              />
            </Box>
            <FormControlLabel
              control={<Checkbox color="primary" name="saveCard" value="yes" />}
              label="Lembrar detalhes do cartão para a próxima vez"
            />
          </Box>
        </Box>
      );
    case 2:
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Revisão do Pedido
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {cart.items.map((item) => (
              <Card key={item.product.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr auto' }, gap: 2, alignItems: 'center' }}>
                    <Box sx={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1">{item.product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatPrice(item.product.price)} cada
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) {
                            handleUpdateQuantity(item.product.id, value);
                          }
                        }}
                        inputProps={{
                          min: 1,
                          style: { textAlign: 'center', width: '40px' }
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Typography variant="subtitle1">
                      Subtotal: {formatPrice(item.product.price * item.quantity)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
            {cart.items.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Seu carrinho está vazio
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => window.location.href = '/home'}
                >
                  Continuar Comprando
                </Button>
              </Box>
            )}
            {cart.items.length > 0 && (
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="h6">
                  Total: {formatPrice(cart.total)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      );
    default:
      throw new Error('Etapa desconhecida');
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
            <Card>
              <CardContent>
                <Stepper 
                  activeStep={activeStep} 
                  sx={{ 
                    mb: 4,
                    '& .MuiStep-root:first-of-type': { pl: 0 },
                    '& .MuiStep-root:last-of-type': { pr: 0 }
                  }}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {activeStep === steps.length ? (
                  <Stack spacing={2} useFlexGap>
                    <Typography variant="h1">📦</Typography>
                    <Typography variant="h5">
                      Obrigado pelo seu pedido!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Seu número de pedido é <strong>#140396</strong>. Enviamos um
                      email de confirmação e atualizaremos você quando o pedido for
                      enviado.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ alignSelf: 'start' }}
                      onClick={() => window.location.href = '/home'}
                    >
                      Voltar para a loja
                    </Button>
                  </Stack>
                ) : (
                  <React.Fragment>
                    {getStepContent(activeStep)}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                      {activeStep !== 0 && (
                        <Button
                          startIcon={<ChevronLeftRoundedIcon />}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Voltar
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        endIcon={<ChevronRightRoundedIcon />}
                        onClick={handleNext}
                      >
                        {activeStep === steps.length - 1 ? 'Finalizar Pedido' : 'Próximo'}
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumo do Pedido
                </Typography>
                {cartService.getCart().items.map((item) => (
                  <Box key={item.product.id} sx={{ my: 1 }}>
                    <Typography>
                      {item.product.name} x {item.quantity}
                    </Typography>
                    <Typography color="text.secondary">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">
                  Total: R$ {cartService.getCart().total.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}