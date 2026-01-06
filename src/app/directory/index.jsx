import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { animeService } from '../../services/api';
import SEO from '../../components/SEO';

const Directory = () => {
  const [directoryData, setDirectoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const response = await animeService.getAllAnimeDirectory();
        if (response.data.ok) {
          setDirectoryData(response.data.data.list);
        }
      } catch (err) {
        setError('Gagal memuat daftar semua anime');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectory();

    // Scroll Listener untuk tombol Back to Top
    const handleScroll = () => {
        if (window.scrollY > 300) {
            setShowScrollTop(true);
        } else {
            setShowScrollTop(false);
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
        <p className="text-red-500 font-bold mb-2">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen relative">
      <SEO 
        title="Daftar Semua Anime"
        description="Jelajahi dan nonton ribuan judul anime subtitle Indonesia dalam database terlengkap kami. Temukan anime favoritmu dari A sampai Z."
      />
      {/* Header */}
      <div className="mb-12 text-center">
         <h1 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">
            Daftar <span className="text-primary">Semua Anime</span>
         </h1>
         <p className="text-gray-400 max-w-xl mx-auto">
            Cari anime berdasarkan abjad dari database lengkap kami.
         </p>
      </div>

      {/* Alphabet Selector (Static, not sticky) */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 bg-gray-900/50 p-6 rounded-2xl border border-white/5">
        {directoryData.map((group) => (
          <button
            key={group.startWith}
            onClick={() => {
              const element = document.getElementById(`letter-${group.startWith}`);
              if (element) {
                const yOffset = -100; 
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
              }
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm bg-gray-800 text-gray-400 hover:bg-primary hover:text-white transition-all hover:scale-110"
          >
            {group.startWith}
          </button>
        ))}
      </div>

      {/* Directory List */}
      <div className="space-y-12">
        {directoryData.map((group) => (
          <div key={group.startWith} id={`letter-${group.startWith}`} className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-2xl font-black shadow-lg shadow-primary/20 text-white">
                  {group.startWith}
               </div>
               <div className="h-px flex-grow bg-gradient-to-r from-primary/50 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
               {group.animeList.map((anime) => {
                  const isOngoing = anime.title.toLowerCase().includes('on-going') || anime.title.toLowerCase().includes('ongoing');
                  const cleanTitle = anime.title.replace(/\[?on-going\]?/i, '').replace(/\[?ongoing\]?/i, '').trim();

                  return (
                    <Link 
                      key={anime.animeId} 
                      to={`/anime/${anime.animeId}`}
                      className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                    >
                       <div className={`w-1.5 h-1.5 rounded-full transition-colors flex-shrink-0 ${isOngoing ? 'bg-primary animate-pulse' : 'bg-gray-700 group-hover:bg-primary'}`}></div>
                       <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-sm text-gray-400 group-hover:text-white transition-colors truncate" title={cleanTitle}>
                             {cleanTitle}
                          </span>
                          {isOngoing && (
                             <span className="text-[10px] font-black text-primary uppercase tracking-tighter flex-shrink-0 bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                                On-Going
                             </span>
                          )}
                       </div>
                    </Link>
                  );
               })}
            </div>
          </div>
        ))}
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-primary hover:bg-red-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 z-50 ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Back to Top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

    </div>
  );
};

export default Directory;