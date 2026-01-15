
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TeacherObservation, AIReport, ObservationScore, Dimension, ChatMessage } from "../types";
import { DIMENSIONS } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// 1. Observation Report Generation (Flash)
export async function generateObservationReport(observation: TeacherObservation): Promise<AIReport> {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  
  const scoresSummary = DIMENSIONS.map(dim => {
    const dimScores = dim.criteria.map(crit => {
      const scoreData = observation.scores[crit.id];
      return `${crit.label}: ${scoreData?.score || 'N/A'}/5 - Notas: ${scoreData?.notes || 'Sin notas'}`;
    }).join('\n');
    return `### ${dim.title}\n${dimScores}`;
  }).join('\n\n');

  const prompt = `Analiza la observación de ${observation.observerName} al docente ${observation.teacherName}.
    NOTAS: ${observation.generalNotes}
    PUNTAJES: ${scoresSummary}
    Genera JSON: observedAspects, improvementFocus, praxisSuggestions, dialogueProposal.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          observedAspects: { type: Type.STRING },
          improvementFocus: { type: Type.STRING },
          praxisSuggestions: { type: Type.STRING },
          dialogueProposal: { type: Type.STRING },
        },
        required: ["observedAspects", "improvementFocus", "praxisSuggestions", "dialogueProposal"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

// 2. Immediate Dimension Suggestions (Flash)
export async function generateDimensionSuggestions(dimension: Dimension, scores: Record<string, ObservationScore>): Promise<string> {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  const relevantScores = dimension.criteria.map(crit => `- ${crit.label}: ${scores[crit.id]?.score || 'N/A'}`).join('\n');
  const prompt = `Sugiere mejoras para la dimensión "${dimension.title}" basadas en: ${relevantScores}`;
  const response = await ai.models.generateContent({ model, contents: prompt });
  return response.text || "";
}

// 3. Image Analysis (Pro)
export async function analyzeEvidenceImage(base64Data: string): Promise<string> {
  const ai = getAI();
  const model = 'gemini-3-pro-preview';
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
        { text: "Describe qué aspectos de la práctica docente se observan en esta imagen y cómo se relacionan con las dimensiones pedagógicas." }
      ]
    }
  });
  return response.text || "No se pudo analizar la imagen.";
}

// 4. Audio Transcription (Flash)
export async function transcribeAudio(base64Data: string): Promise<string> {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: "audio/wav" } },
        { text: "Transcribe exactamente lo que se dice en este audio de observación." }
      ]
    }
  });
  return response.text || "";
}

// 5. Text to Speech (TTS Flash)
export async function playTextToSpeech(text: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Lee profesionalmente: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return;

  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  source.start();
}

// 6. Pedagogical Chatbot (Pro with Search Grounding)
export async function askPedagogicalAssistant(message: string, history: ChatMessage[]): Promise<ChatMessage> {
  const ai = getAI();
  const model = 'gemini-3-pro-preview';
  const response = await ai.models.generateContent({
    model,
    contents: [
      ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "Eres un asesor pedagógico experto. Usa Google Search para encontrar las mejores estrategias, libros y recursos actualizados."
    }
  });

  const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({ title: chunk.web!.title, uri: chunk.web!.uri })) || [];

  return { role: 'model', text: response.text || "", urls };
}

// Audio Utilities
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
