import {
	motion,
	useMotionValue,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";
import { useRef } from "react";

const realProject = {
	name: "J.Barranco",
	sector: "Limpieza profesional",
	note: "Web corporativa real en producción para presentar servicios locales con claridad y facilitar el contacto.",
	href: "https://jbarrancolimpieza.com",
	image: "/assets/projects/thumbnails/project-jbarranco-gallery.webp",
};

const demoProjects = [
	{
		name: "ZeroChaos",
		sector: "Reformas integrales",
		note: "Prototipo web para presentar servicios de reforma y simular solicitudes de presupuesto.",
		href: "/proyectos/zero-chaos",
		image: "/assets/projects/thumbnails/project-zerochaos-gallery.webp",
	},
	{
		name: "ZeroDelay",
		sector: "Mudanzas",
		note: "Demostración web para explicar servicios de mudanza y simular la solicitud de presupuesto.",
		href: "/proyectos/zerodelay",
		image: "/assets/projects/thumbnails/project-zerodelay-gallery.webp",
	},
	{
		name: "ZeroShop",
		sector: "Comercio y tienda online",
		note: "Demo de e-commerce con catálogo filtrable, búsqueda por voz y carrito/checkout simulados.",
		href: "/proyectos/zeroshop",
		image: "/assets/projects/thumbnails/project-zeroshop-gallery.webp",
	},
	{
		name: "ZeroVanity",
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
		name: "ZeroRisk",
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
];

type DemoProject = (typeof demoProjects)[number];

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
				className="aspect-[5/4] w-full overflow-hidden bg-[#111114]"
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
	const featuredRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress: featuredScroll } = useScroll({
		target: featuredRef,
		offset: ["start end", "end start"],
	});

	const featuredTextY = useTransform(
		featuredScroll,
		[0, 1],
		prefersReducedMotion ? [0, 0] : [32, -32],
	);
	const featuredImageY = useTransform(
		featuredScroll,
		[0, 1],
		prefersReducedMotion ? [0, 0] : [-28, 28],
	);
	const featuredScale = useTransform(
		featuredScroll,
		[0, 0.5, 1],
		prefersReducedMotion ? [1, 1, 1] : [0.94, 1.02, 0.96],
	);

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
						<span>OBSIDIAN</span> <span>{"//"}</span>{" "}
						<span>SHOWCASE TÉCNICO</span>
					</span>
				</motion.div>

				<div
					ref={featuredRef}
					className="mb-24 grid gap-10 border-b border-white/10 pb-20 lg:grid-cols-12 lg:items-center"
				>
					<motion.div style={{ y: featuredTextY }} className="lg:col-span-5">
						<span className="font-tech inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0077CC]">
							<span
								className="h-2 w-2 rounded-full bg-[#0077CC]"
								aria-hidden="true"
							/>
							<span>PROYECTO REAL EN PRODUCCIÓN</span>
						</span>
						<h3 className="mt-3 text-3xl font-semibold text-[#F7F6F3] md:text-4xl">
							{realProject.name}
						</h3>
						<p className="font-tech mt-1 text-xs uppercase tracking-widest text-white/55">
							{realProject.sector}
						</p>
						<p className="mt-4 max-w-[46ch] text-base leading-relaxed text-white/75">
							{realProject.note}
						</p>
						<a
							href={realProject.href}
							target="_blank"
							rel="noopener noreferrer"
							className="group mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0077CC] px-6 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC]"
						>
							<span>Visitar web real</span>
							<ArrowUpRight
								className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								strokeWidth={1.5}
								aria-hidden="true"
							/>
						</a>
					</motion.div>
					<motion.div
						style={{ y: featuredImageY, scale: featuredScale }}
						className="lg:col-span-7"
					>
						<a
							href={realProject.href}
							target="_blank"
							rel="noopener noreferrer"
							data-cursor="VISITAR WEB ↗"
							className="block aspect-[5/4] max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#141418] transition-colors hover:border-[#0077CC] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0077CC] lg:ml-auto"
						>
							<img
								src={realProject.image}
								alt="J.Barranco — Web corporativa en producción"
							className="h-full w-full object-cover"
								loading="lazy"
								decoding="async"
							/>
						</a>
					</motion.div>
				</div>

				<div className="mb-12 flex items-center justify-between">
					<p className="font-tech text-xs uppercase tracking-widest text-white/60">
						DEMOSTRACIONES TÉCNICAS · DATOS SIMULADOS
					</p>
				</div>

				<div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
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
