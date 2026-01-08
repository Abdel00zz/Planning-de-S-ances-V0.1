import React from 'react';

interface ClassSelectorProps {
    id: string;
    levels: string[];
    selectedLevel: string;
    onChange: (level: string) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ id, levels, selectedLevel, onChange }) => {
    return (
        <select
            id={id}
            value={selectedLevel}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
            {levels.map(level => (
                <option key={level} value={level}>{level}</option>
            ))}
        </select>
    );
};

export default ClassSelector;
