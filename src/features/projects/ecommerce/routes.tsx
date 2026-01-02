import { Route, Routes } from 'react-router-dom';
import EcommerceLayout from './layout/EcommerceLayout';
import CatalogPage from './pages/CatalogPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductDetailPage from './pages/ProductDetailPage';

export default function EcommerceRoutes() {
  return (
    <Routes>
      <Route element={<EcommerceLayout />}>
        <Route index element={<CatalogPage />} />
        <Route path="producto/:id" element={<ProductDetailPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="*" element={<div>Página no encontrada en tienda</div>} />
      </Route>
    </Routes>
  );
}
