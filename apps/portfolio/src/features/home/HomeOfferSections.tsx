import {
	AnimatePresence,
	motion,
	useAnimationFrame,
	useMotionValue,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
	useVelocity,
} from "framer-motion";
import { ArrowUpRight, Check, MessageCircle, Plus } from "lucide-react";
import { useRef, useState } from "react";

const pillars = [
	{
		code: "01",
		title: "Diseño y Desarrollo Web a Medida",
		headline:
			"Webs corporativas y landing pages con identidad propia.",
		description:
			"Diseñamos y maquetamos sitios web claros y adaptados a cualquier dispositivo, orientados a comunicar el valor de tu negocio con solidez.",
		includes:
			"Diseño personalizado · Maquetación responsive · Dominio, hosting y SSL",
		cta: "Consultar para mi web",
	},
	{
		code: "02",
		title: "Aplicaciones y Producto Digital",
		headline:
			"Aplicaciones web, portales de gestión y plataformas interactivas.",
		description:
			"Desarrollamos aplicaciones y herramientas digitales con código a medida cuando una web informativa no es suficiente.",
		includes:
			"Arquitectura modular · Portales de cliente · Flujos de reserva o presupuesto",
		cta: "Plantear un producto",
	},
];

const essentialInclusions = [
	"Web de una página con Inicio y Contacto",
	"Diseño adaptado a móviles",
	"Dominio y hosting durante un año",
	"Certificado SSL",
	"Botón directo de WhatsApp",
	"Banner de Cookies RGPD",
];

const customInclusions = [
	"Webs multipágina, landing pages y arquitectura editorial",
	"Portales de cliente y flujos interactivos",
	"Aplicaciones web y sistemas de gestión con código a medida",
	"Puesta en marcha y despliegue estructurado",
];

const steps = [
	{
		code: "01",
		title: "Diagnóstico",
		description:
			"Analizamos tus objetivos, qué necesitas comunicar y cuál es la solución técnica adecuada sin sobredimensionar el alcance.",
	},
	{
		code: "02",
		title: "Arquitectura y Diseño",
		description:
			"Definimos la estructura de contenidos, la jerarquía visual y la experiencia de navegación antes de pasar a código.",
	},
	{
		code: "03",
		title: "Desarrollo",
		description:
			"Construimos la interfaz y las funcionalidades acordadas, cuidando la velocidad de carga, la accesibilidad y la adaptación móvil.",
	},
	{
		code: "04",
		title: "Despliegue y Soporte",
		description:
			"Publicamos el proyecto con dominio y certificado SSL configurados, dejándolo operativo y listo para evolucionar.",
	},
];

const faqs = [
	{
		q: "¿Trabajáis con autónomos y pequeñas empresas?",
		a: "Sí. El Nivel 1 (Lanzamiento Esencial) está pensado específicamente para profesionales y negocios que necesitan una presencia web sólida, rápida y sin complejidad innecesaria.",
	},
	{
		q: "¿Por qué no hay precios cerrados en la web?",
		a: "Cada proyecto tiene un alcance distinto. Trabajamos bajo presupuesto personalizado tras un diagnóstico breve para no cobrar de más ni recortar en calidad técnica.",
	},
	{
		q: "¿Qué diferencia hay entre J.Barranco y las demás demos?",
		a: "J.Barranco es un proyecto real en producción para un cliente real (tanto su web comercial como su ERP de gestión). Los otros nueve proyectos son demostraciones técnicas con datos simulados para mostrar nuestro criterio visual y técnico por sector.",
	},
];

function KineticMarquee() {
	const prefersReducedMotion = useReducedMotion() ?? false;
	const baseX = useMotionValue(0);
	const { scrollY } = useScroll();
	const scrollVelocity = useVelocity(scrollY);
	const smoothVelocity = useSpring(scrollVelocity, {
		damping: 50,
		stiffness: 380,
	});
	const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], {
		clamp: false,
	});
	const x = useTransform(baseX, (v) => `${(((v % 50) + 50) % 50) - 50}%`);

	useAnimationFrame((_, delta) => {
		if (prefersReducedMotion) return;
		const moveBy = -2.2 * (delta / 1000) * (1 + Math.abs(velocityFactor.get()));
		baseX.set(baseX.get() + moveBy);
	});

	const items =
		"DISEÑO WEB A MEDIDA · LANDING PAGES · APLICACIONES Y GESTIÓN · SEO LOCAL · VELOCIDAD Y RENDIMIENTO · DISEÑO RESPONSIVE · TRATO DIRECTO · ";

	return (
		<div className="overflow-hidden border-y border-[#E2DFD7] bg-[#09090B] py-4 text-[#F7F6F3]">
			<motion.div
				style={{ x }}
				className="flex w-max whitespace-nowrap font-tech text-xs font-medium uppercase tracking-widest"
			>
				<span className="pr-4">{items}</span>
				<span className="pr-4">{items}</span>
				<span className="pr-4">{items}</span>
				<span className="pr-4">{items}</span>
			</motion.div>
		</div>
	);
}

export function HomeOfferSections() {
	const prefersReducedMotion = useReducedMotion() ?? false;

	return (
		<>
			<KineticMarquee />
			<section
				id="servicio"
				className="overflow-hidden border-b border-[#E2DFD7] bg-[#F7F6F3] py-20 text-[#111111] md:py-28"
			>
				<div className="container-custom">
					<motion.div
						initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
						className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-[#E2DFD7] pb-6"
					>
						<div>
							<p className="font-tech mb-3 text-xs font-medium uppercase tracking-widest text-[#0077CC]">
								02 / SERVICIOS
							</p>
							<h2 className="text-[clamp(2rem,3.5vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
								Dos pilares técnicos, un mismo estándar.
							</h2>
						</div>
						<span className="font-tech text-[11px] uppercase tracking-widest text-[#5C5B57]">
							ALCANCE MODULAR
						</span>
					</motion.div>

					<div className="divide-y divide-[#E2DFD7] border-b border-[#E2DFD7]">
						{pillars.map((pillar, idx) => (
							<motion.div
								key={pillar.code}
								initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, amount: 0.25 }}
								transition={{
									duration: 0.55,
									delay: idx * 0.1,
									ease: [0.22, 1, 0.36, 1],
								}}
								className="group grid gap-6 py-10 transition-colors duration-300 hover:bg-[#EFECE6]/70 lg:grid-cols-12 lg:items-start lg:px-5"
							>
								<div className="transition-transform duration-300 group-hover:translate-x-2 lg:col-span-5">
									<span className="font-tech mb-2 block text-xs font-semibold text-[#0077CC]">
										<span>{pillar.code}</span> <span>/</span>{" "}
										<span>{pillar.title.toUpperCase()}</span>
									</span>
									<h3 className="text-xl font-semibold leading-snug text-[#111111] md:text-2xl">
										{pillar.headline}
									</h3>
								</div>
								<div className="space-y-3 lg:col-span-5">
									<p className="text-base leading-relaxed text-[#5C5B57]">
										{pillar.description}
									</p>
									<p className="font-tech text-xs text-[#111111]">
										{pillar.includes}
									</p>
								</div>
								<div className="lg:col-span-2 lg:flex lg:justify-end">
									<a
										href="#contacto"
										className="group/link inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[#111111] underline decoration-[#E2DFD7] underline-offset-4 transition-colors hover:text-[#0077CC] hover:decoration-[#0077CC] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077CC]"
									>
										<span>{pillar.cta}</span>
										<ArrowUpRight
											className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
											strokeWidth={1.5}
											aria-hidden="true"
										/>
									</a>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>
		</>
	);
}

export function HomeProcessSections() {
	const prefersReducedMotion = useReducedMotion() ?? false;
	const processRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: processRef,
		offset: ["start end", "center center"],
	});
	const lineScale = useTransform(
		scrollYProgress,
		[0.05, 0.9],
		prefersReducedMotion ? [1, 1] : [0, 1],
	);

	return (
		<section
			ref={processRef}
			id="proceso"
			className="border-b border-[#E2DFD7] bg-white py-20 text-[#111111] md:py-28"
		>
			<div className="container-custom">
				<motion.div
					initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-[#E2DFD7] pb-6"
				>
					<div>
						<p className="font-tech mb-3 text-xs font-medium uppercase tracking-widest text-[#0077CC]">
							04 / METODOLOGÍA
						</p>
						<h2 className="text-[clamp(2rem,3.5vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
							Cuatro etapas claras, sin fricción.
						</h2>
					</div>
				</motion.div>

				<div className="mb-10 h-0.5 w-full overflow-hidden bg-[#E2DFD7]">
					<motion.div
						style={{ scaleX: lineScale }}
						className="h-full w-full origin-left bg-[#0077CC]"
						aria-hidden="true"
					/>
				</div>

				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{steps.map((step, idx) => (
						<motion.div
							key={step.code}
							initial={
								prefersReducedMotion
									? false
									: { opacity: 0, y: 32, scale: 0.96 }
							}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true, amount: 0.25 }}
							transition={{
								duration: 0.52,
								delay: idx * 0.1,
								ease: [0.22, 1, 0.36, 1],
							}}
							className="border-t-2 border-[#111111] pt-5 transition-colors hover:border-[#0077CC]"
						>
							<span className="font-tech block text-xs font-semibold text-[#0077CC]">
								<span>{step.code}</span> <span>/</span>
							</span>
							<h3 className="mt-2 text-lg font-semibold text-[#111111]">
								{step.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-[#5C5B57]">
								{step.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

export function HomePricingSection() {
	const prefersReducedMotion = useReducedMotion() ?? false;

	return (
		<section
			id="tarifas"
			className="border-b border-[#E2DFD7] bg-[#F7F6F3] py-20 text-[#111111] md:py-28"
		>
			<div className="container-custom">
				<motion.header
					initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="mb-14 flex flex-wrap items-end justify-between gap-4 border-b border-[#E2DFD7] pb-6"
				>
					<div>
						<p className="font-tech mb-3 text-xs font-medium uppercase tracking-widest text-[#0077CC]">
							05 / TARIFAS Y ALCANCE MODULAR
						</p>
						<h2 className="text-[clamp(2rem,3.5vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-[#111111]">
							Dos niveles claros, mismo rigor técnico.
						</h2>
						<p className="mt-4 max-w-[58ch] text-base leading-relaxed text-[#5C5B57]">
							Trabajamos en remoto bajo presupuesto personalizado tras un
							diagnóstico breve, adaptando el alcance a lo que tu negocio
							necesita realmente.
						</p>
					</div>
					<span className="font-tech text-[11px] uppercase tracking-widest text-[#5C5B57]">
						PRESUPUESTO A MEDIDA
					</span>
				</motion.header>

				<div className="grid gap-10 lg:grid-cols-12">
					<section
						className="flex flex-col justify-between rounded-2xl border border-[#E2DFD7] bg-white p-8 sm:p-10 lg:col-span-6"
						aria-labelledby="nivel-1-title"
					>
						<div>
							<div className="flex items-baseline justify-between gap-4 border-b border-[#E2DFD7] pb-6">
								<div>
									<span className="font-tech text-xs font-semibold uppercase tracking-widest text-[#0077CC]">
										NIVEL 1 · LANZAMIENTO ESENCIAL
									</span>
									<h3
										id="nivel-1-title"
										className="mt-2 text-2xl font-semibold text-[#111111]"
									>
										Presencia profesional rápida
									</h3>
								</div>
								<a
									href="#contacto"
									className="font-tech shrink-0 whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-[#111111] underline decoration-[#E2DFD7] underline-offset-4 transition-colors hover:text-[#0077CC] hover:decoration-[#0077CC]"
								>
									Consultar presupuesto
								</a>
							</div>

							<p className="mt-5 text-sm leading-relaxed text-[#5C5B57]">
								Pensado para autónomos, profesionales y pequeñas empresas que
								necesitan una web clara, rápida y lista para captar contactos.
							</p>

							<ul className="mt-6 grid gap-3 border-t border-[#E2DFD7] pt-6 text-sm text-[#111111]">
								{essentialInclusions.map((item) => (
									<li key={item} className="flex items-start gap-3">
										<Check
											className="mt-0.5 h-4 w-4 shrink-0 text-[#0077CC]"
											strokeWidth={1.75}
											aria-hidden="true"
										/>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="mt-8 flex flex-wrap gap-3 border-t border-[#E2DFD7] pt-6">
							<a
								href="#contacto"
								className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#111111] px-6 text-xs font-medium uppercase tracking-widest text-[#F7F6F3] transition-colors hover:bg-[#0077CC] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC]"
							>
								<span>Consultar presupuesto</span>
								<ArrowUpRight
									className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
									strokeWidth={1.5}
									aria-hidden="true"
								/>
							</a>
							<a
								href="https://wa.me/34912622712?text=Hola%2C%20quiero%20consultar%20presupuesto%20para%20el%20Nivel%201%20Lanzamiento%20Esencial."
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#111111] px-5 text-xs font-medium uppercase tracking-widest text-[#111111] transition-colors hover:bg-[#111111] hover:text-[#F7F6F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC]"
							>
								<MessageCircle className="h-4 w-4" aria-hidden="true" />
								<span>WhatsApp</span>
							</a>
						</div>
					</section>

					<section
						className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#09090B] p-8 text-[#F7F6F3] sm:p-10 lg:col-span-6"
						aria-labelledby="nivel-2-title"
					>
						<div>
							<div className="flex items-baseline justify-between gap-4 border-b border-white/15 pb-6">
								<div>
									<span className="font-tech text-xs font-semibold uppercase tracking-widest text-[#0077CC]">
										NIVEL 2 · SOLUCIONES A MEDIDA
									</span>
									<h3
										id="nivel-2-title"
										className="mt-2 text-2xl font-semibold text-[#F7F6F3]"
									>
										Plataformas y producto digital
									</h3>
								</div>
								<a
									href="#contacto"
									className="font-tech shrink-0 whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-white/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-[#38BDF8] hover:decoration-[#38BDF8]"
								>
									Consultar presupuesto
								</a>
							</div>

							<p className="mt-5 text-sm leading-relaxed text-white/75">
								Para empresas y proyectos con necesidades específicas de
								diseño, portales de gestión, aplicaciones interactivas o
								soluciones a medida.
							</p>

							<ul className="mt-6 grid gap-3 border-t border-white/15 pt-6 text-sm text-[#F7F6F3]">
								{customInclusions.map((item) => (
									<li key={item} className="flex items-start gap-3">
										<Check
											className="mt-0.5 h-4 w-4 shrink-0 text-[#0077CC]"
											strokeWidth={1.75}
											aria-hidden="true"
										/>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="mt-8 flex flex-wrap gap-3 border-t border-white/15 pt-6">
							<a
								href="#contacto"
								className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0077CC] px-6 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC]"
							>
								<span>Solicitar diagnóstico</span>
								<ArrowUpRight
									className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
									strokeWidth={1.5}
									aria-hidden="true"
								/>
							</a>
						</div>
					</section>
				</div>
			</div>
		</section>
	);
}

export function HomeFaqSection() {
	const prefersReducedMotion = useReducedMotion() ?? false;
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section
			id="preguntas"
			className="border-b border-[#E2DFD7] bg-[#EFECE6] py-20 text-[#111111] md:py-24"
		>
			<div className="container-custom">
				<p className="font-tech mb-3 text-xs font-medium uppercase tracking-widest text-[#0077CC]">
					06 / PREGUNTAS FRECUENTES
				</p>
				<div className="mt-8 divide-y divide-[#E2DFD7] border-y border-[#E2DFD7]">
					{faqs.map((item, idx) => {
						const isOpen = openIndex === idx;
						return (
							<div key={item.q} className="py-5">
								<button
									type="button"
									aria-expanded={isOpen}
									onClick={() => setOpenIndex(isOpen ? null : idx)}
									className="flex w-full items-center justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077CC]"
								>
									<span className="text-base font-semibold text-[#111111] md:text-lg">
										{item.q}
									</span>
									<Plus
										className={`h-5 w-5 shrink-0 text-[#0077CC] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
										strokeWidth={1.75}
										aria-hidden="true"
									/>
								</button>
								<AnimatePresence initial={false}>
									{isOpen && (
										<motion.div
											initial={
												prefersReducedMotion ? false : { opacity: 0, height: 0 }
											}
											animate={{ opacity: 1, height: "auto" }}
											exit={
												prefersReducedMotion
													? undefined
													: { opacity: 0, height: 0 }
											}
											transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
											className="overflow-hidden"
										>
											<p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-[#5C5B57] md:text-base">
												{item.a}
											</p>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
