import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { animeService } from '../../services/api';

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await animeService.getAllGenres();
        if (response.data.ok) {
          setGenres(response.data.data.genreList);
        }
      } catch (err) {
        setError('Gagal memuat daftar genre');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

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
      <div className="mb-12 text-center">
         <h1 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">
            Jelajahi <span className="text-primary">Genre</span>
         </h1>
         <p className="text-gray-400 max-w-xl mx-auto">
            Temukan ribuan anime berdasarkan kategori yang Anda sukai.
         </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {genres.map((genre) => (
          <Link 
            key={genre.genreId} 
            to={`/genres/${genre.genreId}`}
            className="group relative flex flex-col items-center justify-center p-6 bg-gray-800/40 hover:bg-primary rounded-2xl border border-white/5 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden shadow-lg"
          >
            {/* Background Decoration */}
            <div className="absolute -right-2 -bottom-2 text-white/5 group-hover:text-white/10 transition-colors transform rotate-12">
               <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
               </svg>
            </div>

            <span className="relative z-10 text-sm font-bold text-gray-200 group-hover:text-white text-center">
              {genre.title}
            </span>
            <span className="relative z-10 text-[10px] text-gray-500 group-hover:text-white/70 mt-1 uppercase tracking-widest font-medium">
               Genre
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genres;
