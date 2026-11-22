import {
	AnimatePresence,
	motion,
	useReducedMotion,
	useScroll,
	useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoZero from "@/assets/zerocode-horizontal-optimized.webp";
import { cn } from "@/lib/utils";

const navLinks = [
	{ code: "01", label: "Estudio", href: "#sobre-mi" },
	{ code: "02", label: "Servicios", href: "#servicio" },
	{ code: "03", label: "Proyectos", href: "#projects" },
	{ code: "04", label: "Metodología", href: "#proceso" },
	{ code: "05", label: "Tarifas", href: "#tarifas" },
	{ code: "06", label: "FAQs", href: "#preguntas" },
	{ code: "07", label: "Contacto", href: "#contacto" },
];

export function Navbar() {
	const navigate = useNavigate();
	const prefersReducedMotion = useReducedMotion() ?? false;
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 120,
		damping: 30,
		restDelta: 0.001,
	});

	useEffect(() => {
		const handleScroll = () => setIsScrolled(globalThis.scrollY > 16);
		globalThis.addEventListener("scroll", handleScroll, { passive: true });
		return () => globalThis.removeEventListener("scroll", handleScroll);
	}, []);

	const handleNavClick = (href: string) => {
		setIsMenuOpen(false);
		if (href.startsWith("#")) {
			const element = document.querySelector(href);
			if (element) {
				const headerHeight =
					document.querySelector("header")?.getBoundingClientRect().height ?? 0;
				const targetTop =
					element.getBoundingClientRect().top +
					globalThis.scrollY -
					headerHeight;
				globalThis.scrollTo({
					top: targetTop,
					behavior: prefersReducedMotion ? "auto" : "smooth",
				});
			} else {
				Promise.resolve(navigate(`/${href}`)).catch(() => undefined);
			}
		} else {
			Promise.resolve(navigate(href)).catch(() => undefined);
			globalThis.scrollTo({
				top: 0,
				behavior: prefersReducedMotion ? "auto" : "smooth",
			});
		}
	};

	return (
		<header
			className={cn(
				"fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
				isScrolled
					? "border-white/15 bg-[#09090B]/95 backdrop-blur-md"
					: "border-white/10 bg-[#09090B]/90 backdrop-blur-sm",
			)}
		>
			{!prefersReducedMotion && (
				<motion.div
					style={{ scaleX }}
					className="fixed left-0 right-0 top-0 z-50 h-0.5 origin-left bg-[#0077CC]"
					aria-hidden="true"
				/>
			)}

			<div className="container-custom">
				<nav
					aria-label="Navegación principal"
					className="flex min-h-16 md:min-h-18 items-center justify-between gap-6"
				>
					<a
						href="/"
						className="group flex shrink-0 items-center rounded-md transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077CC]"
						onClick={(event) => {
							event.preventDefault();
							handleNavClick("/");
						}}
						aria-label="ZeroCode DevOps, inicio"
					>
						<img
							src={logoZero}
							alt="ZeroCode DevOps"
							className="h-12 w-44 object-contain sm:h-14 sm:w-52"
							fetchPriority="high"
						/>
					</a>

					<div className="hidden items-center gap-7 xl:flex">
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="group inline-flex items-baseline gap-1.5 rounded-sm py-1.5 text-sm font-medium text-[#F7F6F3]/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077CC]"
								onClick={(event) => {
									event.preventDefault();
									handleNavClick(link.href);
								}}
							>
								<span className="font-tech text-[10px] text-[#0077CC]">
									{link.code}
								</span>
								<span>{link.label}</span>
							</a>
						))}
					</div>

					<div className="flex items-center gap-2.5 sm:gap-3">
						<button
							type="button"
							className="group hidden min-h-11 items-center gap-2.5 rounded-full bg-[#F7F6F3] px-5 text-xs font-medium uppercase tracking-widest text-[#111111] transition-colors duration-300 hover:bg-[#0077CC] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC] active:scale-[0.98] sm:inline-flex"
							onClick={() => handleNavClick("#contacto")}
						>
							<span>Solicitar propuesta</span>
							<span
								className="h-1.5 w-1.5 rounded-full bg-[#0077CC] transition-colors group-hover:bg-white"
								aria-hidden="true"
							/>
						</button>

						<button
							type="button"
							className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/25 bg-[#141418] px-4 text-xs font-medium uppercase tracking-widest text-[#F7F6F3] transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC] active:scale-[0.98] xl:hidden"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							aria-expanded={isMenuOpen}
							aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
						>
							<span>{isMenuOpen ? "Cerrar" : "Menú"}</span>
							<span className="flex items-center gap-1" aria-hidden="true">
								<span className="h-1 w-1 rounded-full bg-[#F7F6F3]" />
								<span className="h-1 w-1 rounded-full bg-[#0077CC]" />
							</span>
						</button>
					</div>
				</nav>
			</div>

			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
						transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
						className="fixed inset-x-0 top-16 md:top-18 z-40 border-b border-[#E2DFD7] bg-[#F4F3EF] shadow-2xl"
					>
						<div className="container-custom py-8">
							<div className="mb-4 flex items-center justify-between border-b border-[#E2DFD7] pb-3">
								<span className="font-tech text-[11px] uppercase tracking-widest text-[#5C5B57]">
									<span>NAVEGACIÓN</span> <span>{"//"}</span>{" "}
									<span>ZEROCODE DEVOPS</span>
								</span>
								<span className="font-tech text-[11px] uppercase tracking-widest text-[#0077CC]">
									ENFOQUE REMOTO
								</span>
							</div>

							<div className="grid gap-2 md:grid-cols-2 md:gap-x-10">
								{navLinks.map((link) => (
									<a
										key={link.href}
										href={link.href}
										className="group flex min-h-14 items-center justify-between border-b border-[#E2DFD7] text-lg font-medium text-[#111111] transition-colors hover:text-[#0077CC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC]"
										onClick={(event) => {
											event.preventDefault();
											handleNavClick(link.href);
										}}
									>
										<span>{link.label}</span>
										<span className="font-tech text-xs text-[#5C5B57] transition-colors group-hover:text-[#0077CC]">
											<span>{link.code}</span> <span>/</span>
										</span>
									</a>
								))}
							</div>

							<div className="mt-6 flex flex-wrap items-center justify-between gap-4">
								<p className="text-sm text-[#5C5B57]">
									Diseño web y Producto Digital a medida.
								</p>
								<button
									type="button"
									className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#111111] px-6 text-xs font-medium uppercase tracking-widest text-[#F4F3EF] transition-colors hover:bg-[#0077CC] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC]"
									onClick={() => handleNavClick("#contacto")}
								>
									<span>Solicitar propuesta</span>
									<ArrowUpRight
										className="h-4 w-4"
										strokeWidth={1.75}
										aria-hidden="true"
									/>
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
