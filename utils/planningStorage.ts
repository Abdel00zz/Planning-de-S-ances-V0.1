/**
 * Planning Storage System
 * Gère le stockage local des plannings avec isolation par classe.
 */

import { Session } from '../types';

const STORAGE_KEY = 'planning_sessions'; // index global

export interface StoredPlanning {
  id: string;
  className: string;
  sessions: Session[];
  createdAt: string;
  updatedAt: string;
  weekNumber?: number;
  year?: number;
}

export interface WeekGroup {
  weekNumber: number;
  year: number;
  label: string;
  sessions: Session[];
  isCurrent: boolean;
}

/**
 * Obtient le numéro de semaine ISO 8601
 */
export function getWeekNumber(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week: weekNo, year: d.getUTCFullYear() };
}

/**
 * Vérifie si une date est dans la semaine courante
 */
export function isCurrentWeek(date: Date): boolean {
  const current = getWeekNumber(new Date());
  const target = getWeekNumber(date);
  return current.week === target.week && current.year === target.year;
}

/**
 * Charge tous les plannings depuis localStorage
 */
export function loadPlannings(): StoredPlanning[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data) as StoredPlanning[];
    return JSON.parse(JSON.stringify(parsed)); // deep clone
  } catch (error) {
    console.error('Erreur chargement plannings:', error);
    return [];
  }
}

/**
 * Sauvegarde un planning
 */
export function savePlanning(className: string, sessions: Session[]): StoredPlanning {
  // Deep clone sessions to break any external references
  const sessionsClone = JSON.parse(JSON.stringify(sessions));

  // Charger l'index global
  const plannings = loadPlannings();
  const existingIndex = plannings.findIndex(p => p.className === className);

  const planning: StoredPlanning = {
    id: existingIndex >= 0 ? plannings[existingIndex].id : generateId(),
    className,
    sessions: sessionsClone,
    createdAt: existingIndex >= 0 ? plannings[existingIndex].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    plannings[existingIndex] = planning;
  } else {
    plannings.push(planning);
  }

  // Sauvegarder l'index global (liste de plannings)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plannings));
  } catch (e) {
    console.warn('Erreur sauvegarde index global:', e);
  }

  // Écrire la clé par-classe (utilisée par l'application React)
  try {
    const classKey = `planning_sessions_${className.replace(/\s+/g, '_')}`;
    localStorage.setItem(classKey, JSON.stringify(sessionsClone));
    
    // Note: on n'utilise plus nextIdKey car l'ID est calculé dynamiquement
  } catch (e) {
    console.warn('Erreur sauvegarde clé par-classe:', e);
  }

  return planning;
}

/**
 * Charge le planning spécifique d'une classe (isolé)
 */
export function loadPlanningForClass(className: string): StoredPlanning | null {
  const plannings = loadPlannings();
  const found = plannings.find(p => p.className === className);
  return found ? JSON.parse(JSON.stringify(found)) : null; // retourner une copie profonde
}

/**
 * Supprime un planning
 */
export function deletePlanning(planningId: string): boolean {
  const plannings = loadPlannings();
  const filtered = plannings.filter(p => p.id !== planningId);
  
  if (filtered.length < plannings.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
  return false;
}

/**
 * Groupe les sessions par semaine
 */
export function groupSessionsByWeek(sessions: Session[]): WeekGroup[] {
  const groups = new Map<string, WeekGroup>();
  const currentWeekInfo = getWeekNumber(new Date());
  
  sessions.forEach(session => {
    const sessionDate = new Date(session.date);
    const { week, year } = getWeekNumber(sessionDate);
    const key = `${year}-W${week}`;
    
    if (!groups.has(key)) {
      const isCurrent = week === currentWeekInfo.week && year === currentWeekInfo.year;
      groups.set(key, {
        weekNumber: week,
        year,
        label: formatWeekLabel(week, year, isCurrent),
        sessions: [],
        isCurrent
      });
    }
    
    groups.get(key)!.sessions.push(session);
  });
  
  // Trier par année et semaine (décroissant - les plus récentes en premier)
  return Array.from(groups.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.weekNumber - a.weekNumber;
  });
}

/**
 * Formate le label de la semaine
 */
function formatWeekLabel(week: number, year: number, isCurrent: boolean): string {
  if (isCurrent) {
    return `Semaine ${week} - Cette semaine`;
  }
  
  const today = new Date();
  const currentWeek = getWeekNumber(today);
  
  if (year === currentWeek.year) {
    if (week === currentWeek.week + 1) {
      return `Semaine ${week} - Semaine prochaine`;
    } else if (week === currentWeek.week - 1) {
      return `Semaine ${week} - Semaine dernière`;
    }
  }
  
  return `Semaine ${week} (${year})`;
}

/**
 * Détecte les chevauchements de classes
 */
export function detectClassOverlaps(sessions: Session[]): Array<{
  session1: Session;
  session2: Session;
  overlapMinutes: number;
}> {
  const overlaps: Array<{
    session1: Session;
    session2: Session;
    overlapMinutes: number;
  }> = [];
  
  for (let i = 0; i < sessions.length; i++) {
    for (let j = i + 1; j < sessions.length; j++) {
      const s1 = sessions[i];
      const s2 = sessions[j];
      
      // Même jour ?
      if (s1.date !== s2.date) continue;
      
      const start1 = parseTimeHHhMM(s1.time);
      const end1 = start1 + s1.durationMinutes;
      const start2 = parseTimeHHhMM(s2.time);
      const end2 = start2 + s2.durationMinutes;
      
      // Vérifier chevauchement
      if (start1 < end2 && start2 < end1) {
        const overlapStart = Math.max(start1, start2);
        const overlapEnd = Math.min(end1, end2);
        const overlapMinutes = overlapEnd - overlapStart;
        
        overlaps.push({
          session1: s1,
          session2: s2,
          overlapMinutes
        });
      }
    }
  }
  
  return overlaps;
}

/**
 * Parse une heure "HHhMM" en minutes
 */
function parseTimeHHhMM(time: string): number {
  const [hours, minutes] = time.split('h').map(Number);
  return hours * 60 + (minutes || 0);
}

/**
 * Génère un ID unique
 */
function generateId(): string {
  return `planning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Récupère toutes les sessions de la semaine courante
 */
export function getCurrentWeekSessions(): Session[] {
  const plannings = loadPlannings();
  const allSessions = plannings.flatMap(p => p.sessions);
  return allSessions.filter(s => isCurrentWeek(new Date(s.date)));
}