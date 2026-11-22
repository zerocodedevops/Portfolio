import { motion } from "framer-motion";
import { ArrowUp, Mail, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import footerLogo from "@/assets/zerocode-horizontal-optimized.webp";

const socialLinks = [
	{ icon: Mail, href: "mailto:admin@zerocode-devops.com", label: "Email" },
	{ icon: MessageCircle, href: "https://wa.me/34912622712", label: "WhatsApp" },
];

const footerLinks = [
	{ code: "01", label: "Estudio", href: "/#sobre-mi" },
	{ code: "02", label: "Servicios", href: "/#servicio" },
	{ code: "03", label: "Proyectos", href: "/#projects" },
	{ code: "04", label: "Metodología", href: "/#proceso" },
	{ code: "05", label: "Tarifas", href: "/#tarifas" },
	{ code: "06", label: "FAQs", href: "/#preguntas" },
	{ code: "07", label: "Contacto", href: "/#contacto" },
];

const resourceLinks = [
	{ label: "Aviso legal", href: "/aviso-legal" },
	{ label: "Privacidad", href: "/politica-de-privacidad" },
	{ label: "Cookies", href: "/politica-de-cookies" },
];

export function Footer() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const handleNavClick = (href: string) => {
		if (href.startsWith("https://")) {
			globalThis.window.location.href = href;
			return;
		}
		if (href.startsWith("/#")) {
			const hash = href.slice(1);
			const element = document.querySelector(hash);
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			} else {
				Promise.resolve(navigate("/")).catch(() => undefined);
				setTimeout(
					() =>
						document
							.querySelector(hash)
							?.scrollIntoView({ behavior: "smooth" }),
					100,
				);
			}
			return;
		}
		if (href.startsWith("#")) {
			const element = document.querySelector(href);
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			} else {
				Promise.resolve(navigate("/")).catch(() => undefined);
				setTimeout(() => {
					document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
				}, 100);
			}
		} else {
			Promise.resolve(navigate(href)).catch(() => undefined);
			globalThis.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const scrollToTop = () => {
		globalThis.scrollTo({ top: 0, behavior: "smooth" });
	};

	const currentYear = new Date().getFullYear();

	return (
		<footer className="relative border-t border-white/10 bg-[#09090B] text-[#F7F6F3]">
			<motion.button
				type="button"
				onClick={scrollToTop}
				className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-[#0077CC] p-2.5 text-white shadow-lg transition-colors hover:bg-white hover:text-[#111111]"
				whileHover={{ scale: 1.08, y: -2 }}
				whileTap={{ scale: 0.95 }}
				aria-label={t("footer.scrollButton")}
			>
				<ArrowUp className="h-4 w-4" />
			</motion.button>

			<div className="container-custom pt-10 pb-7 md:pt-12 md:pb-8">
				<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1.55fr)_minmax(0,0.85fr)] lg:gap-10">
					{/* Columna 1: Marca */}
					<div className="text-center lg:text-left">
						<motion.a
							href="/"
							className="mx-auto inline-flex items-center justify-center lg:mx-0 lg:justify-start"
							whileHover={{ scale: 1.02 }}
							onClick={(e) => {
								e.preventDefault();
								handleNavClick("/");
							}}
						>
							<img
								src={footerLogo}
								alt="ZeroCode DevOps"
								className="h-11 w-38 object-contain"
							/>
						</motion.a>
						<p className="mx-auto mt-2.5 max-w-[34ch] text-xs leading-relaxed text-white/60 lg:mx-0">
							ZeroCode DevOps — Estudio tecnológico boutique. Diseño web y
							Producto Digital a medida.
						</p>
					</div>

					{/* Columna 2: Navegación compacta y visual (01 a 07) */}
					<div className="text-center lg:text-left">
						<h4 className="font-tech mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/80">
							Navegación
						</h4>
						<div className="flex flex-wrap justify-center gap-1.5 lg:justify-start">
							{footerLinks.map((link) => (
								<a
									key={link.code}
									href={link.href}
									onClick={(e) => {
										e.preventDefault();
										handleNavClick(link.href);
									}}
									className="group inline-flex items-baseline gap-1.5 rounded-full border border-white/10 bg-[#121318] px-3 py-1.5 text-xs font-medium text-white/75 transition-colors hover:border-[#0077CC] hover:bg-[#0077CC]/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC]"
								>
									<span className="font-tech text-[10px] font-semibold text-[#0077CC] transition-colors group-hover:text-[#38BDF8]">
										{link.code}
									</span>
									<span>{link.label}</span>
								</a>
							))}
						</div>
					</div>

					{/* Columna 3: Legal + Contacto rápido en bloque compacto */}
					<div className="flex flex-col items-center gap-4 lg:items-end">
						<div className="text-center lg:text-right">
							<h4 className="font-tech mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-white/80">
								Legal
							</h4>
							<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 lg:justify-end">
								{resourceLinks.map((link) => (
									<a
										key={link.label}
										href={link.href}
										className="text-xs font-medium text-white/65 transition-colors hover:text-[#0077CC]"
										onClick={(e) => {
											e.preventDefault();
											handleNavClick(link.href);
										}}
									>
										{link.label}
									</a>
								))}
							</div>
						</div>

						<div className="flex items-center gap-2.5">
							{socialLinks.map((social) => (
								<motion.a
									key={social.label}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="rounded-full border border-white/15 bg-[#141418] p-2 text-white/75 transition-colors hover:border-[#0077CC] hover:text-[#0077CC]"
									whileHover={{ scale: 1.06 }}
									whileTap={{ scale: 0.95 }}
									aria-label={social.label}
								>
									<social.icon className="h-4 w-4" />
								</motion.a>
							))}
						</div>
					</div>
				</div>

				<p className="mt-7 text-center text-xs text-white/50">
					© {currentYear} ZeroCode DevOps
				</p>
			</div>
		</footer>
	);
}
