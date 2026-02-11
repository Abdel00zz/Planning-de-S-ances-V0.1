
import React from 'react';
import { PlusIcon, DownloadIcon } from './icons';
import ClassSelector from './ClassSelector';

interface ControlsProps {
    onAddSession: () => void;
    onExportPNG: () => void;
    onSavePlanning: () => void;
    classLevels: string[];
    selectedClass: string;
    onClassChange: (level: string) => void;
    isExporting: boolean;
}

const Controls: React.FC<ControlsProps> = ({
    onAddSession,
    onExportPNG,
    onSavePlanning,
    classLevels,
    selectedClass,
    onClassChange,
    isExporting
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
                    onClick={onExportPNG}
                    disabled={isExporting}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-slate-300 bg-transparent shadow-sm hover:bg-slate-100 h-10 px-4 py-2"
                >
                    {isExporting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Exportation...
                        </>
                    ) : (
                        <>
                            <DownloadIcon className="w-5 h-5 mr-2" />
                            Exporter en PNG
                        </>
                    )}
                </button>
            </div>
        </section>
    );
};

export default Controls;