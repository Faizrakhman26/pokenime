import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { animeService } from '../../services/api';
import AnimeCard from '../../components/AnimeCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [keyword, setKeyword] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchResults = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    setError(null);
    try {
      const response = await animeService.searchAnime(searchTerm);
      if (response.data.ok) {
        setResults(response.data.data.animeList);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError('Gagal mencari anime. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setSearchParams({ q: keyword });
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Search Header */}
      <div className="mb-12 text-center">
         <h1 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">
            Cari <span className="text-primary">Anime</span> Favoritmu
         </h1>
         <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <input 
               type="text" 
               placeholder="Masukkan judul anime..." 
               value={keyword}
               onChange={(e) => setKeyword(e.target.value)}
               className="w-full bg-gray-800 border-2 border-white/5 group-hover:border-primary/50 focus:border-primary px-6 py-4 rounded-2xl text-white outline-none transition-all pr-16 shadow-xl"
            />
            <button 
               type="submit"
               className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-red-700 text-white px-5 rounded-xl transition-all flex items-center justify-center"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </button>
         </form>
      </div>

      {/* Results Section */}
      <div>
         {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
               <p className="text-gray-500 animate-pulse">Mencari "{query}"...</p>
            </div>
         ) : error ? (
            <div className="text-center py-20 bg-red-900/10 border border-red-500/20 rounded-3xl">
               <p className="text-red-500">{error}</p>
            </div>
         ) : results.length > 0 ? (
            <>
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 mb-8">
                  <h2 className="text-lg md:text-xl font-bold text-white border-l-4 border-primary pl-4 uppercase tracking-tight flex flex-col md:block">
                     Hasil Pencarian: <span className="text-gray-400 italic font-medium md:ml-2 mt-1 md:mt-0 text-sm md:text-base">"{query}"</span>
                  </h2>
                  <span className="self-start md:self-auto text-[10px] md:text-xs text-gray-500 bg-gray-800 px-3 py-1.5 rounded-full border border-white/5 font-bold tracking-wide">
                     {results.length} Anime Ditemukan
                  </span>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {results.map((anime) => (
                    <AnimeCard key={anime.animeId} anime={anime} type="search" />
                  ))}
               </div>
            </>
         ) : query ? (
            <div className="text-center py-20">
               <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Anime tidak ditemukan</h3>
               <p className="text-gray-500">Coba gunakan kata kunci yang lain.</p>
            </div>
         ) : (
            <div className="text-center py-20 opacity-30">
               <svg className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <p className="text-lg">Silakan masukkan judul anime untuk mencari.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default Search;
