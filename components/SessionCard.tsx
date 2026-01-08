
import React, { useState } from 'react';
import type { Session } from '../types';
import { XIcon } from './icons';
import { formatDuration, normalizeTime, validateTime } from '../utils/time';

interface SessionCardProps {
    session: Session;
    sessionNumber: number;
    onDelete: (id: number) => void;
    onUpdate: (id: number, field: keyof Session, value: any) => void;
    onEditDuration: (id: number) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, sessionNumber, onDelete, onUpdate, onEditDuration }) => {
    const [timeValue, setTimeValue] = useState(session.time);

    const handleTimeBlur = () => {
        if (validateTime(timeValue)) {
            const normalized = normalizeTime(timeValue);
            setTimeValue(normalized);
            onUpdate(session.id, 'time', normalized);
        } else {
            alert("Format d'heure invalide. Utilisez : 14h00, 14:00, 14h, ou 14");
            setTimeValue(session.time); // Revert to original value
        }
    };

    const adjustDuration = (amount: number) => {
        const newDuration = session.durationMinutes + amount;
        if (newDuration >= 15 && newDuration <= 480) {
            onUpdate(session.id, 'durationMinutes', newDuration);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200">
                <h4 className="font-semibold text-slate-800">Séance {sessionNumber}</h4>
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Date</label>
                    <input
                        type="date"
                        value={session.date}
                        onChange={(e) => onUpdate(session.id, 'date', e.target.value)}
                        className="mt-1 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Heure</label>
                    <input
                        type="text"
                        value={timeValue}
                        onChange={(e) => setTimeValue(e.target.value)}
                        onBlur={handleTimeBlur}
                        placeholder="ex: 20h00"
                        className="mt-1 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Durée</label>
                    <div className="mt-1 flex items-center gap-2">
                        <button
                            onClick={() => adjustDuration(-15)}
                            className="flex-shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-700 h-8 w-8"
                        >
                            -
                        </button>
                        <div
                            onClick={() => onEditDuration(session.id)}
                            className="flex-1 text-center font-semibold text-slate-800 bg-slate-100 rounded-md h-8 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors"
                            title="Cliquez pour modifier"
                        >
                            {formatDuration(session.durationMinutes)}
                        </div>
                        <button
                            onClick={() => adjustDuration(15)}
                            className="flex-shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-700 h-8 w-8"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
            <button
                onClick={() => onDelete(session.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-md flex items-center justify-center opacity-70 hover:opacity-100 hover:scale-110 transition-all"
                aria-label="Supprimer la séance"
            >
                <XIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default SessionCard;