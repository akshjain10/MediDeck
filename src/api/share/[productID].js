import { useProducts } from '@/hooks/useProducts';

export default function handler(req, res) {
  const { productId } = req.query;
  const { products } = useProducts();
  const product = products.find(p => p.id === productId);
  // Fetch product data (replace with your actual data source)

  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="${product.brandName}" />
        <meta property="og:description" content="MRP ₹${product.mrp}" />
        <meta property="og:image" content="${window.location.origin}/products/${productId}.webp" />
        <meta property="og:url" content="${window.location.origin}/products/${productId}" />
      </head>
      <body></body>
    </html>
  `);
}