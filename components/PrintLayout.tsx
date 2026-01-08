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
            year: 'numeric',
            month: 'long',
            day: 'numeric',
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

    return (
        <div className="hidden print:block bg-white w-full h-full text-black relative overflow-hidden">
             {/* Watermark pour l'impression - Gravé en fond */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.05]">
                 <img src="/logo.png" alt="" className="w-[85%] h-auto object-contain grayscale" />
            </div>

            <div className="relative z-10 p-8 h-full flex flex-col font-serif">
                {/* Header Impression - Simplifié et Pro */}
                <header className="flex items-center justify-between mb-8">
                    {/* Logo Gauche */}
                    <div className="w-32 h-32 flex-shrink-0">
                         <img src="/logo.png" alt="Math+" className="w-full h-full object-contain" />
                    </div>
                    
                    {/* Année Droite */}
                    <div className="flex-shrink-0 text-right">
                         <div className="border-2 border-black px-4 py-2 bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                            <p className="text-xs uppercase font-bold text-black tracking-widest mb-1">Année Académique</p>
                            <p className="text-2xl font-bold text-black leading-none">
                                {academicYear.replace('Année Académique ', '')}
                            </p>
                         </div>
                    </div>
                </header>

                {/* Info Classe */}
                <div className="mb-8 bg-white border-y-2 border-black py-4 text-center">
                    <span className="text-[10px] font-bold uppercase text-black tracking-widest block mb-1">Niveau Scolaire</span>
                    <h2 className="text-3xl font-bold text-black font-sans">{selectedClass}</h2>
                </div>

                {/* Tableau "Ultimate Quality" */}
                <section className="flex-1">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="border-2 border-black py-2 px-4 text-center w-16 font-bold uppercase text-xs tracking-wider font-sans">N°</th>
                                <th className="border-2 border-black py-2 px-4 text-left font-bold uppercase text-xs tracking-wider font-sans">Date</th>
                                <th className="border-2 border-black py-2 px-4 text-center font-bold uppercase text-xs tracking-wider font-sans">Jour</th>
                                <th className="border-2 border-black py-2 px-4 text-center font-bold uppercase text-xs tracking-wider font-sans">Horaire</th>
                                <th className="border-2 border-black py-2 px-4 text-center font-bold uppercase text-xs tracking-wider font-sans">Durée</th>
                            </tr>
                        </thead>
                        <tbody className="font-sans">
                            {sessions.map((session, index) => (
                                <tr key={session.id} className="even:bg-gray-50/50">
                                    <td className="border border-black py-3 px-4 text-center font-bold text-black">{index + 1}</td>
                                    <td className="border border-black py-3 px-4 text-left font-semibold text-black">{formatDate(session.date)}</td>
                                    <td className="border border-black py-3 px-4 text-center uppercase text-xs font-bold tracking-wide text-black">{getDayOfWeek(session.date)}</td>
                                    <td className="border border-black py-3 px-4 text-center font-mono font-bold text-black text-lg">{session.time.replace('h', ':')}</td>
                                    <td className="border border-black py-3 px-4 text-center font-bold text-black">{formatDuration(session.durationMinutes)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Footer Impression */}
                <section className="mt-auto pt-8 border-t-2 border-black flex items-end justify-between font-sans" style={{ pageBreakInside: 'avoid' }}>
                     <div className="flex gap-10 text-center">
                        <div className="border-r border-black pr-10">
                            <div className="text-4xl font-bold text-black leading-none">{summaryData.totalSessions}</div>
                            <div className="text-[9px] uppercase font-bold text-black mt-2 tracking-wider">Séances</div>
                        </div>
                         <div className="border-r border-black pr-10">
                            <div className="text-4xl font-bold text-black leading-none">{summaryData.totalWeeks}</div>
                            <div className="text-[9px] uppercase font-bold text-black mt-2 tracking-wider">Semaines</div>
                        </div>
                         <div>
                            <div className="text-4xl font-bold text-black leading-none">{summaryData.totalHours}</div>
                            <div className="text-[9px] uppercase font-bold text-black mt-2 tracking-wider">Total Heures</div>
                        </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                         <div className="mb-2 text-[9px] font-bold uppercase text-black tracking-widest">Scanner pour accéder</div>
                         <div className="w-28 h-28 border-2 border-black p-1 bg-white">
                             <PlatformAccess isPrint={true} />
                         </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrintLayout;