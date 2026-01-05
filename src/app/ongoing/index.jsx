import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { animeService } from '../../services/api';
import AnimeCard from '../../components/AnimeCard';

const Ongoing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  
  const [animeList, setAnimeList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOngoing = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const response = await animeService.getOngoingAnime(page);
        if (response.data.ok) {
          setAnimeList(response.data.data.animeList);
          setPagination(response.data.pagination);
        } else {
          setError('Gagal memuat daftar anime ongoing');
        }
      } catch (err) {
        setError('Gagal mengambil data dari server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOngoing();
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
        <h1 className="text-2xl md:text-3xl font-black text-white border-l-4 border-primary pl-4 uppercase tracking-tighter italic">
          Sedang <span className="text-primary">Tayang</span>
        </h1>
        <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-white/5">
           Halaman {page}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {animeList.map((anime) => (
          <AnimeCard key={anime.animeId} anime={anime} type="ongoing" />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-12 flex justify-center items-center gap-4">
        <button 
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            page === 1 
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
            : 'bg-gray-800 text-white hover:bg-primary'
          }`}
        >
          Sebelumnya
        </button>
        <span className="text-gray-400 font-bold">
           Halaman {page} {pagination?.totalPages ? `/ ${pagination.totalPages}` : ''}
        </span>
        <button 
          onClick={handleNextPage}
          disabled={pagination?.hasNextPage === false}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
             pagination?.hasNextPage === false
             ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
             : 'bg-gray-800 text-white hover:bg-primary'
          }`}
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

export default Ongoing;
