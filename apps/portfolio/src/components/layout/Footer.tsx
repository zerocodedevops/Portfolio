import { motion } from "framer-motion";
import { ArrowUp, Mail, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import footerLogo from "@/assets/zerocode-horizontal-optimized.webp";
import { openCookieSettings } from "@/components/CookieConsent";

const socialLinks = [
	{ icon: Mail, href: "mailto:admin@zerocode-devops.com", label: "Email" },
	{ icon: MessageCircle, href: "https://wa.me/34912622712", label: "WhatsApp" },
];

export function Footer() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const footerLinks = [
		{ label: "Inicio", href: "/" },
		{ label: "Estudio", href: "/#sobre-mi" },
		{ label: "Servicios", href: "/#servicio" },
		{ label: "Proyectos", href: "/#projects" },
		{ label: "Tarifas", href: "/precios-paginas-web" },
		{ label: "Contacto", href: "#contacto" },
	];

	const resourceLinks = [
		{ label: "Aviso legal", href: "/aviso-legal" },
		{ label: "Privacidad", href: "/politica-de-privacidad" },
		{ label: "Cookies", href: "/politica-de-cookies" },
	];

	const handleNavClick = (href: string) => {
		if (href.startsWith("https://")) {
			globalThis.window.location.href = href;
			return;
		}
		if (href.startsWith("/#")) {
			Promise.resolve(navigate("/")).catch(() => undefined);
			setTimeout(
				() =>
					document
						.querySelector(href.slice(1))
						?.scrollIntoView({ behavior: "smooth" }),
				100,
			);
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
				className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-[#0077CC] p-3 text-white shadow-lg transition-colors hover:bg-white hover:text-[#111111]"
				whileHover={{ scale: 1.08, y: -2 }}
				whileTap={{ scale: 0.95 }}
				aria-label={t("footer.scrollButton")}
			>
				<ArrowUp className="h-5 w-5" />
			</motion.button>

			<div className="container-custom py-14 md:py-18">
				<div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto]">
					<div className="text-center md:col-span-2 md:text-left xl:col-span-1">
						<div className="mb-4 w-full md:mb-0">
							<motion.a
								href="/"
								className="mx-auto mb-3 flex w-fit items-center justify-center md:mx-0 md:justify-start"
								whileHover={{ scale: 1.03 }}
								onClick={(e) => {
									e.preventDefault();
									handleNavClick("/");
								}}
							>
								<img
									src={footerLogo}
									alt="ZeroCode DevOps"
									className="h-14 w-44 object-contain"
								/>
							</motion.a>
							<p className="mx-auto mt-3 max-w-[38ch] text-sm leading-relaxed text-white/65 md:mx-0">
								Zero Code DevOps — Estudio tecnológico boutique. Diseño web,
								producto digital e ingeniería a medida.
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<h4 className="font-tech text-xs font-semibold uppercase tracking-widest text-white">
							Navegación
						</h4>
						<div className="flex flex-col gap-2">
							{footerLinks.map((link) => (
								<motion.a
									key={link.label}
									href={link.href}
									className="text-xs font-medium text-white/65 transition-colors hover:text-[#0077CC]"
									whileHover={{ x: 2 }}
									onClick={(e) => {
										e.preventDefault();
										handleNavClick(link.href);
									}}
								>
									{link.label}
								</motion.a>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<h4 className="font-tech text-xs font-semibold uppercase tracking-widest text-white">
							Legal
						</h4>
						<div className="flex flex-col gap-2">
							{resourceLinks.map((link) => (
								<motion.a
									key={link.label}
									href={link.href}
									className="text-xs font-medium text-white/65 transition-colors hover:text-[#0077CC]"
									whileHover={{ x: 2 }}
									onClick={(e) => {
										e.preventDefault();
										handleNavClick(link.href);
									}}
								>
									{link.label}
								</motion.a>
							))}
						</div>
					</div>

					<div className="flex justify-center gap-3 md:justify-end">
						{socialLinks.map((social) => (
							<motion.a
								key={social.label}
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-full border border-white/15 bg-[#141418] p-2.5 text-white/75 transition-colors hover:border-[#0077CC] hover:text-[#0077CC]"
								whileHover={{ scale: 1.08 }}
								whileTap={{ scale: 0.95 }}
								aria-label={social.label}
							>
								<social.icon className="h-5 w-5" />
							</motion.a>
						))}
					</div>
				</div>

				<div className="mt-12 border-t border-white/10 pt-8">
					<p className="text-center text-sm text-white/60">
						© {currentYear} ZeroCode DevOps
					</p>
					<div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/55">
						<button
							className="underline underline-offset-2 hover:text-[#0077CC]"
							onClick={openCookieSettings}
							type="button"
						>
							Información de cookies
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
