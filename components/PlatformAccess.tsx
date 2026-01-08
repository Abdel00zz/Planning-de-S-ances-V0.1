import React from 'react';
import { QrCodeSvg } from './QrCodeSvg';

interface PlatformAccessProps {
  isPrint?: boolean;
}

const PlatformAccess: React.FC<PlatformAccessProps> = ({ isPrint = false }) => {
  if (isPrint) {
    return (
      <div className="w-full h-full flex items-center justify-center">
          <QrCodeSvg />
      </div>
    );
  }

  return (
    <footer className="mt-12 text-center print:hidden">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Accès à la Plateforme</h3>
        <div className="w-full max-w-xs mx-auto p-4 flex items-center justify-center">
            <div className="w-40 h-40">
                <QrCodeSvg />
            </div>
        </div>
    </footer>
  );
};

export default PlatformAccess;