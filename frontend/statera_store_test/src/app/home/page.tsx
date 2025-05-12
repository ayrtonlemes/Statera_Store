"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Badge,
  Snackbar,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { productsService, Product } from "@/services/products";
import { cartService, Cart } from "@/services/cart";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const mockProducts: Product[] = [
          {
            id: 1,
            name: "Smartphone XYZ",
            description: "Último modelo com câmera de alta resolução",
            price: 1999.99,
            imageUrl: "https://via.placeholder.com/300x200",
            stock: 10,
          },
          {
            id: 2,
            name: "Notebook Pro",
            description: "Notebook potente para trabalho e jogos",
            price: 4999.99,
            imageUrl: "https://via.placeholder.com/300x200",
            stock: 5,
          },
          {
            id: 3,
            name: "Smart TV 4K",
            description: "TV com resolução 4K e HDR",
            price: 2999.99,
            imageUrl: "https://via.placeholder.com/300x200",
            stock: 8,
          },
          {
            id: 4,
            name: "Fone de Ouvido Bluetooth",
            description: "Fone sem fio com cancelamento de ruído",
            price: 299.99,
            imageUrl: "https://via.placeholder.com/300x200",
            stock: 15,
          },
          {
            id: 5,
            name: "Smartwatch",
            description: "Relógio inteligente com monitor cardíaco",
            price: 799.99,
            imageUrl: "https://via.placeholder.com/300x200",
            stock: 12,
          },
        ];
        setProducts(mockProducts);
        // Outra Opção caso seja usado produto cadastrados no banco de dados, por enquanto é usado mock
        // const data = await productsService.getProducts();
        // setProducts(data);
      } catch (err) {
        setError("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Carregar carrinho do localStorage
    setCart(cartService.getCart());
  }, []);

  const handleAddToCart = (product: Product) => {
    const updatedCart = cartService.addItem(product);
    setCart(updatedCart);
    setSnackbar({
      open: true,
      message: `${product.name} adicionado ao carrinho!`,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Produtos em Destaque
          </Typography>
          <IconButton
            color="primary"
            onClick={() => router.push("/checkout")}
            sx={{ ml: 2 }}
          >
            <Badge badgeContent={cart.items.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Box component="div" sx={{ width: { xs: "100%", sm: "50%", md: "33.33%" }, p: 1.5 }} key={product.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl}
                  alt={product.name}
                  sx={{ cursor: "pointer" }}
                  onClick={() => router.push(`/products/${product.id}`)}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {formatPrice(product.price)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={product.stock > 0 ? "success.main" : "error.main"}
                    >
                      {product.stock > 0
                        ? `${product.stock} em estoque`
                        : "Fora de estoque"}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddShoppingCartIcon />}
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    Adicionar ao Carrinho
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
