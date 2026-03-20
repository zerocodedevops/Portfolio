import { Route, Routes } from "react-router-dom";
import EcommerceLayout from "./layout/EcommerceLayout";
import CatalogPage from "./pages/CatalogPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetailPage from "./pages/ProductDetailPage";

export const EcommerceRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EcommerceLayout />}>
        <Route index element={<CatalogPage />} />
        <Route path="producto/:id" element={<ProductDetailPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>
    </Routes>
  );
};

export default EcommerceRoutes;
