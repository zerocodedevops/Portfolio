// RUTA: ./src/components/charts/DashboardCharts.jsx

import React from 'react';
import type { ReactNode } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Datos de ejemplo para Incidencias
const incidenciasData = [
  { name: 'Ene', recibidas: 4, resueltas: 2 },
  { name: 'Feb', recibidas: 3, resueltas: 1 },
  { name: 'Mar', recibidas: 2, resueltas: 3 },
  { name: 'Abr', recibidas: 6, resueltas: 4 },
  { name: 'May', recibidas: 8, resueltas: 6 },
  { name: 'Jun', recibidas: 5, resueltas: 5 },
];

// Datos de ejemplo para Estado de Incidencias (Pie Chart)
const estadoData = [
  { name: 'Pendientes', value: 5 },
  { name: 'En Proceso', value: 3 },
  { name: 'Resueltas', value: 12 },
  { name: 'Descartadas', value: 2 },
];

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444']; // Colores: Amber, Blue, Green, Red

export const IncidenciasChart = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={incidenciasData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend />
          <Bar dataKey="recibidas" name="Recibidas" fill="#F97316" radius={[4, 4, 0, 0]} />
          <Bar dataKey="resueltas" name="Resueltas" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const EstadoIncidenciasPieChart = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={estadoData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {estadoData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string | number;
  color: string;
}

export const StatsCard = ({ title, value, icon, trend, trendValue, color }: StatsCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10 dark:bg-opacity-20`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
          <span className="text-gray-400 ml-2">vs mes anterior</span>
        </div>
      )}
    </div>
  );
};
