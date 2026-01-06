import React, { useEffect, useState } from 'react';
import { animeService } from '../../services/api';
import AnimeCard from '../../components/AnimeCard';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await animeService.getHome();
        if (response.data.ok) {
          setData(response.data.data);
        }
      } catch (err) {
        setError('Gagal mengambil data dari server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-dark text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-dark text-white">
      <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
        <p className="text-red-500 font-bold mb-2">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  // Ambil anime pertama untuk Hero Section
  const heroAnime = data?.ongoing?.animeList[0];

  return (
    <div className="pb-20">
      <SEO />
      
      {/* Hero Section */}
      {heroAnime && (
        <div className="relative h-[500px] w-full overflow-hidden">
          {/* Background Image Blurry */}
          <div className="absolute inset-0">
            <img 
              src={heroAnime.poster} 
              alt={`Banner ${heroAnime.title}`} 
              className="w-full h-full object-cover opacity-30 blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/40 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pt-20">
            <div className="flex flex-row gap-4 md:gap-8 items-stretch text-left">
                {/* Poster: w-28 on mobile, w-48 on desktop */}
                <div className="block w-28 sm:w-32 md:w-48 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl border-2 border-white/10">
                    <img src={heroAnime.poster} alt={`Poster Anime ${heroAnime.title}`} className="w-full h-full object-cover aspect-[3/4]" />
                </div>
                
                {/* Info Container: Side by side with poster on all screens */}
                <div className="flex flex-col justify-center flex-grow min-w-0">
                    <div>
                        <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 mb-2 md:mb-4 text-[9px] md:text-xs font-bold tracking-wider text-white uppercase bg-primary rounded-full">
                            Ongoing Terbaru
                        </span>
                        <h1 className="text-base sm:text-2xl md:text-6xl font-extrabold text-white mb-2 md:mb-4 leading-tight line-clamp-2 md:line-clamp-none">
                            {heroAnime.title}
                        </h1>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-sm text-gray-300 mb-4 md:mb-6">
                            <span>{heroAnime.releaseDay}</span>
                            <span className="text-primary">•</span>
                            <span>Ep {heroAnime.episodes}</span>
                        </div>
                        <Link 
                            to={`/anime/${heroAnime.animeId}`}
                            className="inline-flex items-center px-4 py-1.5 md:px-8 md:py-3 text-[11px] md:text-base font-bold text-white bg-primary rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-primary/50"
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Nonton
                        </Link>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {/* Section: Ongoing */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white border-l-4 border-primary pl-4">
              Sedang Tayang
            </h2>
            <Link to="/ongoing" className="text-sm text-gray-400 hover:text-primary transition-colors">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data?.ongoing?.animeList.map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} type="ongoing" />
            ))}
          </div>
        </section>

        {/* Section: Completed */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-4">
              Baru Tamat
            </h2>
            <Link to="/completed" className="text-sm text-gray-400 hover:text-blue-500 transition-colors">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data?.completed?.animeList.map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} type="completed" />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;