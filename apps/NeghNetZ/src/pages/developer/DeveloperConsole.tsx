import { useNavigate } from 'react-router-dom';
import { DEMO_UNAVAILABLE_MESSAGE } from '../../demo/demoConstants';

function DeveloperConsole() {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10 text-slate-900">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <h1 className="text-xl font-bold text-slate-900">Consola de Desarrollador</h1>
        <p className="mt-3 text-sm text-slate-600">{DEMO_UNAVAILABLE_MESSAGE}</p>
        <button
          type="button"
          onClick={() => navigate('/login', { replace: true })}
          className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Volver al inicio
        </button>
      </section>
    </main>
  );
}

export default DeveloperConsole;
