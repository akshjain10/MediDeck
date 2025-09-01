@@ .. @@
     if (quantity && typeof quantity === 'number' && quantity > 0) {
-          message += `Requested Quantity: ${quantity} pcs\n`;
+      message += `📦 Requested Quantity: ${quantity} pcs\n`;
     }
 
-    message += `\n📱 Please provide more details about availability and pricing of this product.\n`;
+    // Add product image to WhatsApp message
+    const imageUrl = `${window.location.origin}/images/products/${product.id}.webp`;
+    message += `\n📸 Product Image: ${imageUrl}\n`;
+    message += `\n📱 Please provide more details about availability and pricing of this product.\n`;