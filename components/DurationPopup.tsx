
import React, { useState, useEffect, useRef } from 'react';

interface DurationPopupProps {
    initialMinutes: number;
    onSave: (totalMinutes: number) => void;
    onClose: () => void;
}

const DurationPopup: React.FC<DurationPopupProps> = ({ initialMinutes, onSave, onClose }) => {
    const [hours, setHours] = useState(Math.floor(initialMinutes / 60));
    const [minutes, setMinutes] = useState(initialMinutes % 60);
    const popupRef = useRef<HTMLDivElement>(null);
    const hoursInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    useEffect(() => {
        hoursInputRef.current?.focus();
    }, []);

    const handleSave = () => {
        const totalMinutes = (hours * 60) + minutes;
        if (totalMinutes >= 15 && totalMinutes <= 480) { // 15 min to 8h
            onSave(totalMinutes);
            onClose();
        } else {
            alert('La durée doit être entre 15 minutes et 8 heures.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div ref={popupRef} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold text-slate-800 text-center mb-4">Modifier la durée</h3>
                <div className="flex gap-4 mb-5">
                    <div className="flex-1">
                        <label htmlFor="popup-hours" className="block text-xs font-medium text-slate-500 uppercase mb-1">Heures</label>
                        <input
                            ref={hoursInputRef}
                            id="popup-hours"
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(parseInt(e.target.value, 10) || 0)}
                            min="0"
                            max="8"
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-base text-center font-bold ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="popup-minutes" className="block text-xs font-medium text-slate-500 uppercase mb-1">Minutes</label>
                        <input
                            id="popup-minutes"
                            type="number"
                            value={minutes}
                            onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 0)}
                            min="0"
                            max="59"
                            step="5"
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-base text-center font-bold ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-transparent shadow-sm hover:bg-slate-100 h-9 px-4 py-2"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-orange-500 text-white shadow hover:bg-orange-500/90 h-9 px-4 py-2"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DurationPopup;
