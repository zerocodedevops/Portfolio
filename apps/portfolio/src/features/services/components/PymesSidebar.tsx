import React from 'react';
import { Search, MapPin } from 'lucide-react';

export default function PymesSidebar() {
  return (
    <aside className="sticky top-[68px] lg:block">
      <div className="bg-dark-900/40 border border-dark-800 p-6 rounded-[2rem] space-y-6">
        <h2 className="text-2xl font-bold text-white leading-tight">
          Por qué es importante una buena web para tu negocio en Madrid
        </h2>

        <div className="space-y-[18px]">
          <div className="bg-gradient-to-br from-primary-600/20 to-accent-600/20 p-8 rounded-3xl border border-white/5 mt-16 text-center">
            <h3 className="text-xl font-bold text-white mb-10">Estadísticas Clave</h3>
            <div className="grid grid-cols-1 gap-8 divide-y divide-white/10">
              <div className="pb-8">
                <span className="block text-5xl font-extrabold text-primary-400 mb-2">88%</span>
                <p className="text-sm text-dark-300 leading-relaxed px-4">de consumidores investigan online antes de comprar localmente.</p>
              </div>
              <div className="pt-8">
                <span className="block text-5xl font-extrabold text-accent-400 mb-2">53%</span>
                <p className="text-sm text-dark-300 leading-relaxed px-4">abandona una web local que tarda más de 3s en cargar.</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-dark-700/50 bg-dark-800/30">
            <h3 className="text-sm font-bold text-white mb-[6px] flex items-center gap-2">
              <Search className="w-4 h-4 text-primary-400" />
              Consejo SEO Técnico
            </h3>
            <p className="text-dark-400 text-xs leading-relaxed">
              Optimiza tus "Core Web Vitals". Un buen <strong>servicio de diseño web</strong> garantiza que Google favorezca tu sitio.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-dark-700/50 bg-dark-800/30">
            <h3 className="text-sm font-bold text-white mb-5 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-accent-400 shrink-0" />
              Presencia en Madrid
            </h3>
            <ul className="grid grid-cols-2 gap-3 text-left">
              {['Madrid Capital', 'Rivas Vaciamadrid', 'Coslada', 'San Fernando', 'Arganda del Rey', 'Pozuelo y Aravaca', 'Majadahonda', 'Las Rozas'].map((city) => (
                <li key={city} className="flex items-center gap-2 text-xs text-dark-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />{city}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
