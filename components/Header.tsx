import React from 'react';

interface HeaderProps {
    academicYear: string;
}

const Header: React.FC<HeaderProps> = ({ academicYear }) => {
    return (
        <header className="relative z-10 mb-8">
            <div className="flex items-center justify-between gap-4">
                {/* Logo à gauche */}
                <div className="flex-shrink-0 w-28 h-28">
                    <img 
                        src="/logo.png" 
                        alt="Math+" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.currentTarget.style.opacity = '0';
                        }}
                    />
                </div>

                {/* Année Académique à droite */}
                <div className="flex-shrink-0 text-right">
                    <div className="inline-block px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Année Académique</p>
                        <p className="text-lg font-bold text-slate-800 font-print">{academicYear.replace('Année Académique ', '')}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;