const steps = [
  { title: 'Cuéntanos el contexto', description: 'Origen, destino, fechas aproximadas y qué quieres trasladar.' },
  { title: 'Revisamos la ruta', description: 'Con esa información podemos confirmar disponibilidad y qué detalles faltan.' },
  { title: 'Recibe una propuesta', description: 'Te explicamos el alcance y las condiciones antes de decidir.' },
  { title: 'Cerramos el plan', description: 'Si te encaja, coordinamos contigo los siguientes pasos.' },
];

export default function WhyChooseUs() {
  return <section className="zd-section zd-process"><div className="zd-shell"><div className="zd-reveal"><h2 className="zd-title">Un proceso paso a paso.</h2><p className="zd-copy">Cada traslado tiene sus particularidades. Empezamos por escucharlas y valorar lo necesario.</p></div><ol className="zd-process-grid">{steps.map((step) => <li className="zd-process-step zd-reveal" key={step.title}><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></div></section>;
}
