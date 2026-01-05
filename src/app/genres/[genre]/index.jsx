import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { animeService } from '../../../services/api';
import AnimeCard from '../../../components/AnimeCard';

const GenreDetail = () => {
  const { genre } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeByGenre = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const response = await animeService.getAnimeByGenre(genre, page);
        if (response.data.ok) {
          setAnimeList(response.data.data.animeList);
        } else {
          setError('Gagal memuat daftar anime untuk genre ini');
        }
      } catch (err) {
        setError('Gagal mengambil data dari server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeByGenre();
  }, [genre, page]);

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
    <div className="flex justify-center items-center min-h-screen pt-20">
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
          Genre: <span className="text-primary">{genre.replace(/-/g, ' ')}</span>
        </h1>
        <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-white/5">
           Halaman {page}
        </div>
      </div>

      {/* Grid */}
      {animeList.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {animeList.map((anime) => (
              <AnimeCard key={anime.animeId} anime={anime} type="genre" />
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
            <span className="text-gray-400 font-bold">Halaman {page}</span>
            <button 
              onClick={handleNextPage}
              className="px-6 py-2 bg-gray-800 text-white hover:bg-primary rounded-full font-bold transition-all"
            >
              Selanjutnya
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-500">
           Tidak ada anime yang ditemukan untuk genre ini.
        </div>
      )}
    </div>
  );
};

export default GenreDetail;
