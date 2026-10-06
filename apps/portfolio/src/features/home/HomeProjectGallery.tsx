import { ArrowUpRight, ExternalLink } from 'lucide-react';

const projects = [
  { name: 'J.Barranco', sector: 'Limpieza profesional', note: 'Servicios locales presentados con claridad.', href: 'https://jbarrancolimpieza.com', mark: 'JB', tone: 'from-[#d8edeb] to-[#f3f8f6]' },
  { name: 'ZeroChaos', sector: 'Reformas integrales', note: 'Una propuesta digital para mostrar cada proyecto.', href: '/casos-de-exito/reformas-zerochaos', mark: 'ZC', tone: 'from-[#e8e9df] to-[#f6f5ee]' },
  { name: 'ZeroDelay', sector: 'Mudanzas', note: 'Información práctica para solicitar un servicio.', href: '/casos-de-exito/mudanzas-zerodelay', mark: 'ZD', tone: 'from-[#e2edf7] to-[#f3f7fa]' },
  { name: 'ZeroVanity', sector: 'Peluquería y estética', note: 'Demo en desarrollo para salones de belleza.', href: '/casos-de-exito/peluqueria-zerovanity', mark: 'ZV', tone: 'from-[#f2e4dd] to-[#faf6f2]', demo: true },
];

export function HomeProjectGallery() {
  return (
    <section id="projects" className="bg-white py-20 sm:py-28">
      <div className="container-custom">
        <div className="mb-12 max-w-2xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.19em] text-[#087cae]">Proyectos y conceptos</p><h2 className="font-outfit text-3xl font-semibold tracking-tight text-[#071a35] sm:text-4xl">Cada negocio necesita una web distinta.</h2><div className="mt-4 space-y-2 leading-7 text-[#586a80]"><p>Explora ejemplos de distintos sectores.</p><p>Cada proyecto parte de una necesidad diferente.</p></div></div>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => <article key={project.name} className="group">
            <a href={project.href} target={project.href.startsWith('http') ? '_blank' : undefined} rel={project.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0789bd] focus-visible:ring-offset-4" aria-label={`Ver ${project.name}`}>
              <div className={`relative flex aspect-[1.1/1] items-center justify-center overflow-hidden bg-gradient-to-br ${project.tone}`}>
                <div aria-hidden="true" className="absolute inset-5 border border-[#0b294a]/10"/><div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-[#0b294a]/10"/><div aria-hidden="true" className="absolute left-1/2 top-0 h-full w-px bg-[#0b294a]/10"/>
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#0789bd]/25 bg-white/70 shadow-[0_12px_45px_rgba(7,26,53,.10)]"><span className="font-outfit text-4xl font-semibold tracking-tight text-[#0b294a]">{project.mark}</span><span aria-hidden="true" className="absolute -right-1 top-3 h-3 w-3 rounded-full bg-[#12b8e8]"/></div>
                {project.demo && <span className="absolute bottom-4 left-4 bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0b294a]">Demo en desarrollo</span>}
                <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#071a35] text-white transition group-hover:bg-[#12b8e8] group-hover:text-[#061a32]"><ArrowUpRight className="h-4 w-4"/></span>
              </div>
              <div className="pt-4"><p className="text-xs font-medium uppercase tracking-wider text-[#718197]">{project.sector}</p><h3 className="mt-2 font-outfit text-lg font-semibold text-[#0a203d]">{project.name}</h3><p className="mt-2 text-sm leading-6 text-[#586a80]">{project.note}</p><span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#087cae]">Ver proyecto <ExternalLink className="h-3.5 w-3.5"/></span></div>
            </a>
          </article>)}
        </div>
      </div>
    </section>
  );
}
