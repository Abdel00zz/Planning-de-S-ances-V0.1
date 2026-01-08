
import React, { useMemo } from 'react';
import type { Session } from '../types';
import { formatDuration } from '../utils/time';

interface SummaryProps {
    sessions: Session[];
}

const Summary: React.FC<SummaryProps> = ({ sessions }) => {
    const summaryData = useMemo(() => {
        const totalSessions = sessions.length;
        if (totalSessions === 0) {
            return { totalSessions, totalWeeks: 0, totalHours: '0h' };
        }
        
        const dates = sessions.map(s => new Date(s.date)).sort((a, b) => a.getTime() - b.getTime());
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        
        // Add 1 day to the difference to ensure the week of the last day is counted
        const dayDifference = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
        const totalWeeks = Math.ceil((dayDifference + 1) / 7) || 1;
        
        const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
        const totalHours = formatDuration(totalMinutes);
        
        return { totalSessions, totalWeeks, totalHours };
    }, [sessions]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8 pt-8 border-t border-slate-200">
            <SummaryItem value={summaryData.totalSessions} label="Séances" />
            <SummaryItem value={summaryData.totalWeeks} label="Semaines" />
            <SummaryItem value={summaryData.totalHours} label="Heures Totales" />
        </div>
    );
};

const SummaryItem: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
    <div className="text-center bg-white p-4 rounded-lg border border-slate-200">
        <div className="text-3xl font-bold text-slate-800">{value}</div>
        <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
);

export default Summary;
