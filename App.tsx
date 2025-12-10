import React, { useState, useEffect } from 'react';
import { Petition, Signature, ViewState } from './types';
import { INITIAL_PETITIONS } from './constants';
import CreatePetition from './components/CreatePetition';
import PetitionCard from './components/PetitionCard';
import PetitionDetail from './components/PetitionDetail';
import About from './components/About';
import { Plus, Flame, Heart, Search, Menu, X, ChevronDown, Info } from 'lucide-react';

type SortOption = 'POPULAR' | 'NEWEST';

// 首页轮播图配置
// 只保留用户指定的3张 TNT 图片
const HERO_IMAGES = [
  "https://i.postimg.cc/CKzTS39H/tnt1.jpg", // TNT 团体照 1
  "https://i.postimg.cc/QMwLt6rm/tnt2.jpg", // TNT 团体照 2
  "https://i.postimg.cc/0NbRPThX/tnt3.jpg", // TNT 团体照 3
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [petitions, setPetitions] = useState<Petition[]>(INITIAL_PETITIONS);
  const [selectedPetitionId, setSelectedPetitionId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('POPULAR');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 轮播图状态
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Calculate total signatures for Hero section
  const totalSignatures = petitions.reduce((acc, curr) => acc + curr.signatures.length, 0);

  // Load from local storage on mount (simple persistence)
  useEffect(() => {
    const saved = localStorage.getItem('tnt_petitions_v2');
    if (saved) {
      try {
        setPetitions(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved petitions', error);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('tnt_petitions_v2', JSON.stringify(petitions));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      // If storage is full, try to clean up old data
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded, clearing old data');
        localStorage.removeItem('tnt_petitions_v2');
        // Try again with current data
        try {
          localStorage.setItem('tnt_petitions_v2', JSON.stringify(petitions));
        } catch (e) {
          console.error('Still failed after clearing:', e);
        }
      }
    }
  }, [petitions]);

  // Carousel Logic
  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 5000); // 切换时间：5秒

    return () => clearInterval(timer);
  }, []);

  const handleCreatePetition = (data: Omit<Petition, 'id' | 'signatures' | 'createdAt'>) => {
    const newPetition: Petition = {
      ...data,
      id: Date.now().toString(),
      createdAt: Date.now(),
      signatures: []
    };
    setPetitions([newPetition, ...petitions]);
    setView('HOME');
  };

  const handleSignPetition = (id: string, signerData: Omit<Signature, 'id' | 'timestamp'>) => {
    const newSignature: Signature = {
      ...signerData,
      id: Date.now().toString(),
      timestamp: Date.now()
    };

    setPetitions(petitions.map(p => {
      if (p.id === id) {
        return { ...p, signatures: [...p.signatures, newSignature] };
      }
      return p;
    }));
  };

  const getSortedPetitions = () => {
    const sorted = [...petitions];
    if (sortOption === 'POPULAR') {
      return sorted.sort((a, b) => b.signatures.length - a.signatures.length);
    } else {
      return sorted.sort((a, b) => b.createdAt - a.createdAt);
    }
  };

  const sortedPetitions = getSortedPetitions();
  // Show 4 initially (adjusted from 8) so the "More" button appears with current 6 placeholder items
  const displayedPetitions = showAll ? sortedPetitions : sortedPetitions.slice(0, 4); 

  const renderContent = () => {
    if (view === 'CREATE') {
      return (
        <div className="py-12 px-4 bg-gray-50 min-h-screen">
          <CreatePetition 
            onSubmit={handleCreatePetition} 
            onCancel={() => setView('HOME')} 
          />
        </div>
      );
    }

    if (view === 'DETAIL' && selectedPetitionId) {
      const petition = petitions.find(p => p.id === selectedPetitionId);
      if (petition) {
        return (
          <div className="py-12 px-4 bg-gray-50 min-h-screen">
            <PetitionDetail 
              petition={petition} 
              onBack={() => setView('HOME')}
              onSign={handleSignPetition}
            />
          </div>
        );
      }
    }

    if (view === 'ABOUT') {
      return <About onBack={() => setView('HOME')} />;
    }

    return (
      <div className="animate-in fade-in duration-500">
        {/* Hero Section - Carousel */}
        <div className="relative w-full h-[600px] bg-black overflow-hidden flex flex-col justify-center items-center pb-12 text-center text-white px-4 group">
          
          {/* Background Images Carousel */}
          {HERO_IMAGES.map((imgUrl, index) => (
            <div 
              key={index}
              className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ 
                backgroundImage: `url("${imgUrl}")`,
              }}
            />
          ))}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
          
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center h-full pt-20">
            
            {/* Updated Typography: Smaller than previous 7xl, larger than subtitle, single line preferred */}
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-2xl leading-tight md:whitespace-nowrap">
              每一位爆米花的声音，都值得被听见
            </h1>

            <p className="text-xl md:text-2xl font-bold text-white/90 mb-12 tracking-[0.3em] drop-shadow-lg uppercase">
              热爱. 支持. 成长. 陪伴.
            </p>

            <button 
              onClick={() => setView('CREATE')}
              className="bg-tnt-yellow text-tnt-black hover:bg-tnt-orange text-lg md:text-xl font-black py-4 px-16 rounded shadow-[0_0_30px_rgba(255,200,0,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            >
              <Plus className="w-6 h-6" />
              发起你的心愿
            </button>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <ChevronDown className="w-10 h-10 animate-bounce text-white/70" />
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-black text-gray-900 tracking-wider mb-2">
                心愿清单 - 在与你同频的心愿旁签下你的名字吧
              </h2>
              <div className="h-1 w-20 bg-tnt-yellow mx-auto"></div>
              
              {/* Filter Tabs */}
              <div className="flex justify-center mt-6 gap-4">
                 <button
                    onClick={() => setSortOption('POPULAR')}
                    className={`text-sm font-bold uppercase tracking-wider px-4 py-2 border-b-2 transition-colors ${
                      sortOption === 'POPULAR' ? 'border-tnt-black text-tnt-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                 >
                    热门
                 </button>
                 <button
                    onClick={() => setSortOption('NEWEST')}
                    className={`text-sm font-bold uppercase tracking-wider px-4 py-2 border-b-2 transition-colors ${
                      sortOption === 'NEWEST' ? 'border-tnt-black text-tnt-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                 >
                    最新
                 </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayedPetitions.map(petition => (
                <PetitionCard 
                  key={petition.id} 
                  petition={petition} 
                  onClick={(id) => {
                    setSelectedPetitionId(id);
                    setView('DETAIL');
                  }} 
                />
              ))}
            </div>

            {!showAll && petitions.length > 4 && (
               <div className="text-center mt-16">
                 <button 
                   onClick={() => setShowAll(true)}
                   className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-full font-bold hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm group"
                 >
                   查看更多心愿
                   <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                 </button>
               </div>
            )}
            
            {showAll && (
              <div className="text-center mt-16">
                 <p className="text-gray-400 italic text-sm">已显示所有心愿</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Navbar - White, Chinese, No Login */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setView('HOME')}
            >
               <div className="w-8 h-8 bg-tnt-yellow flex items-center justify-center rounded group-hover:bg-tnt-orange transition-colors">
                  <span className="font-black text-black text-xs">TNT</span>
               </div>
               <span className="font-bold text-xl tracking-tight text-gray-900">
                 时代少年团爆米花 <span className="text-tnt-orange">请愿站</span>
               </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
               <div className="flex items-center gap-3">
                 <div className="relative">
                   <input 
                      type="text" 
                      placeholder="搜索心愿..." 
                      className="pl-4 pr-10 py-1.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-tnt-orange w-64 transition-colors bg-gray-50"
                   />
                   <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                 </div>
                 
                 <button 
                    onClick={() => setView('ABOUT')}
                    className={`flex items-center gap-1 font-bold transition-colors text-sm tracking-wide px-3 py-1.5 rounded-sm ${
                      view === 'ABOUT' 
                        ? 'text-tnt-orange bg-orange-50' 
                        : 'text-gray-600 hover:text-tnt-orange hover:bg-gray-50'
                    }`}
                 >
                    <Info className="w-4 h-4" />
                    关于请愿站
                 </button>
               </div>

               <div className="h-6 w-px bg-gray-200"></div>

               <button 
                  onClick={() => setView('CREATE')}
                  className="flex items-center gap-1 font-bold text-gray-800 hover:text-tnt-orange transition-colors text-sm tracking-wide"
               >
                  <Plus className="w-4 h-4" />
                  发起心愿
               </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-lg">
             <input 
                type="text" 
                placeholder="搜索心愿..." 
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm bg-gray-50"
             />
             <button 
                onClick={() => { setView('ABOUT'); setIsMobileMenuOpen(false); }}
                className="w-full text-left font-bold text-gray-700 py-2 flex items-center gap-2 hover:bg-gray-50 px-2 rounded"
             >
                <Info className="w-4 h-4" />
                关于请愿站
             </button>
             <button 
                onClick={() => { setView('CREATE'); setIsMobileMenuOpen(false); }}
                className="w-full text-left font-bold text-gray-700 py-2 flex items-center gap-2 hover:bg-gray-50 px-2 rounded"
             >
                <Plus className="w-4 h-4" />
                发起心愿
             </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-2 mb-4">
             <div className="bg-gray-100 p-2 rounded-full">
               <Heart className="w-5 h-5 text-gray-400 fill-current" />
             </div>
          </div>
          <p className="text-gray-600 text-base mb-2 font-serif font-bold italic tracking-wide">"破天下，定风云，时代少年并肩行"</p>
          <p className="text-gray-400 text-xs mt-4">
            2025 时代少年团爆米花请愿站. Created with love for TNT!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;