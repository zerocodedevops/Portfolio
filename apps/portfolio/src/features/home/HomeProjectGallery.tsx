import {
	motion,
	useMotionValue,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import { ArrowUpRight, Globe, Layers, ShieldCheck } from "lucide-react";
import type { MouseEvent } from "react";
import { useRef } from "react";

interface ProductionProject {
	readonly id: string;
	readonly badge: string;
	readonly statusPill: string;
	readonly name: string;
	readonly subtitle: string;
	readonly sector: string;
	readonly note: string;
	readonly specs: readonly string[];
	readonly href: string;
	readonly external: boolean;
	readonly ctaLabel: string;
	readonly cursorLabel: string;
	readonly image: string;
	readonly accent: "cerulean" | "emerald";
}

const jbarrancoEcosystem: readonly [ProductionProject, ProductionProject] = [
	{
		id: "jbarranco-web",
		badge: "01 // CAPA PÚBLICA COMERCIAL",
		statusPill: "EN PRODUCCIÓN · ACCESO PÚBLICO",
		name: "J.Barranco — Web Comercial",
		subtitle: "Captación local, catálogo de servicios y presencia corporativa",
		sector: "Limpieza profesional · Comunidad de Madrid",
		note: "Plataforma pública en producción diseñada para posicionar servicios de limpieza de comunidades, oficinas y garajes, con arquitectura SEO local y conversión directa.",
		specs: ["SEO Local Multi-Zona", "Catálogo Interactivo", "Web en Vivo"],
		href: "https://jbarrancolimpieza.com",
		external: true,
		ctaLabel: "Visitar web comercial",
		cursorLabel: "VISITAR WEB REAL ↗",
		image: "/assets/projects/thumbnails/project-jbarranco-gallery.webp",
		accent: "cerulean",
	},
	{
		id: "jbarranco-erp",
		badge: "02 // PLATAFORMA INTERNA ERP",
		statusPill: "EN PRODUCCIÓN · MODO DEMO",
		name: "J.Barranco — ERP de Gestión",
		subtitle: "Sistema integral multi-perfil (Admin · Comunidad · Operario)",
		sector: "ERP a Medida · Operaciones, Rutas, Stock y Contabilidad",
		note: "El motor operativo real de la empresa: planificación de rutas, control de almacén y stock por comunidad, contabilidad, tickets y portales de cliente y empleado. Por privacidad de datos reales, se abre al público como entorno demo interactivo en memoria.",
		specs: ["3 Perfiles en 1 Clic", "19 Colecciones en Memoria", "30 Rutas ERP"],
		href: "/proyectos/jbarranco",
		external: false,
		ctaLabel: "Explorar demo del ERP",
		cursorLabel: "ABRIR ERP DEMO ↗",
		image: "/assets/projects/thumbnails/project-jbarranco-erp-gallery.webp",
		accent: "emerald",
	},
];

const demoProjects = [
	{
		name: "Zero Chaos",
		sector: "Reformas integrales",
		note: "Prototipo web para presentar servicios de reforma y simular solicitudes de presupuesto.",
		href: "/proyectos/zero-chaos",
		image: "/assets/projects/thumbnails/project-zerochaos-gallery.webp",
	},
	{
		name: "Zero Delay",
		sector: "Mudanzas",
		note: "Demostración web para explicar servicios de mudanza y simular la solicitud de presupuesto.",
		href: "/proyectos/zerodelay",
		image: "/assets/projects/thumbnails/project-zerodelay-gallery.webp",
	},
	{
		name: "Zero Shop",
		sector: "Catálogo interactivo",
		note: "Prototipo de catálogo filtrable con búsqueda por voz y flujo interactivo simulado.",
		href: "/proyectos/zeroshop",
		image: "/assets/projects/thumbnails/project-zeroshop-gallery.webp",
	},
	{
		name: "Zero Vanity",
		sector: "Peluquería y estética",
		note: "Demo interactiva para salones con recorrido de reserva y simulador de pago.",
		href: "/proyectos/zerovanity",
		image: "/assets/projects/thumbnails/project-zerovanity-gallery.webp",
	},
	{
		name: "Zero Breakdown",
		sector: "Fontanería · Electricidad · Clima",
		note: "Concepto web para asistencia técnica con especialidades interactivas y formularios simulados.",
		href: "/proyectos/zero-breakdown",
		image: "/assets/projects/thumbnails/project-zero-breakdown-gallery.webp",
	},
	{
		name: "Zero Risk",
		sector: "Prevención de riesgos laborales",
		note: "Concepto web para servicios de prevención y seguridad laboral con formulario de ejemplo.",
		href: "/proyectos/zerorisk.html",
		image: "/assets/projects/thumbnails/project-zerorisk-gallery.webp",
	},
	{
		name: "Zero Atelier",
		sector: "Enmarcación y conservación",
		note: "Prototipo para taller de enmarcación artesanal, conservación de obras y molduras a medida.",
		href: "/proyectos/zeroatelier.html",
		image: "/assets/projects/thumbnails/project-zeroatelier-gallery.webp",
	},
	{
		name: "Zero Plague",
		sector: "Sanidad ambiental y bioseguridad",
		note: "Concepto web para control integral de plagas y bioseguridad con enfoque técnico.",
		href: "/proyectos/zeroplague/index.html",
		image: "/assets/projects/thumbnails/project-zeroplague-gallery.jpg",
	},
	{
		name: "Neigh Net",
		sector: "Comunidades de propietarios",
		note: "Plataforma demo para gestión de comunidades con acceso como vecino o administrador, reservas, votaciones, incidencias y cuentas simuladas.",
		href: "/proyectos/neighnet",
		image: "/assets/projects/thumbnails/project-neighnet-gallery.webp",
	},
];

type DemoProject = (typeof demoProjects)[number];

interface ProductionDiptychCardProps {
	readonly project: ProductionProject;
	readonly side: "left" | "right";
}

function ProductionDiptychCard({ project, side }: ProductionDiptychCardProps) {
	const prefersReducedMotion = useReducedMotion() ?? false;
	const tiltX = useMotionValue(0);
	const tiltY = useMotionValue(0);
	const smoothTiltX = useSpring(tiltX, { stiffness: 220, damping: 22 });
	const smoothTiltY = useSpring(tiltY, { stiffness: 220, damping: 22 });

	const handlePointerMove = (event: MouseEvent<HTMLAnchorElement>) => {
		if (prefersReducedMotion) return;
		const rect = event.currentTarget.getBoundingClientRect();
		const px = (event.clientX - rect.left) / rect.width - 0.5;
		const py = (event.clientY - rect.top) / rect.height - 0.5;
		tiltY.set(px * 6);
		tiltX.set(-py * 6);
	};

	const handlePointerLeave = () => {
		tiltX.set(0);
		tiltY.set(0);
	};

	const isCerulean = project.accent === "cerulean";

	return (
		<motion.article
			initial={
				prefersReducedMotion
					? false
					: { opacity: 0, y: 28 }
			}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{
				duration: 0.65,
				delay: side === "left" ? 0.05 : 0.14,
				ease: [0.22, 1, 0.36, 1],
			}}
			className="group relative flex h-full flex-col rounded-3xl border border-white/12 bg-white/3 p-2 transition-colors duration-500 hover:border-[#0077CC]/60"
		>
			<div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0D0E12] p-5 sm:p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
				{/* Ambient radial glow */}
				<div
					aria-hidden="true"
					className={`pointer-events-none absolute -top-28 ${
						side === "left" ? "-left-24" : "-right-24"
					} h-64 w-64 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-45 ${
						isCerulean ? "bg-[#0077CC]" : "bg-emerald-500"
					}`}
				/>

				<div>
					{/* Top meta header */}
					<div className="mb-4 flex items-center justify-between gap-2">
						<span className="font-tech inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#38BDF8]">
							{side === "left" ? (
								<Globe className="h-3.5 w-3.5 shrink-0 text-[#0077CC]" aria-hidden="true" />
							) : (
								<Layers className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
							)}
							<span>{project.badge}</span>
						</span>

						<span
							className={`font-tech inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
								isCerulean
									? "border-[#0077CC]/40 bg-[#0077CC]/15 text-[#7DD3FC]"
									: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
							}`}
						>
							<span
								className={`h-1.5 w-1.5 rounded-full ${
									isCerulean ? "bg-[#38BDF8]" : "bg-emerald-400"
								}`}
								aria-hidden="true"
							/>
							<span>{project.statusPill}</span>
						</span>
					</div>

					{/* Interactive 3D Thumbnail Frame (Double-Bezel) */}
					<a
						href={project.href}
						target={project.external ? "_blank" : undefined}
						rel={project.external ? "noopener noreferrer" : undefined}
						data-cursor={project.cursorLabel}
						onMouseMove={handlePointerMove}
						onMouseLeave={handlePointerLeave}
						style={{ perspective: 1000 }}
						className="relative block overflow-hidden rounded-2xl border border-white/15 bg-[#121318] p-1.5 transition-colors duration-300 group-hover:border-[#0077CC] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077CC]"
					>
						<motion.div
							style={{
								rotateX: smoothTiltX,
								rotateY: smoothTiltY,
							}}
							className="relative aspect-5/4 w-full overflow-hidden rounded-xl bg-[#0A0B0E]"
						>
							<img
								src={project.image}
								alt={`${project.name} — ${project.sector}`}
								className="block h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
								loading="lazy"
								decoding="async"
							/>

							{/* Subtle bottom gradient + floating glass badge inside thumbnail */}
							<div
								aria-hidden="true"
								className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#09090B]/90 via-[#09090B]/35 to-transparent"
							/>
							<div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
								<span className="font-tech rounded-lg border border-white/15 bg-[#09090B]/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white/90">
									{side === "left"
										? "jbarrancolimpieza.com"
										: "/proyectos/jbarranco · ERP v2"}
								</span>
								<span
									className={`font-tech rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
										isCerulean
											? "bg-[#0077CC] text-white"
											: "bg-emerald-500 text-slate-950"
									}`}
								>
									{side === "left" ? "WEB PÚBLICA" : "DEMO INTERACTIVA"}
								</span>
							</div>
						</motion.div>
					</a>

					{/* Typography & technical specs */}
					<div className="mt-6">
						<p className="font-tech text-[11px] uppercase tracking-wider text-[#38BDF8]">
							{project.sector}
						</p>
						<h3 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#F7F6F3] sm:text-[1.65rem]">
							{project.name}
						</h3>
						<p className="mt-1 text-xs font-medium text-white/60">
							{project.subtitle}
						</p>
						<p className="mt-3 text-sm leading-relaxed text-white/75">
							{project.note}
						</p>
					</div>
				</div>

				{/* Footer: Tech pills + Button-in-button CTA */}
				<div className="mt-6 border-t border-white/10 pt-5">
					<div className="mb-5 flex flex-wrap gap-2">
						{project.specs.map((spec) => (
							<span
								key={spec}
								className="font-tech rounded-md border border-white/10 bg-white/4 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/70"
							>
								{spec}
							</span>
						))}
					</div>

					<a
						href={project.href}
						target={project.external ? "_blank" : undefined}
						rel={project.external ? "noopener noreferrer" : undefined}
						className={`group/btn inline-flex min-h-12 w-full items-center justify-between rounded-full pl-5 pr-2 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 ${
							isCerulean
								? "bg-[#0077CC] text-white hover:bg-white hover:text-[#09090B] focus-visible:outline-[#0077CC]"
								: "border border-emerald-400/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-400 hover:text-slate-950 focus-visible:outline-emerald-400"
						}`}
					>
						<span>{project.ctaLabel}</span>
						<span
							className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 ${
								isCerulean
									? "bg-black/20 text-white group-hover/btn:bg-[#0077CC] group-hover/btn:text-white"
									: "bg-emerald-400/20 text-emerald-200 group-hover/btn:bg-slate-950/20 group-hover/btn:text-slate-950"
							}`}
						>
							<ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
						</span>
					</a>
				</div>
			</div>
		</motion.article>
	);
}

interface DemoCardProps {
	readonly project: DemoProject;
	readonly index: number;
}

function DemoProjectCard({ project, index }: DemoCardProps) {
	const cardRef = useRef<HTMLElement>(null);
	const prefersReducedMotion = useReducedMotion() ?? false;
	const { scrollYProgress } = useScroll({
		target: cardRef,
		offset: ["start end", "end start"],
	});

	const parallaxRange = index % 2 === 0 ? [52, -52] : [-52, 52];
	const cardY = useTransform(
		scrollYProgress,
		[0, 1],
		prefersReducedMotion ? [0, 0] : parallaxRange,
	);
	const imageScale = useTransform(
		scrollYProgress,
		[0, 0.5, 1],
		prefersReducedMotion ? [1, 1, 1] : [0.92, 1, 0.94],
	);

	const tiltX = useMotionValue(0);
	const tiltY = useMotionValue(0);
	const smoothTiltX = useSpring(tiltX, { stiffness: 260, damping: 24 });
	const smoothTiltY = useSpring(tiltY, { stiffness: 260, damping: 24 });

	const handlePointerMove = (event: MouseEvent<HTMLAnchorElement>) => {
		if (prefersReducedMotion) return;
		const rect = event.currentTarget.getBoundingClientRect();
		const px = (event.clientX - rect.left) / rect.width - 0.5;
		const py = (event.clientY - rect.top) / rect.height - 0.5;
		tiltY.set(px * 7);
		tiltX.set(-py * 7);
	};

	const handlePointerLeave = () => {
		tiltX.set(0);
		tiltY.set(0);
	};

	return (
		<motion.article
			ref={cardRef}
			style={{ y: cardY }}
			className="group flex flex-col"
		>
			<a
				href={project.href}
				data-cursor="PROBAR DEMO ↗"
				onMouseMove={handlePointerMove}
				onMouseLeave={handlePointerLeave}
				className="block overflow-hidden rounded-2xl border border-white/15 bg-[#141418] transition-colors duration-300 group-hover:border-[#0077CC] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077CC]"
				style={{ perspective: 900 }}
			>
				<motion.div
					style={{
						rotateX: smoothTiltX,
						rotateY: smoothTiltY,
						scale: imageScale,
					}}
					className="aspect-5/4 w-full overflow-hidden bg-[#111114]"
				>
					<img
						src={project.image}
						alt={`${project.name} — ${project.sector}`}
						className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
						loading="lazy"
						decoding="async"
					/>
				</motion.div>
			</a>
			<div className="mt-5 flex items-baseline justify-between gap-2">
				<h3 className="text-xl font-semibold text-[#F7F6F3]">{project.name}</h3>
				<span className="font-tech text-[10px] uppercase tracking-widest text-white/50">
					DEMO · DATOS SIMULADOS
				</span>
			</div>
			<p className="font-tech mt-1 text-[11px] uppercase tracking-wider text-[#0077CC]">
				{project.sector}
			</p>
			<p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-white/75">
				{project.note}
			</p>
			<a
				href={project.href}
				className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#F7F6F3] underline decoration-white/25 underline-offset-4 transition-colors hover:text-[#0077CC] hover:decoration-[#0077CC]"
			>
				<span>Probar demo</span>
				<ArrowUpRight
					className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
					strokeWidth={1.5}
					aria-hidden="true"
				/>
			</a>
		</motion.article>
	);
}

export function HomeProjectGallery() {
	const prefersReducedMotion = useReducedMotion() ?? false;

	return (
		<section
			id="projects"
			className="overflow-hidden border-b border-white/10 bg-[#09090B] py-24 text-[#F7F6F3] md:py-32"
		>
			<div className="container-custom">
				<motion.div
					initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
					className="mb-14 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6"
				>
					<div>
						<p className="font-tech mb-3 text-xs font-medium uppercase tracking-widest text-[#0077CC]">
							03 / PROYECTOS Y DEMOSTRACIONES
						</p>
						<h2 className="text-[clamp(2rem,3.6vw,3.35rem)] font-semibold leading-[1.05] tracking-tight text-[#F7F6F3]">
							Trabajo real y prototipos verificables.
						</h2>
					</div>
					<span className="font-tech text-[11px] uppercase tracking-widest text-white/50">
						SHOWCASE TÉCNICO
					</span>
				</motion.div>

				{/* Ecosistema Real en Producción: Díptico J.Barranco (Izquierda Comercial / Derecha Demo ERP) */}
				<div className="mb-24 border-b border-white/10 pb-20">
					<div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
						<div>
							<div className="inline-flex flex-wrap items-center gap-2.5">
								<span className="font-tech inline-flex items-center gap-2 rounded-full border border-[#0077CC]/40 bg-[#0077CC]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
									<span
										className="h-2 w-2 rounded-full bg-[#0077CC]"
										aria-hidden="true"
									/>
									<span>ECOSISTEMA REAL EN PRODUCCIÓN · CASO J.BARRANCO</span>
								</span>
								<span className="font-tech inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[11px] uppercase tracking-wider text-white/65">
									<ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
									<span>Datos reales protegidos mediante entorno demo aislado</span>
								</span>
							</div>
							<h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#F7F6F3] sm:text-3xl">
								Doble despliegue en producción: Portal Comercial + ERP de Gestión.
							</h3>
						</div>
						<p className="max-w-[54ch] text-sm leading-relaxed text-white/65">
							A la izquierda, la web comercial pública activa en producción. A la derecha, el sistema ERP interno con el que opera la empresa a diario, habilitado en modo demostración con datos simulados para proteger la privacidad de clientes y empleados.
						</p>
					</div>

					<div
						className="grid gap-6 lg:grid-cols-2 lg:gap-8"
						data-testid="jbarranco-production-diptych"
					>
						<ProductionDiptychCard
							project={jbarrancoEcosystem[0]}
							side="left"
						/>
						<ProductionDiptychCard
							project={jbarrancoEcosystem[1]}
							side="right"
						/>
					</div>
				</div>

				<div className="mb-12 flex items-center justify-between">
					<p className="font-tech text-xs uppercase tracking-widest text-white/60">
						CONCEPTOS Y DEMOSTRACIONES SECTORIALES · DATOS SIMULADOS
					</p>
				</div>

				<div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
					{demoProjects.map((project, index) => (
						<DemoProjectCard
							key={project.name}
							project={project}
							index={index}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
