import { createHashRouter } from "react-router-dom";
import EcommerceLayout from "./layout/EcommerceLayout";
import CatalogPage from "./pages/CatalogPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetailPage from "./pages/ProductDetailPage";

export const router = createHashRouter([
	{
		path: "/",
		element: <EcommerceLayout />,
		children: [
			{
				index: true,
				element: <CatalogPage />,
			},
			{
				path: "producto/:id",
				element: <ProductDetailPage />,
			},
			{
				path: "checkout",
				element: <CheckoutPage />,
			},
		],
	},
]);
