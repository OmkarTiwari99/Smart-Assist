import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Auth } from './components/Auth';
import { HistoryList } from './components/HistoryList';
import { analyzeImage } from './services/geminiService';
import { saveHistory, getHistory, clearHistory } from './services/db';
import { AppState, TutorResponse, AnalysisError, User, HistoryEntry } from './types';
import { GraduationCap, AlertTriangle, LogOut, History as HistoryIcon, UserCircle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<TutorResponse | null>(null);
  const [error, setError] = useState<AnalysisError | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load user from session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('eli5_user_session');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      refreshHistory(u.id);
    }
  }, []);

  const refreshHistory = async (userId: string) => {
    const h = await getHistory(userId);
    setHistory(h);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('eli5_user_session', JSON.stringify(loggedInUser));
    refreshHistory(loggedInUser.id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('eli5_user_session');
    setResult(null);
    setAppState(AppState.IDLE);
    setHistory([]);
    setIsHistoryOpen(false);
  };

  const handleImageSelected = async (base64: string, mimeType: string) => {
    if (!user) return;

    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const data = await analyzeImage(base64, mimeType);
      
      // Add image data to the result object for caching context
      const fullData = { 
        ...data, 
        imageUrl: `data:${mimeType};base64,${base64}` 
      };
      
      setResult(fullData);
      setAppState(AppState.SUCCESS);

      // Save to "DB"
      await saveHistory(user.id, fullData);
      await refreshHistory(user.id);

    } catch (err: any) {
      console.error(err);
      setError({
        title: "Oops! Something went wrong.",
        message: err.message || "I couldn't read that properly. Please try a clearer photo!",
      });
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setError(null);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setResult(entry.data);
    setAppState(AppState.SUCCESS);
  };

  const handleClearHistory = async () => {
      if (user && confirm("Are you sure you want to delete all your history?")) {
          await clearHistory(user.id);
          refreshHistory(user.id);
      }
  }

  return (
    <div className="min-h-screen font-sans relative overflow-hidden bg-[#f0f9ff] selection:bg-kid-yellow selection:text-yellow-900">
      {/* Decorative Blobs with Animation */}
      <div className="blob animate-float bg-kid-blue w-[500px] h-[500px] rounded-full top-[-100px] left-[-100px]"></div>
      <div className="blob animate-float-delayed bg-kid-yellow w-[400px] h-[400px] rounded-full bottom-[-50px] right-[-100px]"></div>
      <div className="blob animate-pulse bg-kid-pink w-64 h-64 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"></div>

      {/* Header */}
      <header className="pt-8 pb-4 px-4 relative z-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl">
            
            {/* Logo Area */}
            <div className="flex items-center gap-3 group cursor-default">
                <div className="bg-gradient-to-br from-kid-green to-teal-400 p-3 rounded-2xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    <GraduationCap className="text-white w-7 h-7" />
                </div>
                <h1 className="font-comic font-bold text-3xl text-gray-800 tracking-tight flex flex-col leading-none">
                    <span>ELI5 <span className="text-kid-purple">Tutor</span></span>
                </h1>
            </div>

            {/* User Controls */}
            {user && (
                <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md pl-4 pr-2 py-2 rounded-full shadow-sm border border-white/50 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-kid-blue to-cyan-300 flex items-center justify-center text-white font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-700 text-sm hidden sm:block">{user.name}</span>
                    </div>
                    <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
                    <button 
                        onClick={() => setIsHistoryOpen(true)}
                        className="p-2 hover:bg-white rounded-full transition-all relative text-gray-500 hover:text-kid-blue active:scale-95"
                        title="History"
                    >
                        <HistoryIcon size={20} />
                        {history.length > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                        )}
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="p-2 hover:bg-white rounded-full transition-all text-gray-400 hover:text-red-500 active:scale-95"
                        title="Log Out"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 relative z-10 pb-20 max-w-5xl">
        
        {!user ? (
            <div className="mt-12 flex justify-center">
                <Auth onLogin={handleLogin} />
            </div>
        ) : (
            <>
                 {/* Intro Text (only show on IDLE) */}
                 {appState === AppState.IDLE && (
                    <div className="text-center mb-12 mt-8 animate-slide-up space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white/50 backdrop-blur-sm text-sm font-semibold text-kid-purple shadow-sm mb-2">
                             <Sparkles size={16} /> <span>AI-Powered Learning Buddy</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                            Homework Made <span className="text-kid-purple underline decoration-wavy decoration-kid-yellow decoration-4 underline-offset-4">Easy</span>
                        </h2>
                        <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                            Stuck on a confusing textbook page? Snap a pic and get a simple explanation!
                        </p>
                    </div>
                 )}

                {appState === AppState.ERROR && error && (
                <div className="max-w-xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl shadow-md flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-red-100 p-2 rounded-full">
                        <AlertTriangle className="text-red-500 w-6 h-6 flex-shrink-0" />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-800 text-lg">{error.title}</h3>
                        <p className="text-red-700 mt-1">{error.message}</p>
                        <button 
                            onClick={handleReset}
                            className="mt-3 px-4 py-2 bg-white text-red-600 font-bold rounded-lg shadow-sm hover:bg-red-50 transition-colors border border-red-100 text-sm"
                        >
                            Try again
                        </button>
                    </div>
                </div>
                )}

                {appState !== AppState.SUCCESS && (
                    <ImageUploader 
                        onImageSelected={handleImageSelected} 
                        isLoading={appState === AppState.ANALYZING} 
                    />
                )}

                {appState === AppState.SUCCESS && result && (
                    <ResultDisplay data={result} onReset={handleReset} />
                )}

                <HistoryList 
                    history={history} 
                    isOpen={isHistoryOpen} 
                    onClose={() => setIsHistoryOpen(false)} 
                    onSelect={handleHistorySelect}
                    onClear={handleClearHistory}
                />
            </>
        )}
        
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm relative z-10">
        <p className="font-medium opacity-70">© 2024 ELI5 Tutor • Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;