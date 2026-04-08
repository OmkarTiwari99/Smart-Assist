import React, { useCallback, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, Clipboard, ArrowUp } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload an image file!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      const matches = result.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        onImageSelected(matches[2], matches[1]);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  // Handle Paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
        if (e.clipboardData && e.clipboardData.files.length > 0) {
            const file = e.clipboardData.files[0];
            processFile(file);
        }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  if (preview) {
    return (
      <div className="relative w-full max-w-lg mx-auto mb-8 animate-fade-in">
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white">
            <img src={preview} alt="Uploaded" className="w-full h-80 object-cover" />
            {!isLoading && (
              <button 
                onClick={() => setPreview(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-red-500 transition-colors shadow-lg border border-white/30"
              >
                <X size={24} />
              </button>
            )}
        </div>
        {isLoading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2rem] z-10">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-kid-purple mb-4"></div>
                <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-kid-purple/20"></div>
            </div>
            <p className="text-kid-purple font-comic font-bold text-2xl animate-pulse">Thinking hard...</p>
            <p className="text-gray-400 text-sm mt-2">Simulating a 5-year-old brain</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`w-full max-w-xl mx-auto mb-8 transition-all duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <label 
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative flex flex-col items-center justify-center w-full h-72 
          border-4 border-dashed rounded-[2.5rem] cursor-pointer 
          transition-all duration-300 bg-white shadow-xl
          ${isDragging 
            ? 'border-kid-green bg-green-50 scale-105 shadow-green-200' 
            : 'border-gray-200 hover:border-kid-blue hover:bg-blue-50/50 hover:shadow-2xl hover:-translate-y-1'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 space-y-4">
          <div className={`
            p-5 rounded-full transition-all duration-300
            ${isDragging ? 'bg-green-100 scale-110 rotate-12' : 'bg-blue-50 group-hover:bg-blue-100'}
          `}>
            {isDragging ? (
                <ArrowUp className="w-12 h-12 text-kid-green animate-bounce" />
            ) : (
                <Upload className="w-12 h-12 text-kid-blue" />
            )}
          </div>
          
          <div>
            <p className="text-2xl font-comic font-bold text-gray-700 mb-1">
                {isDragging ? 'Drop it like it\'s hot!' : 'Tap to upload notes'}
            </p>
            <p className="text-gray-400 font-medium">
                or drag and drop a photo here
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
            <Clipboard size={14} className="text-gray-400" /> 
            <span>PRO TIP: Press <span className="bg-white px-1.5 py-0.5 rounded border border-gray-300 shadow-sm text-gray-700 font-mono">Ctrl+V</span> to paste</span>
          </div>
        </div>
        <input 
          id="file-upload" 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={(e) => e.target.files && processFile(e.target.files[0])}
        />
      </label>
    </div>
  );
};