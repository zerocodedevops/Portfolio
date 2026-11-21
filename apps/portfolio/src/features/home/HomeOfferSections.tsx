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
import { ArrowUpRight, Plus } from "lucide-react";
import { useRef, useState } from "react";

const pillars = [
	{
		code: "01",
		title: "Diseño y Desarrollo Web a Medida",
		headline:
			"Webs corporativas y páginas de lanzamiento con identidad propia.",
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
			"Aplicaciones web, comercio electrónico y plataformas interactivas.",
		description:
			"Desarrollamos aplicaciones y herramientas digitales personalizadas en React y TypeScript cuando una web informativa no es suficiente.",
		includes:
			"Arquitectura modular · Catálogos filtrables · Flujos de reserva o presupuesto",
		cta: "Plantear un producto",
	},
	{
		code: "03",
		title: "Automatización e Ingeniería",
		headline: "Integraciones, flujos de trabajo y despliegue estructurado.",
		description:
			"Conectamos tu presencia web con tus procesos diarios y preparamos entornos de despliegue ordenados y mantenibles.",
		includes:
			"Conexión de formularios · Integración de APIs · Despliegue continuo",
		cta: "Hablar sobre ingeniería",
	},
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
		a: "J.Barranco es un proyecto real en producción para un cliente real. Los otros ocho proyectos son demostraciones técnicas con datos simulados para mostrar nuestro criterio visual y técnico por sector.",
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
		"DISEÑO WEB A MEDIDA · PRODUCTO DIGITAL · INGENIERÍA · AUTOMATIZACIÓN · REACT 19 · TYPESCRIPT · ";

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
	const levelsRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress: levelsScroll } = useScroll({
		target: levelsRef,
		offset: ["start end", "end start"],
	});

	const leftLevelY = useTransform(
		levelsScroll,
		[0, 1],
		prefersReducedMotion ? [0, 0] : [36, -36],
	);
	const rightLevelY = useTransform(
		levelsScroll,
		[0, 1],
		prefersReducedMotion ? [0, 0] : [-36, 36],
	);

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
								Tres pilares técnicos, un mismo estándar.
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

					<div
						ref={levelsRef}
						id="inversion"
						className="mt-16 grid gap-8 lg:grid-cols-12"
					>
						<motion.div
							style={{ y: leftLevelY }}
							className="lg:col-span-6 lg:border-r lg:border-[#E2DFD7] lg:pr-8"
						>
							<span className="font-tech text-xs font-semibold uppercase tracking-widest text-[#0077CC]">
								NIVEL 1 · LANZAMIENTO ESENCIAL
							</span>
							<h3 className="mt-2 text-2xl font-semibold text-[#111111]">
								Presencia profesional rápida
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-[#5C5B57]">
								Web de una página, diseño responsive, dominio y hosting durante
								un año, certificado SSL y botón directo de WhatsApp.
							</p>
							<p className="font-tech mt-4 text-xs font-semibold uppercase tracking-widest text-[#111111]">
								Consultar presupuesto
							</p>
						</motion.div>
						<motion.div
							style={{ y: rightLevelY }}
							className="lg:col-span-6 lg:pl-4"
						>
							<span className="font-tech text-xs font-semibold uppercase tracking-widest text-[#5C5B57]">
								NIVEL 2 · PLATAFORMAS Y SOLUCIONES A MEDIDA
							</span>
							<h3 className="mt-2 text-2xl font-semibold text-[#111111]">
								Producto digital y arquitectura
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-[#5C5B57]">
								Webs multipágina, tiendas online, aplicaciones web interactivas,
								automatizaciones e integraciones definidas tras diagnóstico
								previo.
							</p>
							<p className="font-tech mt-4 text-xs font-semibold uppercase tracking-widest text-[#111111]">
								Consultar presupuesto
							</p>
						</motion.div>
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
					05 / PREGUNTAS FRECUENTES
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
