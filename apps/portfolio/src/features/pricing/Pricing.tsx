import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { Seo } from "@/components/common/SEO";
import { Layout } from "@/components/layout";

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
	"Integraciones y despliegue estructurado",
];

export default function Pricing() {
	return (
		<Layout>
			<Seo
				title="Tarifas y Niveles de Proyecto | ZeroCode DevOps"
				description="Lanzamiento Esencial para autónomos y pymes, y Plataformas y Soluciones a Medida. Solicita diagnóstico y presupuesto personalizado."
			/>
			<main className="border-b border-[#E2DFD7] bg-[#F7F6F3] px-4 pb-24 pt-32 text-[#111111] sm:px-6">
				<div className="container-custom">
					<header className="mb-16 border-b border-[#E2DFD7] pb-10">
						<p className="font-tech mb-3 text-xs font-medium uppercase tracking-widest text-[#0077CC]">
							TARIFAS Y ALCANCE MODULAR
						</p>
						<h1 className="max-w-[18ch] text-[clamp(2.25rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-tight text-[#111111]">
							Dos niveles claros, mismo rigor técnico.
						</h1>
						<p className="mt-5 max-w-[58ch] text-base leading-relaxed text-[#5C5B57] md:text-lg">
							Trabajamos en remoto bajo presupuesto personalizado tras un
							diagnóstico breve, adaptando el alcance a lo que tu negocio
							necesita realmente.
						</p>
					</header>

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
										<h2
											id="nivel-1-title"
											className="mt-2 text-2xl font-semibold text-[#111111]"
										>
											Presencia profesional rápida
										</h2>
									</div>
									<span className="font-tech text-xs font-semibold uppercase tracking-widest text-[#111111]">
										Consultar presupuesto
									</span>
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
									href="/#contacto"
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
										<h2
											id="nivel-2-title"
											className="mt-2 text-2xl font-semibold text-[#F7F6F3]"
										>
											Plataformas y producto digital
										</h2>
									</div>
									<span className="font-tech text-xs font-semibold uppercase tracking-widest text-white/80">
										Consultar presupuesto
									</span>
								</div>

								<p className="mt-5 text-sm leading-relaxed text-white/75">
									Para empresas y proyectos con necesidades específicas de
									diseño, portales de gestión, aplicaciones interactivas o
									integraciones a medida.
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
									href="/#contacto"
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
			</main>
		</Layout>
	);
}
