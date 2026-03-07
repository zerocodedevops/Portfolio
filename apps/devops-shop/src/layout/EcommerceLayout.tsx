import { Cpu, LogOut, Moon, ShoppingCart, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import AuthModal from "../components/AuthModal";
import CartSidebar from "../components/CartSidebar";
import ScrollToTop from "../components/ScrollToTop";
import { logout } from "../store/authSlice";
import { toggleCart } from "../store/cartSlice";
import type { RootState } from "../store/store";

function Navbar() {
	const dispatch = useDispatch();
	const { i18n } = useTranslation();
	const [isAuthOpen, setIsAuthOpen] = useState(false);
	const [isDark, setIsDark] = useState(() =>
		document.documentElement.classList.contains("dark"),
	);
	const cartItems = useSelector((state: RootState) => state.cart.items);

	const toggleTheme = () => {
		const newDark = !isDark;
		setIsDark(newDark);
		if (newDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};
	const { user, isAuthenticated } = useSelector(
		(state: RootState) => state.auth,
	);
	const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

	return (
		<>
			<nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 transition-colors">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						<Link to="/" className="flex items-center gap-2 group">
							<div className="bg-slate-900 dark:bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-600 transition-colors">
								<Cpu className="w-5 h-5 text-white" />
							</div>
							<span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
								DevOps Shop
							</span>
						</Link>

						<div className="flex items-center gap-4">
							<Link
								to="/"
								className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors hidden md:block"
							>
								← Inicio
							</Link>

							<div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />

							{/* Theme Toggle */}
							<button
								type="button"
								onClick={toggleTheme}
								className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
								title={isDark ? "Modo Claro" : "Modo Oscuro"}
							>
								{isDark ? (
									<Sun className="w-5 h-5" />
								) : (
									<Moon className="w-5 h-5" />
								)}
							</button>

							{/* Language Toggle */}
							<div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-lg p-1 mr-2">
								<button
									type="button"
									onClick={() => i18n.changeLanguage("es")}
									className={`px-2 py-1 text-xs font-medium rounded transition-colors ${i18n.language === "es" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-indigo-600 dark:text-slate-400"}`}
								>
									ES
								</button>
								<button
									type="button"
									onClick={() => i18n.changeLanguage("en")}
									className={`px-2 py-1 text-xs font-medium rounded transition-colors ${i18n.language === "en" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-indigo-600 dark:text-slate-400"}`}
								>
									EN
								</button>
							</div>

							{/* Auth Button */}
							{isAuthenticated && user ? (
								<div className="flex items-center gap-3 pl-2">
									<span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">
										Hola,{" "}
										<span className="text-indigo-600 dark:text-indigo-400">
											{user.username}
										</span>
									</span>
									<button
										type="button"
										onClick={() => dispatch(logout())}
										className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
										title="Cerrar sesión"
									>
										<LogOut className="w-5 h-5" />
									</button>
								</div>
							) : (
								<button
									type="button"
									onClick={() => setIsAuthOpen(true)}
									className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all"
								>
									<User className="w-5 h-5" />
									<span className="hidden sm:inline">Entrar</span>
								</button>
							)}

							<button
								type="button"
								onClick={() => dispatch(toggleCart())}
								className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
							>
								<ShoppingCart className="w-6 h-6" />
								{itemCount > 0 && (
									<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in shadow-sm">
										{itemCount}
									</span>
								)}
							</button>
						</div>
					</div>
				</div>
			</nav>

			<AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
		</>
	);
}

export default function EcommerceLayout() {
	useEffect(() => {
		document.title = "Catálogo | DevOps Shop";
	}, []);

	return (
		<>
			<ScrollToTop />
			<div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
				<Navbar />
				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<Outlet />
				</main>
				<CartSidebar />
			</div>
		</>
	);
}
