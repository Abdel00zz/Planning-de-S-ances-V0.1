
import React, { useMemo } from 'react';
import type { Session } from '../types';
import { formatDuration } from '../utils/time';
import PlatformAccess from './PlatformAccess';
import { groupSessionsByWeek, WeekGroup } from '../utils/planningStorage';

interface PrintLayoutProps {
    sessions: Session[];
    academicYear: string;
    selectedClass: string;
}

const PrintLayout: React.FC<PrintLayoutProps> = ({ sessions, academicYear, selectedClass }) => {
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC' 
        });
    };

    const getDayOfWeek = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.toLocaleDateString('fr-FR', { weekday: 'long', timeZone: 'UTC' });
        return day.charAt(0).toUpperCase() + day.slice(1);
    };

    const summaryData = useMemo(() => {
        const totalSessions = sessions.length;
        if (totalSessions === 0) {
            return { totalSessions, totalWeeks: 0, totalHours: '0h' };
        }
        
        const dates = sessions.map(s => new Date(s.date)).sort((a, b) => a.getTime() - b.getTime());
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        
        const dayDifference = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
        const totalWeeks = Math.ceil((dayDifference + 1) / 7) || 1;
        
        const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
        const totalHours = formatDuration(totalMinutes);
        
        return { totalSessions, totalWeeks, totalHours };
    }, [sessions]);

    const weeklySessions: WeekGroup[] = useMemo(() => groupSessionsByWeek(sessions).reverse(), [sessions]);

    return (
        <div id="print-layout-container" className="absolute top-0 -left-[9999px] z-0 p-10 font-sans" style={{ width: '1240px' }}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl p-12 w-full min-h-[1754px] flex flex-col">
                
                <header className="flex items-start justify-between mb-10">
                    <div className="flex items-center gap-6">
                        <img src="/logo.png" alt="Math+" className="w-28 h-28" />
                        <div>
                            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-amber-300 text-transparent bg-clip-text">
                                {selectedClass}
                            </h1>
                            <p className="text-xl text-slate-300 font-light tracking-wide">{academicYear}</p>
                        </div>
                    </div>
                     <div className="text-right flex-shrink-0">
                        <div className="text-4xl font-bold">{summaryData.totalSessions}</div>
                        <div className="text-sm uppercase tracking-widest text-slate-400">Séances</div>
                    </div>
                </header>

                <main className="flex-1 space-y-8">
                    {weeklySessions.map((week) => (
                        <div key={week.label}>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-orange-400 mb-4 border-b-2 border-slate-700 pb-2">
                                {week.label}
                            </h2>
                            <div className="grid grid-cols-3 gap-6">
                                {week.sessions.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((session) => (
                                    <div key={session.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 shadow-lg">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-bold text-slate-300">{formatDate(session.date)}</span>
                                            <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{getDayOfWeek(session.date)}</span>
                                        </div>
                                        <div className="text-center bg-slate-900 rounded-md py-3">
                                            <div className="text-4xl font-mono font-bold text-amber-300 tracking-wider">{session.time.replace('h', ':')}</div>
                                            <div className="text-sm text-slate-400 font-semibold">{formatDuration(session.durationMinutes)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-slate-700 rounded-lg">
                            <p className="text-slate-400">Aucune séance planifiée.</p>
                        </div>
                    )}
                </main>

                <footer className="mt-auto pt-8 border-t-2 border-slate-700 flex items-end justify-between">
                    <div className="flex gap-10 text-center">
                        <div>
                            <div className="text-4xl font-bold">{summaryData.totalWeeks}</div>
                            <div className="text-xs uppercase font-bold text-slate-400 mt-1 tracking-wider">Semaines</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">{summaryData.totalHours}</div>
                            <div className="text-xs uppercase font-bold text-slate-400 mt-1 tracking-wider">Total Heures</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                             <div className="text-sm font-bold uppercase text-slate-300 tracking-widest">Accès Plateforme</div>
                             <div className="text-xs text-slate-400">mathplus-platform.com</div>
                        </div>
                        <div className="w-28 h-28 border-4 border-slate-700 p-1 bg-white rounded-lg">
                             <PlatformAccess isPrint={true} />
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PrintLayout;