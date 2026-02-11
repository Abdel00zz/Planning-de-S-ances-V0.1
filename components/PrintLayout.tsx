import React, { useMemo } from 'react';
import type { Session } from '../types';
import { formatDuration } from '../utils/time';
import PlatformAccess from './PlatformAccess';

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
    
    const sortedSessions = useMemo(() => {
        return [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [sessions]);


    return (
        <div id="print-layout-container" className="absolute top-0 -left-[9999px] z-0 p-8" style={{ width: '1240px', fontFamily: 'Fira Sans, sans-serif' }}>
            <div className="bg-white text-slate-900 rounded-3xl border border-[#dce4ef] p-10 w-full min-h-[1754px] flex flex-col shadow-[0_24px_55px_-30px_rgba(59,130,246,0.35)]">
                <header className="mb-8 rounded-2xl border border-[#dce4ef] bg-gradient-to-r from-[#f1f5f9] via-[#eef2ff] to-[#f8fafc] p-8">
                    <div className="flex items-start gap-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Planning des séances</p>
                            <h1 className="font-print-heading text-[2.15rem] leading-tight font-bold tracking-tight text-slate-900 mt-1">{selectedClass}</h1>
                            <p className="text-base text-slate-600 mt-1">{academicYear}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="rounded-xl border border-[#dce4ef] bg-white p-4 text-center">
                            <div className="text-3xl font-bold text-slate-900">{summaryData.totalSessions}</div>
                            <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Séances</div>
                        </div>
                        <div className="rounded-xl border border-[#dce4ef] bg-white p-4 text-center">
                            <div className="text-3xl font-bold text-slate-900">{summaryData.totalWeeks}</div>
                            <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Semaines</div>
                        </div>
                        <div className="rounded-xl border border-[#dce4ef] bg-white p-4 text-center">
                            <div className="text-3xl font-bold text-slate-900">{summaryData.totalHours}</div>
                            <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Volume horaire</div>
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    {sessions.length > 0 ? (
                        <div className="grid grid-cols-2 gap-5">
                            {sortedSessions.map((session) => (
                                <article
                                    key={session.id}
                                    className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden"
                                >
                                    <div className="p-5">
                                        <div className="flex justify-between items-start gap-3 mb-4">
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{getDayOfWeek(session.date)}</p>
                                                <p className="text-base font-semibold text-slate-800 mt-1">{formatDate(session.date)}</p>
                                            </div>
                                        </div>
                                        <div className="rounded-lg bg-gradient-to-br from-sky-100 to-blue-200 px-5 py-4 text-center">
                                            <div className="text-4xl font-mono font-bold tracking-wide text-slate-900">{session.time.replace('h', ':')}</div>
                                            <div className="text-sm text-blue-800 uppercase tracking-[0.12em] mt-1">{formatDuration(session.durationMinutes)}</div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-[#cbd5e1] rounded-2xl bg-white">
                            <p className="text-slate-500">Aucune séance planifiée.</p>
                        </div>
                    )}
                </main>

                <footer className="mt-8 pt-6 border-t border-[#dce4ef] flex items-end justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Accès plateforme</p>
                        <p className="text-sm text-slate-700 mt-1">https://mathplus-coral.vercel.app</p>
                    </div>

                    <div className="w-24 h-24 border border-[#dce4ef] p-1.5 bg-white rounded-xl shadow-sm">
                        <PlatformAccess isPrint={true} />
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PrintLayout;