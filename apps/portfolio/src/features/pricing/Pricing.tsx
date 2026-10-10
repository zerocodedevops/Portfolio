import { Check, MessageCircle } from 'lucide-react';
import { Seo } from '@/components/common/SEO';
import { Layout } from '@/components/layout';
import { ParallaxBackdrop } from '@/components/ui/ParallaxBackdrop';

const inclusions = [
  'Una sola página con Inicio y Contacto',
  'Botón de redirección a WhatsApp',
  'Diseño adaptado a móviles',
  'Enlaces a los textos legales que facilite tu negocio',
  'Dominio y hosting durante un año',
  'Certificado SSL',
];

export default function Pricing() {
  return <Layout>
    <Seo title="Precio de página web desde 400 € más IVA" description="Conoce qué incluye la web de una página desde 400 € más IVA para autónomos y pymes de toda España. Presupuesto claro antes de empezar." />
    <main className="relative isolate overflow-hidden bg-[#f3f7fa] px-4 pb-24 pt-32 sm:px-6">
      <ParallaxBackdrop />
      <div className="container-custom relative z-10">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.19em] text-[#087cae]">Precio claro</p>
          <h1 className="font-outfit text-4xl font-semibold tracking-tight text-[#071a35] sm:text-5xl">Una web para empezar desde 400 € más IVA</h1>
          <div className="mt-5 space-y-2 text-lg leading-8 text-[#586a80]"><p>Una página cuidada para presentar tu negocio y facilitar que contacten contigo.</p><p>Trabajo online en toda España.</p></div>
        </header>
        <section className="mx-auto max-w-4xl border border-[#dce4eb] bg-white p-6 shadow-sm sm:p-10" aria-labelledby="price-includes">
          <div className="flex flex-col justify-between gap-6 border-b border-[#dce4eb] pb-7 sm:flex-row sm:items-end">
            <div><h2 id="price-includes" className="font-outfit text-2xl font-semibold text-[#071a35]">Web de una página</h2><p className="mt-2 text-sm text-[#586a80]">Inicio y contacto, con el alcance indicado a continuación.</p></div>
            <p className="font-outfit text-4xl font-semibold text-[#071a35]">400 € + IVA</p>
          </div>
          <ul className="grid gap-4 py-8 text-sm leading-6 text-[#263c56] sm:grid-cols-2">{inclusions.map((item,index)=><li key={item} className={`flex gap-3 ${index < 2 ? 'sm:col-span-2' : ''}`}><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0789bd]" aria-hidden="true"/>{item}</li>)}</ul>
          <div className="space-y-2 border-t border-[#dce4eb] pt-6 text-sm leading-6 text-[#586a80]"><p>El dominio y el hosting están incluidos durante el primer año. Cualquier renovación o mantenimiento posterior se acordará y presupuestará antes de contratarlo.</p><p>Si necesitas un alcance distinto, cuéntame qué tienes en mente.</p><p>Recibirás una propuesta y un presupuesto acordados antes de empezar.</p></div>
          <div className="mt-7 flex flex-wrap gap-3"><a href="/#contacto" className="inline-flex min-h-12 items-center gap-2 bg-[#087cae] px-5 font-semibold text-white transition hover:bg-[#071a35]">Pedir presupuesto</a><a href="https://wa.me/34912622712?text=Hola%2C%20quiero%20consultar%20una%20web%20para%20mi%20negocio." target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 border border-[#0b294a] px-5 font-semibold text-[#0b294a] transition hover:bg-[#0b294a] hover:text-white"><MessageCircle className="h-4 w-4"/>WhatsApp</a></div>
        </section>
      </div>
    </main>
  </Layout>;
}
