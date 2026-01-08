import React from 'react';
import { PlusIcon, PrinterIcon } from './icons';
import ClassSelector from './ClassSelector';

interface ControlsProps {
    onAddSession: () => void;
    onPrint: () => void;
    onSavePlanning: () => void;
    classLevels: string[];
    selectedClass: string;
    onClassChange: (level: string) => void;
}

const Controls: React.FC<ControlsProps> = ({
    onAddSession,
    onPrint,
    onSavePlanning,
    classLevels,
    selectedClass,
    onClassChange
}) => {
    return (
        <section className="mb-8 print:hidden">
            <div className="mb-4">
                <label htmlFor="class-level-select" className="block text-xs font-medium text-slate-500 uppercase mb-1">
                    Niveau Scolaire
                </label>
                <ClassSelector
                    id="class-level-select"
                    levels={classLevels}
                    selectedLevel={selectedClass}
                    onChange={onClassChange}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                    onClick={onAddSession}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-orange-500 text-white shadow hover:bg-orange-500/90 h-10 px-4 py-2"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Ajouter une séance
                </button>
                
                {/* 🔥 Bouton Enregistrer avec icône de sauvegarde */}
                <button
                    onClick={onSavePlanning}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white shadow hover:bg-emerald-700 h-10 px-4 py-2"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Sauvegarder
                </button>
                
                <button
                    onClick={onPrint}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-slate-300 bg-transparent shadow-sm hover:bg-slate-100 h-10 px-4 py-2"
                >
                    <PrinterIcon className="w-5 h-5 mr-2" />
                    Imprimer le planning
                </button>
            </div>
        </section>
    );
};

export default Controls;