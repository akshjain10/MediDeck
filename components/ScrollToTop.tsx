@@ .. @@
 import { useEffect } from 'react';
-import { useLocation } from 'react-router-dom';
+import { usePathname } from 'next/navigation';

 const ScrollToTop = () => {
-  const { pathname } = useLocation();
+  const pathname = usePathname();