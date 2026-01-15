
import React, { useEffect, useState } from 'react';
import { TeacherObservation, AIReport } from '../types';
import { generateObservationReport, playTextToSpeech } from '../services/geminiService';

interface ReportViewProps {
  observation: TeacherObservation;
  onClose: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ observation, onClose }) => {
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const result = await generateObservationReport(observation);
        setReport(result);
      } catch (err) {
        setError("Error al conectar con la IA.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [observation]);

  const handleRead = async (id: string, text: string) => {
    setIsReading(id);
    await playTextToSpeech(text);
    setIsReading(null);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-slate-700">Generando análisis profundo...</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full my-auto overflow-hidden animate-fadeIn">
        <div className="bg-gradient-to-r from-teal-600 to-indigo-700 p-8 text-white flex justify-between">
          <div>
            <h2 className="text-3xl font-bold">Informe de Acompañamiento</h2>
            <p className="opacity-80 mt-1">{observation.teacherName} • {observation.schoolName}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><i className="fa-solid fa-xmark"></i></button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
          {report && (
            <>
              {[
                { title: 'Aspectos Observados', key: 'observedAspects', icon: 'fa-eye', color: 'text-teal-600', bg: 'bg-teal-50' },
                { title: 'Focos de Mejora', key: 'improvementFocus', icon: 'fa-arrow-up-right-dots', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { title: 'Sugerencias Praxis', key: 'praxisSuggestions', icon: 'fa-lightbulb', color: 'text-amber-600', bg: 'bg-amber-50' },
                { title: 'Diálogo Democrático', key: 'dialogueProposal', icon: 'fa-handshake', color: 'text-rose-600', bg: 'bg-rose-50' }
              ].map(section => (
                <div key={section.key} className={`${section.bg} p-6 rounded-2xl border relative`}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className={`font-bold flex items-center ${section.color}`}>
                      <i className={`fa-solid ${section.icon} mr-2`}></i> {section.title}
                    </h4>
                    <button 
                      onClick={() => handleRead(section.key, (report as any)[section.key])}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition ${isReading === section.key ? 'bg-indigo-600 text-white animate-pulse' : 'bg-white text-slate-400 hover:text-indigo-600'}`}
                    >
                      <i className="fa-solid fa-volume-high"></i>
                    </button>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{(report as any)[section.key]}</p>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t flex justify-end space-x-4">
          <button onClick={() => window.print()} className="px-6 py-2 bg-white border rounded-xl font-bold"><i className="fa-solid fa-print mr-2"></i>Imprimir</button>
          <button onClick={onClose} className="px-8 py-2 bg-teal-600 text-white rounded-xl font-bold shadow-lg">Listo</button>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
