
import { useLocation } from "react-router-dom";
import React, { useEffect} from 'react';
import { useCartPersistence } from '@/hooks/useCartPersistence';
import Header from '@/components/Header';

const PrivacyPolicy = () => {
  const location = useLocation();
  const { cartItems, setCartItems} = useCartPersistence();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
      <div className="min-h-screen bg-gray-50">
            <Header
              cartItemsCount={cartItems.length}
              onCartClick={() => {}}
              onSetCartItems={setCartItems}
            />
     <main className="container mx-auto px-4 py-8 space-y-6">
       <div className="max-w-3xl mx-auto px-4 py-10">
         <h1 className="text-3xl font-bold text-blue-700 mb-4">Privacy Policy</h1>
         <p className="mb-4 text-sm text-gray-600">Effective Date: July 4, 2025</p>

         <p className="mb-6">
           At <strong>Arihant Medigens</strong>, your privacy is important to us. Our mobile application is designed to display our range of products only. We do not collect, store, or track any kind of personal data from our users.
         </p>

         <h2 className="text-xl font-semibold text-gray-800 mb-2">1. No Data Collection</h2>
         <p className="mb-6">
           Our app does not collect any personal information such as your name, phone number, email address, location, or device data. We do not use cookies, analytics tools, or trackers of any kind.
         </p>

         <h2 className="text-xl font-semibold text-gray-800 mb-2">2. User-Initiated Communication</h2>
         <p className="mb-6">
           If you choose to place an order, you may voluntarily contact us via WhatsApp. Any information you share (such as your name, phone number, or address) is provided by you directly through WhatsApp and is not collected by our app.
         </p>

         <h2 className="text-xl font-semibold text-gray-800 mb-2">3. No Third-Party Access</h2>
         <p className="mb-6">
           Our app does not integrate with any third-party services or platforms that collect your information. We do not sell, rent, or share user data with anyone.
         </p>

         <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Children's Privacy</h2>
         <p className="mb-6">
           Since we do not collect any user data, our app does not knowingly collect or process any information from children under the age of 13.
         </p>

         <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Updates to This Policy</h2>
         <p className="mb-6">
           If our practices change, we will update this Privacy Policy accordingly. Any changes will be posted within the app and will be effective from the updated date.
         </p>

         <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Contact Us</h2>
         <p className="mb-4">
           If you have any questions about this Privacy Policy, feel free to contact us:
         </p>

         <div className="bg-white border p-4 shadow rounded">
           <p><strong>Arihant Medigens</strong></p>
           <p>📧 Email: <a href="mailto:info@arihantmedigens.com" className="text-blue-600">info@arihantmedigens.com</a></p>
           <p>📞 Phone: <a href="tel:+919856686156" className="text-blue-600">+91-9856686156</a></p>
         </div>
         </div>
      </main>
      </div>
  );
};

export default PrivacyPolicy;
