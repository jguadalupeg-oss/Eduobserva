
import React, { useState, useRef } from 'react';
import { DIMENSIONS } from '../constants';
import { TeacherObservation, ObservationScore } from '../types';
import { generateDimensionSuggestions, transcribeAudio, analyzeEvidenceImage } from '../services/geminiService';

interface ObservationFormProps {
  onSubmit: (observation: TeacherObservation) => void;
  onCancel: () => void;
}

const ObservationForm: React.FC<ObservationFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    teacherName: '',
    schoolName: '',
    observerName: '',
    generalNotes: '',
  });

  const [scores, setScores] = useState<Record<string, ObservationScore>>({});
  const [activeDimension, setActiveDimension] = useState(0);
  const [dimSuggestions, setDimSuggestions] = useState<Record<string, { text: string; loading: boolean }>>({});
  const [isRecording, setIsRecording] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<string | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleScoreChange = (criterionId: string, score: number) => {
    setScores(prev => ({ ...prev, [criterionId]: { ...prev[criterionId], criterionId, score } }));
  };

  const handleNoteChange = (criterionId: string, notes: string) => {
    setScores(prev => ({ ...prev, [criterionId]: { ...prev[criterionId], criterionId, notes } }));
  };

  const startRecording = async (criterionId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const text = await transcribeAudio(base64);
          handleNoteChange(criterionId, (scores[criterionId]?.notes || '') + ' ' + text);
          setIsRecording(null);
        };
      };
      mediaRecorder.current.start();
      setIsRecording(criterionId);
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
  };

  const handleImageUpload = (criterionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAnalyzingImage(criterionId);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const analysis = await analyzeEvidenceImage(base64);
      handleNoteChange(criterionId, (scores[criterionId]?.notes || '') + '\n[Análisis de Imagen]: ' + analysis);
      setIsAnalyzingImage(null);
    };
  };

  const handleGetAISuggestions = async () => {
    const currentDim = DIMENSIONS[activeDimension];
    setDimSuggestions(prev => ({ ...prev, [currentDim.id]: { text: '', loading: true } }));
    const suggestions = await generateDimensionSuggestions(currentDim, scores);
    setDimSuggestions(prev => ({ ...prev, [currentDim.id]: { text: suggestions, loading: false } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherName || !formData.schoolName) return alert("Completa campos básicos");
    onSubmit({ id: Date.now().toString(), ...formData, date: new Date().toISOString(), scores });
  };

  const currentDim = DIMENSIONS[activeDimension];
  const currentAISuggestion = dimSuggestions[currentDim.id];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto border border-slate-200 mb-12">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Nueva Observación</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark text-xl"></i></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" className="px-3 py-2 bg-slate-50 border rounded-lg" value={formData.teacherName} onChange={e => setFormData({...formData, teacherName: e.target.value})} placeholder="Docente" required />
          <input type="text" className="px-3 py-2 bg-slate-50 border rounded-lg" value={formData.schoolName} onChange={e => setFormData({...formData, schoolName: e.target.value})} placeholder="Escuela" required />
          <input type="text" className="px-3 py-2 bg-slate-50 border rounded-lg" value={formData.observerName} onChange={e => setFormData({...formData, observerName: e.target.value})} placeholder="Supervisor" required />
        </div>

        <div className="flex overflow-x-auto border-b pb-2 space-x-4">
          {DIMENSIONS.map((dim, idx) => (
            <button key={dim.id} type="button" onClick={() => setActiveDimension(idx)} className={`px-4 py-2 rounded-t-lg transition whitespace-nowrap ${activeDimension === idx ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-600 font-bold' : 'text-slate-500'}`}>
              <i className={`fa-solid ${dim.icon} mr-2`}></i>{dim.title}
            </button>
          ))}
        </div>

        <div className="animate-fadeIn">
          <h3 className="text-xl font-bold mb-6 flex items-center"><i className={`fa-solid ${currentDim.icon} mr-3 text-teal-600`}></i>{currentDim.title}</h3>
          <div className="space-y-6">
            {currentDim.criteria.map(crit => (
              <div key={crit.id} className="bg-slate-50 p-4 rounded-xl border">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1">
                    <p className="font-semibold">{crit.label}</p>
                    <p className="text-xs text-slate-500">{crit.description}</p>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button key={v} type="button" onClick={() => handleScoreChange(crit.id, v)} className={`w-8 h-8 rounded text-sm font-bold ${scores[crit.id]?.score === v ? 'bg-teal-600 text-white' : 'bg-white border'}`}>{v}</button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <textarea className="w-full p-3 border rounded-lg text-sm" value={scores[crit.id]?.notes || ''} onChange={e => handleNoteChange(crit.id, e.target.value)} rows={3} placeholder="Notas de campo..." />
                  <div className="absolute bottom-2 right-2 flex space-x-2">
                    <label className="cursor-pointer text-slate-400 hover:text-indigo-600 transition" title="Analizar foto de evidencia">
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(crit.id, e)} />
                      <i className={`fa-solid ${isAnalyzingImage === crit.id ? 'fa-spinner animate-spin' : 'fa-camera'} p-2`}></i>
                    </label>
                    <button type="button" onMouseDown={() => startRecording(crit.id)} onMouseUp={stopRecording} onMouseLeave={stopRecording} className={`p-2 rounded-full transition ${isRecording === crit.id ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-teal-600'}`} title="Mantener para dictar">
                      <i className="fa-solid fa-microphone"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t">
            {currentAISuggestion ? (
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h4 className="text-indigo-800 font-bold text-sm flex items-center mb-2"><i className="fa-solid fa-wand-magic-sparkles mr-2"></i>Sugerencias de la IA</h4>
                {currentAISuggestion.loading ? <p className="text-xs animate-pulse">Generando...</p> : <p className="text-sm italic text-slate-700">{currentAISuggestion.text}</p>}
              </div>
            ) : (
              <button type="button" onClick={handleGetAISuggestions} className="w-full py-3 bg-white border border-dashed border-teal-300 rounded-xl text-teal-600 font-bold hover:bg-teal-50 transition">
                <i className="fa-solid fa-sparkles mr-2"></i> Generar Sugerencias con IA para esta sección
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <button type="button" disabled={activeDimension === 0} onClick={() => setActiveDimension(prev => prev - 1)} className="px-4 py-2 text-slate-500">Anterior</button>
          {activeDimension < DIMENSIONS.length - 1 
            ? <button type="button" onClick={() => setActiveDimension(prev => prev + 1)} className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold">Siguiente</button>
            : <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-bold shadow-lg">Finalizar Visita</button>
          }
        </div>
      </form>
    </div>
  );
};

export default ObservationForm;
