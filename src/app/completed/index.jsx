import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { animeService } from '../../services/api';
import AnimeCard from '../../components/AnimeCard';

const Completed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  
  const [animeList, setAnimeList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompleted = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const response = await animeService.getCompletedAnime(page);
        if (response.data.ok) {
          setAnimeList(response.data.data.animeList);
          setPagination(response.data.pagination);
        } else {
          setError('Gagal memuat daftar anime tamat');
        }
      } catch (err) {
        setError('Gagal mengambil data dari server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, [page]);

  const handleNextPage = () => {
    setSearchParams({ page: page + 1 });
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setSearchParams({ page: page - 1 });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen pt-20 px-4">
      <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
        <p className="text-red-500 font-bold mb-2">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white border-l-4 border-blue-500 pl-4 uppercase tracking-tighter italic">
          Anime <span className="text-blue-500">Tamat</span>
        </h1>
        <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-white/5">
           Halaman {page}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {animeList.map((anime) => (
          <AnimeCard key={anime.animeId} anime={anime} type="completed" />
        ))}
      </div>

      {/* Pagination Controls (Responsive) */}
      <div className="mt-12 flex justify-center items-center gap-6">
        <button 
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`h-10 w-10 md:w-auto md:px-6 flex items-center justify-center rounded-full font-bold transition-all ${
            page === 1 
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
            : 'bg-gray-800 text-white hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]'
          }`}
          aria-label="Halaman Sebelumnya"
        >
          <span className="hidden md:inline">Sebelumnya</span>
          <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-white/5 shadow-inner">
           <span className="text-white font-black text-sm md:text-base">
             {page}
           </span>
           <span className="text-gray-500 font-bold">/</span>
           <span className="text-gray-400 font-bold text-sm md:text-base">
             {pagination?.totalPages || '?'}
           </span>
        </div>

        <button 
          onClick={handleNextPage}
          disabled={pagination?.hasNextPage === false}
          className={`h-10 w-10 md:w-auto md:px-6 flex items-center justify-center rounded-full font-bold transition-all ${
             pagination?.hasNextPage === false
             ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
             : 'bg-gray-800 text-white hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]'
          }`}
           aria-label="Halaman Selanjutnya"
        >
          <span className="hidden md:inline">Selanjutnya</span>
          <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default Completed;
