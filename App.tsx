
import React, { useState, useEffect } from 'react';
import { TeacherObservation } from './types';
import Dashboard from './components/Dashboard';
import ObservationForm from './components/ObservationForm';
import ReportView from './components/ReportView';
import ChatAssistant from './components/ChatAssistant';

const App: React.FC = () => {
  const [observations, setObservations] = useState<TeacherObservation[]>([]);
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [selectedObservation, setSelectedObservation] = useState<TeacherObservation | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('edu_observations');
    if (saved) setObservations(JSON.parse(saved));
  }, []);

  const handleAddObservation = (obs: TeacherObservation) => {
    const updated = [obs, ...observations];
    setObservations(updated);
    localStorage.setItem('edu_observations', JSON.stringify(updated));
    setView('dashboard');
    setSelectedObservation(obs);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50 via-slate-50 to-indigo-50"></div>

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <i className="fa-solid fa-graduation-cap text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">EduObserva</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acompañamiento Inteligente</p>
            </div>
          </div>

          <nav className="hidden md:flex bg-slate-100 p-1 rounded-2xl">
            <button onClick={() => setView('dashboard')} className={`px-5 py-2 rounded-xl text-sm font-bold transition ${view === 'dashboard' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}>Dashboard</button>
            <button onClick={() => setView('form')} className={`px-5 py-2 rounded-xl text-sm font-bold transition ${view === 'form' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}>Visita</button>
          </nav>

          <button onClick={() => setView('form')} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition flex items-center">
            <i className="fa-solid fa-plus mr-2"></i>Nueva Visita
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative">
        {view === 'dashboard' ? <Dashboard observations={observations} onSelectObservation={setSelectedObservation} /> : <ObservationForm onSubmit={handleAddObservation} onCancel={() => setView('dashboard')} />}
      </main>

      {selectedObservation && <ReportView observation={selectedObservation} onClose={() => setSelectedObservation(null)} />}
      
      <ChatAssistant />

      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 EduObserva - Supervisión y Praxis Docente Potenciada con IA</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
