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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3">
        {genres.map((genre) => (
          <Link 
            key={genre.genreId} 
            to={`/genres/${genre.genreId}`}
            className="group relative flex items-center justify-center py-3 px-4 bg-gray-800/40 hover:bg-primary rounded-xl border border-white/5 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden shadow-lg"
          >
            <span className="relative z-10 text-xs font-black text-gray-200 group-hover:text-white text-center uppercase tracking-tight">
              {genre.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genres;
