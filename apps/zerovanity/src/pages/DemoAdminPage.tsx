import { useMemo, useState } from "react";
import { CalendarDays, Scissors, Users } from "lucide-react";
import { SERVICE_CATALOG } from "../data/services";
import { STYLISTS } from "../data/stylists";

type DemoBooking = {
  id: string;
  name: string;
  service: string;
  stylist: string;
  date: Date;
  status: "Pendiente" | "Confirmada" | "Cancelada";
};

function createSampleBookings(): DemoBooking[] {
  const today = new Date();
  const at = (days: number, hour: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    return date;
  };
  return [
    { id: "demo-1", name: "Lucía Martín", service: "Balayage", stylist: "Anna Garcia", date: at(0, 12), status: "Pendiente" },
    { id: "demo-2", name: "María López", service: "Manicura", stylist: "Elena Ruiz", date: at(1, 10), status: "Confirmada" },
    { id: "demo-3", name: "Carmen Ruiz", service: "Corte hombre", stylist: "Marc Soler", date: at(2, 16), status: "Pendiente" },
  ];
}

export default function DemoAdminPage() {
  const [bookings, setBookings] = useState(createSampleBookings);
  const [section, setSection] = useState<"citas" | "servicios" | "equipo">("citas");
  const todayCount = useMemo(() => bookings.filter((booking) => booking.date.toDateString() === new Date().toDateString()).length, [bookings]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[.25em] text-amber-400">Zero Vanity</p><h1 className="mt-2 text-3xl font-bold">Panel de administración</h1></div>
          <a className="rounded border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900" href="/proyectos/zerovanity/">Volver a la demo</a>
        </header>
        <aside className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">Vista de demostración: todos los datos son ficticios y los cambios solo viven en esta sesión. No hay conexión a una base de datos.</aside>
        <nav className="mb-6 flex flex-wrap gap-2" aria-label="Secciones del panel">
          {([{ id: "citas", label: "Citas", icon: CalendarDays }, { id: "servicios", label: "Servicios", icon: Scissors }, { id: "equipo", label: "Equipo", icon: Users }] as const).map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setSection(id)} className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm ${section === id ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-300 hover:bg-slate-800"}`}><Icon size={16} />{label}</button>)}
        </nav>
        {section === "citas" && <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {[{ label: "Citas de hoy", value: todayCount }, { label: "Pendientes", value: bookings.filter((booking) => booking.status === "Pendiente").length }, { label: "Equipo", value: STYLISTS.length }].map((stat) => <article key={stat.label} className="rounded-lg border border-slate-800 bg-slate-900 p-5"><p className="text-sm text-slate-400">{stat.label}</p><p className="mt-2 text-3xl font-bold text-amber-400">{stat.value}</p></article>)}
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-slate-800 text-slate-400"><tr>{["Cliente", "Servicio", "Estilista", "Fecha y hora", "Estado", "Acción"].map((label) => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}</tr></thead><tbody>{bookings.map((booking) => <tr key={booking.id} className="border-b border-slate-800/70 last:border-0"><td className="px-4 py-4">{booking.name}</td><td className="px-4 py-4">{booking.service}</td><td className="px-4 py-4">{booking.stylist}</td><td className="px-4 py-4">{booking.date.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}</td><td className="px-4 py-4">{booking.status}</td><td className="space-x-2 px-4 py-4"><button onClick={() => setBookings((items) => items.map((item) => item.id === booking.id ? { ...item, status: "Confirmada" } : item))} className="text-emerald-400 hover:underline">Confirmar</button><button onClick={() => setBookings((items) => items.filter((item) => item.id !== booking.id))} className="text-rose-400 hover:underline">Eliminar</button></td></tr>)}</tbody></table></div>
        </>}
        {section === "servicios" && <div className="grid gap-5 md:grid-cols-2">{SERVICE_CATALOG.map((category) => <section key={category.id} className="rounded-lg border border-slate-800 bg-slate-900 p-5"><h2 className="mb-4 font-semibold text-amber-300">{category.title}</h2><ul className="space-y-3">{category.services.slice(0, 5).map((service) => <li key={service.id} className="flex justify-between gap-4 text-sm"><span>{service.title}</span><span className="text-slate-400">{service.price} € · {service.duration}</span></li>)}</ul></section>)}</div>}
        {section === "equipo" && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{STYLISTS.map((stylist) => <article key={stylist.id} className="rounded-lg border border-slate-800 bg-slate-900 p-5"><h2 className="font-semibold">{stylist.name}</h2><p className="mt-1 text-sm text-amber-400">{stylist.role}</p></article>)}</div>}
      </div>
    </main>
  );
}
