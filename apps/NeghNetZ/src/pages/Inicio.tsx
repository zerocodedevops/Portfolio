// RUTA: ./src/pages/Inicio.jsx

import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { VecinoOutletContext } from '../types/domain';
import { motion } from 'framer-motion';
import { 
  IncidenciasChart, 
  EstadoIncidenciasPieChart, 
  StatsCard 
} from '../components/charts/DashboardCharts';
import { 
  ExclamationTriangleIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';

function Inicio() {
  const [datosVecino] = useOutletContext<VecinoOutletContext>();

  if (!datosVecino) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-naranja-500"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      className="p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Hola, <span className="text-naranja-500">{datosVecino.datosPersonales?.nombre || datosVecino.nombre}</span> 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Aquí tienes un resumen de lo que está pasando en tu comunidad hoy.
        </p>
      </motion.div>
      
      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        <StatsCard 
          title="Incidencias Activas" 
          value="3" 
          icon={<ExclamationTriangleIcon className="w-6 h-6 text-naranja-500" />}
          trend="down"
          trendValue="12%"
          color="bg-naranja-500"
        />
        <StatsCard 
          title="Reservas Próximas" 
          value="2" 
          icon={<CalendarIcon className="w-6 h-6 text-blue-500" />}
          trend="up"
          trendValue="5%"
          color="bg-blue-500"
        />
        <StatsCard 
          title="Documentos Nuevos" 
          value="5" 
          icon={<DocumentTextIcon className="w-6 h-6 text-green-500" />}
          trend="up"
          trendValue="8%"
          color="bg-green-500"
        />
        <StatsCard 
          title="Vecinos Registrados" 
          value="42" 
          icon={<UserGroupIcon className="w-6 h-6 text-purple-500" />}
          trend="up"
          trendValue="2"
          color="bg-purple-500"
        />
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Actividad de Incidencias</h3>
          <IncidenciasChart />
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Estado de Solicitudes</h3>
          <EstadoIncidenciasPieChart />
        </motion.div>
      </div>

      {/* Quick Actions / Recent Activity */}
      <motion.div 
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer group">
              <div className="w-2 h-2 rounded-full bg-naranja-500 mr-4 group-hover:scale-125 transition-transform"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Nueva acta de reunión publicada</p>
                <p className="text-xs text-gray-500">Hace 2 horas • Documentos</p>
              </div>
              <span className="text-gray-400 group-hover:text-naranja-500 transition-colors">→</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Inicio;
