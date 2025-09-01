@@ .. @@
     cartItems.forEach((item, index) => {
       const itemTotal = item.mrp * item.quantity;
       total += itemTotal;
-      message += `${index + 1}. ${item.name}-`;
-      message += `${item.quantity} pc\n`;
+      message += `${index + 1}. ${item.name} - ${item.quantity} pc\n`;
+      // Add product image for each item
+      const imageUrl = `${window.location.origin}/images/products/${item.id}.webp`;
+      message += `   📸 Image: ${imageUrl}\n`;
     });
 
+    message += `\n💰 Total Items: ${cartItems.length}\n`;
     message += `\n🕒 Order Time: ${new Date().toLocaleString()}`;