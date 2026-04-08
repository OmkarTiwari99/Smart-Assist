import React, { useState } from 'react';
import { TutorResponse } from '../types';
import { Lightbulb, List, HelpCircle, CheckCircle2, Volume2, StopCircle, Eye, EyeOff } from 'lucide-react';

interface ResultDisplayProps {
  data: TutorResponse;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, onReset }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const text = `${data.bigIdea}. Here is the breakdown. ${data.breakdown.join('. ')}. Question: ${data.checkQuestion}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
        alert("Sorry, your browser doesn't support talking!");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-slide-up pb-24">
      
      {/* Control Bar - Floating */}
      <div className="sticky top-4 z-20 flex gap-3 justify-end pointer-events-none">
        <div className="pointer-events-auto flex gap-3 p-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/50">
            {data.imageUrl && (
                <button
                    onClick={() => setShowImage(!showImage)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                        showImage 
                        ? 'bg-kid-blue text-white shadow-md' 
                        : 'bg-transparent text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {showImage ? <><EyeOff size={16} /> Hide</> : <><Eye size={16} /> Show Original</>}
                </button>
            )}
            <div className="w-[1px] bg-gray-300 my-1"></div>
            <button
            onClick={speak}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                isSpeaking 
                ? 'bg-red-500 text-white shadow-md animate-pulse' 
                : 'bg-transparent text-kid-purple hover:bg-purple-50'
            }`}
            >
            {isSpeaking ? <><StopCircle size={16} /> Stop</> : <><Volume2 size={16} /> Read Aloud</>}
            </button>
        </div>
      </div>

      {showImage && data.imageUrl && (
        <div className="bg-white p-3 rounded-3xl shadow-xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <img src={data.imageUrl} alt="Original source" className="w-full max-h-96 object-contain rounded-2xl bg-gray-50" />
        </div>
      )}

      {/* Big Idea Card */}
      <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1">
        <div className="bg-gradient-to-r from-kid-yellow to-yellow-400 p-6 flex items-center gap-4">
          <div className="bg-white/30 backdrop-blur-sm p-3 rounded-2xl shadow-inner">
            <Lightbulb className="w-8 h-8 text-yellow-900" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-comic font-bold text-3xl text-yellow-950 leading-none">The Big Idea</h2>
            <div className="h-1 w-12 bg-yellow-900/20 rounded-full mt-2"></div>
          </div>
        </div>
        <div className="p-8">
          <p className="text-2xl text-gray-800 font-sans leading-relaxed font-medium">
            {data.bigIdea}
          </p>
        </div>
      </div>

      {/* Breakdown Card */}
      <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1">
        <div className="bg-gradient-to-r from-kid-blue to-cyan-400 p-6 flex items-center gap-4">
          <div className="bg-white/30 backdrop-blur-sm p-3 rounded-2xl shadow-inner">
            <List className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="font-comic font-bold text-3xl text-white">The Simple Break Down</h2>
        </div>
        <div className="p-8 bg-blue-50/30">
          <ul className="space-y-4">
            {data.breakdown.map((point, index) => (
              <li key={index} className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-blue-100 hover:border-kid-blue hover:shadow-md transition-all group">
                <div className="bg-green-100 p-1.5 rounded-full mt-0.5 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-5 h-5 text-kid-green" strokeWidth={3} />
                </div>
                <span className="text-lg text-gray-700 font-medium leading-relaxed">{point.replace(/^- /, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Check Question Card */}
      <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1">
        <div className="bg-gradient-to-r from-kid-purple to-purple-500 p-6 flex items-center gap-4">
          <div className="bg-white/30 backdrop-blur-sm p-3 rounded-2xl shadow-inner">
            <HelpCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="font-comic font-bold text-3xl text-white">Check Your Brain!</h2>
        </div>
        <div className="p-10 text-center bg-purple-50/50">
          <p className="text-2xl font-bold text-purple-900 font-comic">
            {data.checkQuestion}
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={onReset}
          className="bg-gray-800 text-white font-bold py-4 px-12 rounded-full shadow-xl hover:bg-gray-900 hover:scale-105 hover:shadow-2xl transition-all transform flex items-center gap-3 text-lg group"
        >
          <span className="group-hover:rotate-12 transition-transform">✨</span> Scan Another One
        </button>
      </div>

    </div>
  );
};