
import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon } from './icons';

interface QrCodeUploaderProps {
    qrCodeImage: string | null;
    onImageUpload: (base64: string) => void;
}

const QrCodeUploader: React.FC<QrCodeUploaderProps> = ({ qrCodeImage, onImageUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onImageUpload(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Veuillez déposer un fichier JPG ou PNG.');
        }
    }, [onImageUpload]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);
    
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <footer className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Accès à la Plateforme</h3>
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full max-w-xs mx-auto border-2 border-dashed rounded-xl p-4 flex items-center justify-center min-h-[180px] transition-colors cursor-pointer ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-slate-300 bg-slate-100/50 hover:border-slate-400'}`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                />
                {qrCodeImage ? (
                    <img src={qrCodeImage} alt="QR Code" className="max-w-full max-h-40 object-contain" />
                ) : (
                    <div className="text-center text-slate-500">
                        <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400 mb-2"/>
                        <p className="font-semibold">Glissez-déposez un QR Code</p>
                        <p className="text-xs">ou cliquez pour choisir un fichier</p>
                    </div>
                )}
            </div>
             <p className="text-sm text-slate-500 mt-4 print:hidden">L'image sera incluse dans l'impression.</p>
        </footer>
    );
};

export default QrCodeUploader;
