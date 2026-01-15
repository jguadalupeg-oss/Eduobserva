
export interface Criterion {
  id: string;
  label: string;
  description: string;
}

export interface Dimension {
  id: string;
  title: string;
  icon: string;
  criteria: Criterion[];
}

export interface ObservationScore {
  criterionId: string;
  score: number; // 1-5
  notes: string;
}

export interface TeacherObservation {
  id: string;
  teacherName: string;
  schoolName: string;
  observerName: string;
  date: string;
  scores: Record<string, ObservationScore>;
  generalNotes: string;
}

export interface AIReport {
  observedAspects: string;
  improvementFocus: string;
  praxisSuggestions: string;
  dialogueProposal: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  urls?: { title: string; uri: string }[];
}
