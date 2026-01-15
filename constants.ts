
import { Dimension } from './types';

export const DIMENSIONS: Dimension[] = [
  {
    id: 'planeacion',
    title: 'Planeación',
    icon: 'fa-calendar-check',
    criteria: [
      { id: 'p1', label: 'Aprendizaje Activo', description: 'Diseño de estrategias centradas en el estudiante.' },
      { id: 'p2', label: 'Contexto Sociocultural', description: 'Vinculación con saberes locales y regionales.' },
      { id: 'p3', label: 'Diversidad de Estilos', description: 'Estrategias diferenciadas presentes en la planeación.' },
      { id: 'p4', label: 'IA y Tecnologías', description: 'Incorporación de IA y TIC en la planificación.' }
    ]
  },
  {
    id: 'ejecucion',
    title: 'Ejecución',
    icon: 'fa-chalkboard-user',
    criteria: [
      { id: 'e1', label: 'Metodologías Activas', description: 'Aplicación de ABP, aprendizaje cooperativo, etc.' },
      { id: 'e2', label: 'Aprendizaje Significativo', description: 'Alumnos relacionan contenidos con vida cotidiana.' },
      { id: 'e3', label: 'Pensamiento Crítico', description: 'Fomento del análisis y la argumentación.' },
      { id: 'e4', label: 'Recursos Contextualizados', description: 'Pertinencia de materiales empleados en aula.' }
    ]
  },
  {
    id: 'monitoreo',
    title: 'Monitoreo',
    icon: 'fa-chart-line',
    criteria: [
      { id: 'm1', label: 'Seguimiento de Avances', description: 'Frecuencia de evaluaciones formativas.' },
      { id: 'm2', label: 'Retroalimentación', description: 'Observación y retroalimentación de la práctica.' },
      { id: 'm3', label: 'Análisis de Datos', description: 'Uso de sistemas de información para decisiones.' },
      { id: 'm4', label: 'Mejora Continua', description: 'Acciones correctivas basadas en resultados.' }
    ]
  },
  {
    id: 'evaluacion',
    title: 'Evaluación',
    icon: 'fa-clipboard-check',
    criteria: [
      { id: 'ev1', label: 'Evaluación Formativa', description: 'Uso de rúbricas, portafolios y coevaluación.' },
      { id: 'ev2', label: 'Impacto en Aprendizaje', description: 'Mejora de desempeño tras retroalimentación.' },
      { id: 'ev3', label: 'Criterios de Diversidad', description: 'Ajustes razonables para NEE en evaluación.' },
      { id: 'ev4', label: 'Participación Estudiantil', description: 'Alumnos aportan perspectiva en evaluación.' }
    ]
  },
  {
    id: 'inclusion',
    title: 'Inclusión',
    icon: 'fa-hands-holding-child',
    criteria: [
      { id: 'i1', label: 'Diversidad Cultural', description: 'Inclusión de lenguas indígenas y cultura local.' },
      { id: 'i2', label: 'Equidad Educativa', description: 'Adaptaciones curriculares para discapacidad.' },
      { id: 'i3', label: 'Vulnerabilidad', description: 'Inclusión de estudiantes en vulnerabilidad.' },
      { id: 'i4', label: 'Accesibilidad Material', description: 'Recursos adecuados para necesidades especiales.' }
    ]
  },
  {
    id: 'derechos',
    title: 'Derechos Humanos',
    icon: 'fa-scale-balanced',
    criteria: [
      { id: 'd1', label: 'Cultura de Paz', description: 'Valores democráticos y respeto.' },
      { id: 'd2', label: 'Prevención Violencia', description: 'Acciones para atender conflictos y discriminación.' },
      { id: 'd3', label: 'Toma de Decisiones', description: 'Espacios de participación del alumnado.' },
      { id: 'd4', label: 'Protección de Derechos', description: 'Aplicación de protocolos institucionales.' }
    ]
  },
  {
    id: 'etica',
    title: 'Ética',
    icon: 'fa-gavel',
    criteria: [
      { id: 'et1', label: 'Principios Éticos', description: 'Responsabilidad, honestidad y solidaridad.' },
      { id: 'et2', label: 'Transparencia', description: 'Rendición de cuentas en gestión escolar.' },
      { id: 'et3', label: 'Ética Profesional', description: 'Confidencialidad e imparcialidad docente.' },
      { id: 'et4', label: 'Reflexión Ética', description: 'Análisis de dilemas éticos en contenidos.' }
    ]
  },
  {
    id: 'alfabetizacion',
    title: 'Alfabetización Inicial',
    icon: 'fa-book-open-reader',
    criteria: [
      { id: 'a1', label: 'Adquisición Lectoescritura', description: 'Niveles esperados en comprensión y producción.' },
      { id: 'a2', label: 'Estrategias Innovadoras', description: 'Variedad de métodos en enseñanza inicial.' },
      { id: 'a3', label: 'Multimodalidad', description: 'Combinación de lectura, imagen y tecnología.' },
      { id: 'a4', label: 'Participación Familiar', description: 'Familias involucradas en el apoyo lector.' }
    ]
  },
  {
    id: 'comunidad',
    title: 'Participación Comunitaria',
    icon: 'fa-users-rectangle',
    criteria: [
      { id: 'c1', label: 'Vínculo Organizaciones', description: 'Colaboraciones con actores comunitarios.' },
      { id: 'c2', label: 'Participación Familiar', description: 'Presencia de padres y tutores en eventos.' },
      { id: 'c3', label: 'Identidad Cultural', description: 'Proyectos que rescatan historia y tradiciones.' },
      { id: 'c4', label: 'Espacios Comunitarios', description: 'Aprendizaje fuera del aula en la comunidad.' }
    ]
  }
];
