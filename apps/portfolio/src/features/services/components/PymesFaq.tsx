import React from 'react';

export default function PymesFaq() {
  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center sm:text-left">
        Preguntas frecuentes (FAQ)
      </h2>
      <div className="space-y-4">
        <FaqItem
          q="¿Cuánto cuesta contratar un diseñador web para mi empresa en Madrid?"
          a="El precio de una página web para empresa puede variar. Un diseño web profesional parte de 700€, pudiendo llegar a 1.400€ o más si tu negocio necesita integraciones complejas o SEO local avanzado."
        />
        <FaqItem
          q="¿Qué incluye el servicio de creación de página web para pymes?"
          a="Al contratar diseñador web freelance Madrid con nosotros, el paquete incluye un diseño a medida y autogestionable, optimización de velocidad de carga, textos legales (RGPD), certificado SSL, e integración para contacto directo por WhatsApp o email."
        />
        <FaqItem
          q="¿Cuánto tarda en estar lista?"
          a="Crear una página web para mi negocio suele demorarse entre 2 y 4 semanas, siempre dependiendo del tiempo que tardemos en recopilar los textos, fotos e información de tus servicios."
        />
        <FaqItem
          q="¿Tengo que saber de informática para gestionar mi web?"
          a="Para nada. Te entregamos la web lista y te damos una formación básica para que seas autónomo al 100%."
        />
        <FaqItem
          q="¿La web será mía al 100%?"
          a="Sí. Siempre recomendamos que el dominio y el hosting estén a tu nombre. Tú eres el dueño legal de todo."
        />
        <FaqItem
          q="¿Por qué necesito una web si ya tengo redes sociales?"
          a="Porque tu web es tuya. Las redes son prestadas. Pueden cambiar reglas, alcance o incluso cerrar tu cuenta sin avisar. Un desarrollo propio te da el control total de tu negocio."
        />
        <FaqItem
          q="¿Trabajas solo en Madrid o también online?"
          a="Mi base está en Madrid y doy servicio presencial en toda la Comunidad (Rivas, Pozuelo, Alcobendas, Coslada…), pero trabajo igualmente con clientes de toda España de forma 100% online. La comunicación es igual de fluida por videollamada."
        />
      </div>
    </section>
  );
}

function FaqItem({ q, a }: Readonly<{ q: string; a: string }>) {
  return (
    <div className="p-6 rounded-2xl bg-dark-800/40 border border-dark-700/50 hover:border-dark-700 transition-colors">
      <h3 className="text-lg font-bold text-white mb-3">{q}</h3>
      <p className="text-dark-300 leading-relaxed text-sm">{a}</p>
    </div>
  );
}
