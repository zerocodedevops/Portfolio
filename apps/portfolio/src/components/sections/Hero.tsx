import {
	type MotionValue,
	motion,
	useReducedMotion,
	useScroll,
	useTransform,
} from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { lazy, Suspense, useRef } from "react";
import profilePhoto from "@/assets/perfil-david-portada-user.webp";

const HeroCanvas3D = lazy(() =>
	import("./HeroCanvas3D").then((module) => ({ default: module.HeroCanvas3D })),
);

const manifestoWords =
	"Creemos en una web rápida, legible y bien estructurada. Evitamos el ruido visual, las plantillas sobrecargadas y las capas comerciales innecesarias. Apostamos por soluciones técnicas honestas, interfaces cuidadas y prototipos interactivos que permiten validar el enfoque antes de tomar decisiones."
		.split(" ")
		.map((word, position) => ({ id: `${position}-${word}`, word }));

function ScrubbedWord({
	word,
	progress,
	range,
}: {
	readonly word: string;
	readonly progress: MotionValue<number>;
	readonly range: [number, number];
}) {
	const opacity = useTransform(progress, range, [0.18, 1]);
	return (
		<>
			<motion.span style={{ opacity }} className="inline-block">
				{word}
			</motion.span>{" "}
		</>
	);
}

const principles = [
	{
		code: "01",
		title: "Ingeniería sin lastre",
		description:
			"Desarrollamos interfaces orientadas al rendimiento, la accesibilidad y el mantenimiento limpio con tecnología web moderna.",
	},
	{
		code: "02",
		title: "Prototipos verificables",
		description:
			"Demostraciones interactivas por sector para mostrar nuestro criterio visual y técnico de forma tangible.",
	},
	{
		code: "03",
		title: "Trato directo",
		description:
			"Comunicación continua y transparente directamente con el responsable técnico del proyecto, sin intermediarios.",
	},
];

export function Hero() {
	const prefersReducedMotion = useReducedMotion() ?? false;
	const stageTrackRef = useRef<HTMLElement>(null);
	const studioRef = useRef<HTMLElement>(null);

	const { scrollYProgress: heroScroll } = useScroll({
		target: stageTrackRef,
		offset: ["start start", "end start"],
	});

	const { scrollYProgress: studioScroll } = useScroll({
		target: studioRef,
		offset: ["start end", "center center"],
	});

	const titleY = useTransform(
		heroScroll,
		[0, 0.45],
		prefersReducedMotion ? [0, 0] : [0, -48],
	);
	const titleOpacity = useTransform(
		heroScroll,
		[0, 0.35],
		prefersReducedMotion ? [1, 1] : [1, 0.15],
	);
	const stageScale = useTransform(
		heroScroll,
		[0, 0.55],
		prefersReducedMotion ? [1, 1] : [0.97, 1],
	);
	const stageRadius = useTransform(
		heroScroll,
		[0, 0.55],
		prefersReducedMotion ? [24, 24] : [24, 0],
	);
	const photoScale = useTransform(
		studioScroll,
		[0, 1],
		prefersReducedMotion ? [1, 1] : [1.08, 1],
	);
	const photoY = useTransform(
		studioScroll,
		[0, 1],
		prefersReducedMotion ? [0, 0] : [28, 0],
	);

	return (
		<>
			<section
				ref={stageTrackRef}
				id="home"
				className="relative overflow-hidden bg-[#09090B] text-[#F7F6F3] md:min-h-[145dvh]"
			>
				<div id="hero" className="md:sticky md:top-18">
					<motion.div
						style={{ scale: stageScale, borderRadius: stageRadius }}
						className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[#09090B] text-[#F7F6F3] md:min-h-[calc(100svh-4.5rem)]"
					>
						<Suspense fallback={null}>
							<HeroCanvas3D reducedMotion={prefersReducedMotion} />
						</Suspense>
						<motion.div
							style={{ y: titleY, opacity: titleOpacity }}
							className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-8 lg:p-10"
						>
							<div className="pointer-events-none max-w-[min(56rem,68%)] max-sm:max-w-full">
								<p className="font-tech mb-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-white/70 sm:mb-6">
									<span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0077CC]" aria-hidden="true" />
									<span>ESTUDIO TECNOLÓGICO · ENFOQUE REMOTO</span>
								</p>
								<motion.h1
									initial={prefersReducedMotion ? false : { y: 18, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
									className="max-w-[18ch] text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-white"
									style={{ fontFamily: "var(--zc-font-sans)" }}
								>
										<span className="sm:block">Diseño web y</span>{" "}
										<span className="font-editorial font-normal italic text-[#0077CC] sm:block">Producto Digital</span>{" "}
										<span className="sm:block">a medida.</span>
								</motion.h1>
							</div>

							<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
								<p className="max-w-[42ch] text-sm leading-relaxed text-white/75 sm:text-base">
									Construimos sitios web rápidos y aplicaciones con código a medida y trato directo, sin intermediarios.
								</p>
								<div className="flex flex-wrap items-center gap-3">
									<a href="#contacto" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0077CC] px-6 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC]">
										<span>Solicitar propuesta</span><ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} aria-hidden="true" />
									</a>
									<a href="#projects" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-[#111114]/75 px-6 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:border-white hover:bg-white hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC]">
										<span>Explorar proyectos</span><ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" strokeWidth={1.5} aria-hidden="true" />
									</a>
								</div>
							</div>
						</motion.div>
						<div aria-hidden="true" className="pointer-events-none absolute right-6 top-1/2 z-1 hidden -translate-y-1/2 font-tech text-right text-[10px] uppercase leading-6 tracking-[0.24em] text-white/45 lg:block">
							<span className="block">DIGITAL SYSTEM</span><span className="block text-[#0077CC]">001 / ENGINEERED</span><span className="mt-2 block">FOR THE WEB</span>
						</div>
					</motion.div>
				</div>
			</section>

			<section
				ref={studioRef}
				id="sobre-mi"
				className="border-b border-[#E2DFD7] bg-[#F7F6F3] py-20 text-[#111111] md:py-28"
			>
				<div className="container-custom">
					<div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-[#E2DFD7] pb-4">
						<p className="font-tech text-xs font-medium uppercase tracking-widest text-[#0077CC]">
							01 / EL ESTUDIO Y MANIFIESTO
						</p>
						<span className="font-tech text-[11px] uppercase tracking-widest text-[#5C5B57]">
							DIRECCIÓN Y CRITERIO
						</span>
					</div>

					<div className="grid gap-12 lg:grid-cols-12 lg:items-start">
						<div className="lg:col-span-4">
							<figure>
								<div className="overflow-hidden border border-[#E2DFD7] bg-[#EFECE6]">
									<motion.img
										style={{ scale: photoScale, y: photoY }}
										src={profilePhoto}
										alt="David G., desarrollador y responsable técnico de ZeroCode DevOps"
										className="aspect-4/5 w-full object-cover object-top"
										loading="lazy"
										decoding="async"
									/>
								</div>
							</figure>
						</div>

						<div className="lg:col-span-8 lg:pl-8">
							<motion.h2
								initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
								className="text-[clamp(1.85rem,3.4vw,3rem)] font-semibold leading-[1.06] tracking-tight text-[#111111]"
							>
								Soy David G., desarrollador y responsable técnico de ZeroCode
								DevOps.
							</motion.h2>
							<p className="mt-5 max-w-[60ch] text-base leading-relaxed text-[#5C5B57] md:text-lg">
								Trabajo de forma directa con cada cliente para diseñar y
								programar soluciones digitales claras, mantenibles y adaptadas a
								la necesidad real de su negocio.
							</p>

							<motion.blockquote
								initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
								className="mt-10 border-l-2 border-[#0077CC] pl-6 md:pl-8"
							>
								<p className="font-tech mb-2 text-[11px] uppercase tracking-widest text-[#5C5B57]">
									MANIFIESTO
								</p>
								<p className="font-editorial text-2xl leading-snug text-[#111111] md:text-3xl">
									{prefersReducedMotion
										? manifestoWords.map((item) => item.word).join(" ")
										: manifestoWords.map((item, idx) => {
												const start = idx / manifestoWords.length;
												const end = Math.min(
													start + 1.6 / manifestoWords.length,
													1,
												);
												return (
													<ScrubbedWord
														key={item.id}
														word={item.word}
														progress={studioScroll}
														range={[start * 0.75, end * 0.75 + 0.15]}
													/>
												);
											})}
								</p>
							</motion.blockquote>

							<div className="mt-12 grid gap-8 border-t border-[#E2DFD7] pt-10 sm:grid-cols-3">
								{principles.map((item, idx) => (
									<motion.div
										key={item.code}
										initial={
											prefersReducedMotion ? false : { opacity: 0, y: 14 }
										}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, amount: 0.3 }}
										transition={{
											duration: 0.45,
											delay: idx * 0.08,
											ease: [0.22, 1, 0.36, 1],
										}}
										className="space-y-2.5 sm:border-l sm:border-[#E2DFD7] sm:pl-6 first:sm:border-l-0 first:sm:pl-0"
									>
										<span className="font-tech block text-xs font-semibold text-[#0077CC]">
											<span>{item.code}</span> <span>/</span>
										</span>
										<h3 className="text-base font-semibold text-[#111111]">
											{item.title}
										</h3>
										<p className="text-sm leading-relaxed text-[#5C5B57]">
											{item.description}
										</p>
									</motion.div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
