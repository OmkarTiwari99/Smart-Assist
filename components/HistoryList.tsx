import React from 'react';
import { HistoryEntry } from '../types';
import { Clock, ChevronRight, Trash2, ArrowRight } from 'lucide-react';

interface HistoryListProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear, isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-gray-900/30 z-40 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col bg-gray-50/50">
          
          {/* Header */}
          <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-comic font-bold text-gray-800">My Lessons</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Recent Scans</p>
            </div>
            <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-700"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Clock className="w-8 h-8 opacity-40" />
                </div>
                <p className="font-bold text-gray-600">No lessons saved yet.</p>
                <p className="text-sm mt-1">Scan your first homework!</p>
              </div>
            ) : (
              history.map((entry) => (
                <div 
                  key={entry.id}
                  onClick={() => { onSelect(entry); onClose(); }}
                  className="bg-white p-4 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all border border-gray-200 hover:border-kid-blue hover:shadow-md group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                     </span>
                     {entry.data.imageUrl && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">IMG</span>
                     )}
                  </div>
                  
                  <p className="font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-kid-blue transition-colors">
                    {entry.data.bigIdea}
                  </p>
                  
                  <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight size={16} className="text-kid-blue" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {history.length > 0 && (
            <div className="p-4 bg-white border-t border-gray-100">
                <button 
                    onClick={onClear}
                    className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors text-sm"
                >
                    <Trash2 size={16} /> Clear All History
                </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};