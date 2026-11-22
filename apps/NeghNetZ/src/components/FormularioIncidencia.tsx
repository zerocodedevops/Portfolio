import React, { useState } from 'react';

export interface FormularioIncidenciaData {
  titulo: string;
  descripcion: string;
  categoria: string;
  zona: string;
}

interface FormularioIncidenciaProps {
  onSubmit: (formData: FormularioIncidenciaData) => void;
  onCancel: () => void;
}

function FormularioIncidencia({ onSubmit, onCancel }: FormularioIncidenciaProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Fontanería', // Valor por defecto
    zona: 'Zonas Comunes', // Valor por defecto
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descripcion) {
      alert('Por favor, rellena el título y la descripción.');
      return;
    }
    onSubmit(formData); // Llama a la función que le pasamos desde el padre
  };

  return (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Notificar Nueva Incidencia</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
            required
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
            >
              <option value="Fontanería">Fontanería</option>
              <option value="Electricidad">Electricidad</option>
              <option value="Cerrajería">Cerrajería</option>
              <option value="Cristalería">Cristalería</option>
              <option value="Jardinería">Jardinería</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label htmlFor="zona" className="block text-sm font-medium text-gray-700">Zona</label>
            <select
              id="zona"
              name="zona"
              value={formData.zona}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
            >
              <option value="Zonas Comunes">Zonas Comunes</option>
              <option value="Portal A">Portal A</option>
              <option value="Portal B">Portal B</option>
              <option value="Garaje">Garaje</option>
              <option value="Pista de Pádel">Pista de Pádel</option>
              <option value="Piscina">Piscina</option>
              <option value="Vivienda Privada">Vivienda Privada</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-naranja-500 hover:bg-naranja-600 text-white font-semibold py-2 px-4 rounded"
          >
            Notificar Incidencia
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioIncidencia;
