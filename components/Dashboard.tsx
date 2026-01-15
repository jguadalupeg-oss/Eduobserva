
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend 
} from 'recharts';
import { TeacherObservation } from '../types';
import { DIMENSIONS } from '../constants';

interface DashboardProps {
  observations: TeacherObservation[];
  onSelectObservation: (obs: TeacherObservation) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ observations, onSelectObservation }) => {
  const averageData = useMemo(() => {
    if (observations.length === 0) return [];

    return DIMENSIONS.map(dim => {
      let total = 0;
      let count = 0;
      observations.forEach(obs => {
        dim.criteria.forEach(crit => {
          if (obs.scores[crit.id]?.score) {
            total += obs.scores[crit.id].score;
            count++;
          }
        });
      });
      return {
        subject: dim.title,
        A: count > 0 ? Number((total / count).toFixed(1)) : 0,
        fullMark: 5,
      };
    });
  }, [observations]);

  return (
    <div className="space-y-8 pb-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-file-signature"></i>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Observaciones</p>
            <p className="text-3xl font-bold text-slate-800">{observations.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-school"></i>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Escuelas Visitadas</p>
            <p className="text-3xl font-bold text-slate-800">
              {new Set(observations.map(o => o.schoolName)).size}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fa-solid fa-star"></i>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Promedio General</p>
            <p className="text-3xl font-bold text-slate-800">
              {observations.length > 0 
                ? (averageData.reduce((acc, curr) => acc + curr.A, 0) / averageData.length).toFixed(1)
                : '0.0'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <i className="fa-solid fa-chart-simple text-teal-500 mr-2"></i>
            Desempeño por Dimensión (Promedio)
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={averageData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 5]} hide />
                <YAxis 
                  dataKey="subject" 
                  type="category" 
                  width={140} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="A" name="Puntaje" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <i className="fa-solid fa-spider text-indigo-500 mr-2"></i>
            Mapa Radial de Fortalezas
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={averageData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} hide />
                <Radar
                  name="Nivel de Praxis"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Observation List */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Historial de Observaciones</h3>
          <span className="text-sm font-medium text-slate-500">{observations.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Docente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Escuela</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Observador</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {observations.map(obs => (
                <tr key={obs.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{obs.teacherName}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{obs.schoolName}</td>
                  <td className="px-6 py-4 text-slate-600">{obs.observerName}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(obs.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onSelectObservation(obs)}
                      className="px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-bold hover:bg-teal-100 transition"
                    >
                      Ver Informe IA
                    </button>
                  </td>
                </tr>
              ))}
              {observations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No hay observaciones registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
