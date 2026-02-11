
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Session } from './types';
import Header from './components/Header';
import Controls from './components/Controls';
import SessionCard from './components/SessionCard';
import Summary from './components/Summary';
import PlatformAccess from './components/PlatformAccess';
import DurationPopup from './components/DurationPopup';
import PrintLayout from './components/PrintLayout';
import { ToastContainer } from './components/Toast';
import { savePlanning, detectClassOverlaps, groupSessionsByWeek } from './utils/planningStorage';
import html2canvas from 'html2canvas';

interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    title?: string;
    details?: string[];
    duration?: number;
    priority?: 'low' | 'normal' | 'high'; // Pour la queue
    className?: string; // Pour contextualiser
}

const CLASS_LEVELS = [
    'Tronc Commun Scientifique',
    '1ère Bac Sciences Expérimentales',
    '1ère Bac Sciences Mathématiques',
    '2ème Bac Sciences Expérimentales',
    '2ème Bac Sciences Mathématiques'
];

const App: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [editingDurationSessionId, setEditingDurationSessionId] = useState<number | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>(() => {
        return localStorage.getItem('selectedClass') || CLASS_LEVELS[0];
    });
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [toastQueue, setToastQueue] = useState<Omit<ToastMessage, 'id'>[]>([]);
    const [isProcessingQueue, setIsProcessingQueue] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const getAcademicYear = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        // Academic year starts in September (month 8)
        const startYear = month >= 8 ? year : year - 1;
        return `Année Académique ${startYear}-${startYear + 1}`;
    };

    const academicYear = useMemo(getAcademicYear, []);
    
    // 🔥 Pas de sessions par défaut - commence vide
    const createDefaultSessions = useCallback((): {sessions: Session[]} => {
        return { sessions: [] };
    }, []);

    // 🔥 Fonction intelligente pour ajouter un toast (avec priorité et contexte)
    const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
        // Ajouter automatiquement le nom de la classe pour éviter confusion
        const toastWithContext = {
            ...toast,
            className: toast.className || selectedClass,
            priority: toast.priority || 'normal',
            duration: toast.duration || 3000
        };

        // 🎯 Filtre intelligent: ignorer les toasts de faible priorité si queue pleine
        if (toastWithContext.priority === 'low' && toastQueue.length > 2) {
            return;
        }

        // ⚡ Toast haute priorité: afficher immédiatement
        if (toastWithContext.priority === 'high') {
            const id = `toast_${Date.now()}_${Math.random()}`;
            setToasts([{ ...toastWithContext, id }]);
            return;
        }

        // 📋 Ajouter à la queue (max 3 toasts en attente)
        setToastQueue(prev => {
            if (prev.length >= 3) {
                return prev;
            }
            return [...prev, toastWithContext];
        });
    }, [selectedClass, toastQueue.length]);

    // 🔥🔥🔥 ULTRA-SÉCURISÉ: Charger les sessions avec isolation TOTALE
    useEffect(() => {
        try {
            // 🔥 Clés UNIQUES par classe avec préfixe de sécurité
            const storageKey = `planning_sessions_${selectedClass.replace(/\s+/g, '_')}`;
            const savedSessions = localStorage.getItem(storageKey);

            if (savedSessions && savedSessions !== 'null' && savedSessions !== '[]') {
                const parsedSessions = JSON.parse(savedSessions);
                
                // 🔥🔥🔥 TRIPLE SÉCURITÉ: Deep clone avec JSON pour casser TOUTES les références
                const ultraClonedSessions = JSON.parse(JSON.stringify(parsedSessions)).map((s: any) => ({
                    id: Number(s.id),
                    date: String(s.date),
                    time: String(s.time),
                    durationMinutes: Number(s.durationMinutes)
                }));
                
                setSessions(ultraClonedSessions);
            } else {
                // 🔥 Commencer vide (pas de sessions par défaut)
                setSessions([]);
            }
        } catch (error) {
            console.error("❌ Failed to load from local storage", error);
            setSessions([]);
        }
    }, [selectedClass]);

    // 🔥🔥🔥 ULTRA-SÉCURISÉ: Sauvegarder avec isolation TOTALE
    // Ce useEffect gère la persistance automatique "au fil de l'eau" pour ne pas perdre de données
    // si l'utilisateur quitte sans cliquer sur "Enregistrer"
    useEffect(() => {
        try {
            const storageKey = `planning_sessions_${selectedClass.replace(/\s+/g, '_')}`;
            
            // 🔥 Deep clone
            const ultraClonedSessions = JSON.parse(JSON.stringify(sessions));
            
            localStorage.setItem(storageKey, JSON.stringify(ultraClonedSessions));
            localStorage.setItem('selectedClass', selectedClass);
            
        } catch (error) {
            console.error("❌ Failed to save to local storage", error);
        }
    }, [sessions, selectedClass]);

    // 🔥 Système de queue intelligent pour les toasts (1 seul à la fois)
    useEffect(() => {
        if (toastQueue.length > 0 && toasts.length === 0 && !isProcessingQueue) {
            setIsProcessingQueue(true);
            const nextToast = toastQueue[0];
            const id = `toast_${Date.now()}_${Math.random()}`;
            setToasts([{ ...nextToast, id }]);
            setToastQueue(prev => prev.slice(1));
            
            // Après la durée du toast, permettre le prochain
            setTimeout(() => {
                setIsProcessingQueue(false);
            }, nextToast.duration || 3000);
        }
    }, [toastQueue, toasts, isProcessingQueue]);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const handleClassChange = (newClass: string) => {
        // ⚠️ Toast uniquement si important (passage avec sessions non vides)
        if (sessions.length > 3) {  // Seulement si > 3 sessions (éviter spam)
            addToast({
                type: 'info',
                title: `📚 ${newClass}`,
                message: `${sessions.length} séance(s) chargée(s)`,
                priority: 'low', // Basse priorité
                duration: 2000
            });
        }
        setSelectedClass(newClass);
    };

    const handleAddSession = () => {
        // 🔥 OPTIMISATION: Calcul dynamique de l'ID. Plus besoin d'état 'nextId'.
        // Trouve le plus grand ID existant et ajoute 1. Si vide, commence à 1.
        const maxId = sessions.length > 0 
            ? Math.max(...sessions.map(s => s.id))
            : 0;
        
        const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
        
        // Logique intelligente pour la date par défaut: semaine suivante
        const newDate = new Date(lastSession ? lastSession.date : new Date());
        if (lastSession) {
            newDate.setDate(newDate.getDate() + 7);
        }

        const newSession: Session = {
            id: maxId + 1,
            date: newDate.toISOString().split('T')[0],
            time: lastSession?.time || '20h00',
            durationMinutes: lastSession?.durationMinutes || 120
        };

        setSessions(prev => [...prev, newSession]);
    };

    const handleDeleteSession = (id: number) => {
        // 🔥 Autoriser la suppression de toutes les séances (pas de minimum)
        setSessions(prev => prev.filter(s => s.id !== id));
    };

    const handleUpdateSession = (id: number, field: keyof Session, value: any) => {
        setSessions(prev => prev.map(s => 
            s.id === id 
                ? { ...s, [field]: value }  // 🔥 Créer un nouvel objet avec spread
                : { ...s }  // 🔥 Créer aussi un nouvel objet pour les autres (éviter références)
        ));
    };
    
    const handleExportPNG = async () => {
        const printElement = document.getElementById('print-layout-container');
        if (!printElement) {
            addToast({
                type: 'error',
                title: 'Erreur Exportation',
                message: 'Impossible de trouver l\'élément à exporter.',
                priority: 'high'
            });
            return;
        }

        setIsExporting(true);
        addToast({ type: 'info', title: 'Exportation en cours...', message: 'Génération de l\'image PNG.', duration: 2500 });

        try {
            const canvas = await html2canvas(printElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                windowWidth: printElement.scrollWidth,
                windowHeight: printElement.scrollHeight,
            });

            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            const safeClassName = selectedClass.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.download = `planning_${safeClassName}_${new Date().toISOString().split('T')[0]}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            addToast({ type: 'success', title: 'Exportation réussie', message: 'Votre planning a été téléchargé.', priority: 'normal' });

        } catch (error) {
            console.error('Erreur durant l\'exportation PNG:', error);
            addToast({ type: 'error', title: 'Échec de l\'exportation', message: 'Une erreur est survenue.', priority: 'high' });
        } finally {
            setIsExporting(false);
        }
    };

    // 🔥 Nouvelle fonction: Enregistrer localement et valider
    const handleSavePlanning = async () => {
        if (sessions.length === 0) {
            addToast({
                type: 'warning',
                title: '⚠️ Planning vide',
                message: 'Ajoutez au moins une séance',
                priority: 'normal',
                className: selectedClass
            });
            return;
        }

        try {
            // Détecter les chevauchements
            const overlaps = detectClassOverlaps(sessions);
            
            if (overlaps.length > 0) {
                // ⚡ Haute priorité: conflit détecté
                addToast({
                    type: 'warning',
                    title: `⚡ ${overlaps.length} conflit(s)`,
                    message: 'Séances se chevauchent',
                    priority: 'high',
                    className: selectedClass,
                    duration: 4000
                });
                
                const conflictDetails = overlaps.map(o => 
                    `${o.session1.date} ${o.session1.time} ↔ ${o.session2.time} (${o.overlapMinutes}min)`
                );
                
                const proceed = window.confirm(
                    `⚠️ ${overlaps.length} conflit(s) temporel(s) détecté(s) pour ${selectedClass}:\n\n${conflictDetails.join('\n')}\n\nContinuer l'enregistrement quand même ?`
                );
                
                if (!proceed) return;
            }

            // Sauvegarder localement via l'utilitaire (pour la persistance "officielle")
            const savedPlanning = savePlanning(selectedClass, sessions);
            
            // Grouper par semaines pour le feedback
            const weekGroups = groupSessionsByWeek(sessions);
            const currentWeekGroup = weekGroups.find(w => w.isCurrent);
            const currentWeekCount = currentWeekGroup ? currentWeekGroup.sessions.length : 0;
            
            // ✅ Succès: afficher avec contexte de classe
            addToast({
                type: 'success',
                title: `✓ Sauvegardé`,
                message: `${sessions.length} séance(s) sécurisée(s) localement`,
                details: currentWeekCount > 0 ? [`${currentWeekCount} séance(s) cette semaine`] : [],
                priority: 'normal',
                className: selectedClass,
                duration: 3000
            });
            
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            // ⚠️ Erreur: haute priorité
            addToast({
                type: 'error',
                title: `❌ Erreur`,
                message: "Impossible d'écrire dans le stockage local",
                priority: 'high',
                className: selectedClass,
                duration: 5000
            });
        }
    };

    const editingSession = useMemo(() => {
      return sessions.find(s => s.id === editingDurationSessionId);
    }, [sessions, editingDurationSessionId]);

    return (
        <>
            {/* Watermark Gravé dans le background (Écran uniquement) */}
            <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.03] print:hidden">
                <img src="/logo.png" alt="Watermark" className="w-[600px] h-[600px] object-contain grayscale" />
            </div>

            <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 print:hidden relative z-10">
                <div className="mx-auto max-w-4xl">
                    <Header academicYear={academicYear} />
                    <Controls
                        onAddSession={handleAddSession}
                        onExportPNG={handleExportPNG}
                        onSavePlanning={handleSavePlanning}
                        classLevels={CLASS_LEVELS}
                        selectedClass={selectedClass}
                        onClassChange={handleClassChange}
                        isExporting={isExporting}
                    />
                </div>

                <main>
                    <section>
                        <h3 className="text-2xl font-semibold text-center mb-6">Planning des Séances</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sessions.map((session, index) => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    sessionNumber={index + 1}
                                    onDelete={handleDeleteSession}
                                    onUpdate={handleUpdateSession}
                                    onEditDuration={setEditingDurationSessionId}
                                />
                            ))}
                        </div>
                        {sessions.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50/80">
                                <p className="text-slate-500">Aucune séance planifiée.</p>
                                <button onClick={handleAddSession} className="mt-2 text-orange-600 font-medium hover:underline">
                                    Commencer par ajouter une séance
                                </button>
                            </div>
                        )}
                        <Summary sessions={sessions} />
                    </section>
                    <PlatformAccess />
                </main>

                {/* 🔥 Système de toasts moderne */}
                <ToastContainer toasts={toasts} removeToast={removeToast} />

                {editingSession && (
                    <DurationPopup
                        initialMinutes={editingSession.durationMinutes}
                        onSave={(totalMinutes) => handleUpdateSession(editingSession.id, 'durationMinutes', totalMinutes)}
                        onClose={() => setEditingDurationSessionId(null)}
                    />
                )}
            </div>
            
            {/* Layout d'impression dédié */}
            <PrintLayout sessions={sessions} academicYear={academicYear} selectedClass={selectedClass} />
        </>
    );
};

export default App;